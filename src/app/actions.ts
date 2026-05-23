"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createActiveBookDraft,
  finishBook,
  pauseBook,
  prepareBookActivation,
  prepareTodayReadingEntry
} from "@/domain";
import { createSupabaseDataAccess } from "@/data";

export async function createBookAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const todayEntry = await data.entries.getEntryByDate(today);

  if (todayEntry) {
    redirectWithError("entry_exists");
  }

  const title = getString(formData, "title");
  const author = getString(formData, "author");
  const totalPages = getNumber(formData, "totalPages");
  const startPage = getNumber(formData, "startPage");
  const currentPage = getNumber(formData, "currentPage");
  const startedDate = getString(formData, "startedDate") || today;

  if (!title || !author) {
    redirectWithError("book_details_required");
  }

  if (totalPages < 1 || startPage < 1 || currentPage < startPage) {
    redirectWithError("invalid_book_pages");
  }

  if (startPage > totalPages || currentPage >= totalPages) {
    redirectWithError("invalid_book_pages");
  }

  await data.books.createBook(
    createActiveBookDraft({
      title,
      author,
      totalPages,
      startPage,
      currentPage,
      startedDate
    })
  );

  revalidatePath("/");
  redirect("/?message=book_created");
}

export async function updateBookDetailsAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const book = await getBookFromForm(data, formData);
  const title = getString(formData, "title");
  const author = getString(formData, "author");
  const totalPages = getNumber(formData, "totalPages");

  if (!title || !author) {
    redirectWithError("book_details_required");
  }

  if (totalPages < book.currentPage || totalPages < book.startPage) {
    redirectWithError("invalid_book_pages");
  }

  await data.books.updateBook({
    ...book,
    title,
    author,
    totalPages
  });

  revalidatePath("/");
  redirect("/?message=book_updated");
}

export async function pauseBookAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const book = await getBookFromForm(data, formData);

  if (book.status !== "reading") {
    redirectWithError("invalid_book");
  }

  await data.books.updateBook(pauseBook(book));

  revalidatePath("/");
  redirect("/?message=book_paused");
}

export async function activateBookAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const [targetBook, activeBook, todayEntry] = await Promise.all([
    getBookFromForm(data, formData),
    data.books.getActiveBook(),
    data.entries.getEntryByDate(today)
  ]);
  const result = prepareBookActivation({
    targetBook,
    activeBook,
    todayEntry
  });

  if (!result.ok) {
    redirectWithError(result.error);
  }

  if (result.previousActiveBook) {
    await data.books.updateBook(result.previousActiveBook);
  }

  await data.books.updateBook(result.activatedBook);

  revalidatePath("/");
  redirect("/?message=book_activated");
}

export async function finishBookAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const book = await getBookFromForm(data, formData);

  if (book.status === "finished") {
    redirectWithError("book_finished");
  }

  await data.books.updateBook(finishBook(book, getTodayIsoDate()));

  revalidatePath("/");
  redirect("/?message=book_finished");
}

export async function recordTodayAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const [activeBook, settings, existingEntry] = await Promise.all([
    data.books.getActiveBook(),
    data.settings.getSettings(),
    data.entries.getEntryByDate(today)
  ]);

  const result = prepareTodayReadingEntry({
    activeBook,
    settings,
    today,
    finishedPage: getNumber(formData, "finishedPage"),
    note: getString(formData, "note"),
    existingEntry
  });

  if (!result.ok) {
    redirectWithError(result.error);
  }

  await data.entries.upsertEntry(result.entry);
  await data.books.updateBook(result.book);

  revalidatePath("/");
  redirect("/?message=entry_saved");
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string): number {
  const value = Number(getString(formData, key));

  return Number.isFinite(value) ? Math.floor(value) : 0;
}

async function getBookFromForm(
  data: ReturnType<typeof createSupabaseDataAccess>,
  formData: FormData
) {
  const bookId = getString(formData, "bookId");
  const book = bookId ? await data.books.getBookById(bookId) : null;

  if (!book) {
    redirectWithError("invalid_book");
  }

  return book;
}

function getTodayIsoDate(): string {
  const timeZone = process.env.PAGESTRIDER_TIME_ZONE ?? "Europe/Minsk";
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

function redirectWithError(error: string): never {
  redirect(`/?error=${encodeURIComponent(error)}`);
}

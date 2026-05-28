"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createActiveBookDraft,
  finishBook,
  normalizeDailyGoalInput,
  pauseBook,
  prepareReadingEntryCorrection,
  prepareBookActivation,
  prepareTodayReadingEntry,
  recalculateBookAfterEntryChange
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
  const [activeBook, dailyGoal, existingEntry] = await Promise.all([
    data.books.getActiveBook(),
    data.goals.getCurrentDailyGoal(today),
    data.entries.getEntryByDate(today)
  ]);

  const result = prepareTodayReadingEntry({
    activeBook,
    settings: { dailyGoalPages: dailyGoal.pagesPerDay },
    today,
    startPage: getOptionalNumber(formData, "startPage"),
    endPage: getOptionalNumber(formData, "endPage"),
    creditedPages: getNumber(formData, "creditedPages"),
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

export async function createDailyGoalAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const result = normalizeDailyGoalInput({
    pagesPerDay: getNumber(formData, "pagesPerDay"),
    effectiveFrom: getString(formData, "effectiveFrom"),
    note: getString(formData, "note")
  });

  if (!result.ok) {
    redirectWithError(result.error);
  }

  const goal = await data.goals.createDailyGoal(result.value);

  if (goal.effectiveFrom <= getTodayIsoDate()) {
    await data.settings.updateSettings({ dailyGoalPages: goal.pagesPerDay });
  }

  revalidatePath("/");
  revalidatePath("/report");
  redirect("/?message=goal_saved");
}

export async function updateDailyGoalAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const goalId = getString(formData, "goalId");
  const result = normalizeDailyGoalInput({
    pagesPerDay: getNumber(formData, "pagesPerDay"),
    effectiveFrom: getString(formData, "effectiveFrom"),
    note: getString(formData, "note")
  });

  if (!goalId) {
    redirectWithError("invalid_goal");
  }

  if (!result.ok) {
    redirectWithError(result.error);
  }

  const goal = await data.goals.updateDailyGoal(goalId, result.value);

  if (goal.effectiveFrom <= getTodayIsoDate()) {
    const currentGoal = await data.goals.getCurrentDailyGoal(getTodayIsoDate());
    await data.settings.updateSettings({ dailyGoalPages: currentGoal.pagesPerDay });
  }

  revalidatePath("/");
  revalidatePath("/report");
  redirect("/?message=goal_saved");
}

export async function updateReadingEntryAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const entry = await getEntryFromForm(data, formData);
  const book = await data.books.getBookById(entry.bookId);
  const targetDate = getString(formData, "date");
  const [existingEntryOnTargetDate, dailyGoal] = await Promise.all([
    targetDate ? data.entries.getEntryByDate(targetDate) : Promise.resolve(null),
    data.goals.getDailyGoalForDate(targetDate || entry.date)
  ]);
  const result = prepareReadingEntryCorrection({
    entry,
    book,
    targetDate,
    dailyGoalPages: dailyGoal.pagesPerDay,
    existingEntryOnTargetDate,
    startPage: getOptionalNumber(formData, "startPage"),
    endPage: getOptionalNumber(formData, "endPage"),
    creditedPages: getNumber(formData, "creditedPages"),
    note: getString(formData, "note")
  });

  if (!result.ok) {
    redirectToJourneyWithError(result.error);
  }

  await data.entries.updateEntry(result.entry);
  await updateBookAfterHistoryChange(data, result.entry.bookId);

  revalidateAppRoutes(result.entry.bookId);
  redirect("/journey?message=entry_updated");
}

export async function deleteReadingEntryAction(formData: FormData): Promise<void> {
  const data = createSupabaseDataAccess();
  const entry = await getEntryFromForm(data, formData);

  await data.entries.deleteEntry(entry.id);
  await updateBookAfterHistoryChange(data, entry.bookId);

  revalidateAppRoutes(entry.bookId);
  redirect("/journey?message=entry_deleted");
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string): number {
  const value = Number(getString(formData, key));

  return Number.isFinite(value) ? Math.floor(value) : 0;
}

function getOptionalNumber(formData: FormData, key: string): number | null {
  const rawValue = getString(formData, key);

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? Math.floor(value) : null;
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

async function getEntryFromForm(
  data: ReturnType<typeof createSupabaseDataAccess>,
  formData: FormData
) {
  const entryId = getString(formData, "entryId");
  const entry = entryId ? await data.entries.getEntryById(entryId) : null;

  if (!entry) {
    redirectToJourneyWithError("invalid_entry");
  }

  return entry;
}

async function updateBookAfterHistoryChange(
  data: ReturnType<typeof createSupabaseDataAccess>,
  bookId: string
): Promise<void> {
  const [book, entries] = await Promise.all([
    data.books.getBookById(bookId),
    data.entries.listEntries()
  ]);

  if (!book) {
    redirectToJourneyWithError("invalid_book");
  }

  await data.books.updateBook(
    recalculateBookAfterEntryChange(
      book,
      entries.filter((entry) => entry.bookId === book.id)
    )
  );
}

function revalidateAppRoutes(bookId: string): void {
  revalidatePath("/");
  revalidatePath("/journey");
  revalidatePath("/books");
  revalidatePath(`/books/${bookId}`);
  revalidatePath("/report");
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

function redirectToJourneyWithError(error: string): never {
  redirect(`/journey?error=${encodeURIComponent(error)}`);
}

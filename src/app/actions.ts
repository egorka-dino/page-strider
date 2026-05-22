"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createActiveBookDraft,
  prepareTodayReadingEntry
} from "@/domain";
import { createSupabaseDataAccess } from "@/data";

export async function createBookAction(formData: FormData): Promise<void> {
  const title = getString(formData, "title");
  const author = getString(formData, "author");
  const totalPages = getNumber(formData, "totalPages");
  const startPage = getNumber(formData, "startPage");
  const currentPage = getNumber(formData, "currentPage");
  const startedDate = getString(formData, "startedDate") || getTodayIsoDate();

  if (!title || !author) {
    redirectWithError("book_details_required");
  }

  if (totalPages < 1 || startPage < 1 || currentPage < startPage) {
    redirectWithError("invalid_book_pages");
  }

  if (startPage > totalPages || currentPage >= totalPages) {
    redirectWithError("invalid_book_pages");
  }

  const data = createSupabaseDataAccess();

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

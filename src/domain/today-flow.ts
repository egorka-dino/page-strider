import type { Book, ReadingEntry, Settings } from "./types";

export type TodayFlowError =
  | "missing_active_book"
  | "entry_exists"
  | "invalid_entry"
  | "invalid_entry_date"
  | "invalid_credited_pages"
  | "end_before_start"
  | "end_after_total"
  | "invalid_book";

export type TodayReadingResult =
  | {
      ok: true;
      entry: Omit<ReadingEntry, "id">;
      book: Book;
    }
  | {
      ok: false;
      error: TodayFlowError;
    };

export type ReadingEntryCorrectionResult =
  | {
      ok: true;
      entry: ReadingEntry;
    }
  | {
      ok: false;
      error: TodayFlowError;
    };

export interface ActiveBookInput {
  title: string;
  author: string;
  totalPages: number;
  startPage: number;
  currentPage: number;
  startedDate: string;
}

export function createActiveBookDraft(
  input: ActiveBookInput
): Omit<Book, "id"> {
  const totalPages = normalizePositivePage(input.totalPages);
  const startPage = normalizePositivePage(input.startPage);
  const currentPage = normalizePositivePage(input.currentPage);

  return {
    title: input.title.trim(),
    author: input.author.trim(),
    totalPages,
    startPage,
    currentPage,
    status: "reading",
    startedDate: input.startedDate,
    finishedDate: null
  };
}

export function prepareTodayReadingEntry(input: {
  activeBook: Book | null;
  settings: Settings;
  today: string;
  startPage: number | null;
  endPage: number | null;
  creditedPages: number;
  note?: string;
  existingEntry: ReadingEntry | null;
}): TodayReadingResult {
  if (!input.activeBook) {
    return { ok: false, error: "missing_active_book" };
  }

  if (input.existingEntry) {
    return { ok: false, error: "entry_exists" };
  }

  const activeBook = input.activeBook;
  const startPage = normalizeOptionalPage(input.startPage);
  const endPage = normalizeOptionalPage(input.endPage);
  const creditedPages = Math.floor(input.creditedPages);

  if (!isValidBook(activeBook)) {
    return { ok: false, error: "invalid_book" };
  }

  if (!Number.isFinite(creditedPages) || creditedPages < 1) {
    return { ok: false, error: "invalid_credited_pages" };
  }

  if (startPage !== null && endPage !== null && endPage < startPage) {
    return { ok: false, error: "end_before_start" };
  }

  if (endPage !== null && endPage > activeBook.totalPages) {
    return { ok: false, error: "end_after_total" };
  }

  const bookFinished = endPage !== null && endPage >= activeBook.totalPages;
  const note = input.note?.trim();
  const book: Book = endPage === null
    ? activeBook
    : {
        ...activeBook,
        currentPage: endPage,
        status: bookFinished ? "finished" : "reading",
        finishedDate: bookFinished ? input.today : null
      };

  return {
    ok: true,
    entry: {
      date: input.today,
      bookId: activeBook.id,
      bookTitle: activeBook.title,
      startPage,
      endPage,
      creditedPages,
      dailyGoalPages: Math.max(1, Math.floor(input.settings.dailyGoalPages)),
      ...(note ? { note } : {})
    },
    book
  };
}

export function prepareReadingEntryCorrection(input: {
  entry: ReadingEntry | null;
  book: Book | null;
  targetDate: string;
  dailyGoalPages: number;
  existingEntryOnTargetDate: ReadingEntry | null;
  startPage: number | null;
  endPage: number | null;
  creditedPages: number;
  note?: string;
}): ReadingEntryCorrectionResult {
  if (!input.entry) {
    return { ok: false, error: "invalid_entry" };
  }

  if (!input.book || input.entry.bookId !== input.book.id || !isValidBook(input.book)) {
    return { ok: false, error: "invalid_book" };
  }

  if (!isValidIsoDate(input.targetDate)) {
    return { ok: false, error: "invalid_entry_date" };
  }

  if (
    input.existingEntryOnTargetDate &&
    input.existingEntryOnTargetDate.id !== input.entry.id
  ) {
    return { ok: false, error: "entry_exists" };
  }

  const startPage = normalizeOptionalPage(input.startPage);
  const endPage = normalizeOptionalPage(input.endPage);
  const creditedPages = Math.floor(input.creditedPages);

  if (!Number.isFinite(creditedPages) || creditedPages < 1) {
    return { ok: false, error: "invalid_credited_pages" };
  }

  if (startPage !== null && endPage !== null && endPage < startPage) {
    return { ok: false, error: "end_before_start" };
  }

  if (endPage !== null && endPage > input.book.totalPages) {
    return { ok: false, error: "end_after_total" };
  }

  const note = input.note?.trim();
  const entry: ReadingEntry = {
    id: input.entry.id,
    date: input.targetDate,
    bookId: input.book.id,
    bookTitle: input.book.title,
    startPage,
    endPage,
    creditedPages,
    dailyGoalPages: Math.max(1, Math.floor(input.dailyGoalPages))
  };

  return {
    ok: true,
    entry: note ? { ...entry, note } : entry
  };
}

export function recalculateBookAfterEntryChange(
  book: Book,
  entries: ReadingEntry[]
): Book {
  const bookmarkEntries = entries
    .filter((entry) => entry.bookId === book.id && entry.endPage !== null)
    .sort((first, second) => first.date.localeCompare(second.date));
  const latestEntry = bookmarkEntries.at(-1);
  const currentPage = latestEntry?.endPage ?? Math.max(1, book.startPage - 1);

  if (currentPage >= book.totalPages) {
    return {
      ...book,
      currentPage: book.totalPages,
      status: "finished",
      finishedDate: latestEntry?.date ?? book.finishedDate
    };
  }

  return {
    ...book,
    currentPage,
    status: book.status === "finished" ? "paused" : book.status,
    finishedDate: null
  };
}

function normalizePositivePage(page: number): number {
  return Math.max(1, Math.floor(page));
}

function normalizeOptionalPage(page: number | null): number | null {
  if (page === null || !Number.isFinite(page)) {
    return null;
  }

  return Math.max(1, Math.floor(page));
}

function isValidBook(book: Book): boolean {
  return (
    book.title.trim().length > 0 &&
    book.totalPages >= 1 &&
    book.startPage >= 1 &&
    book.currentPage >= book.startPage - 1 &&
    book.currentPage <= book.totalPages
  );
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
}

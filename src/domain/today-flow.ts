import { calculatePagesRead } from "./reading-calculations";
import type { Book, ReadingEntry, Settings } from "./types";

export type TodayFlowError =
  | "missing_active_book"
  | "entry_exists"
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
  finishedPage: number;
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
  const startPage = activeBook.currentPage + 1;
  const endPage = Math.floor(input.finishedPage);

  if (!isValidBook(activeBook)) {
    return { ok: false, error: "invalid_book" };
  }

  if (endPage < startPage) {
    return { ok: false, error: "end_before_start" };
  }

  if (endPage > activeBook.totalPages) {
    return { ok: false, error: "end_after_total" };
  }

  const bookFinished = endPage >= activeBook.totalPages;
  const note = input.note?.trim();

  return {
    ok: true,
    entry: {
      date: input.today,
      bookId: activeBook.id,
      bookTitle: activeBook.title,
      startPage,
      endPage,
      pagesRead: calculatePagesRead(startPage, endPage),
      dailyGoalPages: Math.max(1, Math.floor(input.settings.dailyGoalPages)),
      ...(note ? { note } : {})
    },
    book: {
      ...activeBook,
      currentPage: endPage,
      status: bookFinished ? "finished" : "reading",
      finishedDate: bookFinished ? input.today : null
    }
  };
}

function normalizePositivePage(page: number): number {
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

import type { Book, ReadingEntry } from "./types";

export type BookActivationError = "entry_exists" | "book_finished";

export type BookActivationResult =
  | {
      ok: true;
      activatedBook: Book;
      previousActiveBook: Book | null;
    }
  | {
      ok: false;
      error: BookActivationError;
    };

export interface BookDetailsInput {
  title: string;
  author: string;
  totalPages: number;
}

export function pauseBook(book: Book): Book {
  return {
    ...book,
    status: "paused",
    finishedDate: null
  };
}

export function finishBook(book: Book, finishedDate: string): Book {
  return {
    ...book,
    currentPage: book.totalPages,
    status: "finished",
    finishedDate
  };
}

export function prepareBookActivation(input: {
  targetBook: Book;
  activeBook: Book | null;
  todayEntry: ReadingEntry | null;
}): BookActivationResult {
  if (input.todayEntry) {
    return { ok: false, error: "entry_exists" };
  }

  if (input.targetBook.status === "finished") {
    return { ok: false, error: "book_finished" };
  }

  const previousActiveBook =
    input.activeBook && input.activeBook.id !== input.targetBook.id
      ? pauseBook(input.activeBook)
      : null;

  return {
    ok: true,
    activatedBook: {
      ...input.targetBook,
      status: "reading",
      finishedDate: null
    },
    previousActiveBook
  };
}

export function updateBookDetails(book: Book, input: BookDetailsInput): Book {
  return {
    ...book,
    title: input.title.trim(),
    author: input.author.trim(),
    totalPages: Math.max(1, Math.floor(input.totalPages))
  };
}

import { describe, expect, it } from "vitest";

import type { Book, ReadingEntry } from "./types";
import {
  finishBook,
  pauseBook,
  prepareBookActivation,
  updateBookDetails
} from "./book-management";

const activeBook = book("active-book", "reading");
const pausedBook = book("paused-book", "paused");
const finishedBook = book("finished-book", "finished");

describe("book management", () => {
  it("pauses the active book without changing progress", () => {
    expect(pauseBook(activeBook)).toEqual({
      ...activeBook,
      status: "paused",
      finishedDate: null
    });
  });

  it("finishes the active book at its current page", () => {
    expect(finishBook(activeBook, "2026-05-23")).toEqual({
      ...activeBook,
      currentPage: activeBook.totalPages,
      status: "finished",
      finishedDate: "2026-05-23"
    });
  });

  it("activates a paused book and pauses the previous active book", () => {
    const result = prepareBookActivation({
      targetBook: pausedBook,
      activeBook,
      todayEntry: null
    });

    expect(result).toEqual({
      ok: true,
      activatedBook: {
        ...pausedBook,
        status: "reading",
        finishedDate: null
      },
      previousActiveBook: {
        ...activeBook,
        status: "paused",
        finishedDate: null
      }
    });
  });

  it("does not activate another book after today's reading entry exists", () => {
    const result = prepareBookActivation({
      targetBook: pausedBook,
      activeBook,
      todayEntry: entry("2026-05-23")
    });

    expect(result).toEqual({
      ok: false,
      error: "entry_exists"
    });
  });

  it("does not activate a finished book", () => {
    const result = prepareBookActivation({
      targetBook: finishedBook,
      activeBook: null,
      todayEntry: null
    });

    expect(result).toEqual({
      ok: false,
      error: "book_finished"
    });
  });

  it("updates book details while preserving status and reading progress", () => {
    expect(
      updateBookDetails(finishedBook, {
        title: "  Updated title ",
        author: " Updated author ",
        totalPages: 130
      })
    ).toEqual({
      ...finishedBook,
      title: "Updated title",
      author: "Updated author",
      totalPages: 130
    });
  });
});

function book(id: string, status: Book["status"]): Book {
  return {
    id,
    title: `Book ${id}`,
    author: "Author",
    totalPages: 120,
    startPage: 1,
    currentPage: status === "finished" ? 120 : 40,
    status,
    startedDate: "2026-05-20",
    finishedDate: status === "finished" ? "2026-05-22" : null
  };
}

function entry(date: string): ReadingEntry {
  return {
    id: "entry-1",
    date,
    bookId: "active-book",
    bookTitle: "Book active-book",
    startPage: 20,
    endPage: 40,
    pagesRead: 21,
    dailyGoalPages: 17
  };
}

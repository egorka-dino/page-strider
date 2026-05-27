import { describe, expect, it } from "vitest";

import type { Book, ReadingEntry, Settings } from "./types";
import {
  createActiveBookDraft,
  prepareTodayReadingEntry
} from "./today-flow";

const settings: Settings = {
  dailyGoalPages: 20
};

const activeBook: Book = {
  id: "book-1",
  title: "The Hobbit",
  author: "J. R. R. Tolkien",
  totalPages: 310,
  startPage: 1,
  currentPage: 24,
  status: "reading",
  startedDate: "2026-05-20",
  finishedDate: null
};

describe("today flow", () => {
  it("creates an active book draft from setup input", () => {
    expect(
      createActiveBookDraft({
        title: "  The Hobbit  ",
        author: "  J. R. R. Tolkien ",
        totalPages: 310,
        startPage: 1,
        currentPage: 1,
        startedDate: "2026-05-20"
      })
    ).toEqual({
      title: "The Hobbit",
      author: "J. R. R. Tolkien",
      totalPages: 310,
      startPage: 1,
      currentPage: 1,
      status: "reading",
      startedDate: "2026-05-20",
      finishedDate: null
    });
  });

  it("prepares today's entry and next book state", () => {
    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: 25,
      endPage: 42,
      creditedPages: 16,
      note: " Read after dinner. ",
      existingEntry: null
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.entry).toEqual({
      date: "2026-05-22",
      bookId: "book-1",
      bookTitle: "The Hobbit",
      startPage: 25,
      endPage: 42,
      creditedPages: 16,
      dailyGoalPages: 20,
      note: "Read after dinner."
    });
    expect(result.book).toEqual({
      ...activeBook,
      currentPage: 42,
      status: "reading",
      finishedDate: null
    });
  });

  it("marks the book finished when the final page is read", () => {
    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: 25,
      endPage: 310,
      creditedPages: 286,
      note: "",
      existingEntry: null
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.book.status).toBe("finished");
    expect(result.book.finishedDate).toBe("2026-05-22");
  });

  it("saves credited-only reading without moving the bookmark", () => {
    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: null,
      endPage: null,
      creditedPages: 12,
      note: "",
      existingEntry: null
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.entry).toEqual({
      date: "2026-05-22",
      bookId: "book-1",
      bookTitle: "The Hobbit",
      startPage: null,
      endPage: null,
      creditedPages: 12,
      dailyGoalPages: 20
    });
    expect(result.book).toEqual(activeBook);
  });

  it("rejects a finished page before today's start page", () => {
    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: 25,
      endPage: 24,
      creditedPages: 1,
      note: "",
      existingEntry: null
    });

    expect(result).toEqual({
      ok: false,
      error: "end_before_start"
    });
  });

  it("rejects a finished page beyond the total pages", () => {
    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: 25,
      endPage: 311,
      creditedPages: 287,
      note: "",
      existingEntry: null
    });

    expect(result).toEqual({
      ok: false,
      error: "end_after_total"
    });
  });

  it("rejects non-positive credited pages", () => {
    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: 25,
      endPage: 42,
      creditedPages: 0,
      note: "",
      existingEntry: null
    });

    expect(result).toEqual({
      ok: false,
      error: "invalid_credited_pages"
    });
  });

  it("rejects a duplicate entry for the same day", () => {
    const existingEntry: ReadingEntry = {
      id: "entry-1",
      date: "2026-05-22",
      bookId: "book-1",
      bookTitle: "The Hobbit",
      startPage: 1,
      endPage: 24,
      creditedPages: 24,
      dailyGoalPages: 20
    };

    const result = prepareTodayReadingEntry({
      activeBook,
      settings,
      today: "2026-05-22",
      startPage: 25,
      endPage: 42,
      creditedPages: 18,
      note: "",
      existingEntry
    });

    expect(result).toEqual({
      ok: false,
      error: "entry_exists"
    });
  });
});

import { describe, expect, it } from "vitest";

import type { Book, ReadingEntry, Settings } from "./types";
import {
  createActiveBookDraft,
  prepareReadingEntryCorrection,
  recalculateBookAfterEntryChange,
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

  it("prepares a corrected entry with the daily goal for the target date", () => {
    const entry = createEntry({ id: "entry-1", date: "2026-05-22" });
    const result = prepareReadingEntryCorrection({
      entry,
      book: activeBook,
      targetDate: "2026-05-23",
      dailyGoalPages: 21,
      existingEntryOnTargetDate: null,
      startPage: 25,
      endPage: 45,
      creditedPages: 18,
      note: "  New route note. "
    });

    expect(result).toEqual({
      ok: true,
      entry: {
        ...entry,
        date: "2026-05-23",
        startPage: 25,
        endPage: 45,
        creditedPages: 18,
        dailyGoalPages: 21,
        note: "New route note."
      }
    });
  });

  it("allows keeping the same date while correcting an entry", () => {
    const entry = createEntry({ id: "entry-1", date: "2026-05-22" });
    const result = prepareReadingEntryCorrection({
      entry,
      book: activeBook,
      targetDate: "2026-05-22",
      dailyGoalPages: 20,
      existingEntryOnTargetDate: entry,
      startPage: null,
      endPage: null,
      creditedPages: 9,
      note: ""
    });

    expect(result).toEqual({
      ok: true,
      entry: {
        ...entry,
        startPage: null,
        endPage: null,
        creditedPages: 9,
        dailyGoalPages: 20
      }
    });
  });

  it("rejects moving a corrected entry onto another saved day", () => {
    const entry = createEntry({ id: "entry-1", date: "2026-05-22" });
    const otherEntry = createEntry({ id: "entry-2", date: "2026-05-23" });

    expect(
      prepareReadingEntryCorrection({
        entry,
        book: activeBook,
        targetDate: "2026-05-23",
        dailyGoalPages: 20,
        existingEntryOnTargetDate: otherEntry,
        startPage: 25,
        endPage: 45,
        creditedPages: 18,
        note: ""
      })
    ).toEqual({
      ok: false,
      error: "entry_exists"
    });
  });

  it("rejects invalid corrected entry values", () => {
    const entry = createEntry({ id: "entry-1", date: "2026-05-22" });

    expect(
      prepareReadingEntryCorrection({
        entry,
        book: activeBook,
        targetDate: "2026-05-22",
        dailyGoalPages: 20,
        existingEntryOnTargetDate: null,
        startPage: 25,
        endPage: 45,
        creditedPages: 0,
        note: ""
      })
    ).toEqual({ ok: false, error: "invalid_credited_pages" });

    expect(
      prepareReadingEntryCorrection({
        entry,
        book: activeBook,
        targetDate: "2026-05-22",
        dailyGoalPages: 20,
        existingEntryOnTargetDate: null,
        startPage: 45,
        endPage: 25,
        creditedPages: 1,
        note: ""
      })
    ).toEqual({ ok: false, error: "end_before_start" });

    expect(
      prepareReadingEntryCorrection({
        entry,
        book: activeBook,
        targetDate: "2026-05-22",
        dailyGoalPages: 20,
        existingEntryOnTargetDate: null,
        startPage: 300,
        endPage: 311,
        creditedPages: 12,
        note: ""
      })
    ).toEqual({ ok: false, error: "end_after_total" });
  });

  it("recalculates book progress from remaining history entries", () => {
    const finishedBook: Book = {
      ...activeBook,
      currentPage: 310,
      status: "finished",
      finishedDate: "2026-05-24"
    };
    const result = recalculateBookAfterEntryChange(finishedBook, [
      createEntry({ id: "entry-1", date: "2026-05-22", endPage: 42 }),
      createEntry({ id: "entry-2", date: "2026-05-23", endPage: 90 })
    ]);

    expect(result).toEqual({
      ...finishedBook,
      currentPage: 90,
      status: "paused",
      finishedDate: null
    });
  });

  it("keeps a book finished when corrected history still reaches the final page", () => {
    const result = recalculateBookAfterEntryChange(activeBook, [
      createEntry({ id: "entry-1", date: "2026-05-22", endPage: 42 }),
      createEntry({ id: "entry-2", date: "2026-05-23", endPage: 310 })
    ]);

    expect(result).toEqual({
      ...activeBook,
      currentPage: 310,
      status: "finished",
      finishedDate: "2026-05-23"
    });
  });
});

function createEntry(input: Partial<ReadingEntry> = {}): ReadingEntry {
  return {
    id: "entry-1",
    date: "2026-05-22",
    bookId: "book-1",
    bookTitle: "The Hobbit",
    startPage: 25,
    endPage: 42,
    creditedPages: 18,
    dailyGoalPages: 20,
    ...input
  };
}

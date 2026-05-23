import { describe, expect, it } from "vitest";

import type { ReadingEntry } from "./types";
import { buildReadingHistoryDays } from "./reading-history";

const entries: ReadingEntry[] = [
  {
    id: "entry-2",
    date: "2026-05-20",
    bookId: "book-1",
    bookTitle: "The Wild Robot",
    startPage: 31,
    endPage: 54,
    pagesRead: 24,
    dailyGoalPages: 20
  },
  {
    id: "entry-1",
    date: "2026-05-21",
    bookId: "book-1",
    bookTitle: "The Wild Robot",
    startPage: 55,
    endPage: 72,
    pagesRead: 18,
    dailyGoalPages: 20,
    note: "A calm evening chapter."
  },
  {
    id: "entry-3",
    date: "2026-05-19",
    bookId: "book-1",
    bookTitle: "The Wild Robot",
    startPage: 1,
    endPage: 120,
    pagesRead: 120,
    dailyGoalPages: 20
  }
];

describe("reading history", () => {
  it("builds recent calendar days ending on the anchor date", () => {
    expect(
      buildReadingHistoryDays({
        entries,
        anchorDate: "2026-05-22",
        dayCount: 4,
        dailyGoalPages: 20
      }).map((day) => ({
        date: day.date,
        pagesRead: day.pagesRead,
        level: day.level,
        hasEntry: Boolean(day.entry)
      }))
    ).toEqual([
      {
        date: "2026-05-22",
        pagesRead: 0,
        level: "no_reading",
        hasEntry: false
      },
      {
        date: "2026-05-21",
        pagesRead: 18,
        level: "partial",
        hasEntry: true
      },
      {
        date: "2026-05-20",
        pagesRead: 24,
        level: "good",
        hasEntry: true
      },
      {
        date: "2026-05-19",
        pagesRead: 120,
        level: "legendary",
        hasEntry: true
      }
    ]);
  });

  it("uses the entry goal snapshot when classifying a historical reading day", () => {
    const [day] = buildReadingHistoryDays({
      entries: [
        {
          ...entries[0],
          date: "2026-05-22",
          pagesRead: 24,
          dailyGoalPages: 30
        }
      ],
      anchorDate: "2026-05-22",
      dayCount: 1,
      dailyGoalPages: 20
    });

    expect(day.level).toBe("partial");
  });
});

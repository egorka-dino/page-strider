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
    creditedPages: 24,
    dailyGoalPages: 20
  },
  {
    id: "entry-1",
    date: "2026-05-21",
    bookId: "book-1",
    bookTitle: "The Wild Robot",
    startPage: 55,
    endPage: 72,
    creditedPages: 18,
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
    creditedPages: 120,
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
        creditedPages: day.creditedPages,
        level: day.level,
        hasEntry: Boolean(day.entry)
      }))
    ).toEqual([
      {
        date: "2026-05-22",
        creditedPages: 0,
        level: "no_reading",
        hasEntry: false
      },
      {
        date: "2026-05-21",
        creditedPages: 18,
        level: "partial",
        hasEntry: true
      },
      {
        date: "2026-05-20",
        creditedPages: 24,
        level: "good",
        hasEntry: true
      },
      {
        date: "2026-05-19",
        creditedPages: 120,
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
          creditedPages: 24,
          dailyGoalPages: 30
        }
      ],
      anchorDate: "2026-05-22",
      dayCount: 1,
      dailyGoalPages: 20
    });

    expect(day.level).toBe("partial");
  });

  it("uses historical daily goals for days without relying on the current goal", () => {
    expect(
      buildReadingHistoryDays({
        entries: [
          {
            ...entries[0],
            date: "2026-07-10",
            creditedPages: 21,
            dailyGoalPages: 22
          },
          {
            ...entries[1],
            date: "2026-06-20",
            creditedPages: 18,
            dailyGoalPages: 17
          }
        ],
        anchorDate: "2026-07-10",
        dayCount: 22,
        dailyGoalPages: 22
      })
        .filter((day) => day.entry)
        .map((day) => ({
          date: day.date,
          level: day.level
        }))
    ).toEqual([
      { date: "2026-07-10", level: "partial" },
      { date: "2026-06-20", level: "goal" }
    ]);
  });
});

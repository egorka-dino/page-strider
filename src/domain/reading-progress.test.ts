import { describe, expect, it } from "vitest";

import type { Book, ReadingEntry } from "./types";
import {
  buildComputedBadges,
  calculateReadingMetrics,
  calculateStreaks
} from "./reading-progress";

const entries: ReadingEntry[] = [
  entry("2026-05-16", 18),
  entry("2026-05-17", 19),
  entry("2026-05-19", 12),
  entry("2026-05-20", 34),
  entry("2026-05-21", 100),
  entry("2026-05-22", 21)
];

const books: Book[] = [
  book("book-1", "finished"),
  book("book-2", "reading")
];

describe("reading progress", () => {
  it("calculates current and best streaks from goal-completed days", () => {
    expect(
      calculateStreaks({
        entries,
        dailyGoalPages: 17,
        anchorDate: "2026-05-23"
      })
    ).toEqual({
      currentStreakDays: 3,
      bestStreakDays: 3
    });
  });

  it("does not keep the current streak after a missed calendar day", () => {
    expect(
      calculateStreaks({
        entries,
        dailyGoalPages: 17,
        anchorDate: "2026-05-24"
      }).currentStreakDays
    ).toBe(0);
  });

  it("calculates phase four metrics without hardcoded goal values", () => {
    expect(
      calculateReadingMetrics({
        entries,
        books,
        dailyGoalPages: 17,
        anchorDate: "2026-05-23"
      })
    ).toEqual({
      totalPagesRead: 204,
      booksFinished: 1,
      currentStreakDays: 3,
      bestStreakDays: 3,
      readingDaysCount: 6,
      goalCompletedDaysCount: 5,
      averagePagesPerReadingDay: 34,
      averagePagesPerCalendarDay: 25.5,
      bestDayPages: 100,
      pagesReadThisWeek: 167,
      readingDaysThisWeek: 4
    });
  });

  it("keeps streaks across a daily goal change when each day meets its historical goal", () => {
    const changedGoalEntries = [
      entry("2026-06-30", 17, 17),
      entry("2026-07-01", 22, 22),
      entry("2026-07-02", 23, 22)
    ];

    expect(
      calculateStreaks({
        entries: changedGoalEntries,
        dailyGoalPages: 22,
        anchorDate: "2026-07-02"
      })
    ).toEqual({
      currentStreakDays: 3,
      bestStreakDays: 3
    });
  });

  it("computes earned badges from reading progress and book state", () => {
    const badges = buildComputedBadges({
      entries,
      books,
      dailyGoalPages: 17,
      anchorDate: "2026-05-23"
    });

    expect(badges.map((badge) => [badge.key, badge.earned])).toEqual([
      ["first_stride", true],
      ["goal_keeper", true],
      ["page_sprinter", true],
      ["long_strider", true],
      ["century_strider", true],
      ["book_finisher", true],
      ["steady_week", false],
      ["comeback", true]
    ]);
    expect(badges.find((badge) => badge.key === "century_strider")?.earnedDate).toBe(
      "2026-05-21"
    );
  });
});

function entry(
  date: string,
  pagesRead: number,
  dailyGoalPages = 17
): ReadingEntry {
  return {
    id: `entry-${date}`,
    date,
    bookId: "book-1",
    bookTitle: "Test Book",
    startPage: 1,
    endPage: pagesRead,
    pagesRead,
    dailyGoalPages
  };
}

function book(id: string, status: Book["status"]): Book {
  return {
    id,
    title: `Book ${id}`,
    author: "Author",
    totalPages: 120,
    startPage: 1,
    currentPage: status === "finished" ? 120 : 50,
    status,
    startedDate: "2026-05-01",
    finishedDate: status === "finished" ? "2026-05-18" : null
  };
}

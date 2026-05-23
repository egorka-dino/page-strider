import { describe, expect, it } from "vitest";

import type { ReadingEntry } from "./types";
import { buildTeacherReportSummary } from "./teacher-report";

describe("teacher report", () => {
  it("summarizes reading entries for the selected calendar period", () => {
    const entries: ReadingEntry[] = [
      entry("2026-05-01", 12, 17),
      entry("2026-05-03", 21, 17),
      entry("2026-05-05", 34, 20)
    ];

    expect(
      buildTeacherReportSummary({
        entries,
        from: "2026-05-01",
        to: "2026-05-07",
        dailyGoalPages: 17
      })
    ).toEqual({
      periodDaysCount: 7,
      totalPagesRead: 67,
      readingDaysCount: 3,
      goalCompletedDaysCount: 2,
      missedDaysCount: 4,
      averagePagesPerReadingDay: 22.333333333333332,
      averagePagesPerCalendarDay: 9.571428571428571,
      bestDayPages: 34
    });
  });

  it("handles an empty selected period without fake averages", () => {
    expect(
      buildTeacherReportSummary({
        entries: [],
        from: "2026-05-01",
        to: "2026-05-07",
        dailyGoalPages: 17
      })
    ).toEqual({
      periodDaysCount: 7,
      totalPagesRead: 0,
      readingDaysCount: 0,
      goalCompletedDaysCount: 0,
      missedDaysCount: 7,
      averagePagesPerReadingDay: null,
      averagePagesPerCalendarDay: 0,
      bestDayPages: 0
    });
  });

  it("summarizes completion against each entry's historical daily goal", () => {
    const entries: ReadingEntry[] = [
      entry("2026-06-20", 18, 17),
      entry("2026-07-10", 21, 22)
    ];

    expect(
      buildTeacherReportSummary({
        entries,
        from: "2026-06-20",
        to: "2026-07-10",
        dailyGoalPages: 22
      }).goalCompletedDaysCount
    ).toBe(1);
  });
});

function entry(date: string, pagesRead: number, dailyGoalPages: number): ReadingEntry {
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

import { describe, expect, it } from "vitest";

import type { DailyGoal } from "./types";
import {
  getDailyGoalForDate,
  normalizeDailyGoalInput,
  resolveDailyGoalsForEntries
} from "./daily-goals";

const goals: DailyGoal[] = [
  goal("goal-1", 17, "2026-05-01"),
  goal("goal-2", 22, "2026-07-01")
];

describe("daily goals", () => {
  it("resolves the latest goal whose effective date is on or before the reading date", () => {
    expect(getDailyGoalForDate(goals, "2026-06-20").pagesPerDay).toBe(17);
    expect(getDailyGoalForDate(goals, "2026-07-10").pagesPerDay).toBe(22);
  });

  it("uses the default daily goal when no records exist yet", () => {
    expect(getDailyGoalForDate([], "2026-06-20")).toMatchObject({
      id: "default-daily-goal",
      pagesPerDay: 17,
      effectiveFrom: "0001-01-01"
    });
  });

  it("resolves a historical goal for each entry date", () => {
    expect(
      resolveDailyGoalsForEntries({
        entries: [
          entry("2026-06-20", 18),
          entry("2026-07-10", 22)
        ],
        goals
      }).map((entry) => ({
        date: entry.date,
        dailyGoalPages: entry.dailyGoalPages
      }))
    ).toEqual([
      { date: "2026-06-20", dailyGoalPages: 17 },
      { date: "2026-07-10", dailyGoalPages: 22 }
    ]);
  });

  it("validates positive integer pages and ISO effective dates", () => {
    expect(normalizeDailyGoalInput({ pagesPerDay: 22, effectiveFrom: "2026-07-01" }))
      .toEqual({
        ok: true,
        value: {
          pagesPerDay: 22,
          effectiveFrom: "2026-07-01"
        }
      });

    expect(normalizeDailyGoalInput({ pagesPerDay: 0, effectiveFrom: "2026-07-01" }))
      .toEqual({
        ok: false,
        error: "invalid_pages"
      });
    expect(normalizeDailyGoalInput({ pagesPerDay: 22, effectiveFrom: "July 1" }))
      .toEqual({
        ok: false,
        error: "invalid_date"
      });
  });
});

function goal(id: string, pagesPerDay: number, effectiveFrom: string): DailyGoal {
  return {
    id,
    pagesPerDay,
    effectiveFrom,
    note: null,
    createdAt: `${effectiveFrom}T00:00:00.000Z`,
    updatedAt: `${effectiveFrom}T00:00:00.000Z`
  };
}

function entry(date: string, pagesRead: number) {
  return {
    id: `entry-${date}`,
    date,
    bookId: "book-1",
    bookTitle: "Test Book",
    startPage: 1,
    endPage: pagesRead,
    pagesRead,
    dailyGoalPages: 17
  };
}

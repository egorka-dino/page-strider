import { describe, expect, it } from "vitest";

import {
  calculateBookProgress,
  calculatePagesLeft,
  calculatePagesRead,
  classifyDayLevel,
  forecastFinishByAveragePace,
  forecastFinishByDailyGoal
} from "./reading-calculations";

describe("reading calculations", () => {
  it("counts pages inclusively from start page through end page", () => {
    expect(calculatePagesRead(42, 65)).toBe(24);
  });

  it("returns zero pages when the end page is before the start page", () => {
    expect(calculatePagesRead(65, 42)).toBe(0);
  });

  it("calculates clamped book progress from the readable page range", () => {
    expect(
      calculateBookProgress({
        startPage: 10,
        currentPage: 29,
        totalPages: 109
      })
    ).toEqual({
      readPages: 20,
      totalReadablePages: 100,
      progress: 0.2
    });

    expect(
      calculateBookProgress({
        startPage: 10,
        currentPage: 120,
        totalPages: 109
      }).progress
    ).toBe(1);

    expect(
      calculateBookProgress({
        startPage: 10,
        currentPage: 5,
        totalPages: 109
      }).progress
    ).toBe(0);
  });

  it("calculates pages left without returning negative values", () => {
    expect(
      calculatePagesLeft({
        startPage: 10,
        currentPage: 29,
        totalPages: 109
      })
    ).toBe(80);

    expect(
      calculatePagesLeft({
        startPage: 10,
        currentPage: 130,
        totalPages: 109
      })
    ).toBe(0);
  });

  it("classifies day levels by configured daily goal thresholds", () => {
    expect(classifyDayLevel(0, 17)).toBe("no_reading");
    expect(classifyDayLevel(1, 17)).toBe("partial");
    expect(classifyDayLevel(17, 17)).toBe("goal");
    expect(classifyDayLevel(21, 17)).toBe("good");
    expect(classifyDayLevel(34, 17)).toBe("great");
    expect(classifyDayLevel(100, 17)).toBe("legendary");
  });

  it("forecasts finish date by daily goal pace", () => {
    expect(
      forecastFinishByDailyGoal({
        pagesLeft: 34,
        dailyGoalPages: 17,
        fromDate: "2026-05-22"
      })
    ).toEqual({
      kind: "daily_goal",
      averagePagesPerDay: 17,
      daysRemaining: 2,
      finishDate: "2026-05-24"
    });
  });

  it("returns an insufficient-history forecast when average pace cannot be calculated", () => {
    expect(
      forecastFinishByAveragePace({
        pagesLeft: 20,
        entries: [],
        fromDate: "2026-05-22"
      })
    ).toEqual({
      kind: "actual_average",
      averagePagesPerDay: null,
      daysRemaining: null,
      finishDate: null,
      reason: "insufficient_history"
    });
  });

  it("forecasts finish date by actual average reading pace", () => {
    expect(
      forecastFinishByAveragePace({
        pagesLeft: 30,
        entries: [
          { date: "2026-05-20", creditedPages: 10 },
          { date: "2026-05-21", creditedPages: 20 }
        ],
        fromDate: "2026-05-22"
      })
    ).toEqual({
      kind: "actual_average",
      averagePagesPerDay: 15,
      daysRemaining: 2,
      finishDate: "2026-05-24",
      reason: null
    });
  });
});

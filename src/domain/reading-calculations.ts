import type {
  BookPageState,
  BookProgress,
  DayLevel,
  FinishForecast,
  ReadingPaceEntry
} from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculatePagesRead(startPage: number, endPage: number): number {
  if (!Number.isFinite(startPage) || !Number.isFinite(endPage)) {
    return 0;
  }

  return Math.max(0, Math.floor(endPage) - Math.floor(startPage) + 1);
}

export function calculateBookProgress(book: BookPageState): BookProgress {
  const totalReadablePages = Math.max(
    0,
    Math.floor(book.totalPages) - Math.floor(book.startPage) + 1
  );
  const readPages = Math.min(
    totalReadablePages,
    Math.max(0, Math.floor(book.currentPage) - Math.floor(book.startPage) + 1)
  );
  const progress =
    totalReadablePages === 0 ? 0 : clamp(readPages / totalReadablePages, 0, 1);

  return {
    readPages,
    totalReadablePages,
    progress
  };
}

export function calculatePagesLeft(book: BookPageState): number {
  const progress = calculateBookProgress(book);

  return Math.max(0, progress.totalReadablePages - progress.readPages);
}

export function classifyDayLevel(
  pagesRead: number,
  dailyGoalPages: number
): DayLevel {
  const normalizedPagesRead = Math.max(0, Math.floor(pagesRead));
  const normalizedGoal = Math.max(1, Math.floor(dailyGoalPages));

  if (normalizedPagesRead >= 100) {
    return "legendary";
  }

  if (normalizedPagesRead >= normalizedGoal * 2) {
    return "great";
  }

  if (normalizedPagesRead >= Math.ceil(normalizedGoal * 1.2)) {
    return "good";
  }

  if (normalizedPagesRead >= normalizedGoal) {
    return "goal";
  }

  if (normalizedPagesRead > 0) {
    return "partial";
  }

  return "no_reading";
}

export function forecastFinishByDailyGoal(input: {
  pagesLeft: number;
  dailyGoalPages: number;
  fromDate: string;
}): FinishForecast {
  const dailyGoalPages = Math.max(1, Math.floor(input.dailyGoalPages));
  const pagesLeft = Math.max(0, Math.floor(input.pagesLeft));
  const daysRemaining = Math.ceil(pagesLeft / dailyGoalPages);

  return {
    kind: "daily_goal",
    averagePagesPerDay: dailyGoalPages,
    daysRemaining,
    finishDate: addDays(input.fromDate, daysRemaining)
  };
}

export function forecastFinishByAveragePace(input: {
  pagesLeft: number;
  entries: ReadingPaceEntry[];
  fromDate: string;
}): FinishForecast {
  if (input.entries.length === 0) {
    return {
      kind: "actual_average",
      averagePagesPerDay: null,
      daysRemaining: null,
      finishDate: null,
      reason: "insufficient_history"
    };
  }

  const totalPagesRead = input.entries.reduce(
    (total, entry) => total + Math.max(0, entry.pagesRead),
    0
  );
  const averagePagesPerDay = totalPagesRead / input.entries.length;

  if (averagePagesPerDay <= 0) {
    return {
      kind: "actual_average",
      averagePagesPerDay: 0,
      daysRemaining: null,
      finishDate: null,
      reason: "no_reading_pace"
    };
  }

  const pagesLeft = Math.max(0, Math.floor(input.pagesLeft));
  const daysRemaining = Math.ceil(pagesLeft / averagePagesPerDay);

  return {
    kind: "actual_average",
    averagePagesPerDay,
    daysRemaining,
    finishDate: addDays(input.fromDate, daysRemaining),
    reason: null
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function addDays(date: string, days: number): string {
  const parsedDate = parseIsoDate(date);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

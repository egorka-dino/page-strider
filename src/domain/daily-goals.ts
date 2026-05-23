import { DEFAULT_DAILY_GOAL_PAGES } from "./constants";
import type { DailyGoal, DailyGoalInput, ReadingEntry } from "./types";

export type DailyGoalValidationError = "invalid_pages" | "invalid_date";

export type DailyGoalValidationResult =
  | {
      ok: true;
      value: DailyGoalInput;
    }
  | {
      ok: false;
      error: DailyGoalValidationError;
    };

export const DEFAULT_DAILY_GOAL: DailyGoal = {
  id: "default-daily-goal",
  pagesPerDay: DEFAULT_DAILY_GOAL_PAGES,
  effectiveFrom: "0001-01-01",
  note: null,
  createdAt: "0001-01-01T00:00:00.000Z",
  updatedAt: "0001-01-01T00:00:00.000Z"
};

export function getDailyGoalForDate(
  goals: DailyGoal[],
  date: string
): DailyGoal {
  const sortedGoals = sortDailyGoalsAscending(goals);
  const activeGoal = sortedGoals
    .filter((goal) => goal.effectiveFrom <= date)
    .at(-1);

  return activeGoal ?? DEFAULT_DAILY_GOAL;
}

export function getCurrentDailyGoal(
  goals: DailyGoal[],
  date: string
): DailyGoal {
  return getDailyGoalForDate(goals, date);
}

export function resolveDailyGoalsForEntries(input: {
  entries: ReadingEntry[];
  goals: DailyGoal[];
}): ReadingEntry[] {
  return input.entries.map((entry) => ({
    ...entry,
    dailyGoalPages: getDailyGoalForDate(input.goals, entry.date).pagesPerDay
  }));
}

export function sortDailyGoalsAscending(goals: DailyGoal[]): DailyGoal[] {
  return [...goals].sort((left, right) =>
    left.effectiveFrom.localeCompare(right.effectiveFrom)
  );
}

export function sortDailyGoalsDescending(goals: DailyGoal[]): DailyGoal[] {
  return [...goals].sort((left, right) =>
    right.effectiveFrom.localeCompare(left.effectiveFrom)
  );
}

export function normalizeDailyGoalInput(input: {
  pagesPerDay: number;
  effectiveFrom: string;
  note?: string | null;
}): DailyGoalValidationResult {
  const pagesPerDay = Math.floor(input.pagesPerDay);

  if (!Number.isFinite(input.pagesPerDay) || pagesPerDay < 1) {
    return { ok: false, error: "invalid_pages" };
  }

  if (!isIsoDate(input.effectiveFrom)) {
    return { ok: false, error: "invalid_date" };
  }

  const note = input.note?.trim();

  return {
    ok: true,
    value: {
      pagesPerDay,
      effectiveFrom: input.effectiveFrom,
      ...(note ? { note } : {})
    }
  };
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
}

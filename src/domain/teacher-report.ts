import type { ReadingEntry, TeacherReportSummary } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function buildTeacherReportSummary(input: {
  entries: ReadingEntry[];
  from: string;
  to: string;
  dailyGoalPages: number;
}): TeacherReportSummary {
  const periodDaysCount = countCalendarDays(input.from, input.to);
  const totalPagesRead = input.entries.reduce(
    (total, entry) => total + Math.max(0, Math.floor(entry.pagesRead)),
    0
  );
  const readingDaysCount = input.entries.filter((entry) => entry.pagesRead > 0).length;
  const goalCompletedDaysCount = input.entries.filter(
    (entry) => entry.pagesRead >= normalizeGoal(entry.dailyGoalPages || input.dailyGoalPages)
  ).length;

  return {
    periodDaysCount,
    totalPagesRead,
    readingDaysCount,
    goalCompletedDaysCount,
    missedDaysCount: Math.max(0, periodDaysCount - readingDaysCount),
    averagePagesPerReadingDay:
      readingDaysCount > 0 ? totalPagesRead / readingDaysCount : null,
    averagePagesPerCalendarDay:
      periodDaysCount > 0 ? totalPagesRead / periodDaysCount : null,
    bestDayPages: Math.max(0, ...input.entries.map((entry) => entry.pagesRead))
  };
}

function countCalendarDays(from: string, to: string): number {
  const difference = Math.round(
    (parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / MS_PER_DAY
  );

  return Math.max(1, difference + 1);
}

function normalizeGoal(dailyGoalPages: number): number {
  return Math.max(1, Math.floor(dailyGoalPages));
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

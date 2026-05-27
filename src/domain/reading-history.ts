import { classifyDayLevel } from "./reading-calculations";
import type { DayLevel, ReadingEntry } from "./types";

export interface ReadingHistoryDay {
  date: string;
  creditedPages: number;
  level: DayLevel;
  entry: ReadingEntry | null;
}

export function buildReadingHistoryDays(input: {
  entries: ReadingEntry[];
  anchorDate: string;
  dayCount: number;
  dailyGoalPages: number;
}): ReadingHistoryDay[] {
  const entriesByDate = new Map(
    input.entries.map((entry) => [entry.date, entry])
  );
  const dayCount = Math.max(1, Math.floor(input.dayCount));

  return Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(input.anchorDate, -index);
    const entry = entriesByDate.get(date) ?? null;
    const creditedPages = entry?.creditedPages ?? 0;
    const goalPages = entry?.dailyGoalPages ?? input.dailyGoalPages;

    return {
      date,
      creditedPages,
      level: classifyDayLevel(creditedPages, goalPages),
      entry
    };
  });
}

function addDays(date: string, days: number): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

import type { Badge, BadgeKey, Book, ReadingEntry, ReadingMetrics } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface ProgressInput {
  entries: ReadingEntry[];
  books: Book[];
  dailyGoalPages: number;
  anchorDate: string;
}

interface StreakInput {
  entries: ReadingEntry[];
  dailyGoalPages: number;
  anchorDate: string;
}

export interface ReadingStreaks {
  currentStreakDays: number;
  bestStreakDays: number;
}

export function calculateStreaks(input: StreakInput): ReadingStreaks {
  const entriesByDate = buildEntriesByDate(input.entries);
  const normalizedGoal = normalizeGoal(input.dailyGoalPages);
  const anchorEntry = entriesByDate.get(input.anchorDate);
  const currentStartDate =
    anchorEntry && anchorEntry.creditedPages < goalForEntry(anchorEntry, normalizedGoal)
      ? input.anchorDate
      : anchorEntry
        ? input.anchorDate
        : addDays(input.anchorDate, -1);
  let currentStreakDays = 0;

  for (let date = currentStartDate; ; date = addDays(date, -1)) {
    const entry = entriesByDate.get(date);

    if (!entry || entry.creditedPages < goalForEntry(entry, normalizedGoal)) {
      break;
    }

    currentStreakDays += 1;
  }

  return {
    currentStreakDays,
    bestStreakDays: calculateBestStreak(input.entries, normalizedGoal)
  };
}

export function calculateReadingMetrics(input: ProgressInput): ReadingMetrics {
  const entries = sortEntriesAscending(input.entries);
  const streaks = calculateStreaks(input);
  const readingEntries = entries.filter((entry) => entry.creditedPages > 0);
  const totalPagesRead = entries.reduce(
    (total, entry) => total + Math.max(0, Math.floor(entry.creditedPages)),
    0
  );
  const firstDate = entries[0]?.date ?? null;
  const calendarDayCount = firstDate
    ? Math.max(1, differenceInDays(firstDate, input.anchorDate) + 1)
    : 0;
  const weekStart = startOfIsoWeek(input.anchorDate);
  const weekEntries = entries.filter(
    (entry) => entry.date >= weekStart && entry.date <= input.anchorDate
  );

  return {
    totalPagesRead,
    booksFinished: input.books.filter((book) => book.status === "finished").length,
    currentStreakDays: streaks.currentStreakDays,
    bestStreakDays: streaks.bestStreakDays,
    readingDaysCount: readingEntries.length,
    goalCompletedDaysCount: entries.filter(
      (entry) => entry.creditedPages >= goalForEntry(entry, input.dailyGoalPages)
    ).length,
    averagePagesPerReadingDay:
      readingEntries.length > 0 ? totalPagesRead / readingEntries.length : null,
    averagePagesPerCalendarDay:
      calendarDayCount > 0 ? totalPagesRead / calendarDayCount : null,
    bestDayPages: Math.max(0, ...entries.map((entry) => entry.creditedPages)),
    pagesReadThisWeek: weekEntries.reduce(
      (total, entry) => total + Math.max(0, Math.floor(entry.creditedPages)),
      0
    ),
    readingDaysThisWeek: weekEntries.filter((entry) => entry.creditedPages > 0).length
  };
}

export function buildComputedBadges(input: ProgressInput): Badge[] {
  const entries = sortEntriesAscending(input.entries);
  const metrics = calculateReadingMetrics(input);
  const normalizedGoal = normalizeGoal(input.dailyGoalPages);
  const badgeDefinitions: Array<{
    key: BadgeKey;
    label: string;
    description: string;
    earnedDate: string | null;
  }> = [
    {
      key: "first_stride",
      label: "Первый шаг",
      description: "Сохранен первый читательский квест.",
      earnedDate: entries.find((entry) => entry.creditedPages > 0)?.date ?? null
    },
    {
      key: "goal_keeper",
      label: "Хранитель цели",
      description: "Цель на день взята хотя бы один раз.",
      earnedDate:
        entries.find((entry) => entry.creditedPages >= goalForEntry(entry, normalizedGoal))
          ?.date ?? null
    },
    {
      key: "page_sprinter",
      label: "Страничный спринтер",
      description: "Один день прошел в два раза дальше цели.",
      earnedDate:
        entries.find(
          (entry) => entry.creditedPages >= goalForEntry(entry, normalizedGoal) * 2
        )?.date ?? null
    },
    {
      key: "long_strider",
      label: "Длинный шаг",
      description: "Три дня подряд цель держалась на маршруте.",
      earnedDate: findStreakEarnedDate(entries, normalizedGoal, 3)
    },
    {
      key: "century_strider",
      label: "Сотня страниц",
      description: "За один день прочитано 100 страниц или больше.",
      earnedDate: entries.find((entry) => entry.creditedPages >= 100)?.date ?? null
    },
    {
      key: "book_finisher",
      label: "Финиш книги",
      description: "Хотя бы одна книга дошла до финала.",
      earnedDate:
        input.books
          .filter((book) => book.status === "finished" && book.finishedDate)
          .map((book) => book.finishedDate as string)
          .sort()[0] ?? null
    },
    {
      key: "steady_week",
      label: "Ровная неделя",
      description: "Семь дней подряд цель была выполнена.",
      earnedDate: findStreakEarnedDate(entries, normalizedGoal, 7)
    },
    {
      key: "comeback",
      label: "Возвращение на тропу",
      description: "После паузы маршрут снова получил отметку.",
      earnedDate: findComebackDate(entries)
    }
  ];

  return badgeDefinitions.map((definition) => ({
    key: definition.key,
    label: definition.label,
    description: definition.description,
    earned: Boolean(definition.earnedDate),
    earnedDate: definition.earnedDate
  }));
}

function calculateBestStreak(entries: ReadingEntry[], dailyGoalPages: number): number {
  let bestStreak = 0;
  let currentStreak = 0;
  let previousGoalDate: string | null = null;

  for (const entry of sortEntriesAscending(entries)) {
    if (entry.creditedPages < goalForEntry(entry, dailyGoalPages)) {
      previousGoalDate = null;
      currentStreak = 0;
      continue;
    }

    currentStreak =
      previousGoalDate && differenceInDays(previousGoalDate, entry.date) === 1
        ? currentStreak + 1
        : 1;
    previousGoalDate = entry.date;
    bestStreak = Math.max(bestStreak, currentStreak);
  }

  return bestStreak;
}

function findStreakEarnedDate(
  entries: ReadingEntry[],
  dailyGoalPages: number,
  targetDays: number
): string | null {
  let currentStreak = 0;
  let previousGoalDate: string | null = null;

  for (const entry of sortEntriesAscending(entries)) {
    if (entry.creditedPages < goalForEntry(entry, dailyGoalPages)) {
      previousGoalDate = null;
      currentStreak = 0;
      continue;
    }

    currentStreak =
      previousGoalDate && differenceInDays(previousGoalDate, entry.date) === 1
        ? currentStreak + 1
        : 1;
    previousGoalDate = entry.date;

    if (currentStreak >= targetDays) {
      return entry.date;
    }
  }

  return null;
}

function findComebackDate(entries: ReadingEntry[]): string | null {
  const readingEntries = sortEntriesAscending(entries).filter(
    (entry) => entry.creditedPages > 0
  );

  for (let index = 1; index < readingEntries.length; index += 1) {
    if (differenceInDays(readingEntries[index - 1].date, readingEntries[index].date) > 1) {
      return readingEntries[index].date;
    }
  }

  return null;
}

function buildEntriesByDate(entries: ReadingEntry[]): Map<string, ReadingEntry> {
  return new Map(entries.map((entry) => [entry.date, entry]));
}

function sortEntriesAscending(entries: ReadingEntry[]): ReadingEntry[] {
  return [...entries].sort((left, right) => left.date.localeCompare(right.date));
}

function goalForEntry(entry: ReadingEntry, fallbackGoalPages: number): number {
  return normalizeGoal(entry.dailyGoalPages || fallbackGoalPages);
}

function normalizeGoal(dailyGoalPages: number): number {
  return Math.max(1, Math.floor(dailyGoalPages));
}

function addDays(date: string, days: number): string {
  const parsedDate = parseIsoDate(date);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

function differenceInDays(from: string, to: string): number {
  return Math.round((parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / MS_PER_DAY);
}

function startOfIsoWeek(date: string): string {
  const parsedDate = parseIsoDate(date);
  const day = parsedDate.getUTCDay() || 7;
  parsedDate.setUTCDate(parsedDate.getUTCDate() - day + 1);

  return parsedDate.toISOString().slice(0, 10);
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

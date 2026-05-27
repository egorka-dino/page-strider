export type BookStatus = "reading" | "finished" | "paused";

export type DayLevel =
  | "no_reading"
  | "partial"
  | "goal"
  | "good"
  | "great"
  | "legendary";

export type BadgeKey =
  | "first_stride"
  | "goal_keeper"
  | "page_sprinter"
  | "long_strider"
  | "century_strider"
  | "book_finisher"
  | "steady_week"
  | "comeback";

export interface ReaderProfile {
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  startPage: number;
  currentPage: number;
  status: BookStatus;
  startedDate: string;
  finishedDate: string | null;
}

export interface ReadingEntry {
  id: string;
  date: string;
  bookId: string;
  bookTitle: string;
  startPage: number | null;
  endPage: number | null;
  creditedPages: number;
  dailyGoalPages: number;
  note?: string;
}

export interface Settings {
  dailyGoalPages: number;
}

export interface DailyGoal {
  id: string;
  pagesPerDay: number;
  effectiveFrom: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyGoalInput {
  pagesPerDay: number;
  effectiveFrom: string;
  note?: string;
}

export interface BookPageState {
  startPage: number;
  currentPage: number;
  totalPages: number;
}

export interface BookProgress {
  readPages: number;
  totalReadablePages: number;
  progress: number;
}

export interface ReadingMetrics {
  totalPagesRead: number;
  booksFinished: number;
  currentStreakDays: number;
  bestStreakDays: number;
  readingDaysCount: number;
  goalCompletedDaysCount: number;
  averagePagesPerReadingDay: number | null;
  averagePagesPerCalendarDay: number | null;
  bestDayPages: number;
  pagesReadThisWeek: number;
  readingDaysThisWeek: number;
}

export interface TeacherReportSummary {
  periodDaysCount: number;
  totalPagesRead: number;
  readingDaysCount: number;
  goalCompletedDaysCount: number;
  missedDaysCount: number;
  averagePagesPerReadingDay: number | null;
  averagePagesPerCalendarDay: number | null;
  bestDayPages: number;
}

export interface Badge {
  key: BadgeKey;
  label: string;
  description: string;
  earned: boolean;
  earnedDate: string | null;
}

export type ForecastKind = "daily_goal" | "actual_average";

export type ForecastReason = "insufficient_history" | "no_reading_pace";

export interface FinishForecast {
  kind: ForecastKind;
  averagePagesPerDay: number | null;
  daysRemaining: number | null;
  finishDate: string | null;
  reason?: ForecastReason | null;
}

export interface ReadingPaceEntry {
  date: string;
  creditedPages: number;
}

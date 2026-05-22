export type BookStatus = "reading" | "finished" | "paused";

export type DayLevel =
  | "no_reading"
  | "partial"
  | "goal"
  | "good"
  | "great"
  | "legendary";

export type BadgeKey =
  | "first_entry"
  | "goal_day"
  | "three_day_streak"
  | "seven_day_streak"
  | "book_finished"
  | "legendary_day";

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
  startPage: number;
  endPage: number;
  pagesRead: number;
  dailyGoalPages: number;
  note?: string;
}

export interface Settings {
  dailyGoalPages: number;
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
  totalReadingDays: number;
  goalDays: number;
  currentStreakDays: number;
  longestStreakDays: number;
  averagePagesPerReadingDay: number | null;
}

export interface Badge {
  key: BadgeKey;
  label: string;
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
  pagesRead: number;
}

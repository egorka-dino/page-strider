import type { DayLevel } from "./types";

export const DEFAULT_DAILY_GOAL_PAGES = 17;

export const DAY_LEVEL_LABELS: Record<DayLevel, string> = {
  no_reading: "No reading",
  partial: "Started",
  goal: "Goal met",
  good: "Good pace",
  great: "Great pace",
  legendary: "Legendary"
};

export const DAY_LEVEL_PRIORITY: DayLevel[] = [
  "legendary",
  "great",
  "good",
  "goal",
  "partial",
  "no_reading"
];

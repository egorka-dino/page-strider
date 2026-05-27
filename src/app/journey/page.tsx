import { createSupabaseDataAccess } from "@/data";
import {
  buildComputedBadges,
  buildReadingHistoryDays,
  calculateReadingMetrics,
  resolveDailyGoalsForEntries
} from "@/domain";

import { AppNav } from "../app-nav";
import { DailyGoalPanel } from "../goal-panel";
import { HistoryPanel, ProgressPanel } from "../journey-panels";
import { addDays, getTodayIsoDate } from "../page-utils";

export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const historyRange = {
    from: addDays(today, -13),
    to: today
  };
  const [dailyGoals, currentGoal, rawEntries, books] = await Promise.all([
    data.goals.getDailyGoals(),
    data.goals.getCurrentDailyGoal(today),
    data.entries.listEntries(),
    data.books.listBooks()
  ]);
  const allEntries = resolveDailyGoalsForEntries({
    entries: rawEntries,
    goals: dailyGoals
  });
  const recentEntries = allEntries.filter(
    (entry) => entry.date >= historyRange.from && entry.date <= historyRange.to
  );
  const historyDays = buildReadingHistoryDays({
    entries: recentEntries,
    anchorDate: today,
    dayCount: 14,
    dailyGoalPages: currentGoal.pagesPerDay
  });
  const metrics = calculateReadingMetrics({
    entries: allEntries,
    books,
    anchorDate: today,
    dailyGoalPages: currentGoal.pagesPerDay
  });
  const badges = buildComputedBadges({
    entries: allEntries,
    books,
    anchorDate: today,
    dailyGoalPages: currentGoal.pagesPerDay
  });

  return (
    <main className="app-shell">
      <AppNav active="journey" />
      <ProgressPanel metrics={metrics} badges={badges} />
      <DailyGoalPanel currentGoal={currentGoal} goals={dailyGoals} today={today} />
      <HistoryPanel days={historyDays} />
    </main>
  );
}

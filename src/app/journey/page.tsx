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
import { addDays, firstValue, getTodayIsoDate } from "../page-utils";
import { UI_COPY } from "../ui-copy";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  entry_exists: UI_COPY.errors.entryExists,
  invalid_credited_pages: UI_COPY.errors.invalidCreditedPages,
  end_before_start: UI_COPY.errors.endBeforeStart,
  end_after_total: UI_COPY.errors.endAfterTotal,
  invalid_book: UI_COPY.errors.invalidBook,
  invalid_entry: UI_COPY.errors.invalidEntry,
  invalid_entry_date: UI_COPY.errors.invalidEntryDate
};

const messageText: Record<string, string> = {
  entry_added: UI_COPY.messages.entryAdded,
  entry_updated: UI_COPY.messages.entryUpdated,
  entry_deleted: UI_COPY.messages.entryDeleted,
  goal_saved: UI_COPY.messages.goalSaved
};

export default async function JourneyPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
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
  const error = firstValue(params.error);
  const message = firstValue(params.message);

  return (
    <main className="app-shell">
      <AppNav active="journey" />
      {error ? <p className="notice warning">{errorMessages[error] ?? error}</p> : null}
      {message ? <p className="notice success">{messageText[message] ?? message}</p> : null}
      <ProgressPanel metrics={metrics} badges={badges} />
      <DailyGoalPanel currentGoal={currentGoal} goals={dailyGoals} today={today} />
      <HistoryPanel books={books} days={historyDays} />
    </main>
  );
}

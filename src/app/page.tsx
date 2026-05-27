import { createSupabaseDataAccess } from "@/data";
import { resolveDailyGoalsForEntries } from "@/domain";
import Link from "next/link";

import { AppNav } from "./app-nav";
import { BookSetupPanel } from "./book-shelf";
import { TodayPanel } from "./today-panel";
import { firstValue, getTodayIsoDate } from "./page-utils";
import { UI_COPY } from "./ui-copy";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  book_details_required: UI_COPY.errors.bookDetailsRequired,
  invalid_book_pages: UI_COPY.errors.invalidBookPages,
  missing_active_book: UI_COPY.errors.missingActiveBook,
  entry_exists: UI_COPY.errors.entryExists,
  invalid_credited_pages: UI_COPY.errors.invalidCreditedPages,
  end_before_start: UI_COPY.errors.endBeforeStart,
  end_after_total: UI_COPY.errors.endAfterTotal,
  invalid_book: UI_COPY.errors.invalidBook,
  book_finished: UI_COPY.errors.bookFinished,
  invalid_pages: UI_COPY.errors.invalidGoalPages,
  invalid_date: UI_COPY.errors.invalidGoalDate,
  invalid_goal: UI_COPY.errors.invalidGoal
};

const messageText: Record<string, string> = {
  book_created: UI_COPY.messages.bookCreated,
  entry_saved: UI_COPY.messages.entrySaved,
  book_updated: UI_COPY.messages.bookUpdated,
  book_paused: UI_COPY.messages.bookPaused,
  book_activated: UI_COPY.messages.bookActivated,
  book_finished: UI_COPY.messages.bookFinished,
  goal_saved: UI_COPY.messages.goalSaved
};

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const [dailyGoals, currentGoal, activeBook, rawTodayEntry] = await Promise.all([
    data.goals.getDailyGoals(),
    data.goals.getCurrentDailyGoal(today),
    data.books.getActiveBook(),
    data.entries.getEntryByDate(today)
  ]);
  const todayEntry = rawTodayEntry
    ? resolveDailyGoalsForEntries({ entries: [rawTodayEntry], goals: dailyGoals })[0]
    : null;
  const error = firstValue(params.error);
  const message = firstValue(params.message);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{UI_COPY.hero.eyebrow}</p>
          <div className="hero-brand">
            <PageStriderLogo label={UI_COPY.hero.logoLabel} />
            <h1>{UI_COPY.hero.title}</h1>
          </div>
          <p className="hero-copy">
            {UI_COPY.hero.copy}
          </p>
          <Link className="hero-report-link" href="/report">
            {UI_COPY.hero.reportLink}
          </Link>
        </div>
        <div className="goal-token">
          <span>{currentGoal.pagesPerDay}</span>
          <small>{UI_COPY.hero.goalLabel}</small>
        </div>
        <div className="quest-path" aria-label={UI_COPY.hero.pathLabel}>
          {UI_COPY.hero.pathSteps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>

      <AppNav active="today" />

      {error ? <p className="notice warning">{errorMessages[error] ?? error}</p> : null}
      {message ? <p className="notice success">{messageText[message] ?? message}</p> : null}

      {activeBook ? (
        <TodayPanel
          dailyGoalPages={currentGoal.pagesPerDay}
          todayEntry={todayEntry}
          activeBook={activeBook}
        />
      ) : (
        <BookSetupPanel today={today} />
      )}
    </main>
  );
}

function PageStriderLogo({ label }: { label: string }) {
  return (
    <svg className="page-strider-logo" viewBox="0 0 150 150" role="img" aria-label={label}>
      <path
        d="M43 18h47l27 27v86H43z"
        fill="#fff4d7"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M90 20v27h27"
        fill="#d9eadb"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M75 55l8 17 18 2-13 13 3 18-16-9-16 9 3-18-13-13 18-2z"
        fill="var(--ps-spark)"
        stroke="var(--ps-ink)"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M57 115h36"
        fill="none"
        stroke="var(--ps-sky)"
        strokeLinecap="round"
        strokeWidth="7"
      />
    </svg>
  );
}

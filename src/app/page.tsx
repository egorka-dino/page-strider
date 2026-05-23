import {
  buildReadingHistoryDays,
  calculateBookProgress,
  calculatePagesLeft,
  type Book,
  type ReadingHistoryDay,
  type ReadingEntry
} from "@/domain";
import { createSupabaseDataAccess } from "@/data";

import { createBookAction, recordTodayAction } from "./actions";
import { UI_COPY } from "./ui-copy";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  book_details_required: UI_COPY.errors.bookDetailsRequired,
  invalid_book_pages: UI_COPY.errors.invalidBookPages,
  missing_active_book: UI_COPY.errors.missingActiveBook,
  entry_exists: UI_COPY.errors.entryExists,
  end_before_start: UI_COPY.errors.endBeforeStart,
  end_after_total: UI_COPY.errors.endAfterTotal,
  invalid_book: UI_COPY.errors.invalidBook
};

const messageText: Record<string, string> = {
  book_created: UI_COPY.messages.bookCreated,
  entry_saved: UI_COPY.messages.entrySaved
};

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const historyRange = getHistoryRange(today, 14);
  const [settings, activeBook, todayEntry, recentEntries] = await Promise.all([
    data.settings.getSettings(),
    data.books.getActiveBook(),
    data.entries.getEntryByDate(today),
    data.entries.listEntries(historyRange)
  ]);
  const historyDays = buildReadingHistoryDays({
    entries: recentEntries,
    anchorDate: today,
    dayCount: 14,
    dailyGoalPages: settings.dailyGoalPages
  });
  const error = firstValue(params.error);
  const message = firstValue(params.message);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{UI_COPY.hero.eyebrow}</p>
          <h1>{UI_COPY.hero.title}</h1>
          <p className="hero-copy">
            {UI_COPY.hero.copy}
          </p>
        </div>
        <div className="goal-token">
          <span>{settings.dailyGoalPages}</span>
          <small>{UI_COPY.hero.goalLabel}</small>
        </div>
        <div className="quest-path" aria-label={UI_COPY.hero.pathLabel}>
          {UI_COPY.hero.pathSteps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>

      {error ? <p className="notice warning">{errorMessages[error] ?? error}</p> : null}
      {message ? <p className="notice success">{messageText[message] ?? message}</p> : null}

      {activeBook ? (
        <TodayPanel
          dailyGoalPages={settings.dailyGoalPages}
          todayEntry={todayEntry}
          activeBook={activeBook}
        />
      ) : (
        <BookSetupPanel today={today} />
      )}

      <HistoryPanel days={historyDays} />
    </main>
  );
}

function TodayPanel({
  activeBook,
  dailyGoalPages,
  todayEntry
}: {
  activeBook: Book | null;
  dailyGoalPages: number;
  todayEntry: ReadingEntry | null;
}) {
  if (!activeBook) {
    return null;
  }

  const progress = calculateBookProgress(activeBook);
  const pagesLeft = calculatePagesLeft(activeBook);
  const progressPercent = Math.round(progress.progress * 100);
  const nextPage = activeBook.currentPage + 1;

  return (
    <section className="reading-layout">
      <article className="book-panel">
        <p className="eyebrow">{UI_COPY.today.activeBookEyebrow}</p>
        <h2>{activeBook.title}</h2>
        <p className="muted">
          {UI_COPY.today.authorPrefix} {activeBook.author}
        </p>

        <div className="progress-track" aria-label={UI_COPY.today.progressLabel(progressPercent)}>
          <div style={{ width: `${progressPercent}%` }} />
        </div>

        <dl className="book-stats">
          <div>
            <dt>{UI_COPY.today.readStat}</dt>
            <dd>{progress.readPages}</dd>
          </div>
          <div>
            <dt>{UI_COPY.today.leftStat}</dt>
            <dd>{pagesLeft}</dd>
          </div>
          <div>
            <dt>{UI_COPY.today.doneStat}</dt>
            <dd>{progressPercent}%</dd>
          </div>
        </dl>
      </article>

      <article className="entry-panel">
        {todayEntry ? (
          <>
            <p className="eyebrow">{UI_COPY.today.savedEyebrow}</p>
            <h2>{UI_COPY.today.pagesLogged(todayEntry.pagesRead)}</h2>
            <p className="muted">
              {UI_COPY.today.pageRangeRecorded(todayEntry.startPage, todayEntry.endPage)}
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">{UI_COPY.today.nextStepEyebrow}</p>
            <h2>{UI_COPY.today.startOnPage(nextPage)}</h2>
            <form action={recordTodayAction} className="stacked-form">
              <label>
                {UI_COPY.today.finishedPageLabel}
                <input
                  name="finishedPage"
                  type="number"
                  min={nextPage}
                  max={activeBook.totalPages}
                  required
                />
              </label>
              <label>
                {UI_COPY.today.noteLabel}
                <textarea name="note" rows={3} placeholder={UI_COPY.today.notePlaceholder} />
              </label>
              <p className="form-hint">
                {UI_COPY.today.formHint(dailyGoalPages)}
              </p>
              <button type="submit">{UI_COPY.today.saveButton}</button>
            </form>
          </>
        )}
      </article>
    </section>
  );
}

function HistoryPanel({ days }: { days: ReadingHistoryDay[] }) {
  const hasEntries = days.some((day) => day.entry);

  return (
    <section className="history-panel">
      <div className="history-heading">
        <div>
          <p className="eyebrow">{UI_COPY.history.eyebrow}</p>
          <h2>{UI_COPY.history.heading}</h2>
        </div>
        <p className="muted">{UI_COPY.history.copy}</p>
      </div>

      <div className="history-calendar" aria-label={UI_COPY.history.calendarLabel}>
        {days.map((day) => (
          <article
            className={`history-day level-${day.level}`}
            key={day.date}
            title={`${formatShortDate(day.date)}: ${UI_COPY.history.goalStatus[day.level]}`}
          >
            <time dateTime={day.date}>{formatDayNumber(day.date)}</time>
            <span>{formatWeekday(day.date)}</span>
            <strong>{UI_COPY.history.pagesRead(day.pagesRead)}</strong>
          </article>
        ))}
      </div>

      {hasEntries ? (
        <div className="history-details">
          <h3>{UI_COPY.history.detailsHeading}</h3>
          {days.map((day) => (
            <DayDetail day={day} key={day.date} />
          ))}
        </div>
      ) : (
        <div className="history-empty">
          <h3>{UI_COPY.history.emptyHeading}</h3>
          <p>{UI_COPY.history.emptyCopy}</p>
        </div>
      )}
    </section>
  );
}

function DayDetail({ day }: { day: ReadingHistoryDay }) {
  const status = UI_COPY.history.goalStatus[day.level];

  return (
    <article className={`history-detail level-${day.level}`}>
      <div>
        <time dateTime={day.date}>{formatLongDate(day.date)}</time>
        <span>{status}</span>
      </div>
      {day.entry ? (
        <dl>
          <div>
            <dt>{UI_COPY.history.bookLabel}</dt>
            <dd>{day.entry.bookTitle}</dd>
          </div>
          <div>
            <dt>{UI_COPY.history.pagesLabel}</dt>
            <dd>
              {UI_COPY.history.pageRange(day.entry.startPage, day.entry.endPage)} ·{" "}
              {UI_COPY.history.pagesRead(day.entry.pagesRead)}
            </dd>
          </div>
          {day.entry.note ? (
            <div>
              <dt>{UI_COPY.history.noteLabel}</dt>
              <dd>{day.entry.note}</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p>{UI_COPY.history.emptyDayDetail}</p>
      )}
    </article>
  );
}

function BookSetupPanel({ today }: { today: string }) {
  return (
    <section className="setup-panel">
      <p className="eyebrow">{UI_COPY.bookSetup.eyebrow}</p>
      <h2>{UI_COPY.bookSetup.heading}</h2>
      <form action={createBookAction} className="book-form">
        <label>
          {UI_COPY.bookSetup.titleLabel}
          <input name="title" required />
        </label>
        <label>
          {UI_COPY.bookSetup.authorLabel}
          <input name="author" required />
        </label>
        <label>
          {UI_COPY.bookSetup.totalPagesLabel}
          <input name="totalPages" type="number" min="1" required />
        </label>
        <label>
          {UI_COPY.bookSetup.startPageLabel}
          <input name="startPage" type="number" min="1" defaultValue="1" required />
        </label>
        <label>
          {UI_COPY.bookSetup.currentPageLabel}
          <input name="currentPage" type="number" min="1" defaultValue="1" required />
        </label>
        <label>
          {UI_COPY.bookSetup.startedDateLabel}
          <input name="startedDate" type="date" defaultValue={today} required />
        </label>
        <button type="submit">{UI_COPY.bookSetup.submitButton}</button>
      </form>
    </section>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getHistoryRange(today: string, dayCount: number) {
  return {
    from: addDays(today, -(dayCount - 1)),
    to: today
  };
}

function addDays(date: string, days: number): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

function formatDayNumber(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit"
  }).format(parseIsoDate(date));
}

function formatWeekday(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short"
  }).format(parseIsoDate(date));
}

function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long"
  }).format(parseIsoDate(date));
}

function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(parseIsoDate(date));
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function getTodayIsoDate(): string {
  const timeZone = process.env.PAGESTRIDER_TIME_ZONE ?? "Europe/Minsk";
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

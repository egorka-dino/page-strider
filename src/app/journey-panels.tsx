import type { Badge, Book, ReadingHistoryDay, ReadingMetrics, ReadingEntry } from "@/domain";

import {
  createHistoricalReadingEntryAction,
  deleteReadingEntryAction,
  updateReadingEntryAction
} from "./actions";
import { PageRouteFields } from "./page-route-fields";
import { parseIsoDate } from "./page-utils";
import { UI_COPY } from "./ui-copy";

export function HistoryPanel({ books, days }: { books: Book[]; days: ReadingHistoryDay[] }) {
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
            <strong>{UI_COPY.history.creditedPages(day.creditedPages)}</strong>
          </article>
        ))}
      </div>

      {!hasEntries ? (
        <div className="history-empty">
          <h3>{UI_COPY.history.emptyHeading}</h3>
          <p>{UI_COPY.history.emptyCopy}</p>
        </div>
      ) : null}

      <div className="history-details">
        <h3>{UI_COPY.history.detailsHeading}</h3>
        {days.map((day) => (
          <DayDetail books={books} day={day} key={day.date} />
        ))}
      </div>
    </section>
  );
}

export function ProgressPanel({
  badges,
  metrics
}: {
  badges: Badge[];
  metrics: ReadingMetrics;
}) {
  const metricItems = [
    {
      label: UI_COPY.progress.metrics.totalPagesRead,
      value: UI_COPY.progress.metricPages(metrics.totalPagesRead)
    },
    {
      label: UI_COPY.progress.metrics.booksFinished,
      value: UI_COPY.progress.metricBooks(metrics.booksFinished)
    },
    {
      label: UI_COPY.progress.metrics.readingDaysCount,
      value: UI_COPY.progress.metricDays(metrics.readingDaysCount)
    },
    {
      label: UI_COPY.progress.metrics.goalCompletedDaysCount,
      value: UI_COPY.progress.metricDays(metrics.goalCompletedDaysCount)
    },
    {
      label: UI_COPY.progress.metrics.averagePagesPerReadingDay,
      value:
        metrics.averagePagesPerReadingDay === null
          ? UI_COPY.progress.noAverage
          : UI_COPY.progress.metricPages(metrics.averagePagesPerReadingDay)
    },
    {
      label: UI_COPY.progress.metrics.averagePagesPerCalendarDay,
      value:
        metrics.averagePagesPerCalendarDay === null
          ? UI_COPY.progress.noAverage
          : UI_COPY.progress.metricPages(metrics.averagePagesPerCalendarDay)
    },
    {
      label: UI_COPY.progress.metrics.bestDayPages,
      value: UI_COPY.progress.metricPages(metrics.bestDayPages)
    },
    {
      label: UI_COPY.progress.metrics.pagesReadThisWeek,
      value: UI_COPY.progress.metricPages(metrics.pagesReadThisWeek)
    },
    {
      label: UI_COPY.progress.metrics.readingDaysThisWeek,
      value: UI_COPY.progress.metricDays(metrics.readingDaysThisWeek)
    }
  ];
  const earnedCount = badges.filter((badge) => badge.earned).length;

  return (
    <section className="progress-panel">
      <div className="progress-heading">
        <div>
          <p className="eyebrow">{UI_COPY.progress.eyebrow}</p>
          <h2>{UI_COPY.progress.heading}</h2>
        </div>
        <p className="muted">{UI_COPY.progress.copy}</p>
      </div>

      <div className="streak-band">
        <div>
          <p className="eyebrow">{UI_COPY.progress.streakHeading}</p>
          <dl>
            <div>
              <dt>{UI_COPY.progress.currentStreak}</dt>
              <dd>{UI_COPY.progress.streakUnit(metrics.currentStreakDays)}</dd>
            </div>
            <div>
              <dt>{UI_COPY.progress.bestStreak}</dt>
              <dd>{UI_COPY.progress.streakUnit(metrics.bestStreakDays)}</dd>
            </div>
          </dl>
        </div>
        <p>{UI_COPY.progress.streakEncouragement}</p>
      </div>

      <div className="metric-shelf" aria-label={UI_COPY.progress.metricsHeading}>
        {metricItems.map((item) => (
          <article className="metric-leaf" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="badge-heading">
        <h3>{UI_COPY.progress.badgesHeading}</h3>
        <span>
          {earnedCount}/{badges.length}
        </span>
      </div>

      {badges.length > 0 ? (
        <div className="badge-trail">
          {badges.map((badge) => (
            <article
              className={`badge-token ${badge.earned ? "badge-earned" : "badge-locked"}`}
              key={badge.key}
            >
              <div aria-hidden="true">{badge.earned ? "★" : "☆"}</div>
              <div>
                <h4>{badge.label}</h4>
                <p>{badge.description}</p>
                <span>
                  {badge.earned ? UI_COPY.progress.earnedBadge : UI_COPY.progress.lockedBadge}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="badge-empty">{UI_COPY.progress.emptyBadges}</p>
      )}
    </section>
  );
}

function DayDetail({ books, day }: { books: Book[]; day: ReadingHistoryDay }) {
  const status = UI_COPY.history.goalStatus[day.level];

  return (
    <article className={`history-detail level-${day.level}`}>
      <div>
        <time dateTime={day.date}>{formatLongDate(day.date)}</time>
        <span>{status}</span>
      </div>
      {day.entry ? (
        <>
          <dl>
            <div>
              <dt>{UI_COPY.history.bookLabel}</dt>
              <dd>{day.entry.bookTitle}</dd>
            </div>
            <div>
              <dt>{UI_COPY.history.pagesLabel}</dt>
              <dd>
                {formatHistoryBookmark(day.entry)} ·{" "}
                {UI_COPY.history.creditedPages(day.entry.creditedPages)}
              </dd>
            </div>
            {day.entry.note ? (
              <div>
                <dt>{UI_COPY.history.noteLabel}</dt>
                <dd>{day.entry.note}</dd>
              </div>
            ) : null}
          </dl>
          <HistoryCorrection entry={day.entry} />
        </>
      ) : (
        <>
          <p>{UI_COPY.history.emptyDayDetail}</p>
          <HistoryEntryCreate books={books} date={day.date} />
        </>
      )}
    </article>
  );
}

function HistoryEntryCreate({ books, date }: { books: Book[]; date: string }) {
  if (books.length === 0) {
    return <p>{UI_COPY.history.addEmptyBooks}</p>;
  }

  return (
    <details className="history-correction">
      <summary>{UI_COPY.history.addHeading}</summary>
      <form action={createHistoricalReadingEntryAction} className="history-correction-form">
        <input name="date" type="hidden" value={date} />
        <label className="wide-field">
          {UI_COPY.history.addBookLabel}
          <select name="bookId" required defaultValue={books[0]?.id}>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </label>
        <PageRouteFields
          creditedPagesLabel={UI_COPY.history.correctionCreditedPagesLabel}
          endPageLabel={UI_COPY.history.correctionEndPageLabel}
          startPageLabel={UI_COPY.history.correctionStartPageLabel}
        />
        <label className="wide-field">
          {UI_COPY.history.correctionNoteLabel}
          <textarea name="note" rows={2} />
        </label>
        <button type="submit">{UI_COPY.history.addSaveButton}</button>
      </form>
    </details>
  );
}

function HistoryCorrection({ entry }: { entry: ReadingEntry }) {
  return (
    <details className="history-correction">
      <summary>{UI_COPY.history.correctionHeading}</summary>
      <form action={updateReadingEntryAction} className="history-correction-form">
        <input name="entryId" type="hidden" value={entry.id} />
        <label>
          {UI_COPY.history.correctionDateLabel}
          <input name="date" type="date" defaultValue={entry.date} required />
        </label>
        <PageRouteFields
          creditedPagesLabel={UI_COPY.history.correctionCreditedPagesLabel}
          defaultEndPage={entry.endPage}
          defaultStartPage={entry.startPage}
          endPageLabel={UI_COPY.history.correctionEndPageLabel}
          startPageLabel={UI_COPY.history.correctionStartPageLabel}
        />
        <label className="wide-field">
          {UI_COPY.history.correctionNoteLabel}
          <textarea name="note" rows={2} defaultValue={entry.note ?? ""} />
        </label>
        <button type="submit">{UI_COPY.history.correctionSaveButton}</button>
      </form>
      <form action={deleteReadingEntryAction} className="history-delete-form">
        <input name="entryId" type="hidden" value={entry.id} />
        <p>{UI_COPY.history.correctionDeleteHint}</p>
        <button type="submit">{UI_COPY.history.correctionDeleteButton}</button>
      </form>
    </details>
  );
}

function formatHistoryBookmark(entry: ReadingEntry): string {
  return entry.startPage !== null && entry.endPage !== null
    ? UI_COPY.history.pageRange(entry.startPage, entry.endPage)
    : UI_COPY.history.emptyPageRange;
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

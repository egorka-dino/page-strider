import {
  calculateBookProgress,
  calculatePagesLeft,
  type Book,
  type ReadingEntry
} from "@/domain";

import { recordTodayAction } from "./actions";
import { TodayEntryForm } from "./today-entry-form";
import { UI_COPY } from "./ui-copy";

export function TodayPanel({
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
          {UI_COPY.today.authorPrefix} {activeBook.author || UI_COPY.today.unknownAuthor}
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
            <h2>{UI_COPY.today.pagesLogged(todayEntry.creditedPages)}</h2>
            <p className="muted">
              {formatBookmarkRecord(todayEntry)}
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">{UI_COPY.today.nextStepEyebrow}</p>
            <h2>{UI_COPY.today.startOnPage(nextPage)}</h2>
            <TodayEntryForm
              action={recordTodayAction}
              dailyGoalPages={dailyGoalPages}
              defaultStartPage={nextPage}
              maxPage={activeBook.totalPages}
            />
          </>
        )}
      </article>
    </section>
  );
}

function formatBookmarkRecord(entry: ReadingEntry): string {
  return entry.startPage !== null && entry.endPage !== null
    ? UI_COPY.today.bookmarkRecorded(entry.startPage, entry.endPage)
    : UI_COPY.today.creditedOnlyRecorded;
}

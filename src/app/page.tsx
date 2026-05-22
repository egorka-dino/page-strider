import {
  calculateBookProgress,
  calculatePagesLeft,
  type Book,
  type ReadingEntry
} from "@/domain";
import { createSupabaseDataAccess } from "@/data";

import { createBookAction, recordTodayAction } from "./actions";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  book_details_required: "Add a title and author to start the reading trail.",
  invalid_book_pages: "Check the book pages. The current page must fit inside the book.",
  missing_active_book: "Add an active book before recording today's pages.",
  entry_exists: "Today's reading is already recorded.",
  end_before_start: "The finished page must be after the last page already read.",
  end_after_total: "The finished page cannot be beyond the end of the book.",
  invalid_book: "The active book needs valid page details before recording reading."
};

const messageText: Record<string, string> = {
  book_created: "Book saved. The next page is ready.",
  entry_saved: "Today's reading is saved."
};

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const [settings, activeBook, todayEntry] = await Promise.all([
    data.settings.getSettings(),
    data.books.getActiveBook(),
    data.entries.getEntryByDate(today)
  ]);
  const error = firstValue(params.error);
  const message = firstValue(params.message);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Today&apos;s reading trail</p>
          <h1>PageStrider</h1>
          <p className="hero-copy">
            Keep one active book moving, one clear page step at a time.
          </p>
        </div>
        <div className="goal-token">
          <span>{settings.dailyGoalPages}</span>
          <small>page goal</small>
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
        <p className="eyebrow">Active book</p>
        <h2>{activeBook.title}</h2>
        <p className="muted">by {activeBook.author}</p>

        <div className="progress-track" aria-label={`${progressPercent}% complete`}>
          <div style={{ width: `${progressPercent}%` }} />
        </div>

        <dl className="book-stats">
          <div>
            <dt>Read</dt>
            <dd>{progress.readPages}</dd>
          </div>
          <div>
            <dt>Left</dt>
            <dd>{pagesLeft}</dd>
          </div>
          <div>
            <dt>Done</dt>
            <dd>{progressPercent}%</dd>
          </div>
        </dl>
      </article>

      <article className="entry-panel">
        {todayEntry ? (
          <>
            <p className="eyebrow">Saved today</p>
            <h2>{todayEntry.pagesRead} pages logged</h2>
            <p className="muted">
              Pages {todayEntry.startPage}-{todayEntry.endPage} are recorded for today.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">Next step</p>
            <h2>Start on page {nextPage}</h2>
            <form action={recordTodayAction} className="stacked-form">
              <label>
                Finished page
                <input
                  name="finishedPage"
                  type="number"
                  min={nextPage}
                  max={activeBook.totalPages}
                  required
                />
              </label>
              <label>
                Note
                <textarea name="note" rows={3} placeholder="Optional" />
              </label>
              <p className="form-hint">
                Goal today: {dailyGoalPages} pages. The entry will be saved for this date.
              </p>
              <button type="submit">Save today</button>
            </form>
          </>
        )}
      </article>
    </section>
  );
}

function BookSetupPanel({ today }: { today: string }) {
  return (
    <section className="setup-panel">
      <p className="eyebrow">First book</p>
      <h2>Set the active book</h2>
      <form action={createBookAction} className="book-form">
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Author
          <input name="author" required />
        </label>
        <label>
          Total pages
          <input name="totalPages" type="number" min="1" required />
        </label>
        <label>
          First readable page
          <input name="startPage" type="number" min="1" defaultValue="1" required />
        </label>
        <label>
          Last page already read
          <input name="currentPage" type="number" min="1" defaultValue="1" required />
        </label>
        <label>
          Started date
          <input name="startedDate" type="date" defaultValue={today} required />
        </label>
        <button type="submit">Start book</button>
      </form>
    </section>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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

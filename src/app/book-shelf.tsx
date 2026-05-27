import { calculateBookProgress, type Book, type ReadingEntry } from "@/domain";

import {
  activateBookAction,
  createBookAction,
  finishBookAction,
  pauseBookAction,
  updateBookDetailsAction
} from "./actions";
import { UI_COPY } from "./ui-copy";

export function BooksPanel({
  activeBook,
  books,
  entries,
  today,
  todayEntry
}: {
  activeBook: Book | null;
  books: Book[];
  entries: ReadingEntry[];
  today: string;
  todayEntry: ReadingEntry | null;
}) {
  const pausedBooks = books.filter((book) => book.status === "paused");
  const finishedBooks = books.filter((book) => book.status === "finished");
  const canSwitchToday = !todayEntry;

  return (
    <section className="books-panel">
      <div className="books-heading">
        <div>
          <p className="eyebrow">{UI_COPY.books.eyebrow}</p>
          <h2>{UI_COPY.books.heading}</h2>
        </div>
        <p className="muted">{UI_COPY.books.copy}</p>
      </div>

      <div className="books-route-grid">
        <div className="book-column book-column-featured">
          <SectionHeading
            count={activeBook ? 1 : 0}
            label={UI_COPY.books.activeTrailLabel}
            title={UI_COPY.books.activeHeading}
          />
          {activeBook ? (
            <BookCard
              book={activeBook}
              entries={entries}
              canActivate={false}
              canPause
              canFinish
            />
          ) : (
            <p className="shelf-empty">{UI_COPY.books.noActive}</p>
          )}
          {activeBook && canSwitchToday ? <BookSetupPanel today={today} compact /> : null}
          {activeBook && !canSwitchToday ? (
            <p className="form-hint">{UI_COPY.books.switchLocked}</p>
          ) : null}
        </div>

        <div className="book-column">
          <SectionHeading
            count={pausedBooks.length}
            label={UI_COPY.books.pausedTrailLabel}
            title={UI_COPY.books.pausedHeading}
          />
          {pausedBooks.length > 0 ? (
            pausedBooks.map((book) => (
              <BookCard
                book={book}
                canActivate={canSwitchToday}
                canFinish
                canPause={false}
                entries={entries}
                key={book.id}
              />
            ))
          ) : (
            <p className="shelf-empty">{UI_COPY.books.noPaused}</p>
          )}
          {!canSwitchToday ? (
            <p className="form-hint">{UI_COPY.books.switchLocked}</p>
          ) : null}
        </div>
      </div>

      <div className="finished-stack">
        <SectionHeading
          count={finishedBooks.length}
          label={UI_COPY.books.finishedTrailLabel}
          title={UI_COPY.books.finishedHeading}
        />
        {finishedBooks.length > 0 ? (
          <div className="finished-book-grid">
            {finishedBooks.map((book) => (
              <BookCard
                book={book}
                canActivate={false}
                canFinish={false}
                canPause={false}
                entries={entries}
                key={book.id}
                compact
              />
            ))}
          </div>
        ) : (
          <p className="shelf-empty">{UI_COPY.books.noFinished}</p>
        )}
      </div>
    </section>
  );
}

function SectionHeading({
  count,
  label,
  title
}: {
  count: number;
  label: string;
  title: string;
}) {
  return (
    <div className="book-column-heading">
      <div>
        <span>{label}</span>
        <h3>{title}</h3>
      </div>
      <strong>{UI_COPY.books.sectionCount(count)}</strong>
    </div>
  );
}

function BookCard({
  book,
  canActivate,
  canFinish,
  canPause,
  entries,
  compact = false
}: {
  book: Book;
  canActivate: boolean;
  canFinish: boolean;
  canPause: boolean;
  entries: ReadingEntry[];
  compact?: boolean;
}) {
  const bookEntries = entries.filter((entry) => entry.bookId === book.id);
  const progress = calculateBookProgress(book);
  const progressPercent = Math.round(progress.progress * 100);

  const details = (
    <>
      <details className="book-edit">
        <summary>{UI_COPY.books.editHeading}</summary>
        <form action={updateBookDetailsAction} className="book-edit-form">
          <input name="bookId" type="hidden" value={book.id} />
          <label>
            {UI_COPY.bookSetup.titleLabel}
            <input name="title" defaultValue={book.title} required />
          </label>
          <label>
            {UI_COPY.bookSetup.authorLabel}
            <input name="author" defaultValue={book.author} required />
          </label>
          <label>
            {UI_COPY.bookSetup.totalPagesLabel}
            <input
              name="totalPages"
              type="number"
              min={Math.max(book.startPage, book.currentPage)}
              defaultValue={book.totalPages}
              required
            />
          </label>
          <button type="submit">{UI_COPY.books.saveDetails}</button>
        </form>
      </details>

      <div className="book-actions">
        {canPause ? (
          <form action={pauseBookAction}>
            <input name="bookId" type="hidden" value={book.id} />
            <button type="submit" className="secondary-button">
              {UI_COPY.books.pauseAction}
            </button>
          </form>
        ) : null}
        {canActivate ? (
          <form action={activateBookAction}>
            <input name="bookId" type="hidden" value={book.id} />
            <button type="submit">{UI_COPY.books.activateAction}</button>
          </form>
        ) : null}
        {canFinish ? (
          <form action={finishBookAction}>
            <input name="bookId" type="hidden" value={book.id} />
            <button type="submit" className="secondary-button">
              {UI_COPY.books.finishAction}
            </button>
          </form>
        ) : null}
      </div>

      <details className="book-history">
        <summary>{UI_COPY.books.historyHeading}</summary>
        {bookEntries.length > 0 ? (
          <ul>
            {bookEntries.map((entry) => (
              <li key={entry.id}>
                {formatBookHistoryEntry(entry)}
              </li>
            ))}
          </ul>
        ) : (
          <p>{UI_COPY.books.noBookHistory}</p>
        )}
      </details>
    </>
  );

  return (
    <article
      className={compact ? "shelf-book shelf-book-compact" : "shelf-book"}
      data-status={book.status}
    >
      <div className="shelf-book-heading">
        <div className="book-spine" aria-hidden="true">
          <span />
        </div>
        <div>
          <span>{UI_COPY.books.status[book.status]}</span>
          <h4>{book.title}</h4>
          <p className="muted">{book.author || UI_COPY.today.unknownAuthor}</p>
        </div>
        <strong>{UI_COPY.books.pageProgress(book.currentPage, book.totalPages)}</strong>
      </div>

      <div className="book-progress" aria-label={UI_COPY.books.progressLabel(progressPercent)}>
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <p className="book-dates">
        {UI_COPY.books.startedDate(book.startedDate)}
        {book.finishedDate ? ` · ${UI_COPY.books.finishedDate(book.finishedDate)}` : ""}
      </p>

      {compact ? (
        <details className="book-compact-actions">
          <summary>{UI_COPY.books.openArchiveCard}</summary>
          <div className="book-compact-actions-body">{details}</div>
        </details>
      ) : (
        details
      )}
    </article>
  );
}

export function BookSetupPanel({ today, compact = false }: { today: string; compact?: boolean }) {
  return (
    <section className={compact ? "setup-panel compact-setup" : "setup-panel"}>
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

function formatBookHistoryEntry(entry: ReadingEntry): string {
  return entry.startPage !== null && entry.endPage !== null
    ? UI_COPY.books.historyEntryWithBookmark(
        entry.date,
        entry.startPage,
        entry.endPage,
        entry.creditedPages
      )
    : UI_COPY.books.historyEntryCreditedOnly(entry.date, entry.creditedPages);
}

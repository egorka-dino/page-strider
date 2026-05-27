import type { Book, ReadingEntry } from "@/domain";

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

      <div className="books-grid">
        <div className="book-column">
          <h3>{UI_COPY.books.activeHeading}</h3>
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
          <h3>{UI_COPY.books.pausedHeading}</h3>
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

        <div className="book-column">
          <h3>{UI_COPY.books.finishedHeading}</h3>
          {finishedBooks.length > 0 ? (
            finishedBooks.map((book) => (
              <BookCard
                book={book}
                canActivate={false}
                canFinish={false}
                canPause={false}
                entries={entries}
                key={book.id}
              />
            ))
          ) : (
            <p className="shelf-empty">{UI_COPY.books.noFinished}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function BookCard({
  book,
  canActivate,
  canFinish,
  canPause,
  entries
}: {
  book: Book;
  canActivate: boolean;
  canFinish: boolean;
  canPause: boolean;
  entries: ReadingEntry[];
}) {
  const bookEntries = entries.filter((entry) => entry.bookId === book.id);

  return (
    <article className="shelf-book">
      <div className="shelf-book-heading">
        <div>
          <span>{UI_COPY.books.status[book.status]}</span>
          <h4>{book.title}</h4>
          <p className="muted">{book.author || UI_COPY.today.unknownAuthor}</p>
        </div>
        <strong>{UI_COPY.books.pageProgress(book.currentPage, book.totalPages)}</strong>
      </div>

      <p className="book-dates">
        {UI_COPY.books.startedDate(book.startedDate)}
        {book.finishedDate ? ` · ${UI_COPY.books.finishedDate(book.finishedDate)}` : ""}
      </p>

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

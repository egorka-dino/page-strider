import { createSupabaseDataAccess } from "@/data";
import { resolveDailyGoalsForEntries } from "@/domain";
import { notFound } from "next/navigation";

import { AppNav } from "../../app-nav";
import { BookDetailPanel } from "../../book-shelf";
import { getTodayIsoDate } from "../../page-utils";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const [dailyGoals, book, activeBook, rawTodayEntry, rawEntries] = await Promise.all([
    data.goals.getDailyGoals(),
    data.books.getBookById(bookId),
    data.books.getActiveBook(),
    data.entries.getEntryByDate(today),
    data.entries.listEntries()
  ]);

  if (!book) {
    notFound();
  }

  const entries = resolveDailyGoalsForEntries({
    entries: rawEntries,
    goals: dailyGoals
  });
  const todayEntry = rawTodayEntry
    ? resolveDailyGoalsForEntries({ entries: [rawTodayEntry], goals: dailyGoals })[0]
    : null;

  return (
    <main className="app-shell">
      <AppNav active="books" />
      <BookDetailPanel
        activeBook={activeBook}
        book={book}
        entries={entries}
        todayEntry={todayEntry}
      />
    </main>
  );
}

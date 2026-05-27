import { createSupabaseDataAccess } from "@/data";
import { resolveDailyGoalsForEntries } from "@/domain";

import { AppNav } from "../app-nav";
import { BooksPanel } from "../book-shelf";
import { getTodayIsoDate } from "../page-utils";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const data = createSupabaseDataAccess();
  const today = getTodayIsoDate();
  const [dailyGoals, activeBook, rawTodayEntry, rawEntries, books] = await Promise.all([
    data.goals.getDailyGoals(),
    data.books.getActiveBook(),
    data.entries.getEntryByDate(today),
    data.entries.listEntries(),
    data.books.listBooks()
  ]);
  const allEntries = resolveDailyGoalsForEntries({
    entries: rawEntries,
    goals: dailyGoals
  });
  const todayEntry = rawTodayEntry
    ? resolveDailyGoalsForEntries({ entries: [rawTodayEntry], goals: dailyGoals })[0]
    : null;

  return (
    <main className="app-shell">
      <AppNav active="books" />
      <BooksPanel
        activeBook={activeBook}
        books={books}
        entries={allEntries}
        today={today}
        todayEntry={todayEntry}
      />
    </main>
  );
}

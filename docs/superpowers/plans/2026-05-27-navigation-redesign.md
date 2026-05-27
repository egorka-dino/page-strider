# PageStrider Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the current single long PageStrider page into reader-first `Сегодня`, `Полка`, `Путь`, and `Отчет` sections with shared navigation.

**Architecture:** Keep the existing Supabase data-access layer and domain utilities. Extract focused UI sections from `src/app/page.tsx` into reusable server components, then compose them from route pages under Next.js App Router. Keep `/` as the reader-first daily page, add `/books` and `/journey`, and preserve `/report`.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Supabase data access, CSS in `src/app/globals.css`, Vitest.

---

## File Structure

- Modify `src/app/ui-copy.ts`: add Russian navigation labels and page-specific copy for compact home summaries.
- Modify `src/app/ui-copy.test.ts`: assert new navigation copy is Russian and route labels are present.
- Create `src/app/app-nav.tsx`: shared app navigation with active-link styling.
- Create `src/app/page-utils.ts`: shared date and search-param helpers currently duplicated by pages.
- Create `src/app/today-panel.tsx`: current active book and daily entry surface.
- Create `src/app/book-shelf.tsx`: book shelf, book card, and book setup UI.
- Create `src/app/journey-panels.tsx`: history calendar/details and progress/badge panels.
- Modify `src/app/page.tsx`: reduce to the reader-first `Сегодня` page.
- Create `src/app/books/page.tsx`: `Полка` route.
- Create `src/app/journey/page.tsx`: `Путь` route.
- Modify `src/app/report/page.tsx`: use shared navigation/header while preserving print layout.
- Modify `src/app/globals.css`: add navigation styles, route layout styles, and remove assumptions that all panels live on one page.

## Task 1: Navigation Copy And Tests

**Files:**
- Modify: `src/app/ui-copy.ts`
- Modify: `src/app/ui-copy.test.ts`

- [ ] **Step 1: Write the failing UI copy test**

Add this test to `src/app/ui-copy.test.ts`:

```ts
it("defines Russian navigation labels for the four app sections", () => {
  expect(UI_COPY.navigation.today).toBe("Сегодня");
  expect(UI_COPY.navigation.books).toBe("Полка");
  expect(UI_COPY.navigation.journey).toBe("Путь");
  expect(UI_COPY.navigation.report).toBe("Отчет");
  expect(UI_COPY.navigation.ariaLabel).toContain("раздел");
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm test -- src/app/ui-copy.test.ts
```

Expected: fail because `UI_COPY.navigation` does not exist.

- [ ] **Step 3: Add navigation copy**

Add this object near the top of `UI_COPY` in `src/app/ui-copy.ts`:

```ts
navigation: {
  ariaLabel: "Основные разделы читательского маршрута",
  today: "Сегодня",
  books: "Полка",
  journey: "Путь",
  report: "Отчет"
},
```

- [ ] **Step 4: Run the test again**

Run:

```bash
npm test -- src/app/ui-copy.test.ts
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/ui-copy.ts src/app/ui-copy.test.ts
git commit -m "Add navigation copy"
```

## Task 2: Shared Navigation And Page Helpers

**Files:**
- Create: `src/app/app-nav.tsx`
- Create: `src/app/page-utils.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add route helper utilities**

Create `src/app/page-utils.ts`:

```ts
export function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function addDays(date: string, days: number): string {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return parsedDate.toISOString().slice(0, 10);
}

export function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export function getTodayIsoDate(): string {
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
```

- [ ] **Step 2: Add the shared navigation component**

Create `src/app/app-nav.tsx`:

```tsx
import Link from "next/link";

import { UI_COPY } from "./ui-copy";

type AppSection = "today" | "books" | "journey" | "report";

const navItems: Array<{ section: AppSection; href: string; label: string }> = [
  { section: "today", href: "/", label: UI_COPY.navigation.today },
  { section: "books", href: "/books", label: UI_COPY.navigation.books },
  { section: "journey", href: "/journey", label: UI_COPY.navigation.journey },
  { section: "report", href: "/report", label: UI_COPY.navigation.report }
];

export function AppNav({ active }: { active: AppSection }) {
  return (
    <nav className="app-nav" aria-label={UI_COPY.navigation.ariaLabel}>
      {navItems.map((item) => (
        <Link
          aria-current={item.section === active ? "page" : undefined}
          className={item.section === active ? "app-nav-link active" : "app-nav-link"}
          href={item.href}
          key={item.section}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Add navigation styles**

Append to the shared app layout section in `src/app/globals.css`:

```css
.app-nav {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.app-nav-link {
  border: 1px solid color-mix(in srgb, var(--ps-accent) 18%, transparent);
  border-radius: 999px;
  color: var(--ps-accent);
  font-weight: 800;
  padding: 0.55rem 0.8rem;
  text-decoration: none;
}

.app-nav-link.active {
  background: var(--ps-accent);
  color: var(--ps-accent-ink);
}
```

- [ ] **Step 4: Run checks for the new files**

Run:

```bash
npm run typecheck
npm test -- src/app/ui-copy.test.ts
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/app-nav.tsx src/app/page-utils.ts src/app/globals.css
git commit -m "Add shared app navigation"
```

## Task 3: Extract Today Surface

**Files:**
- Create: `src/app/today-panel.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Move TodayPanel and formatting helper**

Create `src/app/today-panel.tsx` by moving the existing `TodayPanel` and `formatBookmarkRecord` from `src/app/page.tsx`. The imports should be:

```tsx
import {
  calculateBookProgress,
  calculatePagesLeft,
  type Book,
  type ReadingEntry
} from "@/domain";

import { recordTodayAction } from "./actions";
import { TodayEntryForm } from "./today-entry-form";
import { UI_COPY } from "./ui-copy";
```

Export the component:

```tsx
export function TodayPanel({
  activeBook,
  dailyGoalPages,
  todayEntry
}: {
  activeBook: Book | null;
  dailyGoalPages: number;
  todayEntry: ReadingEntry | null;
}) {
  // Keep the moved implementation unchanged.
}
```

- [ ] **Step 2: Import the extracted component**

In `src/app/page.tsx`, remove the local `TodayPanel` and `formatBookmarkRecord` definitions. Add:

```ts
import { TodayPanel } from "./today-panel";
```

- [ ] **Step 3: Run focused checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/today-panel.tsx
git commit -m "Extract today panel"
```

## Task 4: Extract Book Shelf Surface

**Files:**
- Create: `src/app/book-shelf.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Move book shelf components**

Create `src/app/book-shelf.tsx` by moving these existing functions from `src/app/page.tsx`:

- `BooksPanel`
- `BookCard`
- `BookSetupPanel`
- `formatBookHistoryEntry`

Use these imports:

```tsx
import type { Book, ReadingEntry } from "@/domain";

import {
  activateBookAction,
  createBookAction,
  finishBookAction,
  pauseBookAction,
  updateBookDetailsAction
} from "./actions";
import { UI_COPY } from "./ui-copy";
```

Export `BooksPanel` and `BookSetupPanel`:

```tsx
export function BooksPanel(/* keep existing props */) {
  // Keep the moved implementation unchanged.
}

export function BookSetupPanel({ today, compact = false }: { today: string; compact?: boolean }) {
  // Keep the moved implementation unchanged.
}
```

- [ ] **Step 2: Import extracted book components**

In `src/app/page.tsx`, remove the moved functions and add:

```ts
import { BookSetupPanel, BooksPanel } from "./book-shelf";
```

- [ ] **Step 3: Run focused checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/book-shelf.tsx
git commit -m "Extract book shelf components"
```

## Task 5: Extract Journey Panels

**Files:**
- Create: `src/app/journey-panels.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Move journey components**

Create `src/app/journey-panels.tsx` by moving these existing functions from `src/app/page.tsx`:

- `HistoryPanel`
- `ProgressPanel`
- `DayDetail`
- `formatHistoryBookmark`
- `formatDayNumber`
- `formatWeekday`
- `formatShortDate`
- `formatLongDate`

Use these imports:

```tsx
import type { Badge, ReadingHistoryDay, ReadingMetrics, ReadingEntry } from "@/domain";

import { parseIsoDate } from "./page-utils";
import { UI_COPY } from "./ui-copy";
```

Export `HistoryPanel` and `ProgressPanel`:

```tsx
export function HistoryPanel({ days }: { days: ReadingHistoryDay[] }) {
  // Keep the moved implementation unchanged.
}

export function ProgressPanel({
  badges,
  metrics
}: {
  badges: Badge[];
  metrics: ReadingMetrics;
}) {
  // Keep the moved implementation unchanged.
}
```

- [ ] **Step 2: Import extracted journey components**

In `src/app/page.tsx`, remove the moved functions and add:

```ts
import { HistoryPanel, ProgressPanel } from "./journey-panels";
```

- [ ] **Step 3: Run focused checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/journey-panels.tsx
git commit -m "Extract journey panels"
```

## Task 6: Reduce Home Page To Reader-First Today

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add navigation to the home page**

Import `AppNav` in `src/app/page.tsx`:

```ts
import { AppNav } from "./app-nav";
```

Render it after the hero section:

```tsx
<AppNav active="today" />
```

- [ ] **Step 2: Remove long-page sections from home render**

In `src/app/page.tsx`, remove these home render calls:

```tsx
<BooksPanel
  activeBook={activeBook}
  books={books}
  entries={allEntries}
  today={today}
  todayEntry={todayEntry}
/>
<DailyGoalPanel
  currentGoal={currentGoal}
  goals={dailyGoals}
  today={today}
/>
<ProgressPanel metrics={metrics} badges={badges} />
<HistoryPanel days={historyDays} />
```

Keep only:

```tsx
{activeBook ? (
  <TodayPanel
    dailyGoalPages={currentGoal.pagesPerDay}
    todayEntry={todayEntry}
    activeBook={activeBook}
  />
) : (
  <BookSetupPanel today={today} />
)}
```

- [ ] **Step 3: Stop loading data the home page no longer needs**

Change the home page data load to:

```ts
const [dailyGoals, currentGoal, activeBook, rawTodayEntry] = await Promise.all([
  data.goals.getDailyGoals(),
  data.goals.getCurrentDailyGoal(today),
  data.books.getActiveBook(),
  data.entries.getEntryByDate(today)
]);
```

Keep `dailyGoals` only because it resolves the historical goal attached to today's entry.

- [ ] **Step 4: Run checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "Make home page reader first"
```

## Task 7: Add Books Page

**Files:**
- Create: `src/app/books/page.tsx`

- [ ] **Step 1: Create `/books` route**

Create `src/app/books/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Run checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/books/page.tsx
git commit -m "Add book shelf page"
```

## Task 8: Add Journey Page

**Files:**
- Create: `src/app/journey/page.tsx`

- [ ] **Step 1: Create `/journey` route**

Create `src/app/journey/page.tsx`:

```tsx
import { createSupabaseDataAccess } from "@/data";
import {
  buildComputedBadges,
  buildReadingHistoryDays,
  calculateReadingMetrics,
  resolveDailyGoalsForEntries
} from "@/domain";

import { AppNav } from "../app-nav";
import { HistoryPanel, ProgressPanel } from "../journey-panels";
import { addDays, getTodayIsoDate } from "../page-utils";

export const dynamic = "force-dynamic";

export default async function JourneyPage() {
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

  return (
    <main className="app-shell">
      <AppNav active="journey" />
      <ProgressPanel metrics={metrics} badges={badges} />
      <HistoryPanel days={historyDays} />
    </main>
  );
}
```

- [ ] **Step 2: Run checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/journey/page.tsx
git commit -m "Add journey page"
```

## Task 9: Move Goal Management Off Home

**Files:**
- Create or Modify: `src/app/goal-panel.tsx`
- Modify: `src/app/journey/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Extract daily goal management**

If `DailyGoalPanel` still lives in `src/app/page.tsx`, move it to `src/app/goal-panel.tsx` with these imports:

```tsx
import { sortDailyGoalsDescending, type DailyGoal } from "@/domain";

import { createDailyGoalAction, updateDailyGoalAction } from "./actions";
import { UI_COPY } from "./ui-copy";
```

Export it:

```tsx
export function DailyGoalPanel({
  currentGoal,
  goals,
  today
}: {
  currentGoal: DailyGoal;
  goals: DailyGoal[];
  today: string;
}) {
  // Keep the moved implementation unchanged.
}
```

- [ ] **Step 2: Render goal management on `/journey`**

In `src/app/journey/page.tsx`, import:

```ts
import { DailyGoalPanel } from "../goal-panel";
```

Render it after `ProgressPanel`:

```tsx
<DailyGoalPanel currentGoal={currentGoal} goals={dailyGoals} today={today} />
```

- [ ] **Step 3: Keep only goal status on home**

Do not render `DailyGoalPanel` from `src/app/page.tsx`. The home page may keep the existing hero goal token using `currentGoal.pagesPerDay`.

- [ ] **Step 4: Run checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/journey/page.tsx src/app/goal-panel.tsx
git commit -m "Move goal management to journey"
```

## Task 10: Add Navigation To Report And Protect Print

**Files:**
- Modify: `src/app/report/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Render app navigation on report**

In `src/app/report/page.tsx`, import:

```ts
import { AppNav } from "../app-nav";
```

Render it at the top of `<main className="report-shell">`:

```tsx
<div className="print-hidden">
  <AppNav active="report" />
</div>
```

- [ ] **Step 2: Verify print CSS hides navigation**

Ensure `src/app/globals.css` has a print rule that hides `.print-hidden`. If it does not, add:

```css
@media print {
  .print-hidden {
    display: none !important;
  }
}
```

- [ ] **Step 3: Run checks**

Run:

```bash
npm run typecheck
npm test
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/report/page.tsx src/app/globals.css
git commit -m "Add report navigation"
```

## Task 11: Visual And Build Verification

**Files:**
- Modify if needed: `src/app/globals.css`
- Modify if needed: affected route/component files

- [ ] **Step 1: Run the full automated checks**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected: all pass.

- [ ] **Step 2: Start the dev server**

Run:

```bash
npm run dev
```

Expected: Next.js starts and prints a local URL, normally `http://localhost:3000`.

- [ ] **Step 3: Browser-check the four routes**

Open and inspect:

```text
http://localhost:3000/
http://localhost:3000/books
http://localhost:3000/journey
http://localhost:3000/report
```

Expected:

- `/` feels like a reader-first daily screen.
- `/books` contains book management and does not require scrolling past the daily entry.
- `/journey` contains progress, badges, calendar, history, and goal management.
- `/report` still shows report controls and printable report.
- Navigation active states match the current route.
- Mobile width keeps all four destinations tappable without text overlap.

- [ ] **Step 4: Fix visual regressions only if observed**

If panels are too cramped after the split, adjust `src/app/globals.css` with targeted route-neutral CSS. Prefer changes to `.app-shell`, `.app-nav`, and existing panel classes. Do not introduce a new design system.

- [ ] **Step 5: Final commit**

```bash
git add src/app src/domain src/data
git commit -m "Polish navigation layout"
```

Skip this commit if no files changed during visual verification.

## Self-Review

- Spec coverage: covered reader-first home, `/books`, `/journey`, `/report`, shared navigation, Russian copy, data reuse, print protection, and verification.
- Placeholder scan: no deferred requirement markers remain.
- Type consistency: route names, component names, and helper names are defined before use.

# History Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add edit and delete correction workflows for saved reading history.

**Architecture:** Keep correction validation and book recalculation in domain utilities, expose entry update/delete through the data-access layer, and wire Russian-language forms into the existing journey history panel. Server actions coordinate persistence, revalidation, and redirects.

**Tech Stack:** Next.js server actions, TypeScript, Supabase client repository layer, Vitest.

---

### File Structure

- Modify `src/domain/today-flow.ts`: add correction validation and book recalculation helpers near existing reading-entry flow logic.
- Modify `src/domain/today-flow.test.ts`: add failing tests first for editing validation and post-correction book state.
- Modify `src/data/contracts.ts`: add entry lookup by id, update, and delete methods.
- Modify `src/data/supabase-data-access.ts`: implement those methods for `reading_entries`.
- Modify `src/app/actions.ts`: add `updateReadingEntryAction` and `deleteReadingEntryAction`.
- Modify `src/app/journey-panels.tsx`: render correction forms and delete buttons in history details.
- Modify `src/app/ui-copy.ts` and `src/app/ui-copy.test.ts`: add Russian correction copy and keep copy tests green.
- Modify `src/app/globals.css`: add small styling for the correction form.

### Task 1: Domain Correction Utilities

**Files:**
- Modify: `src/domain/today-flow.test.ts`
- Modify: `src/domain/today-flow.ts`

- [ ] **Step 1: Write failing tests**

Add tests for:

```ts
it("prepares a corrected entry with the daily goal for the target date", () => {
  const result = prepareReadingEntryCorrection({
    entry,
    book,
    targetDate: "2026-05-20",
    dailyGoalPages: 21,
    existingEntryOnTargetDate: null,
    startPage: 10,
    endPage: 25,
    creditedPages: 14,
    note: "new note"
  });

  expect(result).toEqual({
    ok: true,
    entry: {
      ...entry,
      date: "2026-05-20",
      startPage: 10,
      endPage: 25,
      creditedPages: 14,
      dailyGoalPages: 21,
      note: "new note"
    }
  });
});
```

Add tests for duplicate target dates, invalid credited pages, end-before-start, end-after-total, and recalculating a finished book back to paused after an entry correction.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/domain/today-flow.test.ts`

Expected: FAIL because `prepareReadingEntryCorrection` and `recalculateBookAfterEntryChange` do not exist.

- [ ] **Step 3: Implement minimal domain helpers**

Add exported helpers:

```ts
export function prepareReadingEntryCorrection(input: CorrectionInput): CorrectionResult;
export function recalculateBookAfterEntryChange(book: Book, entries: ReadingEntry[]): Book;
```

Use the validation rules from the spec. Preserve `reading` and `paused` unless a finished book is no longer complete, in which case set it to `paused`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test -- src/domain/today-flow.test.ts`

Expected: PASS.

### Task 2: Repository Methods

**Files:**
- Modify: `src/data/contracts.ts`
- Modify: `src/data/supabase-data-access.ts`

- [ ] **Step 1: Extend the contract**

Add to `ReadingEntryRepository`:

```ts
getEntryById(id: string): Promise<ReadingEntry | null>;
updateEntry(entry: ReadingEntry): Promise<ReadingEntry>;
deleteEntry(id: string): Promise<void>;
```

- [ ] **Step 2: Implement Supabase methods**

Implement `select().eq("id", id).maybeSingle()`, `update(...).eq("id", entry.id)`, and `delete().eq("id", id)`. Reuse `mapReadingEntry`.

- [ ] **Step 3: Type-check**

Run: `npm run typecheck`

Expected: PASS or no configured script. If absent, use `npx tsc --noEmit`.

### Task 3: Server Actions

**Files:**
- Modify: `src/app/actions.ts`

- [ ] **Step 1: Add update action**

`updateReadingEntryAction` should load the entry, book, target-date entry, and target daily goal. It should call `prepareReadingEntryCorrection`, persist the updated entry, recalculate the affected book from all entries for that book, update the book, revalidate app pages, and redirect to `/journey?message=entry_updated`.

- [ ] **Step 2: Add delete action**

`deleteReadingEntryAction` should load the entry and book, delete the entry, recalculate the book from remaining entries for that book, update the book, revalidate app pages, and redirect to `/journey?message=entry_deleted`.

- [ ] **Step 3: Add error redirects**

Map new correction errors to existing `redirectWithError` handling and add new codes only where needed.

### Task 4: Journey UI

**Files:**
- Modify: `src/app/journey-panels.tsx`
- Modify: `src/app/ui-copy.ts`
- Modify: `src/app/ui-copy.test.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add copy**

Add Russian labels for correction summary, date, start page, end page, credited pages, note, save, delete, and confirmation.

- [ ] **Step 2: Render forms**

In `DayDetail`, render a `<details>` correction area only when `day.entry` exists. Use hidden `entryId`, standard inputs, and the new server actions.

- [ ] **Step 3: Style forms**

Add compact styles that fit the current PageStrider theme and mobile layout.

- [ ] **Step 4: Run UI copy tests**

Run: `npm test -- src/app/ui-copy.test.ts`

Expected: PASS.

### Task 5: Verification

**Files:**
- Read: `package.json`

- [ ] **Step 1: Run focused tests**

Run: `npm test -- src/domain/today-flow.test.ts src/app/ui-copy.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full checks**

Run configured commands from `package.json`: tests, lint, typecheck, and build.

Expected: PASS for every configured command.

- [ ] **Step 3: Review git diff**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; only intended files changed plus any pre-existing user changes.

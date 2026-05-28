# History Correction Design

## Goal

Allow the adult user to correct reading history when a day was saved with the wrong date, pages, credited page count, or note, and to delete accidental entries.

## Scope

The correction flow belongs to Phase 6 polish and hardening. It stays inside the existing MVP model:

- one reader profile
- one active book at a time
- one reading entry per day
- Supabase-backed persistence through the data-access layer
- Russian-only user-facing copy
- no authentication, AI, PDF generation, or multi-book-per-day support

## User Experience

On the `Путь` page, each history detail with a saved reading entry shows a compact correction form. The form lets the user update:

- date
- start page
- end page
- credited pages
- note

The same area includes a delete action for accidental entries. Copy should keep the PageStrider route/quest tone without introducing personal names or family relationships.

## Validation

Saving a correction must reject:

- missing entry id
- missing book
- duplicate target date when moving an entry to a date already used by another entry
- credited pages less than 1
- end page before start page when both are present
- end page beyond the book total pages
- malformed target date

When the date changes, the entry receives the daily goal that applies to the new date.

## Data Flow

History correction uses server actions in `src/app/actions.ts` and repository methods behind `src/data/contracts.ts`.

Editing an entry:

1. Load the existing entry by id.
2. Load the entry's book.
3. Validate the edited values.
4. Update the entry.
5. Recalculate affected book progress from its remaining reading entries.
6. Revalidate `Путь`, `Полка`, `Сегодня`, and report pages.

Deleting an entry:

1. Load the existing entry by id.
2. Delete it.
3. Recalculate the affected book progress from its remaining reading entries.
4. Revalidate `Путь`, `Полка`, `Сегодня`, and report pages.

## Book Recalculation Rule

For the affected book, the saved history is the source of truth after a correction. The latest entry for that book with an `endPage` becomes the current bookmark. If there is no remaining entry with an `endPage`, the bookmark returns to `book.startPage - 1`, clamped to at least `1`.

If the recalculated current page reaches the book total pages, the book status becomes `finished` and `finishedDate` becomes the date of the latest finishing entry. If the book was finished but no longer reaches the end, it returns to `paused` so it does not unexpectedly become the active route.

Existing `reading` and `paused` statuses are otherwise preserved.

## Testing

Add focused domain tests for correction validation and book recalculation. Add data-access contract coverage through TypeScript where repository methods are introduced. Run the existing Vitest suite, TypeScript, lint, and production build if configured.

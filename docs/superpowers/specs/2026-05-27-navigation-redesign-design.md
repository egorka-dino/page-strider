# PageStrider Navigation Redesign

Date: 2026-05-27

## Goal

PageStrider should stop feeling like one long page that exposes every feature at once. The app should become a small multi-page reading journal where the first page is optimized for the reader's daily action, while less frequent adult and management tasks move to dedicated sections.

## Selected Direction

Use a reader-first home page with four top-level sections:

- `Сегодня` at `/`
- `Полка` at `/books`
- `Путь` at `/journey`
- `Отчет` at `/report`

The navigation labels are Russian-language UI copy. Code identifiers and route filenames remain English.

## Page Responsibilities

### Сегодня

The home page is the daily reader screen. It should include only the most frequently used information and actions:

- Current active book.
- Current book progress.
- The daily reading entry form when today's entry has not been saved.
- The saved state for today's entry when it already exists.
- Current daily goal as a small status, not as a full settings form.
- A compact streak or route status that motivates the next step.
- Lightweight links to the other sections.

The home page should not include the full book shelf, full goal history, detailed metrics, badge grid, or detailed history list.

### Полка

The book shelf page owns book management:

- Active book details.
- Paused books.
- Finished books.
- Creating a new book route.
- Editing book details.
- Pausing, activating, and finishing books.
- Per-book reading history.

The existing MVP guardrail still applies: one active book at a time and no switching books after today's entry is saved.

### Путь

The journey page owns route history and motivation:

- Recent reading calendar.
- Day details.
- Current and best streaks.
- Reading metrics.
- Computed badges.

History, metrics, and badges belong together because they answer the same user question: how the reading route is going.

### Отчет

The existing report page remains separate:

- Date range controls.
- Printable teacher report.
- Period summary.
- Reading table.
- Browser print action.

The report should stay clean and print-friendly. It should be available from navigation but should not visually compete with the daily reader screen.

## Navigation

Add a shared app navigation surface for normal app pages. It should show:

```text
Сегодня · Полка · Путь · Отчет
```

The current section should be visibly active. On small screens the same four destinations should stay easy to tap, either as a compact top nav under the brand or as a bottom navigation bar. The implementation should choose the simpler responsive pattern that fits the existing CSS and avoids a large design-system expansion.

The report page may use the same navigation if it does not harm print layout. Print CSS must hide navigation and controls.

## Data Flow

No new persistence model is required. The redesign should reuse the current Supabase data-access layer and domain utilities.

Expected data split:

- `/` loads active book, current goal, today's entry, and enough entries to compute a compact streak/status.
- `/books` loads books and entries needed for per-book history.
- `/journey` loads goals, books, and entries needed for calendar, metrics, and badges.
- `/report` keeps its current report-specific loading flow.

Business logic should remain in existing domain utilities or small new utility functions if needed. UI components should not duplicate calculation rules.

## Copy And Tone

All user-facing UI copy must remain Russian-language only. The tone should stay light and game-like: routes, quests, steps, page streaks, progress, and rewards. The redesign should reduce overload without making the app feel like a generic SaaS dashboard.

## Implementation Notes

The implementation should split the current `src/app/page.tsx` responsibilities into route pages and reusable components. Good candidates for extraction include:

- App navigation.
- PageStrider logo or brand header.
- Today panel.
- Book shelf panel and book card.
- Journey/history panels.
- Goal status and goal management surface.

The extraction should be pragmatic and scoped to the navigation redesign. Avoid unrelated refactors and avoid introducing a large design system.

## Testing And Verification

Run the existing checks after implementation:

- TypeScript check, if configured.
- Lint, if configured.
- Unit tests, especially existing domain and UI copy tests.
- Production build, if configured.

Manual verification should cover:

- Reader-first home page with and without an active book.
- Today's entry before and after saving.
- Book switching restrictions after today's entry exists.
- Journey page with and without history.
- Report page print layout.
- Mobile navigation usability.

## Out Of Scope

- Multiple reader profiles.
- Multiple active books.
- Multiple books per day.
- Authentication.
- AI features.
- PDF generation.
- Database redesign.
- New badge or metrics feature scope beyond reorganizing existing MVP surfaces.

# PageStrider

PageStrider is a small reading journal app for one child reader. It helps the reader track daily reading, see progress through the current book, keep a reading streak, earn badges, and feel motivated by game-like progress. It also helps an adult user review reading history and print a clean teacher report for a selected period.

The app should feel friendly, motivating, and slightly game-like. It should not feel like a boring school form.

The app should avoid the look and feel of a generic SaaS dashboard. PageStrider needs a small custom theme layer so the visual style can later become more book-like, warm, and playful without rewriting business logic or core components.

## Preferred Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui if already present or easy to add later
- Vercel deployment
- MVP storage: a shared database, because the app may be used from multiple devices
- Database options: Vercel Postgres, Neon, or Supabase
- A small data-access layer between UI/business logic and the database
- A small PageStrider theme layer for design tokens and reusable visual primitives

Do not install or configure this stack during the documentation-only setup task.

## MVP Scope

The MVP supports:

- One reader profile
- One active book at a time
- One book per day
- Configurable daily reading goal, defaulting to 17 pages
- Daily reading entry based on the page where the reader finished reading
- Book progress calculation
- Reading history
- Day highlighting
- Streaks
- Metrics
- Computed badges
- Print-friendly HTML teacher report with print CSS

The MVP does not support:

- Multiple reader profiles
- Multiple active books
- Switching between multiple books in the same day
- AI features
- PDF generation
- Complex authentication
- Complex multi-user account system

The MVP does require shared persistence. `localStorage` is not enough because the app must work across multiple devices.

## Product Goals

For the reader:

- Track daily reading.
- See progress through the current book.
- Keep a reading streak.
- See motivating metrics.
- Earn badges.
- Feel that reading progress is game-like and rewarding.

For the adult user:

- Check reading history.
- See whether the daily goal was completed.
- Print a clean report for the teacher.

For the teacher:

- Receive a clear printable reading report for a selected period.

## Visual Direction

PageStrider should feel like a small reading companion, not a generic analytics dashboard. It can still be clean and practical, but the visual system should leave room for a book-like, playful identity.

Design principles:

- Avoid generic SaaS dashboard styling as the default product language.
- Avoid making every feature a neutral business card, KPI tile, or table-heavy admin screen.
- Build a small PageStrider theme layer early, using named tokens and reusable styling primitives.
- Keep visual style separate from business logic and calculation utilities.
- Prefer product language around reading progress, journeys, streaks, badges, shelves, pages, and reports.
- Make the teacher report clean and printable, while the app experience can be warmer and more playful.

The theme layer may include:

- Color tokens for page, ink, accent, success, warning, and badge states.
- Typography choices or wrappers that can later support a more book-like feel.
- Shared component variants for buttons, panels, progress, badges, day states, and report surfaces.
- CSS variables or Tailwind theme extensions, depending on the project setup.

The theme layer should stay small in MVP. It should make future styling easier without creating a large design system before the product exists.

## Core Entities

### Reader

MVP has a single reader profile stored in shared persistence:

- `name`

### Book

A book should include:

- `id`
- `title`
- `author`
- `totalPages`
- `startPage`
- `currentPage`
- `status`: `reading`, `finished`, or `paused`
- `startedDate`
- `finishedDate`

MVP supports only one active book with status `reading`.

### Reading Entry

A daily reading entry should include:

- `id`
- `date`
- `bookId`
- `bookTitle` or a stable book snapshot for reports
- `startPage`
- `endPage`
- `pagesRead`
- `dailyGoalPages`
- optional `note`

MVP assumes one reading entry per day.

### Settings

Settings should include:

- `dailyGoalPages`

The default current goal is 17 pages, but business logic must never hardcode `17`. Calculations should receive the configured goal as input.

## Persistence

PageStrider needs a database in the MVP because the app may be opened from different devices. The application can still keep the product model simple:

- One reader profile.
- One active book at a time.
- One reading entry per day.
- No complex authentication unless explicitly requested later.

Database access should sit behind a small data-access layer. UI components should call application/data functions instead of directly reading from or writing to the database.

Recommended database candidates:

- Vercel Postgres
- Neon
- Supabase

The first documentation task must not install, provision, or configure a database. The database choice and setup should happen during implementation planning.

## Page Counting Rules

A book has:

- `startPage`
- `currentPage`
- `totalPages`

`currentPage` means the last page that has already been read.

For a daily reading entry:

```text
pagesRead = endPage - startPage + 1
```

Example: if the reader started today on page 42 and finished on page 65, then:

```text
pagesRead = 65 - 42 + 1 = 24
```

For book progress:

```text
readPages = currentPage - book.startPage + 1
totalReadablePages = book.totalPages - book.startPage + 1
progress = readPages / totalReadablePages
```

Progress must be clamped between 0 and 1.

Pages left should be calculated from the readable range and must not become negative.

## Day Highlighting

Days in history or calendar views should have one of these visual states:

- `no_reading`: 0 pages
- `partial`: 1 page up to `dailyGoalPages - 1`
- `goal`: at least `dailyGoalPages`
- `good`: at least `ceil(dailyGoalPages * 1.2)`
- `great`: at least `dailyGoalPages * 2`
- `legendary`: at least 100 pages

Priority order:

```text
legendary > great > good > goal > partial > no_reading
```

The classifier should be implemented as a utility function and should receive `dailyGoalPages` as an argument.

## Forecasts

The app should forecast when the current book will be finished:

- Based on the configured daily goal.
- Based on actual average reading pace.

If there is not enough history, the UI should show a fallback message instead of fake precision.

Forecast calculations belong in utility functions.

## Streaks

The app should show:

- Current streak
- Best streak

A streak day is a day where:

```text
pagesRead >= dailyGoalPages
```

Missed days should not feel too punishing in the UI. The product tone should encourage continuing rather than shame missed days.

## Metrics

The app should eventually show:

- Total pages read
- Books finished
- Current streak
- Best streak
- Reading days count
- Goal completed days count
- Average pages per reading day
- Average pages per calendar day
- Best day pages
- Pages read this week
- Reading days this week

Metric calculations should live in utility functions.

## Badges

Badges should be game-like and motivating. In the MVP, badges can be computed from books and reading entries instead of being manually stored.

Suggested badges:

- First Stride: first reading entry
- Goal Keeper: 7 goal days
- Page Sprinter: 20 or more pages in one day
- Long Strider: 50 or more pages in one day
- Century Strider: 100 or more pages in one day
- Book Finisher: first finished book
- Steady Week: 5 reading days in one week
- Comeback: reading after a missed day

Badge logic should live in utility functions.

## Teacher Report

The MVP teacher report should be a print-friendly HTML page with print CSS. It should use browser print and should not generate PDF files.

The report should include:

- Reader name
- Selected period
- Daily goal
- Summary metrics
- Table with date, book, page range, pages read, goal status, and optional note

The report should look good on A4 paper.

## Engineering Principles

- Code and comments must be in English.
- Keep business logic in utility functions, not directly inside UI components.
- Keep persistence behind a small data-access layer so the database provider can later be replaced.
- Prefer TypeScript types for core entities and calculation inputs.
- Avoid hardcoded business values such as the 17-page goal.
- Keep MVP assumptions explicit in code and documentation.
- Add tests if the project already has a test setup.
- Do not add authentication in MVP unless explicitly requested later.
- Use a shared database for MVP persistence because `localStorage` cannot support multiple devices.
- Keep UI friendly and motivating, but avoid large feature expansion during MVP.
- Avoid generic SaaS dashboard styling; use a small PageStrider theme layer for product-specific tokens and visual primitives.
- Keep the theme layer separate from business logic, calculations, and persistence.

## Implementation Phases

1. Foundation
2. Books and Today page
3. History and Calendar
4. Streaks, Metrics, and Badges
5. Teacher Report
6. Polish and Hardening

Detailed phase notes live in `docs/codex-phases/`.

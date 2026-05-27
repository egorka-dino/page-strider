# PageStrider Shared Context

Read this file at the start of every future Codex chat for PageStrider.

PageStrider is a small reading journal app for one child reader. The reader is expected to read every day. The current daily goal is 17 pages, but this must be configurable because it may grow later. Never hardcode `17` in business logic.

The app should help the reader track daily reading, see progress through the current book, keep a streak, see metrics, earn badges, and feel motivated by game-like progress. It should help an adult user check history and print a clean report for the teacher. It should help the teacher receive a clear printable reading report for a selected period.

The app should feel friendly, motivating, and slightly game-like. It should not feel like a boring school form.

Avoid styling the app as a generic SaaS dashboard. Build a small PageStrider theme layer so the visual style can later become more book-like and playful without rewriting business logic or components.

## MVP Guardrails

- One reader profile.
- One active book at a time.
- One book per day.
- No switching between multiple books in the same day.
- No AI features.
- No PDF generation.
- Use a print-friendly HTML report with print CSS.
- No complex authentication.
- Use a shared database for MVP persistence because the app may be used from different devices.
- Keep database access behind a small data-access layer so the provider can later be replaced.
- Code and comments must be in English.
- Business logic belongs in utility functions, not directly inside UI components.
- Visual styling should use a small PageStrider theme layer instead of generic dashboard defaults.

## Preferred Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui if already present or easy to add
- Vercel deployment
- Shared database: Vercel Postgres, Neon, or Supabase are acceptable candidates
- PageStrider theme layer for tokens and reusable visual primitives

Do not add dependencies or configure the stack unless the current phase explicitly requires it.

## Core Page Rules

For a daily reading entry, bookmark movement and credited reading are separate:

```text
suggestedCreditedPages = endPage - startPage + 1
```

The saved `creditedPages` value is the source of truth for daily goal completion,
streaks, metrics, badges, reports, and history totals. `startPage` and `endPage`
are optional for historical imports, and `endPage` is used only for the current
bookmark and active book progress.

For book progress:

```text
readPages = currentPage - book.startPage + 1
totalReadablePages = book.totalPages - book.startPage + 1
progress = readPages / totalReadablePages
```

Progress must be clamped between 0 and 1.

## Phase Order

1. Foundation
2. Books and Today page
3. History and Calendar
4. Streaks, Metrics, and Badges
5. Teacher Report
6. Polish and Hardening

Before starting a phase, read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, this context file, and the specific phase file.

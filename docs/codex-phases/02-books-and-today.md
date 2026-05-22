# Phase 2: Books and Today Page

## Goal

Let the reader add or use one active book and enter where they finished reading today. The app should calculate pages read, save the daily reading entry, update current book progress, and validate impossible page ranges.

## Scope

- Add book creation or initial book setup.
- Support one active book.
- Add a Today page.
- Let the reader enter the page where they finished reading today.
- Calculate pages read using the Phase 1 utility.
- Save one reading entry for the day.
- Update the active book current page.
- Validate page ranges.
- Use the database-backed data-access layer so entries work across devices.
- Use the PageStrider theme layer for visual styling instead of generic dashboard defaults.

## Tasks

- Read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/codex-phases/00-context.md`, and this phase file.
- Confirm Phase 1 is complete or add only missing foundation pieces required for this phase.
- Create or extend a small database-backed data-access layer for books, settings, and reading entries.
- Add active book creation fields:
  - title
  - author
  - total pages
  - start page
  - current page
  - status
  - started date
- Add Today page flow:
  - show active book
  - show current progress
  - show daily goal
  - accept finished page
  - accept optional note
  - calculate pages read
  - save entry
  - update book current page
- Validate that end page is not before today's start page.
- Validate that end page does not exceed total pages.
- Validate that only one MVP entry exists for the day.
- Mark the book as finished when current page reaches total pages.
- Keep business logic in utilities or data functions, not inline in UI components.
- Keep visual styling behind product-specific theme tokens or component variants.
- Update `docs/IMPLEMENTATION_STATUS.md` when the phase is complete.

## Out Of Scope

- Do not implement calendar or history beyond what is required to prevent duplicate daily entries.
- Do not implement badges.
- Do not implement metrics dashboard.
- Do not implement teacher report.
- Do not style the Today page as a generic SaaS dashboard.
- Do not add authentication.
- Do not use `localStorage` as the primary MVP persistence layer.
- Do not support multiple active books.
- Do not support switching books within one day.

## Expected Result

The reader can set up one active book and enter today's finished page. The app records one daily entry, updates book progress, and prevents impossible page ranges.

## Suggested Prompt

```text
Start Phase 2 for PageStrider.

Read PROJECT.md, docs/IMPLEMENTATION_STATUS.md, docs/codex-phases/00-context.md, and docs/codex-phases/02-books-and-today.md.

Implement only book setup and the Today page. Support one active book and one reading entry per day. Use existing foundation utilities and the PageStrider theme layer. Keep shared database persistence behind a small data-access layer. Avoid generic SaaS dashboard styling. Do not implement calendar, badges, metrics dashboard, teacher report, or authentication.
```

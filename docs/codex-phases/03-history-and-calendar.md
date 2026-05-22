# Phase 3: History and Calendar

## Goal

Add reading history and calendar-style day highlighting so users can review reading activity over time.

## Scope

- Add reading history.
- Add calendar or day-list highlighting.
- Show visual states for:
  - no reading
  - partial reading
  - goal completed
  - good day
  - great day
  - legendary day
- Show day details.
- Use the Phase 1 day level utility.
- Keep the MVP assumption of one reading entry per day.
- Use PageStrider theme tokens for day states instead of generic dashboard colors.

## Tasks

- Read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/codex-phases/00-context.md`, and this phase file.
- Confirm Phase 2 is complete or identify the smallest missing prerequisite.
- Add a history view using stored reading entries.
- Add date-based grouping for daily entries.
- Add day highlighting using the shared day level classifier.
- Display each day's book, page range, pages read, goal status, and note if present.
- Show empty states for days or periods with no reading.
- Keep labels friendly and encouraging.
- Keep the visual language book-like and playful where appropriate.
- Keep business logic in utilities.
- Update `docs/IMPLEMENTATION_STATUS.md` when the phase is complete.

## Out Of Scope

- Do not implement streak calculations unless needed only for a tiny display placeholder.
- Do not implement the metrics dashboard.
- Do not implement badges.
- Do not implement teacher report.
- Do not generate PDFs.
- Do not add multiple entries per day.
- Do not add multi-book-per-day support.
- Do not style history as a generic admin dashboard.

## Expected Result

The app shows a clear reading history and highlights each day according to the configured daily goal and PageStrider day-level rules.

## Suggested Prompt

```text
Start Phase 3 for PageStrider.

Read PROJECT.md, docs/IMPLEMENTATION_STATUS.md, docs/codex-phases/00-context.md, and docs/codex-phases/03-history-and-calendar.md.

Implement only reading history and calendar/day highlighting. Use the shared day level utility, existing database-backed data-access layer, and PageStrider theme tokens. Keep the MVP assumption of one reading entry per day. Avoid generic admin/dashboard styling. Do not implement streaks, badges, metrics dashboard, teacher report, PDF generation, or authentication.
```

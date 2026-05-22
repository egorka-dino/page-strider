# Phase 5: Teacher Report

## Goal

Add a print-friendly teacher report for a selected date range using HTML and print CSS. The report should be clean, readable, and suitable for A4 browser printing.

## Scope

- Add date range selector.
- Add print-friendly report page.
- Add summary metrics for the selected period.
- Add reading table.
- Add print CSS.
- Use browser print.
- Keep report styling clean and printable while still aligned with PageStrider tokens where practical.

## Tasks

- Read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/codex-phases/00-context.md`, and this phase file.
- Confirm Phase 4 is complete or identify the smallest missing prerequisite.
- Add a date range selector for report period.
- Filter reading entries by selected period.
- Calculate period summary metrics.
- Add report header with:
  - reader name
  - period
  - daily goal
- Add report table with:
  - date
  - book
  - page range
  - pages read
  - goal status
  - optional note
- Add print CSS optimized for A4 paper.
- Ensure the report is clean when printed from the browser.
- Keep screen UI friendly and report UI clean.
- Do not make the report look like a SaaS analytics export.
- Update `docs/IMPLEMENTATION_STATUS.md` when the phase is complete.

## Out Of Scope

- Do not generate PDF files.
- Do not add email sending.
- Do not add teacher login.
- Do not add signatures or approval workflow.
- Do not change the database architecture unless required for the report query.
- Do not add authentication unless explicitly requested later.

## Expected Result

The user can select a date range, view a clean teacher report, and print it from the browser on A4 paper.

## Suggested Prompt

```text
Start Phase 5 for PageStrider.

Read PROJECT.md, docs/IMPLEMENTATION_STATUS.md, docs/codex-phases/00-context.md, and docs/codex-phases/05-teacher-report.md.

Implement only the print-friendly teacher report with date range selection, summary metrics, reading table, and A4 print CSS. Use browser print, the existing database-backed data-access layer, and the PageStrider theme layer where practical. Do not generate PDF files, add email sending, authentication, or unrelated persistence changes.
```

# Phase 6: Polish and Hardening

## Goal

Improve the MVP experience, harden edge cases, and verify the app is ready for everyday use without adding large new features.

## Scope

- Improve UX.
- Improve mobile layout.
- Refine the PageStrider theme layer.
- Add empty states.
- Add better validation messages.
- Add edit/delete where needed.
- Handle edge cases.
- Check TypeScript, lint, tests, and production build.

## Tasks

- Read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/codex-phases/00-context.md`, and this phase file.
- Review the complete MVP flow:
  - book setup
  - Today page
  - history/calendar
  - streaks/metrics/badges
  - teacher report
- Improve responsive layout on mobile and desktop.
- Review the app for generic SaaS dashboard patterns and replace them with small PageStrider-specific visual treatments.
- Add friendly empty states.
- Improve validation copy.
- Add edit/delete only where needed for realistic correction workflows.
- Handle edge cases:
  - no active book
  - finished book
  - invalid page ranges
  - duplicate daily entry
  - changed daily goal
  - no history for forecasts
  - report period with no entries
- Verify TypeScript.
- Run lint if configured.
- Run tests if configured.
- Run production build if configured.
- Update `docs/IMPLEMENTATION_STATUS.md` when the phase is complete.

## Out Of Scope

- Do not add large new features.
- Do not add multiple reader profiles.
- Do not add multiple active books.
- Do not add multi-book-per-day support.
- Do not add AI features.
- Do not add PDF generation.
- Do not add authentication unless explicitly requested.
- Do not replace or significantly redesign the database layer unless explicitly requested.
- Do not introduce a large design system.

## Expected Result

The MVP feels friendly, stable, and usable for the reader, adult users, and the teacher report workflow. It has a small PageStrider-specific visual identity instead of a generic SaaS dashboard feel. The app passes available checks and avoids obvious edge-case failures.

## Suggested Prompt

```text
Start Phase 6 for PageStrider.

Read PROJECT.md, docs/IMPLEMENTATION_STATUS.md, docs/codex-phases/00-context.md, and docs/codex-phases/06-polish-and-hardening.md.

Polish and harden the existing MVP without adding large new features. Improve UX, mobile layout, empty states, validation messages, correction workflows, edge cases, and the small PageStrider theme layer. Avoid generic SaaS dashboard styling. Run TypeScript, lint, tests, and production build if configured.
```

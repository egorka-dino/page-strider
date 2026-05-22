# Phase 1: Foundation

## Goal

Create the technical foundation for PageStrider without building the full UI. Define shared types, constants, calculation utilities, the persistence boundary, and the small theme boundary so future phases can use tested business logic and consistent product styling without duplicating logic or visual decisions inside components.

## Scope

- Inspect the project structure.
- Confirm whether the project is already a Next.js app or still empty.
- Define shared TypeScript types for books, reading entries, settings, day levels, metrics, forecasts, and badges as needed.
- Define constants for defaults and labels.
- Add calculation utilities for:
  - pages read
  - book progress
  - pages left
  - day level classification
  - finish forecasts
- Define the database-backed data-access boundary, but do not build the full persistence implementation unless the project setup already makes that natural.
- Define the small PageStrider theme layer boundary for product-specific tokens and reusable visual primitives.
- Add tests if the project already has a test setup.

## Tasks

- Read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, and `docs/codex-phases/00-context.md`.
- Inspect package, source, and test structure before editing.
- Add or update shared type definitions in the existing project style.
- Add a configurable default daily goal constant, currently 17 pages.
- Implement `calculatePagesRead(startPage, endPage)`.
- Implement book progress calculation using `startPage`, `currentPage`, and `totalPages`.
- Clamp progress between 0 and 1.
- Implement pages-left calculation without negative results.
- Implement day level classification with priority `legendary > great > good > goal > partial > no_reading`.
- Implement finish forecast utilities for daily-goal pace and actual-average pace.
- Return fallback values when forecast history is insufficient.
- Define interfaces or function contracts for database-backed access to settings, books, and reading entries.
- Document the recommended database choice before provisioning anything.
- Add or document the initial PageStrider theme approach:
  - avoid generic SaaS dashboard styling
  - keep theme tokens separate from business logic
  - leave room for book-like and playful visuals later
- Add focused tests if the repo already has a test setup.
- Update `docs/IMPLEMENTATION_STATUS.md` when the phase is complete.

## Out Of Scope

- Do not build the full UI.
- Do not create a large design system.
- Do not style the product as a generic SaaS dashboard.
- Do not add book creation screens.
- Do not add the Today page.
- Do not add calendar, badges, metrics dashboard, or teacher report.
- Do not add authentication.
- Do not provision a database unless the implementation plan for Phase 1 explicitly chooses to do so.
- Do not install dependencies unless truly required by the existing project setup.

## Expected Result

The project has a small, reusable foundation for PageStrider business logic, a clear database-backed data-access boundary, and a small theme boundary for product-specific styling. Future UI work can import typed utilities for page counting, progress, day levels, and forecasts without coupling visual style to business logic.

## Suggested Prompt

```text
Start Phase 1 for PageStrider.

Read PROJECT.md, docs/IMPLEMENTATION_STATUS.md, docs/codex-phases/00-context.md, and docs/codex-phases/01-foundation.md.

Implement only the foundation scope: shared types, constants, calculation utilities for pages read, book progress, pages left, day level classification, finish forecasts, the data-access boundary for shared database persistence, and a small PageStrider theme boundary. Avoid generic SaaS dashboard styling. Add tests only if a test setup already exists. Do not build UI, do not add authentication, and do not provision a database unless the Phase 1 implementation plan explicitly calls for it.
```

# Phase 4: Streaks, Metrics, and Badges

## Goal

Add motivating progress feedback through streaks, metrics, and computed badges while keeping all calculations in utility functions.

## Scope

- Add current streak.
- Add best streak.
- Add metrics surfaces.
- Add computed badges.
- Keep missed days encouraging rather than punishing.
- Keep progress feedback playful and reading-themed, not like a generic SaaS analytics dashboard.

## Tasks

- Read `PROJECT.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/codex-phases/00-context.md`, and this phase file.
- Confirm Phase 3 is complete or identify the smallest missing prerequisite.
- Add streak utilities:
  - current streak
  - best streak
  - streak days where `pagesRead >= dailyGoalPages`
- Add metrics utilities:
  - total pages read
  - books finished
  - current streak
  - best streak
  - reading days count
  - goal completed days count
  - average pages per reading day
  - average pages per calendar day
  - best day pages
  - pages read this week
  - reading days this week
- Add computed badge utilities for:
  - First Stride
  - Goal Keeper
  - Page Sprinter
  - Long Strider
  - Century Strider
  - Book Finisher
  - Steady Week
  - Comeback
- Add UI surfaces for metrics and badges.
- Keep badges game-like and motivating.
- Use the PageStrider theme layer for badge, streak, progress, and metric presentation.
- Add tests if a test setup exists.
- Update `docs/IMPLEMENTATION_STATUS.md` when the phase is complete.

## Out Of Scope

- Do not add manually stored badge state in MVP unless a later decision requires it.
- Do not add social sharing.
- Do not add leaderboards.
- Do not add AI recommendations.
- Do not implement the teacher report.
- Do not generate PDFs.
- Do not add authentication or change the database architecture unless required by this phase.
- Do not create a generic KPI dashboard look.

## Expected Result

The reader can see motivating streaks, progress metrics, and badges computed from books and reading entries in a PageStrider-specific visual style.

## Suggested Prompt

```text
Start Phase 4 for PageStrider.

Read PROJECT.md, docs/IMPLEMENTATION_STATUS.md, docs/codex-phases/00-context.md, and docs/codex-phases/04-streaks-metrics-badges.md.

Implement only streaks, metrics, and computed badges. Keep calculations in utility functions and add tests if a test setup exists. Use the existing database-backed data-access layer and PageStrider theme layer. Avoid generic KPI/dashboard styling. Do not implement the teacher report, PDF generation, authentication, or unrelated persistence changes.
```

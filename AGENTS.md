# AGENTS.md

Guidance for future Codex agents working on PageStrider.

## Project Orientation

PageStrider is a small reading journal app for one child reader. It should help track daily reading, current book progress, streaks, metrics, badges, and printable teacher reports.

Do not include personal names or family relationships in project documentation, code, seed data, comments, or UI copy. Use neutral terms such as `reader`, `user`, `adult user`, and `teacher`.

## Read Before Work

At the start of a new chat or phase, read these files:

1. `PROJECT.md`
2. `docs/IMPLEMENTATION_STATUS.md`
3. `docs/INFRASTRUCTURE.md`
4. `docs/codex-phases/00-context.md`
5. The specific phase file under `docs/codex-phases/`

Follow the current phase scope. Do not pull later-phase features forward unless explicitly requested.

## Current Infrastructure

- Vercel project is created and linked: `egorka-dinos-projects/page-strider`.
- Supabase project is linked: `Page Strider`, ref `mszcmtqkfanijrypcwvd`, region `eu-west-1`.
- Vercel env vars are set for Production, Preview, and Development:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` is not required for the Supabase-first MVP.
- Add `DATABASE_URL` only if a future phase introduces direct server-side SQL or an ORM.
- Do not commit `.env.local`, `.vercel/`, or `supabase/.temp/`.

## MVP Guardrails

- One reader profile.
- One active book at a time.
- One book per day.
- No switching between multiple books in the same day.
- No AI features.
- No PDF generation in MVP.
- Use browser print and print CSS for the teacher report.
- No complex authentication unless explicitly requested later.
- Use Supabase for shared persistence across devices.
- Do not use `localStorage` as primary MVP persistence.

## Engineering Rules

- Code and comments must be in English.
- Keep business logic in utility functions, not directly inside UI components.
- Keep Supabase/database access behind a small data-access layer.
- Never hardcode the current 17-page goal in business logic; read it from settings or pass it as an argument.
- Add tests when a test setup exists, especially for calculation utilities.
- Keep implementation scoped and avoid unrelated refactors.

## Visual Direction

Avoid styling PageStrider as a generic SaaS dashboard. Build and use a small PageStrider theme layer with product-specific tokens and reusable visual primitives.

The visual style should be friendly, motivating, slightly game-like, and able to become more book-like over time. Keep the theme layer separate from business logic, calculations, and persistence.

## Git And Secrets

- Check `git status` before editing.
- Do not revert user changes unless explicitly requested.
- Never commit real secrets.
- Commit meaningful completed steps with concise messages.

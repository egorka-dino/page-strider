# PageStrider

PageStrider is a small reading journal app for one reader. It helps track the current book, log today's reading, show progress through the book, and build toward streaks, badges, metrics, and printable teacher reports.

The product should feel motivating and lightly game-like. The user-facing interface is Russian-only and should use inviting language around quests, reading routes, page steps, progress, and rewards instead of dry form copy.

## Current Status

- Phase 1: Foundation - complete.
- Phase 2: Books and Today page - complete.
- Phase 3: History and Calendar - not started.
- Phase 4: Streaks, Metrics, and Badges - not started.
- Phase 5: Teacher Report - not started.
- Phase 6: Polish and Hardening - not started.

See [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) for the detailed tracker.

## Stack

- Next.js
- React
- TypeScript
- Vitest
- Supabase for shared MVP persistence
- Vercel deployment

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run checks:

```bash
npm test
npm run typecheck
npm run build
```

## Environment

The app expects Supabase environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Use `.env.example` as the template. Do not commit real secrets, `.env.local`, `.vercel/`, or `supabase/.temp/`.

Infrastructure details live in [docs/INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md).

## MVP Guardrails

- One reader profile.
- One active book at a time.
- One book per day.
- No switching between multiple books in the same day.
- No AI features.
- No PDF generation in MVP.
- No complex authentication.
- Supabase is the shared persistence layer.
- Do not use `localStorage` as primary MVP persistence.
- Keep database access behind the data-access layer.
- Keep business logic in domain utilities, not directly inside UI components.
- Never hardcode the current daily goal in business logic.

## Product And UI Rules

- User-facing interface copy must be Russian-language only.
- The interface should motivate reading through a light game-like tone.
- Prefer words and visuals around quests, reading routes, page steps, progress, and rewards.
- Keep the app friendly and book-like, not like a generic SaaS dashboard.
- Do not pull later-phase badge, metrics, calendar, or report features forward unless explicitly requested.
- Do not include personal names or family relationships in documentation, code, seed data, comments, or UI copy.

## Project Docs

- [PROJECT.md](PROJECT.md) - product brief, MVP scope, entities, and rules.
- [AGENTS.md](AGENTS.md) - guidance for future Codex agents.
- [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) - phase progress.
- [docs/INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md) - Vercel and Supabase setup notes.
- [docs/codex-phases/](docs/codex-phases/) - phase-by-phase implementation notes.

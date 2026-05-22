# PageStrider Foundation

Phase 1 creates the reusable foundation for later app screens without building the product UI.

## Project Setup

- Next.js app router with TypeScript lives under `src/app`.
- Domain logic lives under `src/domain`.
- Database access contracts live under `src/data`.
- Product theme tokens live under `src/theme` and `src/app/globals.css`.
- Vitest covers calculation utilities.

## Domain Layer

The domain layer defines shared types for the MVP entities:

- reader profile
- book
- reading entry
- settings
- day levels
- metrics
- badges
- finish forecasts

Calculation utilities are pure functions. They do not read environment variables, storage, or UI state. The daily goal is passed into calculations, except for the exported default constant used to initialize settings.

## Data Boundary

The MVP persistence choice is Supabase client APIs. Direct SQL and `DATABASE_URL` are not required for the current MVP.

UI and application flows should use the repository contracts in `src/data/contracts.ts` instead of calling Supabase directly from components. Later phases can add a Supabase implementation behind these contracts.

## Theme Boundary

PageStrider theme values are product-specific tokens, not generic dashboard styling. The initial boundary includes page, paper, ink, accent, success, warning, and badge colors plus small radius and shadow tokens.

Future components should import from `src/theme` or use the `--ps-*` CSS variables instead of hardcoding ad hoc visual values in business logic or persistence code.

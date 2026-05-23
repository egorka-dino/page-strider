# PageStrider Infrastructure

This file tracks infrastructure setup for PageStrider.

## Current State

- Vercel project: created and linked.
- Vercel scope: `egorka-dinos-projects`.
- Vercel project name: `page-strider`.
- Vercel framework preset: `Other` until the app is scaffolded.
- GitHub repository: connected by Vercel CLI.
- Supabase local config: initialized.
- Supabase CLI: authenticated.
- Supabase remote projects: Production and Dev are separate.
- Supabase Phase 2 schema migration: applied to Production and Dev.
- Supabase Production project name: `Page Strider`.
- Supabase Production project ref: `mszcmtqkfanijrypcwvd`.
- Supabase Dev project name: `Page Strider Dev`.
- Supabase Dev project ref: `uouwajdcdwgbitaivnfv`.
- Supabase region: `eu-west-1`.
- Vercel env vars: Production points to the Production Supabase project; Preview and Development point to the Dev Supabase project.
- Direct Postgres connection string: not needed for the current Supabase-first MVP setup.

## Vercel

The local workspace is linked to the Vercel project via `.vercel/project.json`. The `.vercel` directory is ignored and should not be committed.

Useful commands:

```bash
npx vercel@latest whoami
npx vercel@latest project inspect page-strider --scope egorka-dinos-projects
npx vercel@latest env ls
npx vercel@latest env pull .env.local --yes
```

By default, `vercel env pull .env.local --yes` pulls the Development environment. For PageStrider, that should point to the Dev Supabase project, not Production.

## Supabase

Supabase remains the recommended MVP database choice. Phase 1 added only repository contracts; later phases should add the Supabase implementation behind those contracts instead of calling Supabase directly from UI components.
Phase 2 added the first application schema and a Supabase-backed data-access implementation for settings, the reader profile, books, and reading entries.

Supabase CLI was initialized with:

```bash
npx supabase@latest init
```

The local Supabase configuration lives in:

```text
supabase/config.toml
```

Supabase CLI authentication was completed with:

```bash
npx supabase@latest login
```

The local project is linked to the Dev Supabase project so local migration work targets the safer database by default:

```bash
npx supabase@latest link --project-ref uouwajdcdwgbitaivnfv
```

The Production Supabase project remains `mszcmtqkfanijrypcwvd`. Be explicit before running remote migration commands against Production.

The linked project metadata lives under `supabase/.temp/`, which is ignored by `supabase/.gitignore`.

## Expected Environment Variables

The initial env template is `.env.example`.

Required Supabase-related keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional later:

- `DATABASE_URL`, only if the app adds direct server-side SQL or an ORM.

Current Vercel status:

- `NEXT_PUBLIC_SUPABASE_URL`: Production uses `mszcmtqkfanijrypcwvd`; Preview and Development use `uouwajdcdwgbitaivnfv`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Production uses the Production Supabase key; Preview and Development use the Dev Supabase key.
- `SUPABASE_SERVICE_ROLE_KEY`: Production uses the Production Supabase key; Preview and Development use the Dev Supabase key.
- `DATABASE_URL`: not added because the MVP can use Supabase client APIs without a direct Postgres connection string.

Do not commit real secret values.

## Environment Separation

- Use Production for the real reading journal.
- Use Preview and Development for testing against the Dev database.
- Keep local `.env.local` pulled from Vercel Development unless intentionally testing Production.
- When adding future migrations, apply and verify them on Dev first, then apply them to Production intentionally.

## Remaining Setup

1. Add `DATABASE_URL` only if a future phase introduces direct server-side SQL or an ORM.
2. If `DATABASE_URL` is added later, use the Supabase dashboard database password or connection string and do not commit it.

## Notes

- Keep database access behind the PageStrider data-access layer.
- Do not use `localStorage` as primary MVP persistence.
- Do not add authentication until explicitly requested.
- Do not implement app features as part of infrastructure setup.

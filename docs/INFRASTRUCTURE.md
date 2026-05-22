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
- Supabase remote project: linked.
- Supabase project name: `Page Strider`.
- Supabase project ref: `mszcmtqkfanijrypcwvd`.
- Supabase region: `eu-west-1`.
- Vercel env vars: Supabase URL, anon key, and service role key added for Production, Preview, and Development.
- Database connection string: pending.

## Vercel

The local workspace is linked to the Vercel project via `.vercel/project.json`. The `.vercel` directory is ignored and should not be committed.

Useful commands:

```bash
npx vercel@latest whoami
npx vercel@latest project inspect page-strider --scope egorka-dinos-projects
npx vercel@latest env ls
npx vercel@latest env pull .env.local --yes
```

## Supabase

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

The local project was linked to the remote Supabase project:

```bash
npx supabase@latest link --project-ref mszcmtqkfanijrypcwvd
```

The linked project metadata lives under `supabase/.temp/`, which is ignored by `supabase/.gitignore`.

## Expected Environment Variables

The initial env template is `.env.example`.

Required Supabase-related keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Current Vercel status:

- `NEXT_PUBLIC_SUPABASE_URL`: added to Production, Preview, and Development.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: added to Production, Preview, and Development.
- `SUPABASE_SERVICE_ROLE_KEY`: added to Production, Preview, and Development.
- `DATABASE_URL`: not added yet.

Do not commit real secret values.

## Remaining Setup

1. Decide how the app will connect to Postgres:
   - use Supabase client APIs first, or
   - add a server-side Postgres connection string when an ORM/direct SQL layer is introduced.
2. Add `DATABASE_URL` to Vercel and `.env.local` only when the connection strategy is chosen.

## Notes

- Keep database access behind the PageStrider data-access layer.
- Do not use `localStorage` as primary MVP persistence.
- Do not add authentication until explicitly requested.
- Do not implement app features as part of infrastructure setup.

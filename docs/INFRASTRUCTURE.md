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

Optional later:

- `DATABASE_URL`, only if the app adds direct server-side SQL or an ORM.

Current Vercel status:

- `NEXT_PUBLIC_SUPABASE_URL`: added to Production, Preview, and Development.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: added to Production, Preview, and Development.
- `SUPABASE_SERVICE_ROLE_KEY`: added to Production, Preview, and Development.
- `DATABASE_URL`: not added because the MVP can use Supabase client APIs without a direct Postgres connection string.

Do not commit real secret values.

## Remaining Setup

1. Use Supabase client APIs for the first MVP data-access layer.
2. Add `DATABASE_URL` only if a future phase introduces direct server-side SQL or an ORM.
3. If `DATABASE_URL` is added later, use the Supabase dashboard database password or connection string and do not commit it.

## Notes

- Keep database access behind the PageStrider data-access layer.
- Do not use `localStorage` as primary MVP persistence.
- Do not add authentication until explicitly requested.
- Do not implement app features as part of infrastructure setup.

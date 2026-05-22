# PageStrider Infrastructure

This file tracks infrastructure setup for PageStrider.

## Current State

- Vercel project: created and linked.
- Vercel scope: `egorka-dinos-projects`.
- Vercel project name: `page-strider`.
- Vercel framework preset: `Other` until the app is scaffolded.
- GitHub repository: connected by Vercel CLI.
- Supabase local config: initialized.
- Supabase remote project: not created yet because Supabase CLI is not authenticated.

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

Remote Supabase project creation still requires authentication. Use one of these options:

```bash
npx supabase@latest login
```

or set:

```bash
SUPABASE_ACCESS_TOKEN
```

After authentication, create or link the remote project, then add the resulting environment variables to Vercel and pull them locally.

## Expected Environment Variables

The initial env template is `.env.example`.

Required Supabase-related keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Do not commit real secret values.

## Notes

- Keep database access behind the PageStrider data-access layer.
- Do not use `localStorage` as primary MVP persistence.
- Do not add authentication until explicitly requested.
- Do not implement app features as part of infrastructure setup.

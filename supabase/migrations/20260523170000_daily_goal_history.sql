create table if not exists public.daily_goals (
  id uuid primary key default gen_random_uuid(),
  pages_per_day integer not null check (pages_per_day > 0),
  effective_from date not null unique,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.daily_goals (pages_per_day, effective_from, note)
select daily_goal_pages, date '0001-01-01', null
from public.settings
where id = true
on conflict (effective_from) do nothing;

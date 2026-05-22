create table if not exists public.settings (
  id boolean primary key default true,
  daily_goal_pages integer not null check (daily_goal_pages > 0),
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id)
);

insert into public.settings (id, daily_goal_pages)
values (true, 17)
on conflict (id) do nothing;

create table if not exists public.reader_profiles (
  id boolean primary key default true,
  name text not null default 'Reader',
  updated_at timestamptz not null default now(),
  constraint reader_profiles_singleton check (id)
);

insert into public.reader_profiles (id, name)
values (true, 'Reader')
on conflict (id) do nothing;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  author text not null default '',
  total_pages integer not null check (total_pages > 0),
  start_page integer not null check (start_page > 0),
  current_page integer not null check (current_page > 0),
  status text not null check (status in ('reading', 'finished', 'paused')),
  started_date date not null,
  finished_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_page <= total_pages),
  check (current_page <= total_pages),
  check (current_page >= start_page)
);

create unique index if not exists one_active_reading_book
on public.books ((status))
where status = 'reading';

create table if not exists public.reading_entries (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  book_id uuid not null references public.books(id) on delete restrict,
  book_title text not null,
  start_page integer not null check (start_page > 0),
  end_page integer not null check (end_page >= start_page),
  pages_read integer not null check (pages_read > 0),
  daily_goal_pages integer not null check (daily_goal_pages > 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

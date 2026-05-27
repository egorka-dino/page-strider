alter table public.reading_entries
  alter column start_page drop not null,
  alter column end_page drop not null;

alter table public.reading_entries
  drop constraint if exists reading_entries_end_page_check;

alter table public.reading_entries
  add constraint reading_entries_bookmark_range_check
  check (
    start_page is null
    or end_page is null
    or end_page >= start_page
  );

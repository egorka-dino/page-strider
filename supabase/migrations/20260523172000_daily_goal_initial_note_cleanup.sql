update public.daily_goals
set note = null,
    updated_at = now()
where effective_from = date '0001-01-01'
  and note is not null;

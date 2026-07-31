alter table public.training_workouts
  drop constraint if exists training_workouts_source_check;

alter table public.training_workouts
  add constraint training_workouts_source_check
  check (source in ('plan', 'manual', 'strava', 'runna'));

alter table public.training_workouts
  add column if not exists external_uid text,
  add column if not exists matched_strava_activity_id bigint,
  add column if not exists planned_duration_minutes integer,
  add column if not exists planned_distance_km numeric(8, 2);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'training_workouts_owner_runna_uid_key'
  ) then
    alter table public.training_workouts
      add constraint training_workouts_owner_runna_uid_key unique (owner_id, external_uid);
  end if;
end
$$;

create unique index if not exists training_workouts_owner_matched_strava_idx
  on public.training_workouts (owner_id, matched_strava_activity_id)
  where matched_strava_activity_id is not null;

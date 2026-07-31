create extension if not exists pgcrypto;

create table if not exists public.training_workouts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null,
  title text not null,
  sport text not null check (sport in ('run', 'bike', 'swim', 'strength', 'recovery')),
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  distance_km numeric(8, 2),
  completed boolean not null default false,
  source text not null default 'manual' check (source in ('plan', 'manual', 'strava')),
  notes text,
  strava_activity_id bigint,
  created_at timestamptz not null default now(),
  unique (owner_id, strava_activity_id)
);

create table if not exists public.strength_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  performed_on date not null,
  exercise text not null,
  weight_kg numeric(7, 2) not null check (weight_kg >= 0),
  reps integer not null check (reps > 0),
  sets integer not null check (sets > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.strava_connections (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  athlete_id bigint not null,
  access_token text not null,
  refresh_token text not null,
  expires_at bigint not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.strava_oauth_states (
  state text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  return_url text not null,
  expires_at timestamptz not null default (now() + interval '10 minutes')
);

alter table public.training_workouts enable row level security;
alter table public.strength_entries enable row level security;
alter table public.strava_connections enable row level security;
alter table public.strava_oauth_states enable row level security;

create policy "Owners manage their workouts"
  on public.training_workouts
  for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners manage their strength entries"
  on public.strength_entries
  for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Strava tokens and OAuth states intentionally have no client policies.
-- They are accessed only by Edge Functions using the service-role key.

create index if not exists training_workouts_owner_date_idx
  on public.training_workouts (owner_id, workout_date);

create index if not exists strength_entries_owner_date_idx
  on public.strength_entries (owner_id, performed_on);

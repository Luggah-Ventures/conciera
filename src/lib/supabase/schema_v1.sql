-- Optional, but safe:
create extension if not exists "pgcrypto";

-- PROFILES (linked to auth.users)
create table if not exists profiles (
  id uuid primary key default auth.uid(),
  email text unique,
  full_name text,
  created_at timestamptz default now()
);

-- MOVES (one per move; v1 can just use the latest)
create table if not exists moves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  current_address text not null,
  new_address text not null,
  move_date date not null,
  adults int default 1,
  children int default 0,
  pets int default 0,
  vehicle_owned boolean default false,
  driving_licence_no text,
  preferences jsonb default '{}'::jsonb, -- { greenEnergy: true, fibrePreferred: true, budgetRange: "££" }
  created_at timestamptz default now()
);

-- INSTITUTIONS registry (what we generate tasks from)
create table if not exists institutions (
  id text primary key,                -- e.g., "dvla-licence"
  title text not null,
  category text not null,             -- "gov", "finance", "utility", "health"
  link text,                          -- landing/deep link
  notes text,                         -- helper copy
  template text,                      -- message/email template with {{placeholders}}
  required_fields text[] default '{}' -- e.g., {full_name,new_address,move_date}
);

-- TASKS created for a move + institution
do $$ begin
  create type task_status as enum ('not_started','in_progress','done');
exception when duplicate_object then null; end $$;

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  move_id uuid references moves(id) on delete cascade,
  institution_id text references institutions(id) on delete set null,
  slug text not null,                  -- e.g., "dvla-licence"
  title text not null,
  description text,
  due_date date,
  status task_status default 'not_started',
  link text,
  generated_template text,
  created_at timestamptz default now()
);

-- Extra fields for clubs/societies
alter table moves add column if not exists new_postcode text;
alter table moves add column if not exists clubs_prefs jsonb default '{}'::jsonb;

-- RLS
alter table profiles enable row level security;
alter table moves enable row level security;
alter table tasks enable row level security;

create policy "profiles self" on profiles
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "moves by owner" on moves
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "tasks by owner via move" on tasks
  using (exists (select 1 from moves m where m.id = move_id and m.user_id = auth.uid()))
  with check (exists (select 1 from moves m where m.id = move_id and m.user_id = auth.uid()));

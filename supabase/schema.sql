-- BSS Flow Academy — database schema
-- Matches docs/database.md. Run this in the Supabase SQL editor
-- (or via `supabase db push` once you have the CLI linked).

create extension if not exists "pgcrypto";

-- Not explicitly listed in docs/database.md, but implied by the
-- `cohort_id` fields on registrations/enrollments and the "Cohort 1
-- sponsored code" requirement in docs/mvp-scope.md. Holds sponsor
-- codes so the server (never the client) can validate them.
create table if not exists cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sponsor_code text unique,
  is_active boolean not null default true,
  price integer not null default 80000,
  created_at timestamptz not null default now()
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  experience_level text not null check (experience_level in ('beginner', 'intermediate', 'advanced')),
  learning_goal text,
  cohort_id uuid references cohorts(id),
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id),
  reference text not null unique,
  amount integer not null,
  currency text not null default 'NGN',
  status text not null check (status in ('pending', 'success', 'failed')),
  provider text not null default 'paystack',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id),
  cohort_id uuid not null references cohorts(id),
  status text not null default 'active' check (status in ('active', 'revoked')),
  access_type text not null check (access_type in ('paid', 'sponsored')),
  access_granted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists payments_registration_id_idx on payments(registration_id);
create index if not exists enrollments_registration_id_idx on enrollments(registration_id);

-- Seed Cohort 1 with no sponsor code, so sponsored enrollment stays
-- disabled until a real code is set. Never commit a real code here —
-- set it directly in the Supabase SQL editor:
--
--   update cohorts set sponsor_code = '<your-secret-code>' where name = 'Cohort 1';
insert into cohorts (name, sponsor_code, is_active, price)
values ('Cohort 1', null, true, 80000)
on conflict do nothing;

-- Row Level Security: all writes happen through API routes using the
-- Supabase service role key, which bypasses RLS. Enabling RLS here
-- with no policies blocks any direct anon/browser access to these
-- tables, which is what we want for V1.
alter table cohorts enable row level security;
alter table registrations enable row level security;
alter table payments enable row level security;
alter table enrollments enable row level security;

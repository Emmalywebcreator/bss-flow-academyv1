-- Rate limiting for sponsor code checks, so codes can't be brute-forced.
-- Attempts are stored in Postgres rather than in memory because the app
-- may run as several serverless instances that don't share memory.

create table if not exists cohort_code_attempts (
  id bigint generated always as identity primary key,
  ip text not null,
  registration_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists cohort_code_attempts_ip_idx
  on cohort_code_attempts (ip, created_at);
create index if not exists cohort_code_attempts_registration_idx
  on cohort_code_attempts (registration_id, created_at);
create index if not exists cohort_code_attempts_created_at_idx
  on cohort_code_attempts (created_at);

alter table cohort_code_attempts enable row level security;

-- Records an attempt and returns whether it is within the limits:
-- 10 per IP and 5 per registration in any 15-minute window. Attempts
-- older than a day are pruned as it goes.
create or replace function record_cohort_code_attempt(p_ip text, p_registration_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  window_start timestamptz := now() - interval '15 minutes';
  ip_attempts int;
  registration_attempts int;
begin
  delete from cohort_code_attempts where created_at < now() - interval '1 day';

  insert into cohort_code_attempts (ip, registration_id)
  values (p_ip, p_registration_id);

  select count(*) into ip_attempts
  from cohort_code_attempts
  where ip = p_ip and created_at >= window_start;

  select count(*) into registration_attempts
  from cohort_code_attempts
  where registration_id = p_registration_id and created_at >= window_start;

  return ip_attempts <= 10 and registration_attempts <= 5;
end;
$$;

-- PostgREST exposes functions to anon/authenticated by default; only the
-- server (service role) may call this.
revoke execute on function record_cohort_code_attempt(text, uuid) from public, anon, authenticated;
grant execute on function record_cohort_code_attempt(text, uuid) to service_role;

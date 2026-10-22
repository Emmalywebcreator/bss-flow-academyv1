-- Email login for enrolled students: a 6-digit code is emailed to the
-- address they registered with, and entering it sets the enrollment
-- cookie on that device. Only the SHA-256 hash of a code is stored.

create table if not exists login_codes (
  id bigint generated always as identity primary key,
  registration_id uuid not null references registrations(id),
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists login_codes_registration_idx
  on login_codes (registration_id, created_at);

-- Code requests and code checks, for rate limiting. Stored in Postgres
-- for the same reason as cohort_code_attempts: serverless instances
-- don't share memory.
create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('request', 'verify')),
  ip text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists login_attempts_ip_idx on login_attempts (kind, ip, created_at);
create index if not exists login_attempts_email_idx on login_attempts (kind, email, created_at);
create index if not exists login_attempts_created_at_idx on login_attempts (created_at);

alter table login_codes enable row level security;
alter table login_attempts enable row level security;

-- Issues a login code for an enrolled email. Limits: 3 requests per
-- email and 10 per IP in any 15-minute window. A new code replaces any
-- earlier unused one, and lasts 10 minutes. Returns
-- {result: 'rate_limited' | 'not_enrolled' | 'created', full_name?}.
create or replace function create_login_code(p_email text, p_ip text, p_code_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  window_start timestamptz := now() - interval '15 minutes';
  v_email text := lower(trim(p_email));
  ip_requests int;
  email_requests int;
  v_registration registrations%rowtype;
begin
  delete from login_attempts where created_at < now() - interval '1 day';
  delete from login_codes where created_at < now() - interval '1 day';

  insert into login_attempts (kind, ip, email) values ('request', p_ip, v_email);

  select count(*) into ip_requests from login_attempts
  where kind = 'request' and ip = p_ip and created_at >= window_start;
  select count(*) into email_requests from login_attempts
  where kind = 'request' and email = v_email and created_at >= window_start;

  if ip_requests > 10 or email_requests > 3 then
    return jsonb_build_object('result', 'rate_limited');
  end if;

  select r.* into v_registration
  from registrations r
  join enrollments e on e.registration_id = r.id and e.status = 'active'
  where r.email = v_email
  order by e.access_granted_at
  limit 1;

  if not found then
    return jsonb_build_object('result', 'not_enrolled');
  end if;

  update login_codes set used_at = now()
  where registration_id = v_registration.id and used_at is null;

  insert into login_codes (registration_id, code_hash, expires_at)
  values (v_registration.id, p_code_hash, now() + interval '10 minutes');

  return jsonb_build_object('result', 'created', 'full_name', v_registration.full_name);
end;
$$;

-- Checks a login code. Limits: 20 checks per IP in 15 minutes, and 5
-- wrong tries per code, after which the code stops working. A correct
-- code is used up, and only logs in a still-active enrollment. Returns
-- {result: 'rate_limited' | 'invalid' | 'locked' | 'ok', registration_id?}.
create or replace function verify_login_code(p_email text, p_ip text, p_code_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  ip_checks int;
  v_code login_codes%rowtype;
begin
  insert into login_attempts (kind, ip, email) values ('verify', p_ip, v_email);

  select count(*) into ip_checks from login_attempts
  where kind = 'verify' and ip = p_ip and created_at >= now() - interval '15 minutes';

  if ip_checks > 20 then
    return jsonb_build_object('result', 'rate_limited');
  end if;

  -- The latest unused, unexpired code for this email, locked so two
  -- concurrent checks can't both use it or both escape the try limit.
  select c.* into v_code
  from login_codes c
  join registrations r on r.id = c.registration_id
  where r.email = v_email and c.used_at is null and c.expires_at > now()
  order by c.created_at desc
  limit 1
  for update of c;

  if not found then
    return jsonb_build_object('result', 'invalid');
  end if;

  if v_code.attempts >= 5 then
    return jsonb_build_object('result', 'locked');
  end if;

  if v_code.code_hash <> p_code_hash then
    update login_codes set attempts = attempts + 1 where id = v_code.id;
    return jsonb_build_object(
      'result', case when v_code.attempts + 1 >= 5 then 'locked' else 'invalid' end
    );
  end if;

  update login_codes set used_at = now() where id = v_code.id;

  if not exists (
    select 1 from enrollments
    where registration_id = v_code.registration_id and status = 'active'
  ) then
    return jsonb_build_object('result', 'invalid');
  end if;

  return jsonb_build_object('result', 'ok', 'registration_id', v_code.registration_id);
end;
$$;

-- Only the server (service role) may call these.
revoke execute on function create_login_code(text, text, text) from public, anon, authenticated;
revoke execute on function verify_login_code(text, text, text) from public, anon, authenticated;
grant execute on function create_login_code(text, text, text) to service_role;
grant execute on function verify_login_code(text, text, text) to service_role;

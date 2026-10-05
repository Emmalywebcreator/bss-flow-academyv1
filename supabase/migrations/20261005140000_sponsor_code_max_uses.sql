-- Cap how many students can enroll with a cohort's sponsor code, so a
-- leaked code can't enroll an unlimited number of people.

-- Defaults to 0: sponsored enrollment stays off for a cohort until a
-- number of sponsored places is set explicitly.
alter table cohorts
  add column if not exists sponsor_max_uses integer not null default 0
  check (sponsor_max_uses >= 0);

update cohorts set sponsor_max_uses = 40 where name = 'Cohort 1';

-- Validates a sponsor code and enrolls the registration if a sponsored
-- place is left. Locks the cohort row so concurrent requests can't take
-- more places than sponsor_max_uses. Re-submitting a code when already
-- enrolled in the cohort succeeds without using another place. Revoked
-- enrollments free their place.
--
-- Returns {"result": "invalid"}, {"result": "full"}, or
-- {"result": "enrolled", "cohort_name": "..."}.
create or replace function enroll_with_sponsor_code(p_registration_id uuid, p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cohort record;
  places_used int;
begin
  select id, name, sponsor_max_uses into cohort
  from cohorts
  where sponsor_code = p_code and is_active
  for update;

  if not found then
    return jsonb_build_object('result', 'invalid');
  end if;

  if exists (
    select 1 from enrollments
    where registration_id = p_registration_id and cohort_id = cohort.id
  ) then
    return jsonb_build_object('result', 'enrolled', 'cohort_name', cohort.name);
  end if;

  select count(*) into places_used
  from enrollments
  where cohort_id = cohort.id and access_type = 'sponsored' and status = 'active';

  if places_used >= cohort.sponsor_max_uses then
    return jsonb_build_object('result', 'full');
  end if;

  insert into enrollments (registration_id, cohort_id, access_type)
  values (p_registration_id, cohort.id, 'sponsored')
  on conflict (registration_id, cohort_id) do nothing;

  return jsonb_build_object('result', 'enrolled', 'cohort_name', cohort.name);
end;
$$;

revoke execute on function enroll_with_sponsor_code(uuid, text) from public, anon, authenticated;
grant execute on function enroll_with_sponsor_code(uuid, text) to service_role;

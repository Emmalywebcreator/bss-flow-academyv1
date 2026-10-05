-- Cohort names must be unique: the app looks cohorts up by name (e.g.
-- "Cohort 1" in payment verification), and a second row with the same
-- name makes that lookup fail for every paid student. This also makes
-- the seed's `on conflict do nothing` take effect.

-- Duplicates may already have enrollments pointing at them, so choosing
-- which row to keep is left to a person rather than done here.
do $$
begin
  if exists (select 1 from cohorts group by name having count(*) > 1) then
    raise exception
      'Duplicate cohort names exist (%). Merge or rename them before applying this migration.',
      (select string_agg(distinct name, ', ')
       from cohorts
       where name in (select name from cohorts group by name having count(*) > 1));
  end if;
end;
$$;

alter table cohorts add constraint cohorts_name_key unique (name);

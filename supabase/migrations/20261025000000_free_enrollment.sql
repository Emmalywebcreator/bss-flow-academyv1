-- Learning is free for now (decided 2026-10-25): registering enrolls
-- the learner straight away with a 'free' enrollment. Sponsor codes are
-- retired, so their function, rate-limit log and columns go. Existing
-- 'sponsored' and 'paid' enrollments are kept as they are.

alter table enrollments drop constraint if exists enrollments_access_type_check;
alter table enrollments
  add constraint enrollments_access_type_check
  check (access_type in ('paid', 'sponsored', 'free'));

drop function if exists enroll_with_sponsor_code(uuid, text);
drop function if exists record_cohort_code_attempt(text, uuid);
drop table if exists cohort_code_attempts;

alter table cohorts drop column if exists sponsor_code;
alter table cohorts drop column if exists sponsor_max_uses;

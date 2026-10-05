-- One enrollment per registration per cohort. Without this, a refreshed
-- payment callback, concurrent verifies, or a resubmitted sponsor code
-- each created another enrollment row.

-- Keep the earliest enrollment if duplicates already exist, so the
-- constraint can be added.
delete from enrollments e
using enrollments earlier
where e.registration_id = earlier.registration_id
  and e.cohort_id = earlier.cohort_id
  and (e.created_at, e.id) > (earlier.created_at, earlier.id);

alter table enrollments
  add constraint enrollments_registration_cohort_key unique (registration_id, cohort_id);

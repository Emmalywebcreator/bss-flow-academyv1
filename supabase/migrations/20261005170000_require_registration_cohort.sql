-- Every registration records the cohort it was made for (see
-- docs/database.md), so registrants who never enroll can still be
-- followed up per cohort. Until now the column was never filled in.

-- Existing registrations were all for Cohort 1, the only cohort so far.
update registrations
set cohort_id = (select id from cohorts where name = 'Cohort 1')
where cohort_id is null;

alter table registrations alter column cohort_id set not null;

-- Registrations are matched by email so a returning registrant reuses
-- their registration instead of creating a duplicate (and can't pay
-- twice). The app now stores emails lowercased; bring existing rows in
-- line so the match is case-insensitive.
update registrations set email = lower(email) where email <> lower(email);

create index if not exists registrations_cohort_email_idx on registrations (cohort_id, email);

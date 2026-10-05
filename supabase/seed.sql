-- Local development data only. Applied by `supabase start` and
-- `supabase db reset`; never applied by `supabase db push`, so nothing
-- here reaches a hosted project.

-- Lets you test sponsored enrollment locally with the code `local-dev-code`.
update cohorts set sponsor_code = 'local-dev-code' where name = 'Cohort 1';

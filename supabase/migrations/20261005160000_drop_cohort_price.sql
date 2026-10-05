-- The enrollment fee lives in one place: PROGRAM.standardPrice in
-- constants/program.ts, which sets both the amount charged and the
-- price shown on the site. cohorts.price was never read, so changing it
-- would have silently done nothing. Each payment row still records the
-- amount actually charged.
alter table cohorts drop column if exists price;

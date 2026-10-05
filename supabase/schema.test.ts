import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const schema = readFileSync(
  join(__dirname, "migrations", "20261005000000_initial_schema.sql"),
  "utf8"
);

test("a registration can only be enrolled once per cohort", () => {
  const migration = readFileSync(
    join(__dirname, "migrations", "20261005120000_unique_enrollment_per_cohort.sql"),
    "utf8"
  );

  expect(migration).toMatch(/unique\s*\(\s*registration_id\s*,\s*cohort_id\s*\)/i);
});

test("cohort names are unique, so lookups by name find one cohort", () => {
  const migration = readFileSync(
    join(__dirname, "migrations", "20261005150000_unique_cohort_name.sql"),
    "utf8"
  );

  expect(migration).toMatch(/alter table cohorts add constraint \w+ unique\s*\(\s*name\s*\)/i);
});

test("cohort seed does not ship a usable sponsor code", () => {
  const seed = schema.match(/insert into cohorts[\s\S]*?;/i)?.[0];

  expect(seed).toBeDefined();
  expect(seed).toMatch(/values\s*\(\s*'Cohort 1'\s*,\s*null\s*,/i);
});

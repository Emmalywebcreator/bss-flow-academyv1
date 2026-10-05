import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");

test("cohort seed does not ship a usable sponsor code", () => {
  const seed = schema.match(/insert into cohorts[\s\S]*?;/i)?.[0];

  expect(seed).toBeDefined();
  expect(seed).toMatch(/values\s*\(\s*'Cohort 1'\s*,\s*null\s*,/i);
});

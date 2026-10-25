import { expect, test } from "vitest";
import { safeReturnTo, withReturnTo } from "./return-to";

test("only learning pages on this site are accepted as a return path", () => {
  expect(safeReturnTo("/learn")).toBe("/learn");
  expect(safeReturnTo("/learn/foundations/html5-structuring-websites/hyperlinks")).toBe(
    "/learn/foundations/html5-structuring-websites/hyperlinks"
  );
  for (const bad of [
    null,
    "",
    "https://evil.example/learn",
    "//evil.example/learn",
    "/learn/../register",
    "/learnmore",
    "/terms",
    "/learn/x?y=1",
  ]) {
    expect(safeReturnTo(bad)).toBeNull();
  }
});

test("withReturnTo adds next only for a safe path", () => {
  expect(withReturnTo("/register", "/learn/foundations")).toBe("/register?next=%2Flearn%2Ffoundations");
  expect(withReturnTo("/login", "https://evil.example")).toBe("/login");
  expect(withReturnTo("/login", null)).toBe("/login");
});

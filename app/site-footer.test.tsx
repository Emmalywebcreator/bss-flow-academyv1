// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import { PROGRAM } from "@/constants/program";

afterEach(cleanup);

test("footer links to every policy page and shows the contact details", () => {
  render(<SiteFooter />);

  expect(screen.getByRole("link", { name: "Terms and Conditions" }).getAttribute("href")).toBe(
    "/terms"
  );
  expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe(
    "/privacy"
  );
  expect(screen.getByRole("link", { name: "Refund Policy" }).getAttribute("href")).toBe(
    "/refund-policy"
  );
  expect(screen.getByRole("link", { name: PROGRAM.supportEmail }).getAttribute("href")).toBe(
    `mailto:${PROGRAM.supportEmail}`
  );
  expect(screen.getByRole("link", { name: PROGRAM.supportPhone }).getAttribute("href")).toBe(
    "tel:+2347039301841"
  );
  expect(screen.getByText(new RegExp(PROGRAM.operator))).toBeDefined();
});

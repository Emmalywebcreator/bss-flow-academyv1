// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TermsPage from "./terms/page";
import PrivacyPage from "./privacy/page";
import RefundPolicyPage from "./refund-policy/page";
import { PROGRAM } from "@/constants/program";

afterEach(cleanup);

test.each([
  ["Terms and Conditions", TermsPage],
  ["Privacy Policy", PrivacyPage],
  ["Refund Policy", RefundPolicyPage],
])("%s page names the operator and gives the support email", (title, Page) => {
  render(<Page />);

  expect(screen.getByRole("heading", { level: 1, name: title })).toBeDefined();
  expect(screen.getAllByText(new RegExp(PROGRAM.operator)).length).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: PROGRAM.supportEmail }).getAttribute("href")).toBe(
    `mailto:${PROGRAM.supportEmail}`
  );
});

test("refund policy states the full, partial and no-refund windows", () => {
  render(<RefundPolicyPage />);

  expect(screen.getByText(/a full refund, if you ask by the day before/)).toBeDefined();
  expect(screen.getByText(/a 50% refund, if you ask within the first 7 days/)).toBeDefined();
  expect(screen.getByText(/no refund\./)).toBeDefined();
});

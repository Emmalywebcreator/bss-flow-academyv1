// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import TermsPage, { metadata as termsMetadata } from "./terms/page";
import PrivacyPage, { metadata as privacyMetadata } from "./privacy/page";
import RefundPolicyPage, { metadata as refundMetadata } from "./refund-policy/page";
import { metadata as registerMetadata } from "./register/layout";
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

test("refund policy says learning is free and states the refund windows for any fee", () => {
  render(<RefundPolicyPage />);

  expect(screen.getByText(/is currently free, so there is\s+nothing to pay/)).toBeDefined();
  expect(screen.getByText("Within 7 days of paying:").parentElement!.textContent).toMatch(/a full refund/);
  expect(screen.getByText("From day 8 to day 14:").parentElement!.textContent).toMatch(/a 50% refund/);
  expect(screen.getByText("After 14 days:").parentElement!.textContent).toMatch(/no refund/);
});

test.each([
  ["Terms and Conditions", TermsPage],
  ["Privacy Policy", PrivacyPage],
  ["Refund Policy", RefundPolicyPage],
])("%s page no longer mentions cohorts, sponsor codes or a set fee", (_, Page) => {
  const { container } = render(<Page />);

  expect(container.textContent).not.toMatch(/cohort|sponsor code/i);
  expect(container.textContent).not.toContain(`₦${PROGRAM.standardPrice.toLocaleString()}`);
});

test("each page has its own meta description", () => {
  const descriptions = [
    registerMetadata,
    termsMetadata,
    privacyMetadata,
    refundMetadata,
  ].map((metadata) => metadata.description);

  expect(descriptions.every(Boolean)).toBe(true);
  expect(new Set(descriptions).size).toBe(descriptions.length);
});

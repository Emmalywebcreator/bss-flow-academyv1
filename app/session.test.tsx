// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { SessionProvider } from "./session";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { FeaturedLearning } from "./_home/featured-learning";
import Html5Lesson from "./learn/foundations/html5-structuring-websites/page";
import Html5Part from "./learn/foundations/html5-structuring-websites/[part]/page";

// Lessons are for enrolled learners; these tests render them as one.
vi.mock("@/lib/enrollment-access", () => ({ requireEnrollment: vi.fn() }));

afterEach(cleanup);

function renderAs(signedIn: boolean, ui: ReactElement) {
  return render(<SessionProvider signedIn={signedIn}>{ui}</SessionProvider>);
}

test("signed-out visitors see Log in and Register in the header and menu", () => {
  renderAs(false, <SiteHeader />);

  expect(screen.getByRole("link", { name: "Log in" }).getAttribute("href")).toBe("/login");
  expect(screen.getByRole("link", { name: "Register" }).getAttribute("href")).toBe("/register");
  expect(screen.queryByRole("link", { name: "My learning" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(within(document.getElementById("mobile-nav")!).getByRole("link", { name: "Log in" })).toBeDefined();
});

test("signed-in learners see My learning instead, in the header and menu", () => {
  renderAs(true, <SiteHeader />);

  expect(screen.getByRole("link", { name: "My learning" }).getAttribute("href")).toBe("/learn");
  expect(screen.queryByRole("link", { name: "Log in" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  expect(within(document.getElementById("mobile-nav")!).queryByRole("link", { name: "Log in" })).toBeNull();
});

test("the footer swaps Register and Log in for My learning once signed in", () => {
  renderAs(true, <SiteFooter />);

  expect(screen.getByRole("link", { name: "My learning" }).getAttribute("href")).toBe("/learn");
  expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Log in" })).toBeNull();
});

test("the homepage card invites signed-out visitors to register, and sends learners to /learn", () => {
  renderAs(false, <FeaturedLearning />);
  expect(screen.getByRole("link", { name: "Register for free" }).getAttribute("href")).toBe("/register");
  cleanup();

  renderAs(true, <FeaturedLearning />);
  expect(screen.queryByRole("link", { name: "Register for free" })).toBeNull();
  expect(screen.getByRole("link", { name: "Go to my learning" }).getAttribute("href")).toBe("/learn");
});

test("the homepage sends signed-out visitors to register before a lesson, and learners straight in", () => {
  renderAs(false, <FeaturedLearning />);
  expect(screen.getByRole("link", { name: "Start lesson 2" }).getAttribute("href")).toBe(
    "/register?next=%2Flearn%2Ffoundations%2Fhtml5-structuring-websites"
  );
  cleanup();

  renderAs(true, <FeaturedLearning />);
  expect(screen.getByRole("link", { name: "Start lesson 2" }).getAttribute("href")).toBe(
    "/learn/foundations/html5-structuring-websites"
  );
});

test("lesson pages, now only for learners, have no register card", async () => {
  renderAs(true, await Html5Lesson());
  expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
  cleanup();

  renderAs(true, await Html5Part({ params: Promise.resolve({ part: "final-project" }) }));
  expect(screen.queryByRole("link", { name: "Register" })).toBeNull();
});

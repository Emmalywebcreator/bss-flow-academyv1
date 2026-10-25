// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import Home from "./page";
import { PROGRAM } from "@/constants/program";
import { LEARNING_AREAS, LESSONS } from "@/constants/learning";
import { NAV_LINKS } from "@/app/nav-links";

afterEach(cleanup);

test("landing page has a headline and links to registration", () => {
  render(<Home />);

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Learn tech by building real things."
  );
  expect(screen.getByRole("link", { name: "Register for free" }).getAttribute("href")).toBe(
    "/register"
  );
});

test("landing page is self-paced, with no cohort or Telegram link", () => {
  const { container } = render(<Home />);

  expect(screen.getByText("Self-paced learning")).toBeDefined();
  expect(container.textContent).not.toMatch(/cohort|sponsor/i);
  expect(container.textContent).not.toContain(PROGRAM.topic);
  expect(container.querySelector('a[href*="t.me"]')).toBeNull();
  // Learning is free for now, so no price is shown.
  expect(container.textContent).not.toContain("₦");
});

test("every in-page navigation link has a matching section", () => {
  const { container } = render(<Home />);

  for (const { href } of NAV_LINKS) {
    const [, hash] = href.split("#");
    if (hash) expect(container.querySelector(`#${hash}`)).not.toBeNull();
  }
  for (const name of ["Explore learning", `About ${PROGRAM.name}`]) {
    const hash = screen.getByRole("link", { name }).getAttribute("href")!.slice(1);
    expect(container.querySelector(`#${hash}`)).not.toBeNull();
  }
});

test("learning areas are labelled planned and not linked", () => {
  render(<Home />);

  for (const area of LEARNING_AREAS) {
    const card = screen.getByRole("heading", { level: 3, name: area.title }).closest("article")!;
    expect(within(card).getByText(area.status === "open" ? "Open now" : "Planned")).toBeDefined();
    expect(within(card).queryByRole("link")).toBeNull();
  }
});

test("published lessons send signed-out visitors to register first; coming-soon lessons aren't linked", () => {
  render(<Home />);

  for (const lesson of LESSONS) {
    const card = screen.getByRole("heading", { level: 3, name: lesson.title }).closest("article")!;
    if (lesson.status === "published") {
      expect(within(card).getByRole("link", { name: `Start lesson ${lesson.number}` }).getAttribute("href")).toBe(
        `/register?next=${encodeURIComponent(lesson.href!)}`
      );
    } else {
      expect(within(card).getByText("Coming soon")).toBeDefined();
      expect(within(card).queryByRole("link")).toBeNull();
    }
  }
});

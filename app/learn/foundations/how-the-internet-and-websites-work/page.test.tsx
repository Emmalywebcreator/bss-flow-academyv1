// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import Lesson from "./page";
import { PARTS, SECTIONS } from "./content";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("every section belongs to exactly one part, in order", () => {
  expect(PARTS.flatMap((p) => p.sections.map((s) => s.id))).toEqual(SECTIONS.map((s) => s.id));
});

test("the overview lists every part and starts with no progress", () => {
  render(<Lesson />);

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("How the Internet and Websites Work");
  const links = within(screen.getByRole("navigation", { name: "Lesson parts" })).getAllByRole("link");
  expect(links.map((l) => l.getAttribute("href"))).toEqual(
    PARTS.map((p) => `/learn/foundations/how-the-internet-and-websites-work/${p.slug}`)
  );
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  expect(screen.getByRole("link", { name: /Start the lesson/ }).getAttribute("href")).toBe(
    "/learn/foundations/how-the-internet-and-websites-work/getting-started"
  );
});

test("the overview picks up where the reader left off", () => {
  localStorage.setItem(
    "lesson-progress:how-the-internet-and-websites-work",
    JSON.stringify(["getting-started", "the-internet-and-the-web"])
  );
  render(<Lesson />);

  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("2");
  expect(screen.getByText(`2 of ${PARTS.length} parts complete`)).toBeDefined();
  expect(screen.getByRole("link", { name: /Continue: The parts of the web/ }).getAttribute("href")).toBe(
    "/learn/foundations/how-the-internet-and-websites-work/parts-of-the-web"
  );
});

// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Part from "./page";
import { PARTS } from "../content";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

const BASE = "/learn/foundations/how-the-internet-and-websites-work";

async function renderPart(slug: string) {
  render(await Part({ params: Promise.resolve({ part: slug }) }));
}

test("each part shows its own sections and its position in the lesson", async () => {
  await renderPart("building-web-pages");

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("How web pages are built");
  expect(screen.getByText(/Part 5 of 9/)).toBeDefined();
  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "How HTML, CSS, and JavaScript work together",
    "Static websites vs dynamic websites",
  ]);
  const nav = screen.getByRole("navigation", { name: "Part navigation" });
  expect(within(nav).getByRole("link", { name: /Visiting a website/ }).getAttribute("href")).toBe(
    `${BASE}/visiting-a-website`
  );
  expect(within(nav).getByRole("link", { name: /Next: Git and GitHub/ }).getAttribute("href")).toBe(
    `${BASE}/git-and-github`
  );
});

test("together the parts cover the whole lesson", async () => {
  await renderPart("parts-of-the-web");
  for (const name of ["Web browser", "Domain name", "IP address", "DNS", "Web server", "Database"]) {
    expect(screen.getByRole("heading", { level: 3, name })).toBeDefined();
  }
  cleanup();

  await renderPart("visiting-a-website");
  const figure = screen.getByText(/How a web page is delivered/).closest("figure")!;
  const steps = within(figure).getAllByRole("listitem").filter((li) => li.closest("ol"));
  expect(steps).toHaveLength(11);
  expect(figure.textContent).toMatch(/browser never talks\s+to the database directly/);
});

function stayFor(seconds: number) {
  act(() => vi.advanceTimersByTime(seconds * 1000));
}

test("moving on too soon goes to the next part without counting this one", async () => {
  vi.useFakeTimers();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  await renderPart("parts-of-the-web");
  const bar = screen.getByRole("progressbar");

  stayFor(10);
  const next = screen.getByRole("link", { name: /Next: Visiting a website/ });
  expect(next.getAttribute("href")).toBe(`${BASE}/visiting-a-website`);
  expect(fireEvent.click(next)).toBe(true); // not prevented, so it navigates

  expect(bar.getAttribute("aria-valuenow")).toBe("0");
});

test("moving on after enough time marks the part complete", async () => {
  vi.useFakeTimers();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  await renderPart("parts-of-the-web");
  const bar = screen.getByRole("progressbar");

  // Half of the part's three minutes.
  stayFor(90);
  fireEvent.click(screen.getByRole("link", { name: /Next: Visiting a website/ }));

  expect(bar.getAttribute("aria-valuenow")).toBe("1");
  expect(screen.getAllByRole("link", { name: /The parts of the web\s*\(complete\)/ }).length).toBeGreaterThan(0);
});

test("time spent with the tab hidden doesn't count", async () => {
  vi.useFakeTimers();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
  await renderPart("parts-of-the-web");

  stayFor(300);
  fireEvent.click(screen.getByRole("link", { name: /Next: Visiting a website/ }));

  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
});

test("the last part links to the next lesson and finishes this one", async () => {
  await renderPart(PARTS.at(-1)!.slug);

  const next = document.getElementById("next-topic")!;
  expect(within(next).getByRole("heading", { name: "Next topic: HTML5: Structuring Websites" })).toBeDefined();
  expect(within(next).getByRole("link", { name: /Start lesson 2/ }).getAttribute("href")).toBe(
    "/learn/foundations/html5-structuring-websites"
  );
  expect(within(next).getByRole("link", { name: "Register" }).getAttribute("href")).toBe("/register");
  expect(screen.getByRole("link", { name: /Finish the lesson/ }).getAttribute("href")).toBe(BASE);
});

test("an unknown part is a 404", async () => {
  await expect(Part({ params: Promise.resolve({ part: "nope" }) })).rejects.toThrow();
});

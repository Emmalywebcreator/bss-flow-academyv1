// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Part from "./page";
import { PARTS } from "../content";
import { requiredSeconds } from "@/app/_lessons/lesson";

// Lessons are for enrolled learners; these tests render them as one.
vi.mock("@/lib/enrollment-access", () => ({ requireEnrollment: vi.fn() }));

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});

const BASE = "/learn/foundations/html5-structuring-websites";
const TIME_KEY = "lesson-time:html5-structuring-websites";

async function renderPart(slug: string) {
  render(await Part({ params: Promise.resolve({ part: slug }) }));
}

function bar() {
  return screen.getByRole("progressbar");
}

function nextLink() {
  return within(screen.getByRole("navigation", { name: "Part navigation" })).getAllByRole("link").at(-1)!;
}

/** Pretend the reader has already spent enough time on each of these parts. */
function spentEnoughTimeOn(...slugs: string[]) {
  const times = Object.fromEntries(
    slugs.map((slug) => [slug, requiredSeconds(PARTS.find((p) => p.slug === slug)!)])
  );
  localStorage.setItem(TIME_KEY, JSON.stringify(times));
}

test("each part renders in order, with Previous and Next following the module order", async () => {
  for (const [i, part] of PARTS.entries()) {
    await renderPart(part.slug);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(part.title);
    expect(screen.getByText(new RegExp(`Part ${i + 1} of 10`))).toBeDefined();
    const nav = screen.getByRole("navigation", { name: "Part navigation" });
    const [previous] = within(nav).getAllByRole("link");
    expect(previous.getAttribute("href")).toBe(i === 0 ? BASE : `${BASE}/${PARTS[i - 1].slug}`);
    expect(nextLink().getAttribute("href")).toBe(i === 9 ? BASE : `${BASE}/${PARTS[i + 1].slug}`);
    cleanup();
  }
});

test("every part needs at least 30 seconds before it counts", () => {
  for (const part of PARTS) expect(requiredSeconds(part)).toBeGreaterThanOrEqual(30);
});

test("clicking Next too soon moves on without counting the part", async () => {
  vi.useFakeTimers();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  await renderPart("introduction-to-html5");

  act(() => vi.advanceTimersByTime(29_000));
  expect(fireEvent.click(nextLink())).toBe(true); // not prevented: it navigates

  expect(bar().getAttribute("aria-valuenow")).toBe("0");
});

test("clicking Next after the reading time counts the part once, however often it's clicked", async () => {
  vi.useFakeTimers();
  vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  await renderPart("introduction-to-html5");

  act(() => vi.advanceTimersByTime(requiredSeconds(PARTS[0]) * 1000));
  fireEvent.click(nextLink());
  fireEvent.click(nextLink());
  fireEvent.click(nextLink());

  expect(bar().getAttribute("aria-valuenow")).toBe("1");
  expect(screen.getByText("1 of 10 parts complete")).toBeDefined();
  expect(screen.getByText("10%")).toBeDefined();
});

test("revisiting a completed part doesn't add progress, and saved progress is restored", async () => {
  spentEnoughTimeOn("introduction-to-html5");
  await renderPart("introduction-to-html5");
  fireEvent.click(nextLink());
  cleanup();

  // A fresh render reads progress back from storage, as a reload would.
  await renderPart("introduction-to-html5");
  expect(bar().getAttribute("aria-valuenow")).toBe("1");
  fireEvent.click(nextLink());
  expect(bar().getAttribute("aria-valuenow")).toBe("1");
});

test("completing all ten parts reaches 100% and finishes the lesson", async () => {
  spentEnoughTimeOn(...PARTS.map((p) => p.slug));

  for (const [i, part] of PARTS.entries()) {
    await renderPart(part.slug);
    fireEvent.click(nextLink());
    expect(bar().getAttribute("aria-valuenow")).toBe(String(i + 1));
    cleanup();
  }

  await renderPart(PARTS[9].slug);
  expect(screen.getByText("Lesson complete")).toBeDefined();
  expect(screen.getByText("100%")).toBeDefined();
  expect(nextLink().textContent).toMatch(/Finish the lesson/);
});

test("the last part has the final quiz, its answers, and no next lesson yet", async () => {
  await renderPart("final-project");

  expect(screen.getByRole("heading", { level: 2, name: "Final knowledge quiz" })).toBeDefined();
  expect(screen.getByRole("heading", { level: 2, name: "Answers and explanations" })).toBeDefined();
  const next = document.getElementById("next-topic")!;
  expect(within(next).getByRole("heading", { name: "What's next" })).toBeDefined();
  expect(within(next).getByRole("link", { name: "learning page" }).getAttribute("href")).toBe("/learn");
});

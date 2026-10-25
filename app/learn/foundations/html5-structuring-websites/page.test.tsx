// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import Lesson from "./page";
import { PARTS } from "./content";
import { SITE_FILES, SITE_PATHS } from "./parts/site-example";
import { BOILERPLATE } from "./parts/02-boilerplate";

// Lessons are for enrolled learners; these tests render them as one.
vi.mock("@/lib/enrollment-access", () => ({ requireEnrollment: vi.fn() }));

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const BASE = "/learn/foundations/html5-structuring-websites";

test("the lesson has the ten modules, in the required order", () => {
  expect(PARTS.map((p) => p.title)).toEqual([
    "Introduction to HTML5",
    "The HTML Boilerplate and DOCTYPE",
    "Indentation and Nesting",
    "Headings and Paragraphs",
    "HTML Lists",
    "Inserting Images in HTML",
    "Creating Hyperlinks with Anchor Tags",
    "Building a Multi-Page Website",
    "HTML Best Practices",
    "Final Project and Assessment",
  ]);
  expect(new Set(PARTS.map((p) => p.slug)).size).toBe(10);
});

test("every teaching module ends with a recap and a quick check", () => {
  for (const part of PARTS.slice(0, -1)) {
    expect(part.sections.slice(-2).map((s) => s.title)).toEqual(["Recap", "Quick check"]);
  }
  const ids = PARTS.flatMap((p) => p.sections.map((s) => s.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test("the overview lists the ten parts and starts at Part 1", async () => {
  render(await Lesson());

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("HTML5: Structuring Websites");
  expect(screen.getByText("Learn the anatomy of HTML syntax to structure your websites.")).toBeDefined();
  const links = within(screen.getByRole("navigation", { name: "Lesson parts" })).getAllByRole("link");
  expect(links.map((l) => l.getAttribute("href"))).toEqual(PARTS.map((p) => `${BASE}/${p.slug}`));
  expect(screen.getByText("0 of 10 parts complete")).toBeDefined();
  expect(screen.getByRole("link", { name: /Start the lesson/ }).getAttribute("href")).toBe(
    `${BASE}/introduction-to-html5`
  );
});

test("Lesson 1's saved progress doesn't show up in this lesson", async () => {
  localStorage.setItem(
    "lesson-progress:how-the-internet-and-websites-work",
    JSON.stringify(["getting-started", "the-internet-and-the-web"])
  );
  render(await Lesson());

  expect(screen.getByText("0 of 10 parts complete")).toBeDefined();
});

function parse(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

test("the example documents are complete HTML5 pages", () => {
  for (const html of [BOILERPLATE, ...Object.values(SITE_FILES)]) {
    expect(html.trim().startsWith("<!DOCTYPE html>")).toBe(true);
    const doc = parse(html);
    expect(doc.documentElement.getAttribute("lang")).toBe("en");
    expect(doc.querySelector('head > meta[charset="UTF-8"]')).not.toBeNull();
    expect(doc.querySelector('head > meta[name="viewport"]')).not.toBeNull();
    expect(doc.title).not.toBe("");
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
  }
});

test("every link and image in the example website points at a file in its folder", () => {
  const titles = new Set<string>();
  for (const html of Object.values(SITE_FILES)) {
    const doc = parse(html);
    titles.add(doc.title);
    expect([...doc.querySelectorAll("nav a")].map((a) => a.getAttribute("href"))).toEqual([
      "index.html",
      "about.html",
      "contact.html",
    ]);
    for (const a of doc.querySelectorAll("a")) {
      const href = a.getAttribute("href")!;
      if (!href.startsWith("mailto:")) expect(SITE_PATHS).toContain(href);
    }
    for (const img of doc.querySelectorAll("img")) {
      expect(SITE_PATHS).toContain(img.getAttribute("src"));
      expect(img.getAttribute("alt")).toBeTruthy();
    }
  }
  expect(titles.size).toBe(3);
});

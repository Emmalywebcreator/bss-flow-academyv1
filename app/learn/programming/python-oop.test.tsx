// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { BEGINNER_TOPICS } from "./_python-oop/beginner";
import { INTERMEDIATE_TOPICS } from "./_python-oop/intermediate";
import { ADVANCED_TOPICS } from "./_python-oop/advanced";
import { inline } from "./_python-oop/render";
import type { Topic } from "./_python-oop/topic";
import Basics from "./python-oop-basics/page";
import { LESSON as BASICS } from "./python-oop-basics/lesson";
import AdvancedPart from "./python-oop-advanced-classes/[part]/page";
import { LESSON as ADVANCED } from "./python-oop-advanced-classes/lesson";
import { LESSON as DESIGN } from "./python-oop-inheritance-and-design/lesson";
import Html5Part from "../foundations/html5-structuring-websites/[part]/page";
import { PARTS as HTML5_PARTS } from "../foundations/html5-structuring-websites/content";

// Lessons are for enrolled learners; these tests render them as one.
vi.mock("@/lib/enrollment-access", () => ({ requireEnrollment: vi.fn() }));

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const LEVELS: [string, readonly Topic[]][] = [
  ["Beginner", BEGINNER_TOPICS],
  ["Intermediate", INTERMEDIATE_TOPICS],
  ["Advanced", ADVANCED_TOPICS],
];

test("the course is three lessons of 5, 7 and 9 parts", () => {
  expect(LEVELS.map(([, topics]) => topics.length)).toEqual([5, 7, 9]);
  expect([BASICS, DESIGN, ADVANCED].map((d) => [d.lesson.level, d.lesson.stage, d.parts.length])).toEqual([
    ["Beginner", "Programming", 5],
    ["Intermediate", "Programming", 7],
    ["Advanced", "Programming", 9],
  ]);
});

test("every part has examples with output, a quiz and a challenge", () => {
  for (const [, topics] of LEVELS) {
    for (const topic of topics) {
      const examples = topic.blocks.filter((b) => b.type === "code");
      expect(examples.length, topic.title).toBeGreaterThan(0);
      for (const example of examples) expect(example.output.trim(), topic.title).not.toBe("");
      expect(topic.quiz.length, topic.title).toBeGreaterThanOrEqual(2);
      expect(topic.challenge.solution.trim()).not.toBe("");
      expect(topic.challenge.hint.trim()).not.toBe("");
    }
  }
});

test("quiz answers are valid and spread across the options, not always in one place", () => {
  for (const [level, topics] of LEVELS) {
    const questions = topics.flatMap((t) => t.quiz);
    const counts = [0, 0, 0, 0];
    for (const q of questions) {
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(q.options.length);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      counts[q.answer]++;
    }
    // Every position is used, and none holds more than 40% of the answers.
    expect(counts.every((c) => c > 0), level).toBe(true);
    expect(Math.max(...counts) / questions.length, level).toBeLessThanOrEqual(0.4);
  }
  const ids = LEVELS.flatMap(([, topics]) => topics.flatMap((t) => t.quiz.map((q) => q.id)));
  expect(new Set(ids).size).toBe(ids.length);
});

test("section ids are unique within each lesson", () => {
  for (const { parts } of [BASICS, DESIGN, ADVANCED]) {
    const ids = parts.flatMap((p) => p.sections.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(parts[0].sections[0].title).toBe("Before you start");
    for (const part of parts) {
      expect(part.sections.slice(-3).map((s) => s.title)).toEqual([
        "Explanation and examples",
        "Quick check",
        "Coding challenge",
      ]);
    }
  }
});

test("text renders `code` and **bold** spans", () => {
  expect(renderToStaticMarkup(<p>{inline("Use `self` for **every** method")}</p>)).toBe(
    '<p>Use <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50">self</code> for <strong>every</strong> method</p>'
  );
});

test("the overview shows the lesson's level and starts at Part 1", async () => {
  render(await Basics());

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Object-Oriented Python: The Basics");
  expect(screen.getByText("Beginner")).toBeDefined();
  expect(screen.getByText("0 of 5 parts complete")).toBeDefined();
  expect(screen.getByRole("link", { name: /Start the lesson/ }).getAttribute("href")).toBe(
    "/learn/programming/python-oop-basics/what-is-oop-classes-and-objects"
  );
  const crumbs = within(screen.getByRole("navigation", { name: "Breadcrumb" }));
  expect(crumbs.getByRole("link", { name: "Programming" }).getAttribute("href")).toBe("/#explore");
});

test("a part shows the example, its output, and the challenge's hint and solution", async () => {
  const slug = "slots-and-memory-efficient-objects";
  render(await AdvancedPart({ params: Promise.resolve({ part: slug }) }));

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("__slots__ and Memory-Efficient Objects");
  expect(screen.getAllByText("Example").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Output").length).toBeGreaterThan(0);
  expect(screen.getByText("Show a hint")).toBeDefined();
  expect(screen.getByText("Show the model solution")).toBeDefined();
});

test("the last part of each lesson points to the next one in Programming, not to Foundations", async () => {
  const basicsEnd = BASICS.parts.at(-1)!.slug;
  const { default: BasicsPart } = await import("./python-oop-basics/[part]/page");
  render(await BasicsPart({ params: Promise.resolve({ part: basicsEnd }) }));
  expect(
    screen.getByRole("link", { name: /Start lesson 2/ }).getAttribute("href")
  ).toBe("/learn/programming/python-oop-inheritance-and-design");
  cleanup();

  render(await Html5Part({ params: Promise.resolve({ part: HTML5_PARTS.at(-1)!.slug }) }));
  expect(screen.queryByText(/Object-Oriented Python/)).toBeNull();
});

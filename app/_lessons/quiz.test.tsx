// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Quiz } from "./quiz";
import { QUIZ_QUESTIONS } from "@/app/learn/foundations/how-the-internet-and-websites-work/quiz-questions";

afterEach(cleanup);

function choose(questionIndex: number, optionIndex: number) {
  const q = QUIZ_QUESTIONS[questionIndex];
  const group = screen.getByRole("group", { name: `${questionIndex + 1}. ${q.question}` });
  fireEvent.click(within(group).getByRole("radio", { name: q.options[optionIndex] }));
}

function answerAll(correctCount: number) {
  QUIZ_QUESTIONS.forEach((q, i) => {
    choose(i, i < correctCount ? q.answer : (q.answer + 1) % q.options.length);
  });
}

test("has the eight questions with the agreed answer keys", () => {
  expect(QUIZ_QUESTIONS.map((q) => q.options[q.answer])).toEqual([
    "To help resolve domain names to IP address information",
    "HTML",
    "It receives HTTP requests and returns HTTP responses",
    "The backend application",
    "To track changes in files over time",
    "404",
    "JavaScript",
    "Reproduce the problem and inspect the error message",
  ]);
});

test("asks for every answer before scoring", () => {
  render(<Quiz questions={QUIZ_QUESTIONS} />);
  choose(0, QUIZ_QUESTIONS[0].answer);

  fireEvent.click(screen.getByRole("button", { name: "Check my answers" }));

  expect(screen.getByRole("alert").textContent).toMatch(/Answer all 8 questions .*7 still to go/);
  expect(screen.queryByRole("status")).toBeNull();
});

test("scores the answers, marks each one and explains every question", () => {
  render(<Quiz questions={QUIZ_QUESTIONS} />);
  answerAll(6);

  fireEvent.click(screen.getByRole("button", { name: "Check my answers" }));

  expect(screen.getByRole("status").textContent).toContain("You scored 6 out of 8.");
  expect(screen.getAllByText("Correct.")).toHaveLength(6);
  expect(screen.getAllByText("Not quite.")).toHaveLength(2);
  expect(screen.getAllByText("Correct answer")).toHaveLength(8);
  for (const q of QUIZ_QUESTIONS) expect(screen.getByText(q.explanation)).toBeDefined();
  for (const radio of screen.getAllByRole("radio")) expect((radio as HTMLInputElement).disabled).toBe(true);
});

test("congratulates a perfect score, and Try again starts over", () => {
  render(<Quiz questions={QUIZ_QUESTIONS} />);
  answerAll(8);
  fireEvent.click(screen.getByRole("button", { name: "Check my answers" }));

  expect(screen.getByRole("status").textContent).toMatch(/8 out of 8.*every answer right/);

  fireEvent.click(screen.getByRole("button", { name: "Try again" }));

  expect(screen.queryByRole("status")).toBeNull();
  for (const radio of screen.getAllByRole("radio")) {
    expect((radio as HTMLInputElement).checked).toBe(false);
    expect((radio as HTMLInputElement).disabled).toBe(false);
  }
  expect(screen.getByRole("button", { name: "Check my answers" })).toBeDefined();
});

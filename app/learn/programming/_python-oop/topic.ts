import type { QuizQuestion } from "@/app/_lessons/quiz";

/*
 * The Python OOP course is kept as data: one Topic per lesson part.
 * Text may use `code` and **bold**; render.tsx turns it into a page.
 */

export type TextBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: readonly string[] }
  /** Aligned plain text, such as a short reference table, shown in monospace. */
  | { type: "table"; text: string };

/** An example and the output it prints, as recorded from a real run. */
export type CodeExample = { type: "code"; code: string; output: string };

export type Block = TextBlock | CodeExample;

export type Challenge = {
  task: readonly TextBlock[];
  starter: string;
  hint: string;
  solution: string;
};

export type Topic = {
  slug: string;
  title: string;
  minutes: number;
  blocks: readonly Block[];
  quiz: readonly QuizQuestion[];
  challenge: Challenge;
};

import type { ReactNode } from "react";
import type { LessonSection } from "@/app/_lessons/lesson";
import { Quiz, type QuizQuestion } from "@/app/_lessons/quiz";

/** The short recap that closes each teaching part. */
export function recap(prefix: string, points: readonly ReactNode[]): LessonSection {
  return {
    id: `${prefix}-recap`,
    title: "Recap",
    body: (
      <ul>
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    ),
  };
}

/** A few multiple-choice questions on the part just read. */
export function quickCheck(prefix: string, questions: readonly QuizQuestion[]): LessonSection {
  return {
    id: `${prefix}-quick-check`,
    title: "Quick check",
    body: (
      <>
        <p>
          {questions.length} quick questions on this part. Choose an answer for each, then check
          them to see an explanation.
        </p>
        <Quiz questions={questions} />
      </>
    ),
  };
}

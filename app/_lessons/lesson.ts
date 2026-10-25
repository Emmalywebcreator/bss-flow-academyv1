import type { ReactNode } from "react";
import type { Lesson } from "@/constants/learning";

export type LessonSection = { id: string; title: string; body: ReactNode };

export type LessonPart = {
  slug: string;
  title: string;
  /** Rough time to work through the part, shown to the reader. */
  minutes: number;
  sections: readonly LessonSection[];
};

/** A published lesson and its parts, read one part per page. */
export type LessonDefinition = {
  lesson: Lesson;
  parts: readonly LessonPart[];
};

/**
 * Time a reader must spend on a part before it can be marked complete:
 * half its estimated time, and never under 30 seconds.
 */
export function requiredSeconds(part: LessonPart) {
  return Math.max(30, (part.minutes * 60) / 2);
}

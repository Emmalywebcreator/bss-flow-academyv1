import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LessonOverview, requireLessonAccess } from "@/app/_lessons/lesson-pages";
import { LESSON } from "./lesson";

export const metadata: Metadata = {
  title: `${LESSON.lesson.title} — ${PROGRAM.name}`,
  description:
    "A free beginner lesson on object-oriented Python: classes and objects, __init__, methods and self, class attributes, and __str__ and __repr__.",
};

/** Programming lesson 1's overview, for registered learners. */
export default async function PythonOopBasics() {
  await requireLessonAccess(LESSON);
  return <LessonOverview definition={LESSON} />;
}

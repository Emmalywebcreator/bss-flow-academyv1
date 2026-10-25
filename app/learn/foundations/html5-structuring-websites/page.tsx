import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LessonOverview, requireLessonAccess } from "@/app/_lessons/lesson-pages";
import { LESSON } from "./lesson";

export const metadata: Metadata = {
  title: `${LESSON.lesson.title} — ${PROGRAM.name}`,
  description:
    "A free beginner lesson on HTML5: tags and elements, the boilerplate, nesting, headings, lists, images, links, and building a multi-page website.",
};

/** Lesson 2's overview, for registered learners. */
export default async function Html5Lesson() {
  await requireLessonAccess(LESSON);
  return <LessonOverview definition={LESSON} />;
}

import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LessonOverview, requireLessonAccess } from "@/app/_lessons/lesson-pages";
import { LESSON } from "./lesson";

export const metadata: Metadata = {
  title: `${LESSON.lesson.title} — ${PROGRAM.name}`,
  description:
    "A free advanced lesson on object-oriented Python: abstract base classes, mixins and the MRO, dataclasses, iterators and context managers, descriptors, __slots__, metaclasses, protocols and design patterns.",
};

/** Programming lesson 3's overview, for registered learners. */
export default async function PythonOopAdvancedClasses() {
  await requireLessonAccess(LESSON);
  return <LessonOverview definition={LESSON} />;
}

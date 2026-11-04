import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LessonOverview, requireLessonAccess } from "@/app/_lessons/lesson-pages";
import { LESSON } from "./lesson";

export const metadata: Metadata = {
  title: `${LESSON.lesson.title} — ${PROGRAM.name}`,
  description:
    "A free intermediate lesson on object-oriented Python: encapsulation and @property, inheritance and super(), polymorphism, class and static methods, operator overloading, and composition.",
};

/** Programming lesson 2's overview, for registered learners. */
export default async function PythonOopInheritanceAndDesign() {
  await requireLessonAccess(LESSON);
  return <LessonOverview definition={LESSON} />;
}

import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LessonOverview } from "@/app/_lessons/lesson-pages";
import { LESSON } from "./lesson";

export const metadata: Metadata = {
  title: `${LESSON.lesson.title} — ${PROGRAM.name}`,
  description:
    "A free beginner lesson on how the internet and websites work: DNS, HTTP and HTTPS, web servers, databases, HTML, CSS, JavaScript, Git, GitHub and basic troubleshooting.",
};

/** Lesson 1's overview, open to everyone. */
export default function HowTheInternetWorksLesson() {
  return <LessonOverview definition={LESSON} />;
}

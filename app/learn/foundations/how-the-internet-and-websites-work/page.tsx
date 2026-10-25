import type { Metadata } from "next";
import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { ContinueLink, LessonProgress, PartList } from "@/app/_lessons/progress";
import { StatusBadge } from "@/app/_home/section";
import { Breadcrumb, LESSON_ID, PART_ENTRIES, lesson } from "./lesson";

export const metadata: Metadata = {
  title: `${lesson.title} — ${PROGRAM.name}`,
  description:
    "A free beginner lesson on how the internet and websites work: DNS, HTTP and HTTPS, web servers, databases, HTML, CSS, JavaScript, Git, GitHub and basic troubleshooting.",
};

/** Lesson 1's overview: what's in it, and how far the reader has got. */
export default function HowTheInternetWorksLesson() {
  return (
    <main className="flex-1 bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb trail={[{ label: `Lesson ${lesson.number}` }]} />

        <header className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge open>Free lesson</StatusBadge>
            <StatusBadge>
              {lesson.stage} &middot; Lesson {lesson.number}
            </StatusBadge>
            <StatusBadge>Beginner</StatusBadge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
            {lesson.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">{lesson.summary}</p>
        </header>

        <section
          aria-labelledby="your-progress-heading"
          className="mt-10 flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <h2 id="your-progress-heading" className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Your progress
          </h2>
          <LessonProgress lessonId={LESSON_ID} parts={PART_ENTRIES} />
          <ContinueLink
            lessonId={LESSON_ID}
            parts={PART_ENTRIES}
            className="self-start rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            The lesson is split into {PART_ENTRIES.length} short parts. Progress is saved in this
            browser.
          </p>
        </section>

        <section aria-labelledby="parts-heading" className="mt-10 flex flex-col gap-3">
          <h2 id="parts-heading" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            What&apos;s in this lesson
          </h2>
          <nav aria-label="Lesson parts">
            <PartList lessonId={LESSON_ID} parts={PART_ENTRIES} />
          </nav>
        </section>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <p className="font-semibold text-zinc-950 dark:text-zinc-50">Learning with {PROGRAM.name}?</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Register as a learner to join the community and follow along as new lessons are published.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 rounded-full bg-zinc-950 px-6 py-2.5 text-center text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

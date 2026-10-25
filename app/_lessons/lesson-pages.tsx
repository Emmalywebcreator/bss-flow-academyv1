import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LESSONS, type Lesson } from "@/constants/learning";
import { PROGRAM } from "@/constants/program";
import { requireEnrollment } from "@/lib/enrollment-access";
import { StatusBadge } from "@/app/_home/section";
import { proseClass } from "./prose";
import { requiredSeconds, type LessonDefinition } from "./lesson";
import {
  CompletePartButton,
  ContinueLink,
  LessonProgress,
  PartList,
  type PartEntry,
} from "./progress";

/*
 * The pages every lesson is made of: an overview at the lesson's href,
 * and one page per part at `<href>/<part slug>`. A lesson's route files
 * only pass in its definition.
 */

const primaryButton =
  "rounded-full bg-zinc-950 px-6 py-2.5 text-center text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200";

function lessonHref(lesson: Lesson) {
  if (!lesson.href) throw new Error(`Lesson ${lesson.number} has no page`);
  return lesson.href;
}

/** Key for saved progress: the last segment of the lesson's URL. */
function lessonId(lesson: Lesson) {
  return lessonHref(lesson).split("/").pop()!;
}

function partEntries({ lesson, parts }: LessonDefinition): PartEntry[] {
  return parts.map(({ slug, title }) => ({ slug, title, href: `${lessonHref(lesson)}/${slug}` }));
}

export function lessonPartParams({ parts }: LessonDefinition) {
  return parts.map(({ slug }) => ({ part: slug }));
}

export function lessonPartMetadata({ lesson, parts }: LessonDefinition, slug: string): Metadata {
  const part = parts.find((p) => p.slug === slug);
  if (!part) return {};
  return { title: `${part.title} — ${lesson.title} — ${PROGRAM.name}` };
}

/**
 * Lessons are for registered learners: call this first in each lesson
 * route. Anyone without an active enrollment is sent to register, then
 * brought back to this page.
 */
export async function requireLessonAccess({ lesson }: LessonDefinition, slug?: string) {
  await requireEnrollment(slug ? `${lessonHref(lesson)}/${slug}` : lessonHref(lesson));
}

/** The index of the part with this slug; a 404 if there isn't one. */
export function partIndexOrNotFound({ parts }: LessonDefinition, slug: string) {
  const index = parts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  return index;
}

type Crumb = { label: string; href?: string };

function Breadcrumb({ lesson, trail }: { lesson: Lesson; trail: readonly Crumb[] }) {
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: lesson.stage, href: "/#learning-paths" },
    ...trail,
  ];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-x-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-zinc-950 dark:hover:text-zinc-50">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-zinc-950 dark:text-zinc-50">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The lesson after this one: linked once published, "Coming soon" before. */
function NextLesson({ lesson }: { lesson: Lesson }) {
  const next = LESSONS.find((l) => l.number === lesson.number + 1);

  return (
    <section id="next-topic" aria-labelledby="next-topic-heading" className="flex flex-col gap-5">
      <h2
        id="next-topic-heading"
        className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50"
      >
        {next ? `Next topic: ${next.title}` : "What's next"}
      </h2>
      {next?.status === "published" && next.href ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-accent/50 bg-white p-6 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge open>Ready</StatusBadge>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {next.stage} &middot; Lesson {next.number}
            </span>
          </div>
          <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{next.title}</p>
          <p className="text-zinc-600 dark:text-zinc-400">{next.summary}</p>
          <Link href={next.href} className={`self-start ${primaryButton}`}>
            Start lesson {next.number} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      ) : next ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge>Coming soon</StatusBadge>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {next.stage} &middot; Lesson {next.number}
            </span>
          </div>
          <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{next.title}</p>
          <p className="text-zinc-600 dark:text-zinc-400">{next.summary}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Not published yet. It will be linked here when it&apos;s ready.
          </p>
        </div>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-400">
          This is the latest lesson so far. New lessons will appear on your{" "}
          <Link href="/learn" className="font-medium text-zinc-950 underline underline-offset-2 dark:text-zinc-50">
            learning page
          </Link>{" "}
          as they&apos;re published.
        </p>
      )}
    </section>
  );
}

/** A lesson's overview: what's in it, and how far the reader has got. */
export function LessonOverview({ definition }: { definition: LessonDefinition }) {
  const { lesson } = definition;
  const id = lessonId(lesson);
  const parts = partEntries(definition);

  return (
    <main className="flex-1 bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb lesson={lesson} trail={[{ label: `Lesson ${lesson.number}` }]} />

        <header className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge open>Free for learners</StatusBadge>
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
          <LessonProgress lessonId={id} parts={parts} />
          <ContinueLink
            lessonId={id}
            parts={parts}
            className="self-start rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            The lesson is split into {parts.length} short parts. Progress is saved in this browser.
          </p>
        </section>

        <section aria-labelledby="parts-heading" className="mt-10 flex flex-col gap-3">
          <h2 id="parts-heading" className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            What&apos;s in this lesson
          </h2>
          <nav aria-label="Lesson parts">
            <PartList lessonId={id} parts={parts} />
          </nav>
        </section>

      </div>
    </main>
  );
}

/** One part of a lesson: its sections, then on to the next part. */
export function LessonPartPage({ definition, index }: { definition: LessonDefinition; index: number }) {
  const { lesson, parts } = definition;
  const id = lessonId(lesson);
  const href = lessonHref(lesson);
  const entries = partEntries(definition);
  const part = parts[index];
  const previous = entries[index - 1];
  const next = entries[index + 1];
  const position = `Part ${index + 1} of ${parts.length} · about ${part.minutes} min`;

  return (
    <main className="flex-1 bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          lesson={lesson}
          trail={[{ label: `Lesson ${lesson.number}`, href }, { label: `Part ${index + 1}` }]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-20">
              <LessonProgress lessonId={id} parts={entries} />
              <details className="rounded-xl border border-zinc-200 bg-white p-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-950">
                <summary className="cursor-pointer font-medium text-zinc-950 dark:text-zinc-50">All parts</summary>
                <nav aria-label="Lesson parts" className="mt-3">
                  <PartList lessonId={id} parts={entries} currentSlug={part.slug} />
                </nav>
              </details>
              <nav aria-label="Lesson parts" className="hidden lg:block">
                <PartList lessonId={id} parts={entries} currentSlug={part.slug} />
              </nav>
            </div>
          </aside>

          <article className="flex min-w-0 max-w-3xl flex-col gap-12">
            <header className="flex flex-col gap-3">
              <p className="text-sm font-medium text-accent">
                <Link href={href} className="hover:underline">
                  {lesson.title}
                </Link>{" "}
                &middot; {position}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
                {part.title}
              </h1>
            </header>

            {part.sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2
                  id={`${section.id}-heading`}
                  className="mb-5 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50"
                >
                  {section.title}
                </h2>
                <div className={proseClass}>{section.body}</div>
              </section>
            ))}

            {!next && <NextLesson lesson={lesson} />}

            <nav
              aria-label="Part navigation"
              className="flex flex-col-reverse gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800"
            >
              <Link
                href={previous?.href ?? href}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <span aria-hidden="true">&larr;</span> {previous ? previous.title : "Lesson overview"}
              </Link>
              <CompletePartButton
                lessonId={id}
                slug={part.slug}
                href={next?.href ?? href}
                nextTitle={next?.title}
                requiredSeconds={requiredSeconds(part)}
                className={primaryButton}
              />
            </nav>
          </article>
        </div>
      </div>
    </main>
  );
}

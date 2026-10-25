import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROGRAM } from "@/constants/program";
import { proseClass } from "@/app/_lessons/prose";
import { CompletePartButton, LessonProgress, PartList } from "@/app/_lessons/progress";
import { StatusBadge } from "@/app/_home/section";
import { PARTS, requiredSeconds } from "../content";
import { Breadcrumb, LESSON_HREF, LESSON_ID, PART_ENTRIES, lesson, nextLesson } from "../lesson";

type Props = { params: Promise<{ part: string }> };

export function generateStaticParams() {
  return PARTS.map(({ slug }) => ({ part: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { part: slug } = await params;
  const part = PARTS.find((p) => p.slug === slug);
  if (!part) return {};
  return { title: `${part.title} — ${lesson.title} — ${PROGRAM.name}` };
}

const primaryButton =
  "rounded-full bg-zinc-950 px-6 py-2.5 text-center text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200";

/** One part of Lesson 1: a couple of sections, then on to the next part. */
export default async function LessonPartPage({ params }: Props) {
  const { part: slug } = await params;
  const index = PARTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const part = PARTS[index];
  const previous = PART_ENTRIES[index - 1];
  const next = PART_ENTRIES[index + 1];
  const position = `Part ${index + 1} of ${PARTS.length} · about ${part.minutes} min`;

  return (
    <main className="flex-1 bg-zinc-50 px-4 py-10 sm:px-6 sm:py-14 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          trail={[{ label: `Lesson ${lesson.number}`, href: LESSON_HREF }, { label: `Part ${index + 1}` }]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4">
            <div className="lg:sticky lg:top-20 flex flex-col gap-4">
              <LessonProgress lessonId={LESSON_ID} parts={PART_ENTRIES} />
              <details className="rounded-xl border border-zinc-200 bg-white p-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-950">
                <summary className="cursor-pointer font-medium text-zinc-950 dark:text-zinc-50">All parts</summary>
                <nav aria-label="Lesson parts" className="mt-3">
                  <PartList lessonId={LESSON_ID} parts={PART_ENTRIES} currentSlug={part.slug} />
                </nav>
              </details>
              <nav aria-label="Lesson parts" className="hidden lg:block">
                <PartList lessonId={LESSON_ID} parts={PART_ENTRIES} currentSlug={part.slug} />
              </nav>
            </div>
          </aside>

          <article className="flex min-w-0 max-w-3xl flex-col gap-12">
            <header className="flex flex-col gap-3">
              <p className="text-sm font-medium text-accent">
                <Link href={LESSON_HREF} className="hover:underline">
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

            {!next && (
              <section id="next-topic" aria-labelledby="next-topic-heading" className="flex flex-col gap-5">
                <h2
                  id="next-topic-heading"
                  className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50"
                >
                  Next topic: {nextLesson.title}
                </h2>
                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge>Coming soon</StatusBadge>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {nextLesson.stage} &middot; Lesson {nextLesson.number}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{nextLesson.title}</p>
                  <p className="text-zinc-600 dark:text-zinc-400">{nextLesson.summary}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Not published yet. It will be linked here when it&apos;s ready.
                  </p>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
                  <div>
                    <p className="font-semibold text-zinc-950 dark:text-zinc-50">Learning with {PROGRAM.name}?</p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Register as a learner to join the community and follow along as new lessons are published.
                    </p>
                  </div>
                  <Link href="/register" className={`shrink-0 ${primaryButton}`}>
                    Register
                  </Link>
                </div>
              </section>
            )}

            <nav
              aria-label="Part navigation"
              className="flex flex-col-reverse gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800"
            >
              <Link
                href={previous?.href ?? LESSON_HREF}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <span aria-hidden="true">&larr;</span> {previous ? previous.title : "Lesson overview"}
              </Link>
              <CompletePartButton
                lessonId={LESSON_ID}
                slug={part.slug}
                href={next?.href ?? LESSON_HREF}
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

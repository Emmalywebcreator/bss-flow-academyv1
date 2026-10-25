import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { LESSONS, type Lesson } from "@/constants/learning";
import { Section, StatusBadge } from "@/app/_home/section";

const fee = `₦${PROGRAM.standardPrice.toLocaleString()}`;

/** The first lessons, and how to register as a learner. */
export function FeaturedLearning() {
  return (
    <Section
      id="featured"
      eyebrow="Featured learning"
      title="Start here"
      intro="Learning begins with how the internet and websites work. Lessons are self-paced, and the first one is free to read, so you can start right now."
      tinted
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <ul className="flex flex-col gap-6 lg:col-span-3">
          {LESSONS.map((lesson) => (
            <li key={lesson.title} className="flex-1">
              <LessonCard lesson={lesson} />
            </li>
          ))}
        </ul>
        <RegisterCard />
      </div>
    </Section>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const published = lesson.status === "published" && lesson.href;

  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-2xl border p-6 sm:p-8 ${
        published
          ? "border-accent/50 bg-white ring-1 ring-accent/20 dark:bg-black"
          : "border-dashed border-zinc-300 bg-white/60 dark:border-zinc-700 dark:bg-black/40"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge open={Boolean(published)}>{published ? "Free lesson" : "Coming soon"}</StatusBadge>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {lesson.stage} &middot; Lesson {lesson.number}
        </span>
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">{lesson.title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{lesson.summary}</p>
      {published ? (
        <Link
          href={lesson.href!}
          className="mt-auto self-start rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Start lesson {lesson.number}
        </Link>
      ) : (
        <p className="mt-auto text-sm text-zinc-500 dark:text-zinc-400">
          Not published yet. It will appear here when it&apos;s ready.
        </p>
      )}
    </article>
  );
}

function RegisterCard() {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 lg:col-span-2 dark:border-zinc-800 dark:bg-black">
      <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">Register as a learner</h3>
      <p className="text-zinc-600 dark:text-zinc-400">
        Join with a sponsored code or a one-time fee of {fee}.
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <Link
          href="/register"
          className="rounded-full bg-zinc-950 px-8 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Register now
        </Link>
        <Link
          href="/refund-policy"
          className="text-sm text-zinc-600 underline underline-offset-2 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Refund policy
        </Link>
      </div>
    </article>
  );
}

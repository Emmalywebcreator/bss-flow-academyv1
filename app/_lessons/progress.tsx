"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

/*
 * Which parts of a lesson the reader has finished. Lessons are open to
 * everyone, so progress is kept in this browser's localStorage only.
 * Storage can be missing or blocked (private windows, previews), so
 * every access is guarded and the page still works without it.
 */

const CHANGE_EVENT = "lesson-progress-change";

function storageKey(lessonId: string) {
  return `lesson-progress:${lessonId}`;
}

function readRaw(lessonId: string): string {
  try {
    return localStorage.getItem(storageKey(lessonId)) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function markPartComplete(lessonId: string, slug: string) {
  const done = parse(readRaw(lessonId));
  if (done.includes(slug)) return;
  try {
    localStorage.setItem(storageKey(lessonId), JSON.stringify([...done, slug]));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** The slugs of the parts finished so far. Empty on the server. */
export function useCompletedParts(lessonId: string): string[] {
  // The snapshot is the raw string, so it compares equal between reads.
  const raw = useSyncExternalStore(subscribe, () => readRaw(lessonId), () => "[]");
  return parse(raw);
}

export type PartEntry = { slug: string; title: string; href: string };

/** "3 of 9 parts complete" with a bar. */
export function LessonProgress({ lessonId, parts }: { lessonId: string; parts: readonly PartEntry[] }) {
  const completed = useCompletedParts(lessonId);
  const done = parts.filter((p) => completed.includes(p.slug)).length;
  const percent = Math.round((done / parts.length) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium text-zinc-950 dark:text-zinc-50">
          {done === parts.length ? "Lesson complete" : `${done} of ${parts.length} parts complete`}
        </span>
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={0}
        aria-valuemax={parts.length}
        aria-valuenow={done}
        aria-valuetext={`${done} of ${parts.length} parts complete`}
        className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/** The lesson's parts, with a tick on each finished one. */
export function PartList({
  lessonId,
  parts,
  currentSlug,
}: {
  lessonId: string;
  parts: readonly PartEntry[];
  currentSlug?: string;
}) {
  const completed = useCompletedParts(lessonId);

  return (
    <ol className="flex flex-col gap-1 text-sm">
      {parts.map((part, i) => {
        const isDone = completed.includes(part.slug);
        const isCurrent = part.slug === currentSlug;
        return (
          <li key={part.slug}>
            <Link
              href={part.href}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex items-start gap-3 rounded-md px-2 py-1.5 ${
                isCurrent
                  ? "bg-zinc-100 font-medium text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[0.7rem] ${
                  isDone
                    ? "bg-accent text-white dark:text-zinc-950"
                    : "border border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {isDone ? <span aria-hidden="true">&#10003;</span> : i + 1}
              </span>
              <span>
                {part.title}
                {isDone && <span className="sr-only"> (complete)</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Links to the first unfinished part: "Start lesson" or "Continue". */
export function ContinueLink({
  lessonId,
  parts,
  className,
}: {
  lessonId: string;
  parts: readonly PartEntry[];
  className?: string;
}) {
  const completed = useCompletedParts(lessonId);
  const next = parts.find((p) => !completed.includes(p.slug));
  const started = completed.length > 0;
  const target = next ?? parts[0];
  const label = !started ? "Start the lesson" : next ? `Continue: ${next.title}` : "Read it again";

  return (
    <Link href={target.href} className={className}>
      {label} <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

function timeKey(lessonId: string) {
  return `lesson-time:${lessonId}`;
}

function readTimes(lessonId: string): Record<string, number> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(timeKey(lessonId)) ?? "{}");
    return value && typeof value === "object" ? (value as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/** Seconds spent on a part so far, across visits. */
export function secondsOnPart(lessonId: string, slug: string): number {
  const seconds = readTimes(lessonId)[slug];
  return typeof seconds === "number" ? seconds : 0;
}

function addSecond(lessonId: string, slug: string) {
  const times = readTimes(lessonId);
  try {
    localStorage.setItem(timeKey(lessonId), JSON.stringify({ ...times, [slug]: secondsOnPart(lessonId, slug) + 1 }));
  } catch {
    // Storage unavailable: time simply isn't counted.
  }
}

/**
 * The link at the end of a part. It always moves on, but it only marks
 * the part complete once the reader has spent `requiredSeconds` on it
 * (counted while the tab is visible), so skimming doesn't count.
 */
export function CompletePartButton({
  lessonId,
  slug,
  href,
  nextTitle,
  requiredSeconds,
  className,
}: {
  lessonId: string;
  slug: string;
  href: string;
  /** Title of the next part, or undefined on the last part. */
  nextTitle?: string;
  requiredSeconds: number;
  className?: string;
}) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") addSecond(lessonId, slug);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lessonId, slug]);

  function handleClick() {
    if (secondsOnPart(lessonId, slug) >= requiredSeconds) markPartComplete(lessonId, slug);
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {nextTitle ? `Next: ${nextTitle}` : "Finish the lesson"} <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

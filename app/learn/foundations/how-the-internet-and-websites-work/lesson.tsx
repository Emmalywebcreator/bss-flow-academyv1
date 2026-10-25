import Link from "next/link";
import { LESSONS } from "@/constants/learning";
import type { PartEntry } from "@/app/_lessons/progress";
import { PARTS } from "./content";

export const lesson = LESSONS[0];
export const nextLesson = LESSONS[1];
export const LESSON_ID = "how-the-internet-and-websites-work";
export const LESSON_HREF = lesson.href!;

/** Plain data about each part, safe to pass to client components. */
export const PART_ENTRIES: readonly PartEntry[] = PARTS.map(({ slug, title }) => ({
  slug,
  title,
  href: `${LESSON_HREF}/${slug}`,
}));

type Crumb = { label: string; href?: string };

export function Breadcrumb({ trail }: { trail: readonly Crumb[] }) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: lesson.stage, href: "/#learning-paths" }, ...trail];
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

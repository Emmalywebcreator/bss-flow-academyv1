import type { ReactNode } from "react";
import Link from "next/link";

/** Shared layout for the terms, privacy and refund policy pages. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <article className="flex w-full max-w-2xl flex-col gap-4 text-zinc-700 dark:text-zinc-300 [&_a]:font-medium [&_a]:text-zinc-950 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-zinc-50 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-950 dark:[&_h2]:text-zinc-50 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <Link href="/" className="text-sm">
          &larr; Back to home
        </Link>
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Last updated: {updated}</p>
        {children}
      </article>
    </div>
  );
}

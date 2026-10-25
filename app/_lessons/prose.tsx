import type { ReactNode } from "react";

/**
 * Body text styling for lesson sections, in the style of LegalPage.
 * Only the section's own paragraphs, headings and lists are styled
 * (`>`), so embedded components such as the diagram and quiz keep
 * their own list and text styles.
 */
export const proseClass =
  "flex flex-col gap-4 text-zinc-700 leading-7 dark:text-zinc-300 [&>p_a]:font-medium [&>p_a]:text-zinc-950 [&>p_a]:underline [&>p_a]:underline-offset-2 dark:[&>p_a]:text-zinc-50 [&>h3]:mt-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-zinc-950 dark:[&>h3]:text-zinc-50 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-6 [&>*_strong]:font-semibold [&>p_strong]:text-zinc-950 [&>ul_strong]:text-zinc-950 [&>ol_strong]:text-zinc-950 dark:[&>p_strong]:text-zinc-50 dark:[&>ul_strong]:text-zinc-50 dark:[&>ol_strong]:text-zinc-50";

/** A highlighted note for an idea worth remembering. */
export function KeyIdea({ title = "Key idea", children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="rounded-xl border-l-4 border-accent bg-accent-soft px-5 py-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">{title}</p>
      <div className="mt-1 text-zinc-800 dark:text-zinc-200">{children}</div>
    </aside>
  );
}

/** A block of code or terminal output. */
export function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <figcaption className="border-b border-zinc-800 px-4 py-2 font-mono text-xs text-zinc-400">
        {label}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-zinc-100">
        <code>{children.trim()}</code>
      </pre>
    </figure>
  );
}

/** Inline code, for names like `index.html` or `git commit`. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50">
      {children}
    </code>
  );
}

import type { ReactNode } from "react";

/** A homepage section: an anchor id, an eyebrow, a heading and its content. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  tinted = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  tinted?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`px-4 py-20 sm:px-6 sm:py-24 ${
        tinted ? "bg-zinc-50 dark:bg-zinc-950" : "bg-white dark:bg-black"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
          <h2
            id={`${id}-heading`}
            className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50"
          >
            {title}
          </h2>
          {intro && <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{intro}</p>}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/** A small pill that says whether something is available yet. */
export function StatusBadge({ children, open = false }: { children: ReactNode; open?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        open
          ? "bg-accent-soft text-accent"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
      }`}
    >
      {open && <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />}
      {children}
    </span>
  );
}

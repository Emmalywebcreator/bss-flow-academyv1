import { LEARNING_PATH } from "@/constants/learning";
import { Section } from "@/app/_home/section";

export function LearningPath() {
  return (
    <Section
      id="learning-paths"
      eyebrow="Learning paths"
      title="From your first web page to shipping real software"
      intro="Every path follows the same four stages, so you always know where you are and what comes next. This is the structure lessons will be added to, stage by stage."
      tinted
    >
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {LEARNING_PATH.map((stage, i) => (
          <li
            key={stage.title}
            className="relative flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-zinc-950 font-mono text-sm font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
                {i + 1}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {stage.level}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{stage.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{stage.description}</p>
            {/* A bar under each card that fills in as the stages advance. */}
            <div aria-hidden="true" className="mt-auto flex gap-1 pt-2">
              {LEARNING_PATH.map((_, j) => (
                <span
                  key={j}
                  className={`h-1 flex-1 rounded-full ${
                    j <= i ? "bg-accent" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

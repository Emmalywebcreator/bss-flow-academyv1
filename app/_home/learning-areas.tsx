import { LEARNING_AREAS, type LearningArea } from "@/constants/learning";
import { Section, StatusBadge } from "@/app/_home/section";
import { AreaIcon } from "@/app/_home/icons";

export function LearningAreas() {
  return (
    <Section
      id="explore"
      eyebrow="Explore learning"
      title="The areas we teach, and plan to"
      intro="Every area starts from the same foundations. These areas are planned, and each one opens when its first lessons are published."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_AREAS.map((area) => (
          <li key={area.id}>
            <AreaCard area={area} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function AreaCard({ area }: { area: LearningArea }) {
  const open = area.status === "open";

  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 dark:bg-zinc-950 ${
        open
          ? "border-accent/50 ring-1 ring-accent/20"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex size-11 items-center justify-center rounded-xl ${
            open
              ? "bg-accent-soft text-accent"
              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          }`}
        >
          <AreaIcon id={area.id} />
        </span>
        <StatusBadge open={open}>{open ? "Open now" : "Planned"}</StatusBadge>
      </div>
      <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{area.title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{area.description}</p>
    </article>
  );
}

import { TEACHING_PRINCIPLES } from "@/constants/learning";
import { PROGRAM } from "@/constants/program";
import { Section } from "@/app/_home/section";
import { AreaIcon } from "@/app/_home/icons";

const icons = ["explain", "order", "practice", "progress"];

export function WhySection() {
  return (
    <Section
      id="why"
      eyebrow={`Why ${PROGRAM.name}`}
      title="Built for people who are just getting started"
      intro="You don't need a technical background. These are the principles we build every lesson around."
    >
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {TEACHING_PRINCIPLES.map((principle, i) => (
          <li key={principle.title} className="flex flex-col gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <AreaIcon id={icons[i]} />
            </span>
            <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">{principle.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{principle.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

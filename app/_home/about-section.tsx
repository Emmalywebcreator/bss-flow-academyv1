import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { SupportEmail } from "@/app/support-email";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-white px-4 py-20 sm:px-6 sm:py-24 dark:bg-black"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">About</p>
          <h2
            id="about-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50"
          >
            About {PROGRAM.name}
          </h2>
          <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-500">
            {PROGRAM.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-lg text-zinc-600 dark:text-zinc-400">
          <p>
            {PROGRAM.name} is a self-paced, {PROGRAM.format.toLowerCase()} place to learn technology,
            run by {PROGRAM.operator} from {PROGRAM.location}.
          </p>
          <p>
            Our motto — {PROGRAM.tagline} — describes the path we teach: learn to make something,
            make it hold up as it grows, then put it in front of real users. We&apos;re starting
            with the foundations and will add lessons and learning paths over time.
          </p>
          <p className="text-base">
            Questions? Email <SupportEmail />, or read our{" "}
            <Link href="/terms" className="font-medium text-zinc-950 underline underline-offset-2 dark:text-zinc-50">
              terms
            </Link>{" "}
            before registering.
          </p>
        </div>
      </div>
    </section>
  );
}

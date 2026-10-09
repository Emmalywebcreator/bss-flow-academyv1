import Link from "next/link";
import { PROGRAM } from "@/constants/program";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {PROGRAM.firstCohort} &middot; Registration open
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {PROGRAM.name}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{PROGRAM.tagline}</p>
        <p className="max-w-md text-base text-zinc-600 dark:text-zinc-400">
          A hands-on training program in {PROGRAM.topic.toLowerCase()}. Register below to
          join {PROGRAM.firstCohort} — with a sponsored code or a one-time
          fee of &#8358;{PROGRAM.standardPrice.toLocaleString()}.
        </p>
        <dl className="grid w-full max-w-md grid-cols-2 gap-4 text-left sm:grid-cols-4">
          {[
            ["Starts", PROGRAM.firstCohortStart],
            ["Duration", PROGRAM.duration],
            ["Format", PROGRAM.format],
            ["Fee", `₦${PROGRAM.standardPrice.toLocaleString()}`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">{value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/register"
          className="rounded-full bg-zinc-950 px-8 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Register now
        </Link>
      </main>
    </div>
  );
}

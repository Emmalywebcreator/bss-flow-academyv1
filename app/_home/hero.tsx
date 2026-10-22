import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { StatusBadge } from "@/app/_home/section";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-white px-4 pb-20 pt-16 sm:px-6 sm:pt-24 dark:bg-black">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <StatusBadge open>Self-paced learning</StatusBadge>
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-zinc-50"
          >
            Learn tech by building real things.
          </h1>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            {PROGRAM.name} teaches practical technology skills in plain language, one step at a
            time, at your own pace. Learning starts with the foundations: how the internet and
            websites work.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#explore"
              className="rounded-full bg-zinc-950 px-6 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Explore learning
            </Link>
            <Link
              href="#about"
              className="rounded-full border border-zinc-300 px-6 py-3 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              About {PROGRAM.name}
            </Link>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

/** A code editor and the build → scale → ship steps. Decorative only. */
function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-zinc-950/10">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <span className="size-3 rounded-full bg-zinc-700" />
          <span className="size-3 rounded-full bg-zinc-700" />
          <span className="size-3 rounded-full bg-zinc-700" />
          <span className="ml-3 font-mono text-xs text-zinc-400">index.html</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-zinc-300 sm:text-sm">
          <code>
            <span className="text-zinc-500">{"<!-- your first web page -->"}</span>
            {"\n"}
            <Tag name="main" />
            {"\n  "}
            <Tag name="h1" />
            <span className="text-zinc-50">Hello, web</span>
            <Tag name="h1" close />
            {"\n  "}
            <Tag name="p" />
            <span className="text-zinc-50">I built this.</span>
            <Tag name="p" close />
            {"\n"}
            <Tag name="main" close />
          </code>
        </pre>
        <ol className="grid grid-cols-3 border-t border-zinc-800 text-xs sm:text-sm">
          {["Build", "Scale", "Ship"].map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-2 border-zinc-800 px-4 py-3 text-zinc-300 [&:not(:first-child)]:border-l"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-400 font-mono text-[11px] font-semibold text-zinc-950">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="absolute -bottom-6 right-4 hidden rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-lg sm:block dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Preview</p>
        <p className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Hello, web</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">I built this.</p>
      </div>
    </div>
  );
}

function Tag({ name, close = false }: { name: string; close?: boolean }) {
  return (
    <span className="text-sky-300">
      {close ? "</" : "<"}
      <span className="text-emerald-400">{name}</span>
      {">"}
    </span>
  );
}

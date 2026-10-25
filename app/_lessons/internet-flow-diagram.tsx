import type { CSSProperties } from "react";

// The four parties in a page load, left to right.
const LANES = [
  { id: "browser", name: "Browser", color: "text-sky-700 dark:text-sky-300", box: "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40" },
  { id: "dns", name: "DNS resolver", color: "text-amber-700 dark:text-amber-300", box: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40" },
  { id: "server", name: "Web server / app", color: "text-emerald-700 dark:text-emerald-300", box: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40" },
  { id: "database", name: "Database (optional)", color: "text-violet-700 dark:text-violet-300", box: "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40" },
] as const;

type LaneId = (typeof LANES)[number]["id"];

type Step = {
  title: string;
  detail: string;
  optional?: boolean;
} & (
  | { kind: "self"; at: LaneId }
  | { kind: "request" | "response" | "both"; from: LaneId; to: LaneId }
);

const STEPS: readonly Step[] = [
  { kind: "self", at: "browser", title: "You enter a URL", detail: "https://www.example.com" },
  {
    kind: "self",
    at: "browser",
    title: "Check for cached DNS",
    detail: "Browser and operating system look for a recent answer first.",
  },
  {
    kind: "request",
    from: "browser",
    to: "dns",
    optional: true,
    title: "Ask for the IP address",
    detail: "Only if no usable cached answer: “Where is www.example.com?”",
  },
  {
    kind: "response",
    from: "dns",
    to: "browser",
    optional: true,
    title: "IP address returned",
    detail: "e.g. 203.0.113.10 — an address, not the page itself.",
  },
  {
    kind: "both",
    from: "browser",
    to: "server",
    title: "Connect (+ TLS for HTTPS)",
    detail: "A connection opens; TLS encrypts it and checks the server’s certificate.",
  },
  { kind: "request", from: "browser", to: "server", title: "HTTP request", detail: "GET / — “please send the home page”" },
  {
    kind: "self",
    at: "server",
    title: "Process the request",
    detail: "Serve a file, or run application code.",
  },
  {
    kind: "request",
    from: "server",
    to: "database",
    optional: true,
    title: "Query",
    detail: "Only when stored data is needed.",
  },
  { kind: "response", from: "database", to: "server", optional: true, title: "Data", detail: "Rows sent back to the app." },
  {
    kind: "response",
    from: "server",
    to: "browser",
    title: "HTTP response",
    detail: "200 OK, with the HTML of the page.",
  },
  {
    kind: "self",
    at: "browser",
    title: "Display the page",
    detail: "Reads HTML, applies CSS, runs JavaScript, and requests images and other files.",
  },
];

const laneIndex = (id: LaneId) => LANES.findIndex((lane) => lane.id === id);
const laneOf = (id: LaneId) => LANES[laneIndex(id)];

/**
 * How a web page is delivered, as a sequence diagram. One ordered list
 * serves every screen size: from `sm` up each step is placed across
 * four lanes with an arrow; below that, steps stack as cards that name
 * who talks to whom.
 */
export function InternetFlowDiagram() {
  return (
    <figure className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <Legend />

      <div className="relative">
        {/* Lane headers and dashed lifelines, desktop only. */}
        <div aria-hidden="true" className="hidden grid-cols-4 pb-3 sm:grid">
          {LANES.map((lane) => (
            <div key={lane.id} className="px-1 text-center">
              <span className={`inline-block rounded-lg border px-2 py-1 text-xs font-semibold ${lane.box} ${lane.color}`}>
                {lane.name}
              </span>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 top-10 hidden sm:block">
          {LANES.map((lane, i) => (
            <span
              key={lane.id}
              className="absolute inset-y-0 border-l-2 border-dotted border-zinc-200 dark:border-zinc-800"
              style={{ left: `${12.5 + i * 25}%` }}
            />
          ))}
        </div>

        <ol className="relative flex flex-col gap-3 sm:gap-4">
          {STEPS.map((step, i) => (
            <StepRow key={step.title} step={step} number={i + 1} />
          ))}
        </ol>
      </div>

      <figcaption className="border-t border-zinc-200 pt-4 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        How a web page is delivered. Steps 3–4 are skipped when a cached DNS answer is still valid,
        and steps 8–9 only happen when the application needs stored data. The browser never talks
        to the database directly: only the server-side application does.
      </figcaption>
    </figure>
  );
}

function StepRow({ step, number }: { step: Step; number: number }) {
  const optionalTag = step.optional && (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      if needed
    </span>
  );

  if (step.kind === "self") {
    const lane = laneOf(step.at);
    const col = laneIndex(step.at) + 1;
    return (
      <li className="sm:grid sm:grid-cols-4">
        <div
          style={{ gridColumn: `${col} / ${col + 1}` } as CSSProperties}
          className={`flex flex-col gap-1 rounded-xl border p-3 sm:mx-1 sm:p-2 sm:text-center ${lane.box}`}
        >
          <p className="flex flex-wrap items-center gap-2 sm:justify-center">
            <StepNumber n={number} />
            <span className={`text-xs font-semibold sm:sr-only ${lane.color}`}>{lane.name}:</span>
            <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{step.title}</span>
          </p>
          <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">{step.detail}</p>
        </div>
      </li>
    );
  }

  const from = laneIndex(step.from);
  const to = laneIndex(step.to);
  const start = Math.min(from, to);
  const span = Math.abs(to - from) + 1;
  // The arrow runs between the centres of the two lanes it joins.
  const inset = `${(0.5 / span) * 100}%`;
  const direction = step.kind === "both" ? "both" : to > from ? "right" : "left";
  const verb = { request: "sends to", response: "replies to", both: "connects with" }[step.kind];

  return (
    <li className="sm:grid sm:grid-cols-4">
      <div
        style={{ gridColumn: `${start + 1} / ${start + span + 1}` } as CSSProperties}
        className="flex flex-col gap-1 rounded-xl border border-zinc-200 p-3 sm:rounded-none sm:border-0 sm:p-0 dark:border-zinc-800"
      >
        <p className="flex flex-wrap items-center gap-2 sm:justify-center">
          <StepNumber n={number} />
          <span className="text-xs font-semibold sm:sr-only">
            <span className={laneOf(step.from).color}>{laneOf(step.from).name}</span>{" "}
            <span className="text-zinc-500 dark:text-zinc-400">{verb}</span>{" "}
            <span className={laneOf(step.to).color}>{laneOf(step.to).name}</span>:
          </span>
          <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{step.title}</span>
          {optionalTag}
        </p>
        <div aria-hidden="true" className="relative hidden h-4 text-zinc-700 sm:block dark:text-zinc-300" >
          <div className="absolute inset-y-0" style={{ left: inset, right: inset }}>
            <Arrow direction={direction} dashed={step.kind === "response"} />
          </div>
        </div>
        <p className="text-xs leading-5 text-zinc-600 sm:px-6 sm:text-center dark:text-zinc-400">
          {step.detail}
        </p>
      </div>
    </li>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-950 font-mono text-[11px] font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
      {n}
    </span>
  );
}

function Arrow({ direction, dashed }: { direction: "left" | "right" | "both"; dashed: boolean }) {
  const head = (side: "left" | "right") => (
    <svg
      viewBox="0 0 10 10"
      className={`absolute top-1/2 size-3 -translate-y-1/2 ${side === "right" ? "-right-1" : "-left-1 rotate-180"}`}
    >
      <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
    </svg>
  );

  return (
    <div className="relative h-full">
      <span
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-current ${dashed ? "border-dashed" : ""}`}
      />
      {(direction === "right" || direction === "both") && head("right")}
      {(direction === "left" || direction === "both") && head("left")}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-col gap-3 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
      {/* Below `sm` the lanes become this key of who's who. */}
      <ul aria-label="Parties" className="flex flex-wrap gap-2 sm:hidden">
        {LANES.map((lane) => (
          <li key={lane.id} className={`rounded-lg border px-2 py-1 font-semibold ${lane.box} ${lane.color}`}>
            {lane.name}
          </li>
        ))}
      </ul>
      <ul aria-label="Arrow key" className="hidden flex-wrap gap-x-5 gap-y-2 sm:flex">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="w-8 border-t-2 border-zinc-700 dark:border-zinc-300" />
          Request
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="w-8 border-t-2 border-dashed border-zinc-700 dark:border-zinc-300" />
          Response
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            if needed
          </span>
          Optional step
        </li>
      </ul>
    </div>
  );
}

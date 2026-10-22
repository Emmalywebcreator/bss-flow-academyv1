// Line icons for the homepage, drawn on a 24×24 grid in currentColor.

const paths: Record<string, string> = {
  // Browser window
  "web-development": "M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01",
  // Code brackets
  programming: "M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14",
  // Branching graph
  "software-engineering": "M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9",
  // Cloud
  "cloud-computing": "M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z",
  // Loop
  devops: "M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4",
  // Speech bubble
  explain: "M4 5h16v11H9l-5 4z",
  // Numbered list
  order: "M10 6h10M10 12h10M10 18h10M4 5l1.5-1V9M4 12h2l-2 2.5h2M4 17h2v3H4M4 18.5h2",
  // Pencil
  practice: "M4 20l4-1 11-11-3-3L5 16zM14 7l3 3",
  // Rising steps
  progress: "M3 20h5v-5h5v-5h5V4h3",
};

export function AreaIcon({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[id]} />
    </svg>
  );
}

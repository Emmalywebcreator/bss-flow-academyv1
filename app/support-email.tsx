import { PROGRAM } from "@/constants/program";

/** The support address as a mailto link, for inline use in body text. */
export function SupportEmail() {
  return (
    <a
      href={`mailto:${PROGRAM.supportEmail}`}
      className="font-medium text-zinc-950 underline underline-offset-2 dark:text-zinc-50"
    >
      {PROGRAM.supportEmail}
    </a>
  );
}

import Link from "next/link";
import { PROGRAM } from "@/constants/program";

export default function WelcomePage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
          You&apos;re enrolled 🎉
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome to {PROGRAM.name}, {PROGRAM.firstCohort}. The next step is joining the community
          on Telegram, where cohort announcements and session links will be shared.
        </p>
        <Link
          href={PROGRAM.telegramInviteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-zinc-950 px-8 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Join the Telegram community
        </Link>
      </div>
    </div>
  );
}

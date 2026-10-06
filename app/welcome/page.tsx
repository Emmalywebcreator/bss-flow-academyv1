import Link from "next/link";
import { cookies } from "next/headers";
import { PROGRAM } from "@/constants/program";
import { SupportEmail } from "@/app/support-email";
import { ENROLLMENT_COOKIE, hasActiveEnrollment } from "@/lib/enrollment-access";

/**
 * Only shown to enrolled students: the enrollment cookie set by the
 * cohort-code and payment-verify routes is checked against the
 * enrollments table on every request.
 */
export default async function WelcomePage() {
  const registrationId = (await cookies()).get(ENROLLMENT_COOKIE)?.value;
  const enrolled = await hasActiveEnrollment(registrationId);

  if (!enrolled) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            We couldn&apos;t find your enrollment
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            This page is for enrolled {PROGRAM.firstCohort} students. If you enrolled on another
            device or browser, open this page there, or contact support at <SupportEmail />.
          </p>
          <Link
            href="/register"
            className="rounded-full bg-zinc-950 px-8 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Register for {PROGRAM.firstCohort}
          </Link>
        </div>
      </div>
    );
  }

  // Server-side only, so the link never reaches the browser bundle.
  const telegramInviteLink = process.env.TELEGRAM_INVITE_LINK;
  if (!telegramInviteLink) {
    console.error("Missing TELEGRAM_INVITE_LINK environment variable.");
  }

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
        {telegramInviteLink ? (
          <Link
            href={telegramInviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-950 px-8 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Join the Telegram community
          </Link>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The community link isn&apos;t available right now. Please contact support at{" "}
            <SupportEmail /> to get it.
          </p>
        )}
      </div>
    </div>
  );
}

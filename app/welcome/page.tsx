import Link from "next/link";
import { cookies } from "next/headers";
import { LEARNING_PATH, UPCOMING_LESSONS } from "@/constants/learning";
import { SupportEmail } from "@/app/support-email";
import {
  ENROLLMENT_COOKIE,
  getLearnerFirstName,
  hasActiveEnrollment,
} from "@/lib/enrollment-access";

/**
 * The learner's start page. Only shown to enrolled students: the
 * enrollment cookie (set on enrolling or logging in) is checked against
 * the enrollments table on every request.
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
            This page is for enrolled learners. If you&apos;ve already enrolled, log in with the
            email you registered with. Need help? Contact support at <SupportEmail />.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-zinc-950 px-8 py-3 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-zinc-300 px-8 py-3 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Server-side only, so the link never reaches the browser bundle.
  const telegramInviteLink = process.env.TELEGRAM_INVITE_LINK;
  if (!telegramInviteLink) {
    console.error("Missing TELEGRAM_INVITE_LINK environment variable.");
  }

  const firstName = await getLearnerFirstName(registrationId!);
  const [firstStage, ...laterStages] = LEARNING_PATH;
  const firstLesson = UPCOMING_LESSONS[0];

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-16 sm:px-6 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            You&apos;re enrolled
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
            Welcome{firstName ? `, ${firstName}` : ""}. Where would you like to start?
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Learning is self-paced. If you&apos;re new to tech, start with {firstStage.title} —
            every later stage builds on it.
          </p>
        </header>

        <section aria-labelledby="start-heading" className="flex flex-col gap-4">
          <h2 id="start-heading" className="sr-only">
            Starting points
          </h2>

          <article className="flex flex-col gap-4 rounded-2xl border border-accent/50 bg-white p-6 ring-1 ring-accent/20 sm:p-8 dark:bg-zinc-950">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                Recommended for beginners
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Stage 1 &middot; {firstStage.level}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">{firstStage.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{firstStage.description}</p>
            {firstLesson && (
              <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Lesson 1: {firstLesson.title}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Coming soon — it will open here as soon as it&apos;s published.
                </p>
              </div>
            )}
          </article>

          <ul className="grid gap-4 sm:grid-cols-3">
            {laterStages.map((stage, i) => (
              <li
                key={stage.title}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Stage {i + 2}</span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                    Planned
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">{stage.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{stage.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="community-heading"
          className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div>
            <h2 id="community-heading" className="font-semibold text-zinc-950 dark:text-zinc-50">
              Learner community
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Ask questions and get updates on Telegram. Only for registered learners.
            </p>
          </div>
          {telegramInviteLink ? (
            <Link
              href={telegramInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-zinc-300 px-6 py-2.5 text-center text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Join the Telegram community
            </Link>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The community link isn&apos;t available right now. Please contact support at{" "}
              <SupportEmail /> to get it.
            </p>
          )}
        </section>

        <form action="/api/logout" method="post" className="text-center">
          <button type="submit" className="text-sm text-zinc-500 underline dark:text-zinc-400">
            Log out on this device
          </button>
        </form>
      </div>
    </div>
  );
}

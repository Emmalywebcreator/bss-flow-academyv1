import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { PROGRAM } from "@/constants/program";
import { ENROLLMENT_COOKIE } from "@/lib/enrollment-access";

export const metadata: Metadata = {
  title: `Log out — ${PROGRAM.name}`,
  description: `Log out of ${PROGRAM.name} on this device.`,
};

const primaryButton =
  "rounded-full bg-zinc-950 px-6 py-3 text-center text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200";
const secondaryLink =
  "text-center text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50";

/**
 * Asks a signed-in learner to confirm logging out, and confirms it
 * afterwards (/api/logout sends them back here). Logging out is a POST,
 * so another site can't log someone out just by linking to it.
 */
export default async function LogoutPage() {
  const signedIn = (await cookies()).has(ENROLLMENT_COOKIE);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        {signedIn ? (
          <>
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Log out on this device?
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your lesson progress stays saved in this browser. To come back, log in with a code
              sent to the email you registered with.
            </p>
            <form action="/api/logout" method="post" className="mt-2 flex flex-col gap-3">
              <button type="submit" className={primaryButton}>
                Log out
              </button>
              <Link href="/learn" className={secondaryLink}>
                Cancel, back to my learning
              </Link>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              You&apos;re logged out
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              You&apos;re not logged in to {PROGRAM.name} on this device. Log in to open your
              lessons again.
            </p>
            <Link href="/login" className={`mt-2 ${primaryButton}`}>
              Log in
            </Link>
            <Link href="/" className={secondaryLink}>
              Back to home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

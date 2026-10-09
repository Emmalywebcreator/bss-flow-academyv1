import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { SupportEmail } from "@/app/support-email";

/** Contact details and policy links, shown on every page. */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-6 py-8 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/terms" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Terms and Conditions
          </Link>
          <Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Refund Policy
          </Link>
        </nav>
        <p>
          Contact: <SupportEmail /> &middot;{" "}
          <a href={PROGRAM.supportPhoneLink} className="hover:text-zinc-950 dark:hover:text-zinc-50">
            {PROGRAM.supportPhone}
          </a>
        </p>
        <p>
          &copy; 2026 {PROGRAM.name} &middot; Run by {PROGRAM.operator} &middot; {PROGRAM.location}
        </p>
      </div>
    </footer>
  );
}

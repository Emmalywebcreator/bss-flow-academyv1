import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { NAV_LINKS } from "@/app/nav-links";
import { SignedIn, SignedOut } from "@/app/session";

const linkClass = "hover:text-zinc-950 dark:hover:text-zinc-50";

/** Navigation, contact details and policy links, shown on every page. */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-12 text-sm text-zinc-600 sm:px-6 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-zinc-950 dark:text-zinc-50">{PROGRAM.name}</p>
          <p>{PROGRAM.tagline}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <h2 className="font-medium text-zinc-950 dark:text-zinc-50">Learn</h2>
          {NAV_LINKS.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <SignedOut>
            <Link href="/register" className={linkClass}>
              Register
            </Link>
            <Link href="/login" className={linkClass}>
              Log in
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/learn" className={linkClass}>
              My learning
            </Link>
            <Link href="/logout" className={linkClass}>
              Log out
            </Link>
          </SignedIn>
        </nav>

        <nav aria-label="Policies" className="flex flex-col gap-2">
          <h2 className="font-medium text-zinc-950 dark:text-zinc-50">Policies</h2>
          <Link href="/terms" className={linkClass}>
            Terms and Conditions
          </Link>
          <Link href="/privacy" className={linkClass}>
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className={linkClass}>
            Refund Policy
          </Link>
        </nav>

        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-zinc-950 dark:text-zinc-50">Contact</h2>
          <a href={`mailto:${PROGRAM.supportEmail}`} className={linkClass}>
            {PROGRAM.supportEmail}
          </a>
          <a href={PROGRAM.supportPhoneLink} className={linkClass}>
            {PROGRAM.supportPhone}
          </a>
          <p>{PROGRAM.location}</p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-zinc-200 pt-6 dark:border-zinc-800">
        &copy; 2026 {PROGRAM.name} &middot; Run by {PROGRAM.operator}
      </p>
    </footer>
  );
}

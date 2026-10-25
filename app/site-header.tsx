import Link from "next/link";
import { NAV_LINKS } from "@/app/nav-links";
import { MobileNav } from "@/app/mobile-nav";
import { SignedIn, SignedOut } from "@/app/session";

/**
 * Logo, primary navigation, and Log in and Register buttons (or My
 * learning, once signed in), shown on every page.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-black/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-md font-semibold text-zinc-950 dark:text-zinc-50">
          <LogoMark />
          {/* "Academy" is visually dropped on very narrow phones to fit the menu. */}
          <span>
            BSS Flow <span className="max-[379px]:sr-only">Academy</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SignedOut>
            {/* On phones, "Log in" lives in the menu to leave room for the logo. */}
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 sm:block dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              Log in
            </Link>
            <Link href="/register" className={primaryButton}>
              Register
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/learn" className={primaryButton}>
              My learning
            </Link>
          </SignedIn>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

const primaryButton =
  "rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200";

/** Three rising bars: build, scale, ship. */
function LogoMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 rounded-lg bg-zinc-950 p-1.5 dark:bg-zinc-50">
      <rect x="2" y="13" width="5" height="9" rx="1.5" className="fill-zinc-50 dark:fill-zinc-950" />
      <rect x="9.5" y="8" width="5" height="14" rx="1.5" className="fill-zinc-50 dark:fill-zinc-950" />
      <rect x="17" y="2" width="5" height="20" rx="1.5" className="fill-accent" />
    </svg>
  );
}

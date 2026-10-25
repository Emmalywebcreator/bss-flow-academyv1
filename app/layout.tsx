import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/app/site-header";
import { SiteFooter } from "@/app/site-footer";
import { PROGRAM } from "@/constants/program";
import { SessionProvider } from "@/app/session";
import { ENROLLMENT_COOKIE } from "@/lib/enrollment-access";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${PROGRAM.name} — Learn tech at your own pace`,
  description: `Learn practical technology skills in plain language, at your own pace with ${PROGRAM.name}, starting with how the internet and websites work.`,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Only decides which buttons to show; /learn verifies the enrollment.
  const signedIn = (await cookies()).has(ENROLLMENT_COOKIE);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#content"
          className="sr-only rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 dark:bg-zinc-50 dark:text-zinc-950"
        >
          Skip to content
        </a>
        <SessionProvider signedIn={signedIn}>
          <SiteHeader />
          <div id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </div>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}

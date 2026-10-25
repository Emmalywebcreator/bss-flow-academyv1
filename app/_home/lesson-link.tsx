"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSignedIn } from "@/app/session";
import { withReturnTo } from "@/lib/return-to";

/**
 * A link to a lesson. Lessons are for registered learners, so visitors
 * who aren't signed in go to register first and come back afterwards.
 */
export function LessonLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const signedIn = useSignedIn();
  return (
    <Link href={signedIn ? href : withReturnTo("/register", href)} className={className}>
      {children}
    </Link>
  );
}

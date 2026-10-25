import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PROGRAM } from "@/constants/program";
import { ENROLLMENT_COOKIE, hasActiveEnrollment } from "@/lib/enrollment-access";

// The registration page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: `Register — ${PROGRAM.name}`,
  description: `Register for free with ${PROGRAM.name} to learn ${PROGRAM.topic} at your own pace.`,
};

/** Enrolled learners who are already signed in go straight to /learn. */
export default async function RegisterLayout({ children }: { children: ReactNode }) {
  const registrationId = (await cookies()).get(ENROLLMENT_COOKIE)?.value;
  if (await hasActiveEnrollment(registrationId)) redirect("/learn");
  return children;
}

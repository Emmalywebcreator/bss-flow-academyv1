import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PROGRAM } from "@/constants/program";

// The registration page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: `Register — ${PROGRAM.name}`,
  description: `Register for ${PROGRAM.firstCohort} of ${PROGRAM.name}'s ${PROGRAM.topic} program, with a sponsor code or a one-time fee.`,
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}

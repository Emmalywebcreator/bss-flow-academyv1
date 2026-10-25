import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PROGRAM } from "@/constants/program";

// The registration page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: `Register — ${PROGRAM.name}`,
  description: `Register for free with ${PROGRAM.name} to learn ${PROGRAM.topic} at your own pace.`,
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}

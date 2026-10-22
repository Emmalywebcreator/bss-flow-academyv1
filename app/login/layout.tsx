import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PROGRAM } from "@/constants/program";

// The login page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: `Log in — ${PROGRAM.name}`,
  description: `Log in to ${PROGRAM.name} with a code sent to the email you registered with.`,
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}

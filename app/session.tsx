"use client";

import { createContext, useContext, type ReactNode } from "react";

/*
 * Whether the visitor is signed in, for choosing which buttons to show
 * (Register and Log in, or My learning). The root layout reads the
 * enrollment cookie on the server and provides it here, so the right
 * buttons appear on first render. This is only for display: the
 * learning page still checks the enrollment itself.
 */

const SignedInContext = createContext(false);

export function SessionProvider({ signedIn, children }: { signedIn: boolean; children: ReactNode }) {
  return <SignedInContext.Provider value={signedIn}>{children}</SignedInContext.Provider>;
}

export function useSignedIn() {
  return useContext(SignedInContext);
}

/** Shows its children only to visitors who aren't signed in. */
export function SignedOut({ children }: { children: ReactNode }) {
  return useSignedIn() ? null : children;
}

/** Shows its children only to signed-in visitors. */
export function SignedIn({ children }: { children: ReactNode }) {
  return useSignedIn() ? children : null;
}

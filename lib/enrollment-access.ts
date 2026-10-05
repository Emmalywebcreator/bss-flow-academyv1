import type { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Cookie that lets the welcome page confirm, server-side, that the
 * visitor is enrolled. It holds the registration ID (an unguessable
 * UUID only the registrant knows); access is always re-checked against
 * the enrollments table, so a revoked enrollment loses access.
 */
export const ENROLLMENT_COOKIE = "bss_enrollment";

const NINETY_DAYS = 60 * 60 * 24 * 90;

/** Call on the response of a route that has just enrolled the student. */
export function setEnrollmentCookie(response: NextResponse, registrationId: string) {
  response.cookies.set(ENROLLMENT_COOKIE, registrationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: NINETY_DAYS,
  });
  return response;
}

/** Whether the registration has an active enrollment. */
export async function hasActiveEnrollment(registrationId: string | undefined) {
  if (!registrationId) return false;

  const { data, error } = await getSupabaseServerClient()
    .from("enrollments")
    .select("id")
    .eq("registration_id", registrationId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    // An invalid UUID in a tampered cookie also lands here.
    console.error("enrollment access check failed", error);
    return false;
  }

  return Boolean(data);
}

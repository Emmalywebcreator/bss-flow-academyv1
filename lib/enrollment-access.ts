import "server-only";
import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { withReturnTo } from "@/lib/return-to";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Cookie that lets the learning page confirm, server-side, that the
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

/** Call on the response of the logout route. */
export function clearEnrollmentCookie(response: NextResponse) {
  response.cookies.delete(ENROLLMENT_COOKIE);
  return response;
}

/** The learner's first name, for greeting them; null if it can't be read. */
export async function getLearnerFirstName(registrationId: string) {
  const { data, error } = await getSupabaseServerClient()
    .from("registrations")
    .select("full_name")
    .eq("id", registrationId)
    .maybeSingle();

  if (error) console.error("learner name lookup failed", error);
  const fullName = (data as { full_name?: string } | null)?.full_name?.trim();
  return fullName ? fullName.split(/\s+/)[0] : null;
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

/**
 * For pages only enrolled learners may see. Anyone else is sent to
 * register, and brought back to `returnTo` afterwards. Call it from the
 * page itself, not a layout: layouts don't re-run on every navigation.
 */
export async function requireEnrollment(returnTo: string) {
  const registrationId = (await cookies()).get(ENROLLMENT_COOKIE)?.value;
  if (!(await hasActiveEnrollment(registrationId))) redirect(withReturnTo("/register", returnTo));
}

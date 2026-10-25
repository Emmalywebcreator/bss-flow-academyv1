import { NextResponse } from "next/server";
import { clearEnrollmentCookie } from "@/lib/enrollment-access";

/** Logs the student out on this device and confirms it on /logout. */
export async function POST(request: Request) {
  return clearEnrollmentCookie(NextResponse.redirect(new URL("/logout", request.url), 303));
}

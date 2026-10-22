import { NextResponse } from "next/server";
import { clearEnrollmentCookie } from "@/lib/enrollment-access";

/** Logs the student out on this device and sends them home. */
export async function POST(request: Request) {
  return clearEnrollmentCookie(NextResponse.redirect(new URL("/", request.url), 303));
}

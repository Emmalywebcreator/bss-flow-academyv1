import { NextResponse } from "next/server";
import { loginVerifySchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hashLoginCode, requestIp } from "@/lib/login-codes";
import { setEnrollmentCookie } from "@/lib/enrollment-access";

/**
 * Checks an emailed login code and, if it's right, sets the enrollment
 * cookie, so the student can open the welcome page on this device.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginVerifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the 6-digit code from the email." }, { status: 400 });
  }

  const { email, code } = parsed.data;

  const { data: outcome, error } = await getSupabaseServerClient().rpc("verify_login_code", {
    p_email: email,
    p_ip: requestIp(request),
    p_code_hash: hashLoginCode(code),
  });

  if (error || !outcome) {
    console.error("login code check failed", error);
    return NextResponse.json({ error: "Could not log you in. Please try again." }, { status: 500 });
  }

  const checked = outcome as VerifyLoginCodeOutcome;

  if (checked.result === "rate_limited") {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  if (checked.result === "locked") {
    return NextResponse.json(
      { error: "Too many wrong tries for this code. Request a new code." },
      { status: 400 }
    );
  }

  if (checked.result === "invalid") {
    return NextResponse.json(
      { error: "That code is wrong or has expired. Check the email, or request a new code." },
      { status: 400 }
    );
  }

  return setEnrollmentCookie(
    NextResponse.json({ ok: true }, { status: 200 }),
    checked.registration_id
  );
}

/** Shape returned by the verify_login_code database function. */
type VerifyLoginCodeOutcome =
  | { result: "rate_limited" }
  | { result: "invalid" }
  | { result: "locked" }
  | { result: "ok"; registration_id: string };

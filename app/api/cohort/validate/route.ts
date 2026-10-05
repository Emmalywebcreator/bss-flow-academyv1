import { NextResponse } from "next/server";
import { cohortCodeSchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { setEnrollmentCookie } from "@/lib/enrollment-access";

/**
 * Validates a cohort sponsorship code and, if valid and sponsored
 * places remain, creates a sponsored enrollment directly. The client
 * never determines sponsorship eligibility — only the server, against
 * Supabase.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = cohortCodeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "A registration ID and cohort code are required." },
      { status: 400 }
    );
  }

  const { registrationId, code } = parsed.data;
  const supabase = getSupabaseServerClient();

  // Limit attempts per IP and per registration so codes can't be
  // brute-forced. The host (e.g. Vercel) sets x-forwarded-for.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { data: allowed, error: rateLimitError } = await supabase.rpc(
    "record_cohort_code_attempt",
    { p_ip: ip, p_registration_id: registrationId }
  );

  if (rateLimitError) {
    console.error("cohort code rate limit check failed", rateLimitError);
    return NextResponse.json({ error: "Could not validate code." }, { status: 500 });
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  // Checks the code, the cohort's sponsored-place cap and any existing
  // enrollment, and enrolls, in one locked database call so concurrent
  // requests can't exceed the cap.
  const { data: outcome, error: enrollError } = await supabase.rpc(
    "enroll_with_sponsor_code",
    { p_registration_id: registrationId, p_code: code }
  );

  if (enrollError || !outcome) {
    console.error("sponsored enrollment failed", enrollError);
    return NextResponse.json(
      { error: "Could not complete enrollment. Please try again." },
      { status: 500 }
    );
  }

  const { result, cohort_name: cohortName } = outcome as SponsorEnrollmentOutcome;

  if (result === "invalid") {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  if (result === "full") {
    return NextResponse.json(
      {
        error:
          "All sponsored places for this cohort have been taken. You can still enroll by paying the standard fee.",
      },
      { status: 409 }
    );
  }

  return setEnrollmentCookie(
    NextResponse.json({ valid: true, cohortName }, { status: 200 }),
    registrationId
  );
}

/** Shape returned by the enroll_with_sponsor_code database function. */
type SponsorEnrollmentOutcome =
  | { result: "invalid" | "full"; cohort_name?: undefined }
  | { result: "enrolled"; cohort_name: string };

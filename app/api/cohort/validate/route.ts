import { NextResponse } from "next/server";
import { cohortCodeSchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Validates a cohort sponsorship code and, if valid, creates a
 * sponsored enrollment directly. The client never determines
 * sponsorship eligibility — only the server, against Supabase.
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

  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .select("id, name")
    .eq("sponsor_code", code)
    .eq("is_active", true)
    .maybeSingle();

  if (cohortError) {
    console.error("cohort lookup failed", cohortError);
    return NextResponse.json({ error: "Could not validate code." }, { status: 500 });
  }

  if (!cohort) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  // Already enrolled in this cohort (e.g. the code was resubmitted)
  // counts as success rather than creating a second enrollment.
  const { error: enrollmentError } = await supabase.from("enrollments").upsert(
    {
      registration_id: registrationId,
      cohort_id: cohort.id,
      access_type: "sponsored",
    },
    { onConflict: "registration_id,cohort_id", ignoreDuplicates: true }
  );

  if (enrollmentError) {
    console.error("sponsored enrollment failed", enrollmentError);
    return NextResponse.json(
      { error: "Could not complete enrollment. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ valid: true, cohortName: cohort.name }, { status: 200 });
}

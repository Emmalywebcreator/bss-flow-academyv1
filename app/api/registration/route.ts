import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PROGRAM } from "@/constants/program";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid registration data.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { fullName, email, phone, experienceLevel, learningGoal } = parsed.data;
  const supabase = getSupabaseServerClient();

  // Registration is for the current cohort; without it nobody could
  // enroll, so treat a missing cohort as a server error.
  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .select("id")
    .eq("name", PROGRAM.firstCohort)
    .maybeSingle();

  if (cohortError || !cohort) {
    console.error("registration cohort lookup failed", cohortError ?? "cohort not found");
    return NextResponse.json(
      { error: "Could not save your registration. Please try again." },
      { status: 500 }
    );
  }

  const details = {
    full_name: fullName,
    email,
    phone,
    experience_level: experienceLevel,
    learning_goal: learningGoal ?? null,
    cohort_id: cohort.id,
  };

  // A returning registrant (same email, same cohort) continues with their
  // existing registration rather than creating a duplicate, so they can't
  // end up paying twice from a fresh, unenrolled registration.
  const { data: existing, error: existingError } = await supabase
    .from("registrations")
    .select("id")
    .eq("cohort_id", cohort.id)
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (existingError) {
    console.error("existing registration lookup failed", existingError);
    return NextResponse.json(
      { error: "Could not save your registration. Please try again." },
      { status: 500 }
    );
  }

  if (existing && existing.length > 0) {
    const ids = existing.map((registration) => registration.id);

    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .in("registration_id", ids)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (enrollmentError) {
      console.error("existing enrollment lookup failed", enrollmentError);
      return NextResponse.json(
        { error: "Could not save your registration. Please try again." },
        { status: 500 }
      );
    }

    // Typing an email is not proof of identity, so this doesn't grant
    // welcome-page access — that comes only from the enrollment cookie.
    if (enrollment) {
      return NextResponse.json(
        {
          error:
            "This email is already enrolled. Open the welcome page on the device you enrolled with, or contact support.",
        },
        { status: 409 }
      );
    }

    const { error: updateError } = await supabase
      .from("registrations")
      .update(details)
      .eq("id", ids[0]);

    if (updateError) {
      console.error("registration update failed", updateError);
      return NextResponse.json(
        { error: "Could not save your registration. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ registrationId: ids[0] }, { status: 200 });
  }

  const { data, error } = await supabase
    .from("registrations")
    .insert(details)
    .select("id")
    .single();

  if (error) {
    console.error("registration insert failed", error);
    return NextResponse.json(
      { error: "Could not save your registration. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ registrationId: data.id }, { status: 201 });
}

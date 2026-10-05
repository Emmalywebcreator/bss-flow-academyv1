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

  const { data, error } = await supabase
    .from("registrations")
    .insert({
      full_name: fullName,
      email,
      phone,
      experience_level: experienceLevel,
      learning_goal: learningGoal ?? null,
      cohort_id: cohort.id,
    })
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

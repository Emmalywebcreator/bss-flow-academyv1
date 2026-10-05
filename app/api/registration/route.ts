import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

  const { data, error } = await supabase
    .from("registrations")
    .insert({
      full_name: fullName,
      email,
      phone,
      experience_level: experienceLevel,
      learning_goal: learningGoal ?? null,
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

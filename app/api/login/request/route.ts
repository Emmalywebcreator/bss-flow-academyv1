import { NextResponse } from "next/server";
import { loginRequestSchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateLoginCode, hashLoginCode, requestIp } from "@/lib/login-codes";
import { sendLoginCodeEmail } from "@/lib/email";

/**
 * Emails a login code to an enrolled student. The response is the same
 * whether or not the email is enrolled, so it can't be used to find
 * out who has registered.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const { email } = parsed.data;
  const code = generateLoginCode();

  const { data: outcome, error } = await getSupabaseServerClient().rpc("create_login_code", {
    p_email: email,
    p_ip: requestIp(request),
    p_code_hash: hashLoginCode(code),
  });

  if (error || !outcome) {
    console.error("login code creation failed", error);
    return NextResponse.json(
      { error: "Could not send a login code. Please try again." },
      { status: 500 }
    );
  }

  const { result, full_name: fullName } = outcome as CreateLoginCodeOutcome;

  if (result === "rate_limited") {
    return NextResponse.json(
      { error: "Too many login codes requested. Please wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  if (result === "created") {
    try {
      await sendLoginCodeEmail(email, fullName, code);
    } catch (err) {
      console.error("login code email failed", err);
      return NextResponse.json(
        { error: "Could not send a login code. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ sent: true }, { status: 200 });
}

/** Shape returned by the create_login_code database function. */
type CreateLoginCodeOutcome =
  | { result: "rate_limited" | "not_enrolled"; full_name?: undefined }
  | { result: "created"; full_name: string };

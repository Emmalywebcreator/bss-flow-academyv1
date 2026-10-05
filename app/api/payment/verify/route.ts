import { NextResponse } from "next/server";
import { paymentVerifySchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { setEnrollmentCookie } from "@/lib/enrollment-access";
import { verifyTransaction } from "@/lib/paystack";
import { PROGRAM } from "@/constants/program";

/**
 * Verifies a Paystack transaction directly with Paystack (never
 * trusting the client's word for it), checking reference, status,
 * amount and currency, then creates a paid enrollment.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = paymentVerifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "A payment reference is required." }, { status: 400 });
  }

  const { reference } = parsed.data;
  const supabase = getSupabaseServerClient();

  const { data: payment, error: paymentLookupError } = await supabase
    .from("payments")
    .select("id, registration_id, amount, currency, status")
    .eq("reference", reference)
    .maybeSingle();

  if (paymentLookupError || !payment) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  // Already verified: still make sure the enrollment exists, so a
  // retry repairs an earlier attempt that failed after recording the
  // payment as successful.
  if (payment.status === "success") {
    if (!(await ensurePaidEnrollment(supabase, payment.registration_id))) {
      return NextResponse.json({ error: "Could not complete enrollment." }, { status: 500 });
    }
    return setEnrollmentCookie(
      NextResponse.json({ verified: true }, { status: 200 }),
      payment.registration_id
    );
  }

  let transaction;
  try {
    transaction = await verifyTransaction(reference);
  } catch (err) {
    console.error("paystack verify failed", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
  }

  const amountMatches = transaction.amount === payment.amount * 100;
  const currencyMatches = transaction.currency === payment.currency;

  if (transaction.status !== "success" || !amountMatches || !currencyMatches) {
    const { error: failedUpdateError } = await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", payment.id);

    if (failedUpdateError) {
      console.error("payment failed-status update failed", failedUpdateError);
      return NextResponse.json({ error: "Could not verify payment." }, { status: 500 });
    }

    return NextResponse.json({ verified: false }, { status: 200 });
  }

  const { error: successUpdateError } = await supabase
    .from("payments")
    .update({ status: "success", paid_at: transaction.paid_at })
    .eq("id", payment.id);

  if (successUpdateError) {
    console.error("payment success-status update failed", successUpdateError);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 500 });
  }

  if (!(await ensurePaidEnrollment(supabase, payment.registration_id))) {
    return NextResponse.json({ error: "Could not complete enrollment." }, { status: 500 });
  }

  return setEnrollmentCookie(
    NextResponse.json({ verified: true }, { status: 200 }),
    payment.registration_id
  );
}

/**
 * Creates the paid enrollment for a registration if it doesn't already
 * exist. Returns false (after logging) if it could not be saved.
 */
async function ensurePaidEnrollment(
  supabase: ReturnType<typeof getSupabaseServerClient>,
  registrationId: string
): Promise<boolean> {
  const { data: cohort, error: cohortError } = await supabase
    .from("cohorts")
    .select("id")
    .eq("name", PROGRAM.firstCohort)
    .maybeSingle();

  if (cohortError || !cohort) {
    console.error("paid enrollment cohort lookup failed", cohortError ?? "cohort not found");
    return false;
  }

  // Concurrent verifies of the same reference must not create a
  // second enrollment.
  const { error: enrollmentError } = await supabase.from("enrollments").upsert(
    {
      registration_id: registrationId,
      cohort_id: cohort.id,
      access_type: "paid",
    },
    { onConflict: "registration_id,cohort_id", ignoreDuplicates: true }
  );

  if (enrollmentError) {
    console.error("paid enrollment failed", enrollmentError);
    return false;
  }

  return true;
}

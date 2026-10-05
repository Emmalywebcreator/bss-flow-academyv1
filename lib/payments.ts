import { getSupabaseServerClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/paystack";
import { PROGRAM } from "@/constants/program";

export type VerifyAndEnrollResult =
  | { outcome: "verified"; registrationId: string }
  | { outcome: "not_verified" }
  | { outcome: "not_found" }
  | { outcome: "error"; status: 500 | 502; message: string };

/**
 * Verifies a payment directly with Paystack (never trusting the
 * client's or webhook body's word for it), checking reference, status,
 * amount and currency, then creates the paid enrollment.
 *
 * Shared by the payment callback (POST /api/payment/verify) and the
 * Paystack webhook, so a student is enrolled even if they close the tab
 * before the callback page loads. Safe to call repeatedly for the same
 * reference.
 */
export async function verifyAndEnroll(reference: string): Promise<VerifyAndEnrollResult> {
  const supabase = getSupabaseServerClient();

  const { data: payment, error: paymentLookupError } = await supabase
    .from("payments")
    .select("id, registration_id, amount, currency, status")
    .eq("reference", reference)
    .maybeSingle();

  if (paymentLookupError || !payment) {
    return { outcome: "not_found" };
  }

  // Already verified: still make sure the enrollment exists, so a
  // retry repairs an earlier attempt that failed after recording the
  // payment as successful.
  if (payment.status === "success") {
    if (!(await ensurePaidEnrollment(supabase, payment.registration_id))) {
      return { outcome: "error", status: 500, message: "Could not complete enrollment." };
    }
    return { outcome: "verified", registrationId: payment.registration_id };
  }

  let transaction;
  try {
    transaction = await verifyTransaction(reference);
  } catch (err) {
    console.error("paystack verify failed", err);
    return { outcome: "error", status: 502, message: "Could not verify payment." };
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
      return { outcome: "error", status: 500, message: "Could not verify payment." };
    }

    return { outcome: "not_verified" };
  }

  const { error: successUpdateError } = await supabase
    .from("payments")
    .update({ status: "success", paid_at: transaction.paid_at })
    .eq("id", payment.id);

  if (successUpdateError) {
    console.error("payment success-status update failed", successUpdateError);
    return { outcome: "error", status: 500, message: "Could not verify payment." };
  }

  if (!(await ensurePaidEnrollment(supabase, payment.registration_id))) {
    return { outcome: "error", status: 500, message: "Could not complete enrollment." };
  }

  return { outcome: "verified", registrationId: payment.registration_id };
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

  // Concurrent verifies of the same reference (callback and webhook
  // arriving together) must not create a second enrollment.
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

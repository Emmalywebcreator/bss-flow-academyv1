import { NextResponse } from "next/server";
import { paymentVerifySchema } from "@/lib/schemas";
import { setEnrollmentCookie } from "@/lib/enrollment-access";
import { verifyAndEnroll } from "@/lib/payments";

/**
 * Called by the payment callback page after Paystack redirects back.
 * Verifies the transaction with Paystack and creates the paid
 * enrollment (see verifyAndEnroll), then grants welcome-page access.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = paymentVerifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "A payment reference is required." }, { status: 400 });
  }

  const result = await verifyAndEnroll(parsed.data.reference);

  switch (result.outcome) {
    case "not_found":
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    case "error":
      return NextResponse.json({ error: result.message }, { status: result.status });
    case "not_verified":
      return NextResponse.json({ verified: false }, { status: 200 });
    case "verified":
      return setEnrollmentCookie(
        NextResponse.json({ verified: true }, { status: 200 }),
        result.registrationId
      );
  }
}

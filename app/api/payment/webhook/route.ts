import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { verifyAndEnroll } from "@/lib/payments";

/**
 * Paystack webhook. Enrolls students whose payment succeeded even if
 * they never reached the callback page (e.g. closed the tab after
 * paying). Set this URL in the Paystack dashboard:
 * https://<your-domain>/api/payment/webhook
 *
 * The signature proves the request came from Paystack; the payment is
 * still re-verified with Paystack's API before enrolling. Responding
 * with a non-200 status makes Paystack retry later, so only genuine
 * failures on our side return 500.
 */
export async function POST(request: Request) {
  // The signature covers the exact raw body, so read it before parsing.
  const rawBody = await request.text();

  if (!isValidWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event?: unknown; data?: { reference?: unknown } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const reference = event.data?.reference;

  // Acknowledge events we don't act on, so Paystack doesn't retry them.
  if (event.event !== "charge.success" || typeof reference !== "string") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const result = await verifyAndEnroll(reference);

  if (result.outcome === "error") {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  // not_found: a charge this app didn't start. not_verified: Paystack's
  // API disagrees with the event. Neither will change on retry. pending:
  // Paystack sends another charge.success once the payment completes.
  return NextResponse.json({ received: true }, { status: 200 });
}

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { paymentInitializeSchema } from "@/lib/schemas";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";
import { PROGRAM } from "@/constants/program";

/**
 * Starts a Paystack transaction for the standard enrollment fee.
 * The amount always comes from PROGRAM.standardPrice — the client
 * cannot submit its own trusted price.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = paymentInitializeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "A registration ID is required." }, { status: 400 });
  }

  const { registrationId } = parsed.data;
  const supabase = getSupabaseServerClient();

  const { data: registration, error: registrationError } = await supabase
    .from("registrations")
    .select("id, email")
    .eq("id", registrationId)
    .maybeSingle();

  if (registrationError || !registration) {
    return NextResponse.json({ error: "Registration not found." }, { status: 404 });
  }

  const amountKobo = PROGRAM.standardPrice * 100;
  const reference = `bss-${randomUUID()}`;

  const { error: paymentError } = await supabase.from("payments").insert({
    registration_id: registrationId,
    reference,
    amount: PROGRAM.standardPrice,
    currency: PROGRAM.currency,
    status: "pending",
    provider: "paystack",
  });

  if (paymentError) {
    console.error("payment record creation failed", paymentError);
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }

  const appUrl = process.env.APP_URL ?? new URL(request.url).origin;

  try {
    const transaction = await initializeTransaction({
      email: registration.email,
      amountKobo,
      reference,
      callbackUrl: `${appUrl}/payment/callback`,
      metadata: { registrationId },
    });

    return NextResponse.json(
      { authorizationUrl: transaction.authorization_url, reference },
      { status: 200 }
    );
  } catch (err) {
    console.error("paystack initialize failed", err);
    return NextResponse.json({ error: "Could not start payment." }, { status: 502 });
  }
}

import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("Missing PAYSTACK_SECRET_KEY environment variable.");
  }
  return key;
}

interface InitializeTransactionParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface PaystackInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaystackVerifyData {
  // "abandoned" also covers a checkout the customer hasn't completed yet;
  // only "failed" and "reversed" are final failures.
  status:
    | "success"
    | "failed"
    | "reversed"
    | "abandoned"
    | "ongoing"
    | "pending"
    | "processing"
    | "queued";
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  // Whatever was sent as metadata when initializing; Paystack may return
  // it as an object or as a JSON string.
  metadata: unknown;
}

/**
 * Starts a Paystack transaction. The amount is always computed
 * server-side by the caller (see PROGRAM.standardPrice) — never
 * accept a client-submitted amount here.
 */
export async function initializeTransaction({
  email,
  amountKobo,
  reference,
  callbackUrl,
  metadata,
}: InitializeTransactionParams): Promise<PaystackInitializeData> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message ?? "Failed to initialize Paystack transaction.");
  }

  return data.data as PaystackInitializeData;
}

/**
 * Verifies a Paystack transaction directly with Paystack. Never trust
 * a client-reported "payment succeeded" — always verify server-side.
 */
export async function verifyTransaction(reference: string): Promise<PaystackVerifyData> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${getSecretKey()}` } }
  );

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message ?? "Failed to verify Paystack transaction.");
  }

  return data.data as PaystackVerifyData;
}

/**
 * Checks that a webhook really came from Paystack: Paystack signs the
 * raw request body with HMAC-SHA512 using the secret key and sends the
 * hex digest in the x-paystack-signature header.
 */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;

  const expected = Buffer.from(
    createHmac("sha512", getSecretKey()).update(rawBody).digest("hex")
  );
  const received = Buffer.from(signature);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

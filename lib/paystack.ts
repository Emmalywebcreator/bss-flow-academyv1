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
  status: "success" | "failed" | "abandoned";
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
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

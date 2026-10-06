import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("Missing PAYSTACK_SECRET_KEY environment variable.");
  }
  return key;
}

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Calls the Paystack API and returns its `data` field. Fails with a
 * descriptive error (naming the endpoint, HTTP status and Paystack's
 * message or the start of a non-JSON body) instead of a JSON parse
 * error, and gives up after REQUEST_TIMEOUT_MS rather than hanging the
 * request until the platform kills it.
 */
async function paystackRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${getSecretKey()}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error(`Paystack ${path} timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`);
    }
    throw new Error(`Paystack ${path} request failed: ${String(err)}`);
  }

  const text = await response.text();
  let body: { status?: boolean; message?: string; data?: T } | undefined;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(
      `Paystack ${path} returned non-JSON (HTTP ${response.status}): ${text.slice(0, 200)}`
    );
  }

  if (!response.ok || !body?.status) {
    throw new Error(
      `Paystack ${path} failed (HTTP ${response.status}): ${body?.message ?? "no message"}`
    );
  }

  return body.data as T;
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
  return paystackRequest<PaystackInitializeData>("/transaction/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });
}

/**
 * Verifies a Paystack transaction directly with Paystack. Never trust
 * a client-reported "payment succeeded" — always verify server-side.
 */
export async function verifyTransaction(reference: string): Promise<PaystackVerifyData> {
  return paystackRequest<PaystackVerifyData>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
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

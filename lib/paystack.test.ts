import { createHmac } from "crypto";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { initializeTransaction, isValidWebhookSignature, verifyTransaction } from "./paystack";

const secret = "sk_test_webhook_secret";
const body = JSON.stringify({ event: "charge.success", data: { reference: "bss-ref" } });

function sign(payload: string, key = secret) {
  return createHmac("sha512", key).update(payload).digest("hex");
}

beforeEach(() => vi.stubEnv("PAYSTACK_SECRET_KEY", secret));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("isValidWebhookSignature", () => {
  test("accepts a body signed with the secret key", () => {
    expect(isValidWebhookSignature(body, sign(body))).toBe(true);
  });

  test("rejects a missing signature", () => {
    expect(isValidWebhookSignature(body, null)).toBe(false);
  });

  test("rejects a signature made with a different key", () => {
    expect(isValidWebhookSignature(body, sign(body, "sk_test_other"))).toBe(false);
  });

  test("rejects a tampered body", () => {
    const tampered = body.replace("bss-ref", "bss-other");
    expect(isValidWebhookSignature(tampered, sign(body))).toBe(false);
  });

  test("rejects a malformed signature", () => {
    expect(isValidWebhookSignature(body, "abc")).toBe(false);
  });
});

function fetchResponds(body: string, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const initializeParams = {
  email: "ada@example.com",
  amountKobo: 8000000,
  reference: "bss-ref",
  callbackUrl: "https://academy.example.com/payment/callback",
  metadata: { registrationId: "reg-1" },
};

describe("Paystack API requests", () => {
  test("initializes a transaction with the secret key and a timeout", async () => {
    const fetchMock = fetchResponds(
      JSON.stringify({ status: true, data: { authorization_url: "https://checkout/x" } })
    );

    const data = await initializeTransaction(initializeParams);

    expect(data).toEqual({ authorization_url: "https://checkout/x" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.paystack.co/transaction/initialize");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    });
    expect(JSON.parse(init.body)).toEqual({
      email: "ada@example.com",
      amount: 8000000,
      reference: "bss-ref",
      callback_url: "https://academy.example.com/payment/callback",
      metadata: { registrationId: "reg-1" },
    });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  test("verifies a transaction, encoding the reference in the URL", async () => {
    const fetchMock = fetchResponds(JSON.stringify({ status: true, data: { status: "success" } }));

    const data = await verifyTransaction("bss/ref 1");

    expect(data).toEqual({ status: "success" });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.paystack.co/transaction/verify/bss%2Fref%201"
    );
  });

  test("reports Paystack's own message and the HTTP status on an API error", async () => {
    fetchResponds(JSON.stringify({ status: false, message: "Invalid key" }), 401);

    await expect(verifyTransaction("bss-ref")).rejects.toThrow(
      "Paystack /transaction/verify/bss-ref failed (HTTP 401): Invalid key"
    );
  });

  test("reports a non-JSON response clearly instead of a JSON parse error", async () => {
    fetchResponds("<html><body>502 Bad Gateway</body></html>", 502);

    await expect(verifyTransaction("bss-ref")).rejects.toThrow(
      "Paystack /transaction/verify/bss-ref returned non-JSON (HTTP 502): <html><body>502 Bad Gateway"
    );
  });

  test("treats a 200 response with status false as a failure", async () => {
    fetchResponds(JSON.stringify({ status: false, message: "Duplicate Transaction Reference" }));

    await expect(initializeTransaction(initializeParams)).rejects.toThrow(
      "Duplicate Transaction Reference"
    );
  });

  test("gives up with a clear error when Paystack doesn't respond in time", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("The operation timed out.", "TimeoutError"))
    );

    await expect(verifyTransaction("bss-ref")).rejects.toThrow(
      "Paystack /transaction/verify/bss-ref timed out after 10s."
    );
  });

  test("reports a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    await expect(verifyTransaction("bss-ref")).rejects.toThrow(
      "Paystack /transaction/verify/bss-ref request failed: TypeError: fetch failed"
    );
  });
});

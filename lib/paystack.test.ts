import { createHmac } from "crypto";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isValidWebhookSignature } from "./paystack";

const secret = "sk_test_webhook_secret";
const body = JSON.stringify({ event: "charge.success", data: { reference: "bss-ref" } });

function sign(payload: string, key = secret) {
  return createHmac("sha512", key).update(payload).digest("hex");
}

beforeEach(() => vi.stubEnv("PAYSTACK_SECRET_KEY", secret));
afterEach(() => vi.unstubAllEnvs());

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

import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { paystackMock } from "@/tests/mocks/paystack";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);
vi.mock("@/lib/paystack", async () => (await import("@/tests/mocks/paystack")).paystackMock);

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";

const pendingPayment = {
  id: "payment-1",
  registration_id: registrationId,
  amount: 80000,
  currency: "NGN",
  status: "pending",
};

function webhook(body: unknown, signature: string | null = "valid-signature") {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (signature) headers["x-paystack-signature"] = signature;
  return POST(
    new Request("http://localhost:3000/api/payment/webhook", {
      method: "POST",
      headers,
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

const chargeSuccess = { event: "charge.success", data: { reference: "bss-ref" } };

beforeEach(() => {
  supabaseMock.reset();
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  paystackMock.isValidWebhookSignature.mockReturnValue(true);
});

describe("POST /api/payment/webhook", () => {
  test("rejects a request without a valid Paystack signature, without touching the database", async () => {
    paystackMock.isValidWebhookSignature.mockReturnValue(false);

    const response = await webhook(chargeSuccess, "forged");

    expect(response.status).toBe(401);
    expect(paystackMock.isValidWebhookSignature).toHaveBeenCalledWith(
      JSON.stringify(chargeSuccess),
      "forged"
    );
    expect(supabaseMock.calls("payments")).toEqual([]);
  });

  test("enrolls the student on a verified charge.success", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    paystackMock.verifyTransaction.mockResolvedValue({
      status: "success",
      reference: "bss-ref",
      amount: 8000000,
      currency: "NGN",
      paid_at: "2026-10-05T12:00:00Z",
      metadata: { registrationId },
    });

    const response = await webhook(chargeSuccess);

    expect(response.status).toBe(200);
    expect(paystackMock.verifyTransaction).toHaveBeenCalledWith("bss-ref");
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "upsert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "paid" },
      { onConflict: "registration_id,cohort_id", ignoreDuplicates: true },
    ]);
  });

  test("acknowledges other events without acting on them", async () => {
    const response = await webhook({ event: "transfer.success", data: { reference: "x" } });

    expect(response.status).toBe(200);
    expect(supabaseMock.calls("payments")).toEqual([]);
  });

  test("acknowledges a charge this app didn't start, so Paystack stops retrying", async () => {
    supabaseMock.respond("payments", { data: null, error: null });

    const response = await webhook(chargeSuccess);

    expect(response.status).toBe(200);
    expect(paystackMock.verifyTransaction).not.toHaveBeenCalled();
  });

  test("returns 500 on a failure on our side, so Paystack retries", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    paystackMock.verifyTransaction.mockRejectedValue(new Error("network down"));

    const response = await webhook(chargeSuccess);

    expect(response.status).toBe(500);
  });

  test("rejects a signed body that isn't JSON", async () => {
    const response = await webhook("not json");

    expect(response.status).toBe(400);
  });
});

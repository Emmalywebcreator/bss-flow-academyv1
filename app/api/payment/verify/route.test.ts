import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { paystackMock } from "@/tests/mocks/paystack";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);
vi.mock("@/lib/paystack", async () => (await import("@/tests/mocks/paystack")).paystackMock);

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";
const dbError = { message: "database unavailable" };

const pendingPayment = {
  id: "payment-1",
  registration_id: registrationId,
  amount: 80000,
  currency: "NGN",
  status: "pending",
};

const successfulTransaction = {
  status: "success",
  reference: "bss-ref",
  amount: 8000000,
  currency: "NGN",
  paid_at: "2026-10-05T12:00:00Z",
  metadata: { registrationId },
};

function verify() {
  return POST(jsonRequest("/api/payment/verify", { reference: "bss-ref" }));
}

beforeEach(() => {
  supabaseMock.reset();
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/payment/verify", () => {
  test("enrolls once even if the same payment is verified again", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    paystackMock.verifyTransaction.mockResolvedValue(successfulTransaction);

    const response = await verify();

    expect(await response.json()).toEqual({ verified: true });
    expect(response.headers.get("set-cookie")).toMatch(
      new RegExp(`^bss_enrollment=${registrationId};.*HttpOnly`, "i")
    );
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "upsert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "paid" },
      { onConflict: "registration_id,cohort_id", ignoreDuplicates: true },
    ]);
  });

  test("repairs a missing enrollment when the payment is already verified", async () => {
    supabaseMock.respond("payments", { data: { ...pendingPayment, status: "success" }, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });

    const response = await verify();

    expect(await response.json()).toEqual({ verified: true });
    expect(paystackMock.verifyTransaction).not.toHaveBeenCalled();
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "upsert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "paid" },
      { onConflict: "registration_id,cohort_id", ignoreDuplicates: true },
    ]);
  });

  test("errors if an already-verified payment's enrollment cannot be repaired", async () => {
    supabaseMock.respond("payments", { data: { ...pendingPayment, status: "success" }, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    supabaseMock.respond("enrollments", { data: null, error: dbError });

    const response = await verify();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Could not complete enrollment." });
  });

  test("rejects a request without a payment reference", async () => {
    const response = await POST(jsonRequest("/api/payment/verify", { reference: "  " }));

    expect(response.status).toBe(400);
    expect(supabaseMock.calls("payments")).toEqual([]);
  });

  test("returns 404 for an unknown reference, without asking Paystack", async () => {
    supabaseMock.respond("payments", { data: null, error: null });

    const response = await verify();

    expect(response.status).toBe(404);
    expect(paystackMock.verifyTransaction).not.toHaveBeenCalled();
  });

  test("returns 502 and leaves the payment pending if Paystack can't be reached", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    paystackMock.verifyTransaction.mockRejectedValue(new Error("network down"));

    const response = await verify();

    expect(response.status).toBe(502);
    expect(supabaseMock.calls("payments")).not.toContainEqual(
      expect.arrayContaining(["update"])
    );
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test.each([
    ["the transaction did not succeed", { status: "failed" }],
    ["the transaction was reversed", { status: "reversed" }],
    ["less than the fee was paid", { amount: 100 }],
    ["the fee was paid in naira instead of kobo", { amount: 80000 }],
    ["a different currency was paid", { currency: "USD" }],
    ["Paystack reports a different reference", { reference: "bss-other" }],
    [
      "the payment belongs to a different registration",
      { metadata: { registrationId: "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d" } },
    ],
    ["the transaction has no registration metadata", { metadata: null }],
    ["the registration metadata is malformed", { metadata: "not json" }],
  ])("does not enroll when %s", async (_case, override) => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    paystackMock.verifyTransaction.mockResolvedValue({ ...successfulTransaction, ...override });

    const response = await verify();

    expect(await response.json()).toEqual({ verified: false });
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(supabaseMock.calls("payments")).toContainEqual(["update", { status: "failed" }]);
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test.each(["abandoned", "ongoing", "pending", "processing", "queued"])(
    "leaves a %s payment pending instead of marking it failed",
    async (status) => {
      supabaseMock.respond("payments", { data: pendingPayment, error: null });
      paystackMock.verifyTransaction.mockResolvedValue({ ...successfulTransaction, status });

      const response = await verify();

      expect(await response.json()).toEqual({ verified: false, pending: true });
      expect(response.headers.get("set-cookie")).toBeNull();
      expect(supabaseMock.calls("payments")).not.toContainEqual(
        expect.arrayContaining(["update"])
      );
      expect(supabaseMock.calls("enrollments")).toEqual([]);
    }
  );

  test("accepts registration metadata that Paystack returns as a JSON string", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    paystackMock.verifyTransaction.mockResolvedValue({
      ...successfulTransaction,
      metadata: JSON.stringify({ registrationId }),
    });

    const response = await verify();

    expect(await response.json()).toEqual({ verified: true });
  });

  test("verifies with Paystack using the reference from the request", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    paystackMock.verifyTransaction.mockResolvedValue(successfulTransaction);

    await verify();

    expect(supabaseMock.calls("payments")).toContainEqual(["eq", "reference", "bss-ref"]);
    expect(paystackMock.verifyTransaction).toHaveBeenCalledWith("bss-ref");
    expect(supabaseMock.calls("payments")).toContainEqual([
      "update",
      { status: "success", paid_at: "2026-10-05T12:00:00Z" },
    ]);
  });

  test("errors if a failed payment cannot be recorded", async () => {
    supabaseMock.respond(
      "payments",
      { data: pendingPayment, error: null },
      { data: null, error: dbError }
    );
    paystackMock.verifyTransaction.mockResolvedValue({ ...successfulTransaction, status: "failed" });

    const response = await verify();

    expect(response.status).toBe(500);
  });

  test("does not enroll if the successful payment cannot be recorded", async () => {
    supabaseMock.respond(
      "payments",
      { data: pendingPayment, error: null },
      { data: null, error: dbError }
    );
    paystackMock.verifyTransaction.mockResolvedValue(successfulTransaction);

    const response = await verify();

    expect(response.status).toBe(500);
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test("errors instead of claiming success when the cohort is missing", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    supabaseMock.respond("cohorts", { data: null, error: null });
    paystackMock.verifyTransaction.mockResolvedValue(successfulTransaction);

    const response = await verify();

    expect(response.status).toBe(500);
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test("errors instead of claiming success when the enrollment cannot be saved", async () => {
    supabaseMock.respond("payments", { data: pendingPayment, error: null });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    supabaseMock.respond("enrollments", { data: null, error: dbError });
    paystackMock.verifyTransaction.mockResolvedValue(successfulTransaction);

    const response = await verify();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Could not complete enrollment." });
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});

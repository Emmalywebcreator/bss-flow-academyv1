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
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "upsert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "paid" },
      { onConflict: "registration_id,cohort_id", ignoreDuplicates: true },
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
  });
});

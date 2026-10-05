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

beforeEach(() => {
  supabaseMock.reset();
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/payment/verify", () => {
  test("enrolls once even if the same payment is verified again", async () => {
    supabaseMock.respond("payments", {
      data: {
        id: "payment-1",
        registration_id: registrationId,
        amount: 80000,
        currency: "NGN",
        status: "pending",
      },
      error: null,
    });
    supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
    paystackMock.verifyTransaction.mockResolvedValue({
      status: "success",
      reference: "bss-ref",
      amount: 8000000,
      currency: "NGN",
      paid_at: "2026-10-05T12:00:00Z",
    });

    const response = await POST(jsonRequest("/api/payment/verify", { reference: "bss-ref" }));

    expect(await response.json()).toEqual({ verified: true });
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "upsert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "paid" },
      { onConflict: "registration_id,cohort_id", ignoreDuplicates: true },
    ]);
  });
});

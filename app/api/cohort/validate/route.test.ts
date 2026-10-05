import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";

function rateLimitAllows(allowed: boolean) {
  supabaseMock.respond("rpc:record_cohort_code_attempt", { data: allowed, error: null });
}

beforeEach(() => {
  supabaseMock.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/cohort/validate", () => {
  test("rejects a code that matches no active cohort, without enrolling", async () => {
    rateLimitAllows(true);
    supabaseMock.respond("cohorts", { data: null, error: null });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "COHORT1-SPONSOR" })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ valid: false });
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test("enrolls with a matching code", async () => {
    rateLimitAllows(true);
    supabaseMock.respond("cohorts", { data: { id: "cohort-1", name: "Cohort 1" }, error: null });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(await response.json()).toEqual({ valid: true, cohortName: "Cohort 1" });
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "upsert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "sponsored" },
      { onConflict: "registration_id,cohort_id", ignoreDuplicates: true },
    ]);
  });

  test("records the attempt against the caller's IP and registration", async () => {
    rateLimitAllows(true);
    const request = jsonRequest("/api/cohort/validate", { registrationId, code: "guess" });
    request.headers.set("x-forwarded-for", "203.0.113.7, 10.0.0.1");

    await POST(request);

    expect(supabaseMock.calls("rpc:record_cohort_code_attempt")).toEqual([
      ["rpc", { p_ip: "203.0.113.7", p_registration_id: registrationId }],
    ]);
  });

  test("blocks the attempt once the rate limit is reached, without checking the code", async () => {
    rateLimitAllows(false);

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(response.status).toBe(429);
    expect(supabaseMock.calls("cohorts")).toEqual([]);
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test("fails closed if the rate limit check errors", async () => {
    supabaseMock.respond("rpc:record_cohort_code_attempt", {
      data: null,
      error: { message: "database unavailable" },
    });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(response.status).toBe(500);
    expect(supabaseMock.calls("cohorts")).toEqual([]);
  });
});

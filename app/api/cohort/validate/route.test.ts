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

function sponsorOutcome(data: unknown, error: unknown = null) {
  supabaseMock.respond("rpc:enroll_with_sponsor_code", { data, error });
}

beforeEach(() => {
  supabaseMock.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/cohort/validate", () => {
  test("rejects a code that matches no active cohort", async () => {
    rateLimitAllows(true);
    sponsorOutcome({ result: "invalid" });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "COHORT1-SPONSOR" })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ valid: false });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  test("enrolls with a matching code", async () => {
    rateLimitAllows(true);
    sponsorOutcome({ result: "enrolled", cohort_name: "Cohort 1" });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(await response.json()).toEqual({ valid: true, cohortName: "Cohort 1" });
    expect(response.headers.get("set-cookie")).toMatch(
      new RegExp(`^bss_enrollment=${registrationId};.*HttpOnly`, "i")
    );
    expect(supabaseMock.calls("rpc:enroll_with_sponsor_code")).toEqual([
      ["rpc", { p_registration_id: registrationId, p_code: "real-code" }],
    ]);
  });

  test("turns the student away when all sponsored places are taken", async () => {
    rateLimitAllows(true);
    sponsorOutcome({ result: "full" });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(response.status).toBe(409);
    expect((await response.json()).error).toMatch(/sponsored places .* taken/);
  });

  test("errors if the sponsored enrollment cannot be saved", async () => {
    rateLimitAllows(true);
    sponsorOutcome(null, { message: "database unavailable" });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(response.status).toBe(500);
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
    expect(supabaseMock.calls("rpc:enroll_with_sponsor_code")).toEqual([]);
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
    expect(supabaseMock.calls("rpc:enroll_with_sponsor_code")).toEqual([]);
  });
});

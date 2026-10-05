import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";

beforeEach(() => {
  supabaseMock.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/cohort/validate", () => {
  test("rejects a code that matches no active cohort, without enrolling", async () => {
    supabaseMock.respond("cohorts", { data: null, error: null });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "COHORT1-SPONSOR" })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ valid: false });
    expect(supabaseMock.calls("enrollments")).toEqual([]);
  });

  test("enrolls with a matching code", async () => {
    supabaseMock.respond("cohorts", { data: { id: "cohort-1", name: "Cohort 1" }, error: null });

    const response = await POST(
      jsonRequest("/api/cohort/validate", { registrationId, code: "real-code" })
    );

    expect(await response.json()).toEqual({ valid: true, cohortName: "Cohort 1" });
    expect(supabaseMock.calls("enrollments")[0]).toEqual([
      "insert",
      { registration_id: registrationId, cohort_id: "cohort-1", access_type: "sponsored" },
    ]);
  });
});

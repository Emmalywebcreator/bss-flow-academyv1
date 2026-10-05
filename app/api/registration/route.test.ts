import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);

const validBody = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  phone: "08012345678",
  experienceLevel: "beginner",
};

function cohortExists() {
  supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
}

beforeEach(() => {
  supabaseMock.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/registration", () => {
  test("creates a registration for the current cohort and returns its id", async () => {
    cohortExists();
    supabaseMock.respond("registrations", { data: { id: "reg-123" }, error: null });

    const response = await POST(jsonRequest("/api/registration", validBody));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ registrationId: "reg-123" });
    expect(supabaseMock.calls("registrations")[0]).toEqual([
      "insert",
      {
        full_name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "08012345678",
        experience_level: "beginner",
        learning_goal: null,
        cohort_id: "cohort-1",
      },
    ]);
    expect(supabaseMock.calls("cohorts")).toContainEqual(["eq", "name", "Cohort 1"]);
  });

  test("rejects invalid data without touching the database", async () => {
    const response = await POST(
      jsonRequest("/api/registration", { ...validBody, email: "not-an-email" })
    );

    expect(response.status).toBe(400);
    expect(supabaseMock.calls("registrations")).toEqual([]);
  });

  test("rejects a body that isn't JSON", async () => {
    const response = await POST(jsonRequest("/api/registration", "{not json"));

    expect(response.status).toBe(400);
  });

  test("returns 500 without saving if the cohort is missing", async () => {
    supabaseMock.respond("cohorts", { data: null, error: null });

    const response = await POST(jsonRequest("/api/registration", validBody));

    expect(response.status).toBe(500);
    expect(supabaseMock.calls("registrations")).toEqual([]);
  });

  test("returns 500 when the insert fails", async () => {
    cohortExists();
    supabaseMock.respond("registrations", { data: null, error: { message: "boom" } });

    const response = await POST(jsonRequest("/api/registration", validBody));

    expect(response.status).toBe(500);
  });
});

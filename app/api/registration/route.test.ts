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

const savedDetails = {
  full_name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "08012345678",
  experience_level: "beginner",
  learning_goal: null,
  cohort_id: "cohort-1",
};

function cohortExists() {
  supabaseMock.respond("cohorts", { data: { id: "cohort-1" }, error: null });
}

function existingRegistrations(...ids: string[]) {
  supabaseMock.respond("registrations", { data: ids.map((id) => ({ id })), error: null });
}

function register(body: unknown = validBody) {
  return POST(jsonRequest("/api/registration", body));
}

beforeEach(() => {
  supabaseMock.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/registration", () => {
  test("creates a registration for the current cohort and returns its id", async () => {
    cohortExists();
    existingRegistrations();
    supabaseMock.respond("registrations", { data: { id: "reg-123" }, error: null });

    const response = await register();

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ registrationId: "reg-123" });
    expect(supabaseMock.calls("registrations")).toContainEqual(["insert", savedDetails]);
    expect(supabaseMock.calls("cohorts")).toContainEqual(["eq", "name", "Cohort 1"]);
  });

  test("matches and stores the email in lowercase", async () => {
    cohortExists();
    existingRegistrations();
    supabaseMock.respond("registrations", { data: { id: "reg-123" }, error: null });

    await register({ ...validBody, email: "  Ada@Example.COM " });

    expect(supabaseMock.calls("registrations")).toContainEqual(["eq", "email", "ada@example.com"]);
    expect(supabaseMock.calls("registrations")).toContainEqual(["insert", savedDetails]);
  });

  test("continues with an existing unenrolled registration instead of creating a duplicate", async () => {
    cohortExists();
    existingRegistrations("reg-newest", "reg-older");
    supabaseMock.respond("enrollments", { data: null, error: null });

    const response = await register({ ...validBody, phone: "08099999999" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ registrationId: "reg-newest" });
    expect(supabaseMock.calls("enrollments")).toContainEqual([
      "in",
      "registration_id",
      ["reg-newest", "reg-older"],
    ]);
    expect(supabaseMock.calls("registrations")).toContainEqual([
      "update",
      { ...savedDetails, phone: "08099999999" },
    ]);
    expect(supabaseMock.calls("registrations")).toContainEqual(["eq", "id", "reg-newest"]);
    expect(supabaseMock.calls("registrations")).not.toContainEqual(
      expect.arrayContaining(["insert"])
    );
  });

  test("stops an already-enrolled email without granting welcome access", async () => {
    cohortExists();
    existingRegistrations("reg-123");
    supabaseMock.respond("enrollments", { data: { id: "enrollment-1" }, error: null });

    const response = await register();

    expect(response.status).toBe(409);
    expect((await response.json()).error).toMatch(/already enrolled/);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(supabaseMock.calls("registrations")).not.toContainEqual(
      expect.arrayContaining(["insert"])
    );
    expect(supabaseMock.calls("registrations")).not.toContainEqual(
      expect.arrayContaining(["update"])
    );
  });

  test("rejects invalid data without touching the database", async () => {
    const response = await register({ ...validBody, email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(supabaseMock.calls("registrations")).toEqual([]);
  });

  test("rejects a body that isn't JSON", async () => {
    const response = await register("{not json");

    expect(response.status).toBe(400);
  });

  test("returns 500 without saving if the cohort is missing", async () => {
    supabaseMock.respond("cohorts", { data: null, error: null });

    const response = await register();

    expect(response.status).toBe(500);
    expect(supabaseMock.calls("registrations")).toEqual([]);
  });

  test("returns 500 if existing registrations can't be checked", async () => {
    cohortExists();
    supabaseMock.respond("registrations", { data: null, error: { message: "boom" } });

    const response = await register();

    expect(response.status).toBe(500);
    expect(supabaseMock.calls("registrations")).not.toContainEqual(
      expect.arrayContaining(["insert"])
    );
  });

  test("returns 500 when the insert fails", async () => {
    cohortExists();
    existingRegistrations();
    supabaseMock.respond("registrations", { data: null, error: { message: "boom" } });

    const response = await register();

    expect(response.status).toBe(500);
  });
});

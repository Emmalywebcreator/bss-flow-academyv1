import { beforeEach, expect, test, vi } from "vitest";
import { requireEnrollment } from "./enrollment-access";
import { supabaseMock } from "@/tests/mocks/supabase";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);

const cookieValue = vi.hoisted(() => ({ current: undefined as string | undefined }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "bss_enrollment" && cookieValue.current
        ? { name, value: cookieValue.current }
        : undefined,
  }),
}));

const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`redirect ${url}`);
  })
);
vi.mock("next/navigation", () => ({ redirect }));

const lesson = "/learn/foundations/html5-structuring-websites/hyperlinks";
const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";

beforeEach(() => {
  supabaseMock.reset();
  cookieValue.current = undefined;
  redirect.mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

test("sends a visitor with no enrollment cookie to register, then back to the lesson", async () => {
  await expect(requireEnrollment(lesson)).rejects.toThrow(
    `redirect /register?next=${encodeURIComponent(lesson)}`
  );
  expect(supabaseMock.calls("enrollments")).toEqual([]);
});

test("sends a visitor whose enrollment isn't active to register", async () => {
  cookieValue.current = registrationId;
  supabaseMock.respond("enrollments", { data: null, error: null });

  await expect(requireEnrollment(lesson)).rejects.toThrow("redirect /register?next=");
});

test("lets an enrolled learner through", async () => {
  cookieValue.current = registrationId;
  supabaseMock.respond("enrollments", { data: { id: "enrollment-1" }, error: null });

  await expect(requireEnrollment(lesson)).resolves.toBeUndefined();
  expect(redirect).not.toHaveBeenCalled();
  expect(supabaseMock.calls("enrollments")).toContainEqual(["eq", "registration_id", registrationId]);
});

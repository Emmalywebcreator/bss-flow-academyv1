import { beforeEach, expect, test, vi } from "vitest";
import RegisterLayout from "./layout";
import LoginLayout from "../login/layout";
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

beforeEach(() => {
  supabaseMock.reset();
  cookieValue.current = undefined;
  redirect.mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

test.each([
  ["register", RegisterLayout],
  ["login", LoginLayout],
])("the %s page sends an enrolled, signed-in learner to /learn", async (_, Layout) => {
  cookieValue.current = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";
  supabaseMock.respond("enrollments", { data: { id: "enrollment-1" }, error: null });

  await expect(Layout({ children: "form" })).rejects.toThrow("redirect /learn");
});

test.each([
  ["register", RegisterLayout],
  ["login", LoginLayout],
])("the %s page shows its form to anyone else", async (_, Layout) => {
  expect(await Layout({ children: "form" })).toBe("form");

  // A cookie whose enrollment has ended still sees the form, not a redirect loop.
  cookieValue.current = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";
  supabaseMock.respond("enrollments", { data: null, error: null });
  expect(await Layout({ children: "form" })).toBe("form");
  expect(redirect).not.toHaveBeenCalled();
});

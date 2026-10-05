// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import WelcomePage from "./page";
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

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";
const inviteLink = "https://t.me/+test-invite";

beforeEach(() => {
  supabaseMock.reset();
  cookieValue.current = undefined;
  vi.stubEnv("TELEGRAM_INVITE_LINK", inviteLink);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

test("hides the Telegram link from visitors without an enrollment cookie", async () => {
  render(await WelcomePage());

  expect(screen.queryByRole("link", { name: /telegram/i })).toBeNull();
  expect(screen.getByRole("link", { name: /register/i }).getAttribute("href")).toBe("/register");
  expect(supabaseMock.calls("enrollments")).toEqual([]);
});

test("hides the Telegram link when the cookie has no active enrollment", async () => {
  cookieValue.current = registrationId;
  supabaseMock.respond("enrollments", { data: null, error: null });

  render(await WelcomePage());

  expect(screen.queryByRole("link", { name: /telegram/i })).toBeNull();
  expect(supabaseMock.calls("enrollments")).toContainEqual(["eq", "status", "active"]);
});

test("shows the Telegram link to an enrolled student", async () => {
  cookieValue.current = registrationId;
  supabaseMock.respond("enrollments", { data: { id: "enrollment-1" }, error: null });

  render(await WelcomePage());

  expect(
    screen.getByRole("link", { name: "Join the Telegram community" }).getAttribute("href")
  ).toBe(inviteLink);
  expect(supabaseMock.calls("enrollments")).toContainEqual([
    "eq",
    "registration_id",
    registrationId,
  ]);
});

test("asks an enrolled student to contact support if the invite link isn't configured", async () => {
  vi.stubEnv("TELEGRAM_INVITE_LINK", "");
  cookieValue.current = registrationId;
  supabaseMock.respond("enrollments", { data: { id: "enrollment-1" }, error: null });

  render(await WelcomePage());

  expect(screen.queryByRole("link", { name: /telegram/i })).toBeNull();
  expect(screen.getByText(/contact support/i)).toBeDefined();
});

// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import LogoutPage from "./page";

const signedIn = vi.hoisted(() => ({ current: false }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ has: (name: string) => name === "bss_enrollment" && signedIn.current }),
}));

beforeEach(() => {
  signedIn.current = false;
});

afterEach(cleanup);

test("asks a signed-in learner to confirm, logging out with a POST", async () => {
  signedIn.current = true;
  render(await LogoutPage());

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Log out on this device?");
  const button = screen.getByRole("button", { name: "Log out" });
  const form = button.closest("form")!;
  expect(form.getAttribute("action")).toBe("/api/logout");
  expect(form.getAttribute("method")).toBe("post");
  expect(screen.getByRole("link", { name: /back to my learning/ }).getAttribute("href")).toBe("/learn");
});

test("confirms the learner is logged out, with a way to log back in", async () => {
  render(await LogoutPage());

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("You're logged out");
  expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();
  expect(screen.getByRole("link", { name: "Log in" }).getAttribute("href")).toBe("/login");
  expect(screen.getByRole("link", { name: "Back to home" }).getAttribute("href")).toBe("/");
});

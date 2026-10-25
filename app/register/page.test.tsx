// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import RegisterPage from "./page";

const push = vi.hoisted(() => vi.fn());
const searchParams = vi.hoisted(() => ({ current: new URLSearchParams() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  useSearchParams: () => searchParams.current,
}));

beforeEach(() => {
  push.mockReset();
  searchParams.current = new URLSearchParams();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ registrationId: "reg-123" }), { status: 201 })
    )
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "08012345678" } });
  fireEvent.change(screen.getByLabelText("Experience level"), {
    target: { value: "beginner" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Register for free" }));
}

test("registering is free and goes straight to the learning page", async () => {
  render(<RegisterPage />);
  expect(document.body.textContent).not.toMatch(/sponsor|Paystack|₦/i);

  fillAndSubmit();

  await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/learn"));
  expect(vi.mocked(fetch)).toHaveBeenCalledWith("/api/registration", expect.anything());
  expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
});

test("shows the server's error and stays on the form", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ error: "This email is already enrolled." }), { status: 409 })
  );
  render(<RegisterPage />);

  fillAndSubmit();

  expect(await screen.findByText("This email is already enrolled.")).toBeDefined();
  expect(push).not.toHaveBeenCalled();
});

test("registration form links to the terms and privacy policy", () => {
  render(<RegisterPage />);

  expect(screen.getByRole("link", { name: "Terms and Conditions" }).getAttribute("href")).toBe(
    "/terms"
  );
  expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe(
    "/privacy"
  );
});

test("registration form offers a way to log in instead", () => {
  render(<RegisterPage />);

  expect(screen.getByText(/Already have an account\?/)).toBeDefined();
  expect(screen.getByRole("link", { name: "Log in" }).getAttribute("href")).toBe("/login");
});

test("after registering from a lesson link, the learner goes back to that lesson", async () => {
  const lesson = "/learn/foundations/html5-structuring-websites";
  searchParams.current = new URLSearchParams({ next: lesson });
  render(<RegisterPage />);

  expect(screen.getByRole("link", { name: "Log in" }).getAttribute("href")).toBe(
    `/login?next=${encodeURIComponent(lesson)}`
  );
  fillAndSubmit();

  await vi.waitFor(() => expect(push).toHaveBeenCalledWith(lesson));
});

test("ignores a return path that isn't a learning page", async () => {
  searchParams.current = new URLSearchParams({ next: "https://evil.example" });
  render(<RegisterPage />);

  fillAndSubmit();

  await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/learn"));
});

// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import RegisterPage from "./page";

const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

beforeEach(() => {
  push.mockReset();
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

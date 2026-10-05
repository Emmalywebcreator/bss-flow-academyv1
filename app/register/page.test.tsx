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

async function goToCodeStep() {
  render(<RegisterPage />);

  fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "08012345678" } });
  fireEvent.change(screen.getByLabelText("Experience level"), {
    target: { value: "beginner" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));

  fireEvent.click(await screen.findByRole("button", { name: "I have a sponsor code" }));
  return screen.getByLabelText("Sponsor code");
}

test("sponsor code input does not hint at a real code", async () => {
  const input = await goToCodeStep();
  const placeholder = input.getAttribute("placeholder") ?? "";

  expect(placeholder).not.toMatch(/COHORT1-SPONSOR/i);
  // No code-shaped example such as "ABC-123" either.
  expect(placeholder).not.toMatch(/[A-Z0-9]{3,}-[A-Z0-9]{3,}/);
});

test("sends an already-enrolled student to the welcome page instead of Paystack", async () => {
  await goToCodeStep();
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ error: "You're already enrolled.", alreadyEnrolled: true }), {
      status: 409,
    })
  );

  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  fireEvent.click(screen.getByRole("button", { name: /Pay .* with Paystack/ }));

  await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/welcome"));
  expect(vi.mocked(fetch)).toHaveBeenLastCalledWith("/api/payment/initialize", expect.anything());
});

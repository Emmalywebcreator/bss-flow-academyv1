// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import RegisterPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

beforeEach(() => {
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

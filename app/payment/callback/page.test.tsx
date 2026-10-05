// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import PaymentCallbackPage from "./page";

const replace = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace }),
  useSearchParams: () => new URLSearchParams("reference=bss-ref"),
}));

function verifyResponds(body: unknown) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body))));
}

beforeEach(() => replace.mockReset());

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("tells the student a processing payment needs time, without sending them on", async () => {
  verifyResponds({ verified: false, pending: true });

  render(<PaymentCallbackPage />);

  expect(await screen.findByText("Your payment is still processing.")).toBeDefined();
  expect(screen.getByText(/don.t pay again/)).toBeDefined();
  expect(replace).not.toHaveBeenCalled();
});

test("sends the student to the welcome page once the payment is verified", async () => {
  verifyResponds({ verified: true });

  render(<PaymentCallbackPage />);

  await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/welcome"));
  expect(vi.mocked(fetch)).toHaveBeenCalledWith(
    "/api/payment/verify",
    expect.objectContaining({ body: JSON.stringify({ reference: "bss-ref" }) })
  );
});

test("reports a failed payment", async () => {
  verifyResponds({ verified: false });

  render(<PaymentCallbackPage />);

  expect(await screen.findByText(/couldn.t confirm this payment/)).toBeDefined();
});

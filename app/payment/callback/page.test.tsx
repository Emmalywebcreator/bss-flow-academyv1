// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import PaymentCallbackPage from "./page";

const replace = vi.hoisted(() => vi.fn());
// Like Next.js's, the router is the same object on every render (the
// page's verify effect depends on it).
const router = vi.hoisted(() => ({ push: vi.fn(), replace }));
const query = vi.hoisted(() => ({ current: "reference=bss-ref" }));
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(query.current),
}));

function verifyResponds(...bodies: { body: unknown; status?: number }[]) {
  const fetchMock = vi.fn();
  for (const { body, status = 200 } of bodies) {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }));
  }
  vi.stubGlobal("fetch", fetchMock);
}

beforeEach(() => {
  replace.mockReset();
  query.current = "reference=bss-ref";
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test("tells the student a processing payment needs time, without sending them on", async () => {
  verifyResponds({ body: { verified: false, pending: true } });

  render(<PaymentCallbackPage />);

  expect(await screen.findByText("Your payment is still processing.")).toBeDefined();
  expect(screen.getByText(/don.t pay again/)).toBeDefined();
  expect(screen.getByText("bss-ref")).toBeDefined();
  expect(replace).not.toHaveBeenCalled();
});

test("sends the student to the welcome page once the payment is verified", async () => {
  verifyResponds({ body: { verified: true } });

  render(<PaymentCallbackPage />);

  await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/welcome"));
  expect(vi.mocked(fetch)).toHaveBeenCalledWith(
    "/api/payment/verify",
    expect.objectContaining({ body: JSON.stringify({ reference: "bss-ref" }) })
  );
});

test("on a failed payment, shows the reference and a way back to registration", async () => {
  verifyResponds({ body: { verified: false } });

  render(<PaymentCallbackPage />);

  expect(await screen.findByText(/couldn.t confirm this payment/)).toBeDefined();
  expect(screen.getByText("bss-ref")).toBeDefined();
  expect(screen.getByRole("link", { name: "Back to registration" }).getAttribute("href")).toBe(
    "/register"
  );
});

test("lets the student check again after an error, then continues once verified", async () => {
  verifyResponds(
    { body: { error: "Could not verify payment." }, status: 502 },
    { body: { verified: true } }
  );

  render(<PaymentCallbackPage />);

  expect(await screen.findByText(/went wrong while verifying/)).toBeDefined();
  expect(screen.getByText("bss-ref")).toBeDefined();

  fireEvent.click(screen.getByRole("button", { name: "Check again" }));

  await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/welcome"));
  expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
});

test("explains a missing reference without calling the server", async () => {
  query.current = "";
  verifyResponds();

  render(<PaymentCallbackPage />);

  expect(await screen.findByText(/missing a payment reference/)).toBeDefined();
  expect(screen.getByRole("link", { name: "Back to registration" })).toBeDefined();
  expect(vi.mocked(fetch)).not.toHaveBeenCalled();
});

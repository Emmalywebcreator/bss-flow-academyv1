import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { paystackMock } from "@/tests/mocks/paystack";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);
vi.mock("@/lib/paystack", async () => (await import("@/tests/mocks/paystack")).paystackMock);

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";
const registration = { id: registrationId, email: "ada@example.com" };

function initialize(body: unknown = { registrationId }) {
  return POST(jsonRequest("/api/payment/initialize", body));
}

beforeEach(() => {
  supabaseMock.reset();
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubEnv("APP_URL", "https://academy.example.com");
});

afterEach(() => vi.unstubAllEnvs());

describe("POST /api/payment/initialize", () => {
  test("rejects a request without a valid registration ID", async () => {
    const response = await initialize({ registrationId: "not-a-uuid" });

    expect(response.status).toBe(400);
    expect(supabaseMock.calls("registrations")).toEqual([]);
  });

  test("returns 404 for an unknown registration, without starting a payment", async () => {
    supabaseMock.respond("registrations", { data: null, error: null });

    const response = await initialize();

    expect(response.status).toBe(404);
    expect(supabaseMock.calls("payments")).toEqual([]);
    expect(paystackMock.initializeTransaction).not.toHaveBeenCalled();
  });

  test("charges the server-side price, ignoring any amount the client sends", async () => {
    supabaseMock.respond("registrations", { data: registration, error: null });
    paystackMock.initializeTransaction.mockResolvedValue({
      authorization_url: "https://checkout.paystack.com/abc",
      access_code: "abc",
      reference: "ignored",
    });

    const response = await initialize({ registrationId, amount: 100, currency: "USD" });

    expect(response.status).toBe(200);
    const { authorizationUrl, reference } = await response.json();
    expect(authorizationUrl).toBe("https://checkout.paystack.com/abc");
    expect(reference).toMatch(/^bss-[0-9a-f-]{36}$/);

    expect(supabaseMock.calls("payments")[0]).toEqual([
      "insert",
      {
        registration_id: registrationId,
        reference,
        amount: 80000,
        currency: "NGN",
        status: "pending",
        provider: "paystack",
      },
    ]);
    expect(paystackMock.initializeTransaction).toHaveBeenCalledWith({
      email: "ada@example.com",
      amountKobo: 8000000,
      reference,
      callbackUrl: "https://academy.example.com/payment/callback",
      metadata: { registrationId },
    });
  });

  test("returns to the requesting site when APP_URL is not set", async () => {
    vi.stubEnv("APP_URL", undefined);
    supabaseMock.respond("registrations", { data: registration, error: null });
    paystackMock.initializeTransaction.mockResolvedValue({ authorization_url: "https://x" });

    await initialize();

    expect(paystackMock.initializeTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ callbackUrl: "http://localhost:3000/payment/callback" })
    );
  });

  test("uses a new reference for every attempt", async () => {
    supabaseMock.respond(
      "registrations",
      { data: registration, error: null },
      { data: registration, error: null }
    );
    paystackMock.initializeTransaction.mockResolvedValue({ authorization_url: "https://x" });

    const first = await (await initialize()).json();
    const second = await (await initialize()).json();

    expect(first.reference).not.toBe(second.reference);
  });

  test("does not contact Paystack if the payment record cannot be saved", async () => {
    supabaseMock.respond("registrations", { data: registration, error: null });
    supabaseMock.respond("payments", { data: null, error: { message: "database unavailable" } });

    const response = await initialize();

    expect(response.status).toBe(500);
    expect(paystackMock.initializeTransaction).not.toHaveBeenCalled();
  });

  test("returns 502 if Paystack fails to start the transaction", async () => {
    supabaseMock.respond("registrations", { data: registration, error: null });
    paystackMock.initializeTransaction.mockRejectedValue(new Error("Paystack unavailable"));

    const response = await initialize();

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Could not start payment." });
  });
});

import { vi } from "vitest";

/**
 * Mock implementations for `@/lib/paystack`, so tests never call the
 * real Paystack API.
 *
 * Usage in a test file (vi.mock is hoisted, so the factory imports the
 * shared instance rather than closing over a local variable):
 *
 *   import { paystackMock } from "@/tests/mocks/paystack";
 *   vi.mock("@/lib/paystack", async () =>
 *     (await import("@/tests/mocks/paystack")).paystackMock
 *   );
 *   beforeEach(() => vi.resetAllMocks());
 *
 *   paystackMock.verifyTransaction.mockResolvedValue({ status: "success", ... });
 */
export const paystackMock = {
  initializeTransaction: vi.fn(),
  verifyTransaction: vi.fn(),
};

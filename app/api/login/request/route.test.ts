import { beforeEach, describe, expect, test, vi } from "vitest";
import { createHash } from "crypto";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);

const sendLoginCodeEmail = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email", () => ({ sendLoginCodeEmail }));

function outcome(data: unknown, error: unknown = null) {
  supabaseMock.respond("rpc:create_login_code", { data, error });
}

beforeEach(() => {
  supabaseMock.reset();
  sendLoginCodeEmail.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/login/request", () => {
  test("rejects an invalid email", async () => {
    const response = await POST(jsonRequest("/api/login/request", { email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(supabaseMock.calls("rpc:create_login_code")).toEqual([]);
  });

  test("emails an enrolled student a code, storing only its hash", async () => {
    outcome({ result: "created", full_name: "Ada Lovelace" });

    const response = await POST(
      jsonRequest("/api/login/request", { email: " Ada@Example.com " })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });

    const [to, name, code] = sendLoginCodeEmail.mock.calls[0];
    expect([to, name]).toEqual(["ada@example.com", "Ada Lovelace"]);
    expect(code).toMatch(/^\d{6}$/);

    const [[, args]] = supabaseMock.calls("rpc:create_login_code") as [[string, Record<string, string>]];
    expect(args.p_email).toBe("ada@example.com");
    expect(args.p_code_hash).toBe(createHash("sha256").update(code).digest("hex"));
    expect(JSON.stringify(args)).not.toContain(code);
  });

  test("gives the same answer for an email that isn't enrolled, without sending anything", async () => {
    outcome({ result: "not_enrolled" });

    const response = await POST(jsonRequest("/api/login/request", { email: "who@example.com" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
    expect(sendLoginCodeEmail).not.toHaveBeenCalled();
  });

  test("records the request against the caller's IP", async () => {
    outcome({ result: "not_enrolled" });

    await POST(
      new Request("http://localhost:3000/api/login/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
        body: JSON.stringify({ email: "ada@example.com" }),
      })
    );

    const [[, args]] = supabaseMock.calls("rpc:create_login_code") as [[string, Record<string, string>]];
    expect(args.p_ip).toBe("203.0.113.7");
  });

  test("refuses once the rate limit is hit", async () => {
    outcome({ result: "rate_limited" });

    const response = await POST(jsonRequest("/api/login/request", { email: "ada@example.com" }));

    expect(response.status).toBe(429);
    expect(sendLoginCodeEmail).not.toHaveBeenCalled();
  });

  test("errors if the code can't be saved", async () => {
    outcome(null, { message: "database unavailable" });

    const response = await POST(jsonRequest("/api/login/request", { email: "ada@example.com" }));

    expect(response.status).toBe(500);
    expect(sendLoginCodeEmail).not.toHaveBeenCalled();
  });

  test("errors if the email can't be sent", async () => {
    outcome({ result: "created", full_name: "Ada Lovelace" });
    sendLoginCodeEmail.mockRejectedValue(new Error("Resend failed (HTTP 500)"));

    const response = await POST(jsonRequest("/api/login/request", { email: "ada@example.com" }));

    expect(response.status).toBe(500);
    expect(console.error).toHaveBeenCalledWith("login code email failed", expect.anything());
  });
});

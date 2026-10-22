import { beforeEach, describe, expect, test, vi } from "vitest";
import { createHash } from "crypto";
import { POST } from "./route";
import { supabaseMock } from "@/tests/mocks/supabase";
import { jsonRequest } from "@/tests/helpers";

vi.mock("@/lib/supabase/server", async () =>
  (await import("@/tests/mocks/supabase")).supabaseServerModule
);

const registrationId = "4f6c1b7e-2a3d-4c5e-8f90-1a2b3c4d5e6f";

function outcome(data: unknown, error: unknown = null) {
  supabaseMock.respond("rpc:verify_login_code", { data, error });
}

beforeEach(() => {
  supabaseMock.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/login/verify", () => {
  test("rejects a code that isn't 6 digits without checking it", async () => {
    const response = await POST(
      jsonRequest("/api/login/verify", { email: "ada@example.com", code: "12ab" })
    );

    expect(response.status).toBe(400);
    expect(supabaseMock.calls("rpc:verify_login_code")).toEqual([]);
  });

  test("logs in with the right code by setting the enrollment cookie", async () => {
    outcome({ result: "ok", registration_id: registrationId });

    const response = await POST(
      jsonRequest("/api/login/verify", { email: "Ada@Example.com", code: "042137" })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("set-cookie")).toMatch(
      new RegExp(`^bss_enrollment=${registrationId};.*HttpOnly`, "i")
    );
    expect(supabaseMock.calls("rpc:verify_login_code")).toEqual([
      [
        "rpc",
        {
          p_email: "ada@example.com",
          p_ip: "unknown",
          p_code_hash: createHash("sha256").update("042137").digest("hex"),
        },
      ],
    ]);
  });

  test.each([
    ["invalid", 400, /wrong or has expired/],
    ["locked", 400, /Too many wrong tries/],
    ["rate_limited", 429, /wait 15 minutes/],
  ])("refuses a %s code without setting a cookie", async (result, status, message) => {
    outcome({ result });

    const response = await POST(
      jsonRequest("/api/login/verify", { email: "ada@example.com", code: "000000" })
    );

    expect(response.status).toBe(status);
    expect((await response.json()).error).toMatch(message);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  test("errors if the check fails", async () => {
    outcome(null, { message: "database unavailable" });

    const response = await POST(
      jsonRequest("/api/login/verify", { email: "ada@example.com", code: "000000" })
    );

    expect(response.status).toBe(500);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});

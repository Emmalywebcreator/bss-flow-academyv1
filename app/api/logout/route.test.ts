import { expect, test } from "vitest";
import { POST } from "./route";

test("clears the enrollment cookie and sends the student home", async () => {
  const response = await POST(new Request("http://localhost:3000/api/logout", { method: "POST" }));

  expect(response.status).toBe(303);
  expect(response.headers.get("location")).toBe("http://localhost:3000/");
  expect(response.headers.get("set-cookie")).toMatch(/^bss_enrollment=;.*(Max-Age=0|Expires=Thu, 01 Jan 1970)/i);
});

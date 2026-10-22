// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "./page";

const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

function respond(status: number, body: unknown) {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify(body), { status }));
}

beforeEach(() => {
  push.mockReset();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function requestCode() {
  render(<LoginPage />);
  respond(200, { sent: true });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Send login code" }));
  return screen.findByLabelText("Login code");
}

test("asks for the code after sending it, then goes to the welcome page", async () => {
  const codeInput = await requestCode();

  expect(fetch).toHaveBeenCalledWith(
    "/api/login/request",
    expect.objectContaining({ body: JSON.stringify({ email: "ada@example.com" }) })
  );

  respond(200, { ok: true });
  fireEvent.change(codeInput, { target: { value: "04-21 37" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/welcome"));
  expect(vi.mocked(fetch).mock.calls[1]).toEqual([
    "/api/login/verify",
    expect.objectContaining({ body: JSON.stringify({ email: "ada@example.com", code: "042137" }) }),
  ]);
});

test("shows the server's message for a wrong code and stays on the page", async () => {
  const codeInput = await requestCode();

  respond(400, { error: "That code is wrong or has expired." });
  fireEvent.change(codeInput, { target: { value: "000000" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  expect((await screen.findByRole("alert")).textContent).toBe("That code is wrong or has expired.");
  expect(push).not.toHaveBeenCalled();
});

test("shows the rate-limit message when too many codes are requested", async () => {
  render(<LoginPage />);
  respond(429, { error: "Too many login codes requested." });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Send login code" }));

  expect((await screen.findByRole("alert")).textContent).toBe("Too many login codes requested.");
  expect(screen.queryByLabelText("Login code")).toBeNull();
});

test("links to registration for people who haven't registered", () => {
  render(<LoginPage />);

  expect(screen.getByRole("link", { name: "Register" }).getAttribute("href")).toBe("/register");
});

// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Home from "./page";
import { PROGRAM } from "@/constants/program";

afterEach(cleanup);

test("landing page shows the program name and links to registration", () => {
  render(<Home />);

  expect(screen.getByRole("heading", { level: 1, name: PROGRAM.name })).toBeDefined();
  expect(screen.getByRole("link", { name: "Register now" }).getAttribute("href")).toBe(
    "/register"
  );
});

// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SiteHeader } from "./site-header";
import { NAV_LINKS } from "@/app/nav-links";

afterEach(cleanup);

test("header links home, to every section and to registration", () => {
  render(<SiteHeader />);

  const nav = screen.getByRole("navigation", { name: "Main" });
  for (const { href, label } of NAV_LINKS) {
    expect(within(nav).getByRole("link", { name: label }).getAttribute("href")).toBe(href);
  }
  expect(screen.getByRole("link", { name: "BSS Flow Academy" }).getAttribute("href")).toBe("/");
  expect(screen.getByRole("link", { name: "Register" }).getAttribute("href")).toBe("/register");
});

test("mobile menu opens, closes on Escape and closes when a link is chosen", () => {
  render(<SiteHeader />);

  const button = screen.getByRole("button", { name: "Open menu" });
  expect(button.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(button);
  expect(button.getAttribute("aria-expanded")).toBe("true");
  expect(document.getElementById("mobile-nav")).not.toBeNull();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(document.getElementById("mobile-nav")).toBeNull();

  fireEvent.click(button);
  const menu = document.getElementById("mobile-nav")!;
  fireEvent.click(within(menu).getByRole("link", { name: "About" }));
  expect(document.getElementById("mobile-nav")).toBeNull();
});

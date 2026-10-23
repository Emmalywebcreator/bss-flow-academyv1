import { expect, test, vi } from "vitest";
import WelcomePage from "./page";

const redirect = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ redirect }));

test("sends old welcome-page links to the learning page", () => {
  WelcomePage();

  expect(redirect).toHaveBeenCalledWith("/learn");
});

import { expect, test, vi } from "vitest";
import { requireEnrollment } from "@/lib/enrollment-access";
import Lesson1 from "./how-the-internet-and-websites-work/page";
import Lesson1Part from "./how-the-internet-and-websites-work/[part]/page";
import Lesson2 from "./html5-structuring-websites/page";
import Lesson2Part from "./html5-structuring-websites/[part]/page";

vi.mock("@/lib/enrollment-access", () => ({
  requireEnrollment: vi.fn(async () => {
    throw new Error("not enrolled");
  }),
}));

const L1 = "/learn/foundations/how-the-internet-and-websites-work";
const L2 = "/learn/foundations/html5-structuring-websites";

/** The error a page throws, or null if it rendered. */
async function failureOf(page: () => Promise<unknown>) {
  try {
    await page();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

test("every lesson page checks the enrollment, for its own path, before showing anything", async () => {
  const pages: [() => Promise<unknown>, string][] = [
    [() => Lesson1(), L1],
    [() => Lesson1Part({ params: Promise.resolve({ part: "summary" }) }), `${L1}/summary`],
    [() => Lesson2(), L2],
    [() => Lesson2Part({ params: Promise.resolve({ part: "hyperlinks" }) }), `${L2}/hyperlinks`],
  ];

  for (const [page, path] of pages) {
    vi.mocked(requireEnrollment).mockClear();
    expect(await failureOf(page)).toBe("not enrolled");
    expect(requireEnrollment).toHaveBeenCalledWith(path);
  }
});

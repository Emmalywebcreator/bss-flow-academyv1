import { expect, test, vi } from "vitest";
import { requireEnrollment } from "@/lib/enrollment-access";
import Lesson1 from "./how-the-internet-and-websites-work/page";
import Lesson1Part from "./how-the-internet-and-websites-work/[part]/page";
import Lesson2 from "./html5-structuring-websites/page";
import Lesson2Part from "./html5-structuring-websites/[part]/page";
import OopBasics from "../programming/python-oop-basics/page";
import OopBasicsPart from "../programming/python-oop-basics/[part]/page";
import OopDesign from "../programming/python-oop-inheritance-and-design/page";
import OopDesignPart from "../programming/python-oop-inheritance-and-design/[part]/page";
import OopAdvanced from "../programming/python-oop-advanced-classes/page";
import OopAdvancedPart from "../programming/python-oop-advanced-classes/[part]/page";

vi.mock("@/lib/enrollment-access", () => ({
  requireEnrollment: vi.fn(async () => {
    throw new Error("not enrolled");
  }),
}));

const L1 = "/learn/foundations/how-the-internet-and-websites-work";
const L2 = "/learn/foundations/html5-structuring-websites";
const P1 = "/learn/programming/python-oop-basics";
const P2 = "/learn/programming/python-oop-inheritance-and-design";
const P3 = "/learn/programming/python-oop-advanced-classes";

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
    [() => OopBasics(), P1],
    [() => OopBasicsPart({ params: Promise.resolve({ part: "what-is-oop-classes-and-objects" }) }), `${P1}/what-is-oop-classes-and-objects`],
    [() => OopDesign(), P2],
    [() => OopDesignPart({ params: Promise.resolve({ part: "composition-over-inheritance" }) }), `${P2}/composition-over-inheritance`],
    [() => OopAdvanced(), P3],
    [() => OopAdvancedPart({ params: Promise.resolve({ part: "slots-and-memory-efficient-objects" }) }), `${P3}/slots-and-memory-efficient-objects`],
  ];

  for (const [page, path] of pages) {
    vi.mocked(requireEnrollment).mockClear();
    expect(await failureOf(page)).toBe("not enrolled");
    expect(requireEnrollment).toHaveBeenCalledWith(path);
  }
});

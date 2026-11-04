import { LESSONS } from "@/constants/learning";
import type { LessonDefinition } from "@/app/_lessons/lesson";
import { INTERMEDIATE_TOPICS } from "../_python-oop/intermediate";
import { topicParts } from "../_python-oop/render";

const HREF = "/learn/programming/python-oop-inheritance-and-design";

export const LESSON: LessonDefinition = {
  lesson: LESSONS.find((l) => l.href === HREF)!,
  parts: topicParts(INTERMEDIATE_TOPICS),
};

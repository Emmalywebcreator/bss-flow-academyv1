import { LESSONS } from "@/constants/learning";
import type { LessonDefinition } from "@/app/_lessons/lesson";
import { ADVANCED_TOPICS } from "../_python-oop/advanced";
import { topicParts } from "../_python-oop/render";

const HREF = "/learn/programming/python-oop-advanced-classes";

export const LESSON: LessonDefinition = {
  lesson: LESSONS.find((l) => l.href === HREF)!,
  parts: topicParts(ADVANCED_TOPICS),
};

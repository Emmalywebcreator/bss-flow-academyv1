import { LESSONS } from "@/constants/learning";
import type { LessonDefinition } from "@/app/_lessons/lesson";
import { BEGINNER_TOPICS } from "../_python-oop/beginner";
import { topicParts } from "../_python-oop/render";

const HREF = "/learn/programming/python-oop-basics";

export const LESSON: LessonDefinition = {
  lesson: LESSONS.find((l) => l.href === HREF)!,
  parts: topicParts(BEGINNER_TOPICS),
};

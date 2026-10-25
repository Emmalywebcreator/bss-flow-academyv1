import type { LessonPart } from "@/app/_lessons/lesson";
import { introduction } from "./parts/01-introduction";
import { boilerplate } from "./parts/02-boilerplate";
import { nesting } from "./parts/03-nesting";
import { headings } from "./parts/04-headings";
import { lists } from "./parts/05-lists";
import { images } from "./parts/06-images";
import { links } from "./parts/07-links";
import { multiPage } from "./parts/08-multi-page";
import { bestPractices } from "./parts/09-best-practices";
import { finalProject } from "./parts/10-final-project";

// One file per part, read in this order. Each teaching part ends with a
// recap and a quick check; the last part is the project and final quiz.
export const PARTS: readonly LessonPart[] = [
  introduction,
  boilerplate,
  nesting,
  headings,
  lists,
  images,
  links,
  multiPage,
  bestPractices,
  finalProject,
];

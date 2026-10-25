import type { Metadata } from "next";
import {
  LessonPartPage,
  lessonPartMetadata,
  lessonPartParams,
  partIndexOrNotFound,
  requireLessonAccess,
} from "@/app/_lessons/lesson-pages";
import { LESSON } from "../lesson";

type Props = { params: Promise<{ part: string }> };

export function generateStaticParams() {
  return lessonPartParams(LESSON);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return lessonPartMetadata(LESSON, (await params).part);
}

export default async function Html5Part({ params }: Props) {
  const { part } = await params;
  const index = partIndexOrNotFound(LESSON, part);
  await requireLessonAccess(LESSON, part);
  return <LessonPartPage definition={LESSON} index={index} />;
}

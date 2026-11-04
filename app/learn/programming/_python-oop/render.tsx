import type { ReactNode } from "react";
import type { LessonPart, LessonSection } from "@/app/_lessons/lesson";
import { Code, CodeBlock } from "@/app/_lessons/prose";
import { Quiz } from "@/app/_lessons/quiz";
import type { Block, Topic } from "./topic";

const detailsClass =
  "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950";
const summaryClass = "cursor-pointer font-medium text-zinc-950 dark:text-zinc-50";

/** Text with `code` and **bold** spans. */
export function inline(text: string): ReactNode[] {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((piece, i) => {
      if (piece.startsWith("`")) return <Code key={i}>{piece.slice(1, -1)}</Code>;
      if (piece.startsWith("**")) return <strong key={i}>{inline(piece.slice(2, -2))}</strong>;
      return piece;
    });
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "p":
      return <p key={key}>{inline(block.text)}</p>;
    case "list":
      return (
        <ul key={key}>
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm leading-6 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
        >
          {block.text.trim()}
        </pre>
      );
    case "code":
      return (
        <div key={key} className="flex flex-col gap-2">
          <CodeBlock label="Example">{block.code}</CodeBlock>
          <CodeBlock label="Output">{block.output || "(no output)"}</CodeBlock>
        </div>
      );
  }
}

/** How to follow along: shown at the start of each lesson. */
function setupSection(prefix: string): LessonSection {
  return {
    id: `${prefix}-before-you-start`,
    title: "Before you start",
    body: (
      <>
        <p>
          This lesson uses Python 3.10 or newer. To check yours, open a terminal and run{" "}
          <Code>python3 --version</Code> (on Windows, <Code>python --version</Code>). If you
          don&apos;t have Python, download it from <a href="https://www.python.org/downloads/">python.org</a>.
        </p>
        <p>
          Each example shows its code and the output it prints. Try them yourself: save the code
          in a file such as <Code>example.py</Code> and run <Code>python3 example.py</Code>. Change
          things and see what happens; that&apos;s the fastest way to learn.
        </p>
        <p>
          The outputs were recorded with Python 3.12. A few details, such as memory addresses
          (<Code>0x7b83…</Code>) and object sizes, will be different on your computer.
        </p>
      </>
    ),
  };
}

/** A topic as one lesson part: the explanation, a quick check, then a coding challenge. */
export function topicPart(topic: Topic, { first = false } = {}): LessonPart {
  const { slug, challenge } = topic;
  const sections: LessonSection[] = [];
  if (first) sections.push(setupSection(slug));

  sections.push(
    {
      id: `${slug}-explanation`,
      title: "Explanation and examples",
      body: <>{topic.blocks.map(renderBlock)}</>,
    },
    {
      id: `${slug}-quick-check`,
      title: "Quick check",
      body: (
        <>
          <p>
            {topic.quiz.length} quick questions on this part. Choose an answer for each, then check
            them to see an explanation.
          </p>
          <Quiz questions={topic.quiz} />
        </>
      ),
    },
    {
      id: `${slug}-challenge`,
      title: "Coding challenge",
      body: (
        <>
          {challenge.task.map(renderBlock)}
          <CodeBlock label="Starter code">{challenge.starter}</CodeBlock>
          <p>
            Write your solution in a <Code>.py</Code> file and run it to check it behaves as the
            task describes. Stuck? Open the hint first, and the model solution only once
            you&apos;ve had a go.
          </p>
          <details className={detailsClass}>
            <summary className={summaryClass}>Show a hint</summary>
            <p className="mt-3">{inline(challenge.hint)}</p>
          </details>
          <details className={detailsClass}>
            <summary className={summaryClass}>Show the model solution</summary>
            <div className="mt-4">
              <CodeBlock label="Model solution">{challenge.solution}</CodeBlock>
            </div>
          </details>
        </>
      ),
    }
  );

  return { slug, title: topic.title, minutes: topic.minutes, sections };
}

/** Every topic of one level as the parts of a lesson. */
export function topicParts(topics: readonly Topic[]): LessonPart[] {
  return topics.map((topic, i) => topicPart(topic, { first: i === 0 }));
}

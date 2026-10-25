import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { Quiz } from "@/app/_lessons/quiz";
import { FINAL_QUIZ } from "./final-quiz";
import { SITE_TREE } from "./site-example";

export const finalProject: LessonPart = {
  slug: "final-project",
  title: "Final Project and Assessment",
  minutes: 8,
  sections: [
    {
      id: "project-brief",
      title: "Project: My First Multi-Page Website",
      body: (
        <>
          <p>
            Time to bring everything together. You&apos;ll build a small website about yourself
            with three linked pages, using only HTML. No CSS or JavaScript is needed: a plain,
            well-structured site is exactly the goal.
          </p>
          <p>
            If you did the exercise in Part 8, start from that folder and improve it. Otherwise,
            start fresh.
          </p>
        </>
      ),
    },
    {
      id: "final-folder-structure",
      title: "Suggested folder structure",
      body: (
        <>
          <CodeBlock label="Folder structure">{SITE_TREE}</CodeBlock>
          <p>
            You can use your own image name, such as <Code>images/my-photo.jpg</Code>, as long as
            the <Code>src</Code> matches it exactly.
          </p>
        </>
      ),
    },
    {
      id: "project-instructions",
      title: "Instructions",
      body: (
        <ol>
          <li>
            Create the <Code>my-website</Code> folder with an <Code>images</Code> folder inside,
            and add at least one image.
          </li>
          <li>
            Create <Code>index.html</Code>, <Code>about.html</Code> and <Code>contact.html</Code>,
            each starting with the full HTML5 boilerplate.
          </li>
          <li>Give each page its own descriptive title.</li>
          <li>Add the same navigation menu to every page, linking all three pages.</li>
          <li>
            On the homepage, write a main heading and a short welcome in paragraphs, and add your
            image with meaningful alt text.
          </li>
          <li>
            On the About page, introduce yourself and add at least one list, such as things you
            want to learn.
          </li>
          <li>
            On the Contact page, say how to reach you. You can use an email link, or a made-up
            address such as <Code>you@example.com</Code> if you prefer.
          </li>
          <li>
            Check your work against the checklist below, test it in the browser, and run each page
            through the W3C validator.
          </li>
        </ol>
      ),
    },
    {
      id: "project-checklist",
      title: "Requirements checklist",
      body: (
        <>
          <p>Your website is complete when:</p>
          <ul>
            <li>There are three pages: index.html, about.html and contact.html.</li>
            <li>
              Every page has <Code>{"<!DOCTYPE html>"}</Code>, <Code>{'<html lang="en">'}</Code>,
              a head with charset, viewport and title, and a body.
            </li>
            <li>Each page has its own descriptive title.</li>
            <li>A navigation menu on every page links to all three pages, and every link works.</li>
            <li>
              Each page has one <Code>{"<h1>"}</Code>, and headings below it are in order.
            </li>
            <li>Text is in paragraphs, not loose in the body.</li>
            <li>There is at least one ordered or unordered list.</li>
            <li>There is at least one image with meaningful alt text, and it loads.</li>
            <li>Code is consistently indented and correctly nested.</li>
            <li>Filenames are lowercase, with no spaces.</li>
          </ul>
          <KeyIdea title="Going further">
            Wrap each page&apos;s content in <Code>{"<header>"}</Code>, <Code>{"<main>"}</Code> and{" "}
            <Code>{"<footer>"}</Code>, as shown in Part 9.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "assessment-questions",
      title: "Assessment questions",
      body: (
        <>
          <p>
            When your site is finished, answer these in your own words. Writing the answers down
            is the best way to find out what you&apos;ve really understood.
          </p>
          <ol>
            <li>What is the difference between the head and the body of a page?</li>
            <li>
              Why did you choose an ordered or an unordered list for your list?
            </li>
            <li>Read the alt text of your image aloud. Does it describe the image to someone who can&apos;t see it?</li>
            <li>
              Why do the links in your navigation work without <Code>https://</Code>?
            </li>
            <li>
              If you renamed <Code>about.html</Code> to <Code>about-me.html</Code>, what else would
              you need to change?
            </li>
            <li>What did the validator find, and how did you fix it?</li>
          </ol>
        </>
      ),
    },
    {
      id: "final-quiz",
      title: "Final knowledge quiz",
      body: (
        <>
          <p>
            {FINAL_QUIZ.length} questions covering the whole lesson. Choose one answer for each,
            then check your answers to see your score and an explanation for every question.
          </p>
          <Quiz questions={FINAL_QUIZ} />
        </>
      ),
    },
    {
      id: "final-answers",
      title: "Answers and explanations",
      body: (
        <>
          <p>
            Checking your answers above shows each explanation next to its question. If you&apos;d
            rather read them all together, open the list below — try the quiz first, though.
          </p>
          <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <summary className="cursor-pointer font-medium text-zinc-950 dark:text-zinc-50">
              Show all answers
            </summary>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              {FINAL_QUIZ.map((q) => (
                <li key={q.id}>
                  <strong className="text-zinc-950 dark:text-zinc-50">{q.question}</strong>
                  <br />
                  Answer: {q.options[q.answer]}. {q.explanation}
                </li>
              ))}
            </ol>
          </details>
        </>
      ),
    },
    {
      id: "lesson-summary",
      title: "Lesson summary",
      body: (
        <ul>
          <li>HTML describes the structure and meaning of a page, using elements made of tags.</li>
          <li>Every page starts with the HTML5 boilerplate: DOCTYPE, html, head and body.</li>
          <li>Indent consistently and nest correctly: the element opened last closes first.</li>
          <li>Use one h1 and headings in order; put text in paragraphs.</li>
          <li>Use ul when order doesn&apos;t matter and ol when it does, with li for each item.</li>
          <li>Images need src and meaningful alt text; links need href and descriptive text.</li>
          <li>A website is a folder of linked HTML files, with index.html as the homepage.</li>
          <li>Keep filenames lowercase, leave appearance to CSS, and validate your HTML.</li>
        </ul>
      ),
    },
  ],
};

import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

const answerClass =
  "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950";
const summaryClass = "cursor-pointer font-medium text-zinc-950 dark:text-zinc-50";

export const headings: LessonPart = {
  slug: "headings-and-paragraphs",
  title: "Headings and Paragraphs",
  minutes: 5,
  sections: [
    {
      id: "headings",
      title: "Headings: <h1> to <h6>",
      body: (
        <>
          <p>
            HTML has six levels of heading, from <Code>{"<h1>"}</Code> (the most important) to{" "}
            <Code>{"<h6>"}</Code> (the least important).
          </p>
          <CodeBlock label="The six heading levels">{`
<h1>Main title of the page</h1>
<h2>A main section</h2>
<h3>A sub-section</h3>
<h4>A smaller sub-section</h4>
<h5>Rarely needed</h5>
<h6>Very rarely needed</h6>
`}</CodeBlock>
          <p>
            Most pages only need <Code>{"<h1>"}</Code>, <Code>{"<h2>"}</Code> and{" "}
            <Code>{"<h3>"}</Code>.
          </p>
        </>
      ),
    },
    {
      id: "paragraphs",
      title: "Paragraphs: <p>",
      body: (
        <>
          <p>
            Wrap each paragraph of text in a <Code>{"<p>"}</Code> element. The browser adds space
            between paragraphs for you.
          </p>
          <CodeBlock label="Two paragraphs">{`
<p>Tomatoes grow well in warm, sunny places.</p>
<p>Water them in the morning, not in the heat of the day.</p>
`}</CodeBlock>
          <p>
            Pressing Enter in your code does <em>not</em> start a new paragraph. Browsers treat any
            run of spaces and line breaks as a single space. This shows as one line:
          </p>
          <CodeBlock label="Still one paragraph">{`
<p>Tomatoes grow well
in warm, sunny places.</p>
`}</CodeBlock>
          <p>
            When you need a line break inside one piece of text, such as an address or a poem, use{" "}
            <Code>{"<br>"}</Code>. Don&apos;t use <Code>{"<br>"}</Code> to separate paragraphs;
            use separate <Code>{"<p>"}</Code> elements.
          </p>
        </>
      ),
    },
    {
      id: "heading-hierarchy",
      title: "A meaningful heading hierarchy",
      body: (
        <>
          <p>
            Headings describe the <strong>structure</strong> of your content, like the table of
            contents of a book. Follow three rules:
          </p>
          <ol>
            <li>
              Use one <Code>{"<h1>"}</Code> per page, for the page&apos;s main topic.
            </li>
            <li>
              Use <Code>{"<h2>"}</Code> for the main sections, and <Code>{"<h3>"}</Code> for
              sections inside those.
            </li>
            <li>
              Don&apos;t skip levels on the way down: an <Code>{"<h2>"}</Code> should come before
              any <Code>{"<h3>"}</Code> beneath it.
            </li>
          </ol>
          <CodeBlock label="A clear hierarchy">{`
<h1>Growing Tomatoes at Home</h1>

<h2>What you need</h2>
<p>Seeds, a pot, soil and a sunny spot.</p>

<h2>Caring for your plants</h2>

<h3>Watering</h3>
<p>Water every morning.</p>

<h3>Sunlight</h3>
<p>Give them at least six hours of sun a day.</p>
`}</CodeBlock>
          <p>
            If you indented the headings by level, they would look like an outline. That outline
            is exactly what search engines and screen readers see. Many screen reader users jump
            from heading to heading to find what they need, so a clear hierarchy makes your page
            easier for them to use.
          </p>
        </>
      ),
    },
    {
      id: "not-for-size",
      title: "Choose headings for meaning, not size",
      body: (
        <>
          <p>
            Browsers show <Code>{"<h1>"}</Code> very large and <Code>{"<h6>"}</Code> small.
            It&apos;s tempting to pick a heading because you like how big it looks. Don&apos;t:
            choose the level that matches the content&apos;s place in the structure.
          </p>
          <p>
            Size is appearance, and appearance is CSS&apos;s job. With CSS you can make any heading
            any size you like, so there&apos;s never a reason to choose the wrong level for its
            looks.
          </p>
          <KeyIdea title="Common mistakes">
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Using a heading just to make text bold or big.</li>
              <li>Using several <Code>{"<h1>"}</Code> elements because they look impressive.</li>
              <li>Jumping from <Code>{"<h1>"}</Code> straight to <Code>{"<h4>"}</Code>.</li>
              <li>
                Using <Code>{"<br><br>"}</Code> to make space instead of separate paragraphs.
              </li>
              <li>Leaving text outside any element, loose in the body.</li>
            </ul>
          </KeyIdea>
        </>
      ),
    },
    {
      id: "structure-an-article",
      title: "Exercise: structure an article",
      body: (
        <>
          <p>
            Create a file called <Code>article.html</Code> with the boilerplate from Part 2. Then
            put this text into the body, using headings and paragraphs to give it structure:
          </p>
          <CodeBlock label="Plain text to structure">{`
Starting Your Day Well
Morning habits
Wake up at the same time each day. Your body will get used to it.
Drink a glass of water before anything else.
Planning
Write down the three most important things you want to do today.
Evening habits
Put your phone away an hour before bed.
`}</CodeBlock>
          <p>
            Decide which line is the page&apos;s main title, which lines are section headings, and
            which lines are paragraphs. Open the file in your browser to check it.
          </p>
          <details className={answerClass}>
            <summary className={summaryClass}>Show a possible answer</summary>
            <div className="mt-4">
              <CodeBlock label="article.html (body only)">{`
<h1>Starting Your Day Well</h1>

<h2>Morning habits</h2>
<p>Wake up at the same time each day. Your body will get used to it.</p>
<p>Drink a glass of water before anything else.</p>

<h3>Planning</h3>
<p>Write down the three most important things you want to do today.</p>

<h2>Evening habits</h2>
<p>Put your phone away an hour before bed.</p>
`}</CodeBlock>
              <p className="mt-3">
                &quot;Planning&quot; is part of the morning, so it&apos;s an{" "}
                <Code>{"<h3>"}</Code> under &quot;Morning habits&quot;. Making it an{" "}
                <Code>{"<h2>"}</Code> is also fine if you see it as its own section; what matters
                is that you chose the level for a reason.
              </p>
            </div>
          </details>
        </>
      ),
    },
    recap("headings", [
      "There are six heading levels, <h1> to <h6>. Most pages need only <h1> to <h3>.",
      "Use one <h1> per page, then <h2> and <h3> in order, without skipping levels.",
      "Choose a heading level for its place in the structure, not for its size.",
      "Each paragraph goes in its own <p>. Line breaks in your code don't show in the browser.",
    ]),
    quickCheck("headings", [
      {
        id: "headings-q1",
        question: "How many <h1> elements should a typical page have?",
        options: ["None", "One", "One per paragraph", "As many as you like"],
        answer: 1,
        explanation:
          "One <h1> states the page's main topic. Sections below it use <h2>, <h3> and so on.",
      },
      {
        id: "headings-q2",
        question: "You want a section title to look smaller. What should you do?",
        options: [
          "Change it from <h2> to <h5>",
          "Keep the heading level that fits the structure and change its size with CSS later",
          "Replace it with a <p>",
          "Add <br> before it",
        ],
        answer: 1,
        explanation:
          "Heading levels describe structure. Appearance, including size, is controlled with CSS.",
      },
      {
        id: "headings-q3",
        question: "You press Enter in the middle of a <p> in your code. What does the browser show?",
        options: [
          "Two paragraphs",
          "A line break",
          "One paragraph, with the line break treated as a space",
          "An error",
        ],
        answer: 2,
        explanation:
          "Browsers collapse spaces and line breaks in your code into a single space. Use separate <p> elements for separate paragraphs.",
      },
    ]),
  ],
};

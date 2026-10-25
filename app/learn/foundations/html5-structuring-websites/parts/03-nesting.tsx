import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

export const nesting: LessonPart = {
  slug: "indentation-and-nesting",
  title: "Indentation and Nesting",
  minutes: 4,
  sections: [
    {
      id: "what-is-indentation",
      title: "What indentation means",
      body: (
        <>
          <p>
            <strong>Indentation</strong> is the space at the start of a line. In HTML, you indent
            an element when it sits inside another one. Compare these two versions of the same
            list:
          </p>
          <CodeBlock label="Hard to read">{`
<ul>
<li>Rice</li>
<li>Beans</li>
</ul>
`}</CodeBlock>
          <CodeBlock label="Easy to read">{`
<ul>
    <li>Rice</li>
    <li>Beans</li>
</ul>
`}</CodeBlock>
          <p>
            Both show exactly the same thing in the browser. Browsers ignore indentation
            completely. It&apos;s there for people: you, your future self, and anyone else who
            reads your code.
          </p>
        </>
      ),
    },
    {
      id: "why-formatting-matters",
      title: "Why readable formatting matters",
      body: (
        <>
          <p>Well-formatted HTML lets you:</p>
          <ul>
            <li>see at a glance which elements are inside which;</li>
            <li>spot a missing closing tag, because the shape of the code looks wrong;</li>
            <li>find and change things quickly when the page grows to hundreds of lines.</li>
          </ul>
          <p>
            Pick one size of indent, either 2 or 4 spaces, and use it everywhere. This lesson uses
            4. Most editors indent for you when you press Tab or Enter.
          </p>
          <KeyIdea title="Tip">
            In VS Code, right-click in your file and choose &quot;Format Document&quot; to tidy the
            indentation of the whole file at once.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "what-is-nesting",
      title: "Nesting: elements inside elements",
      body: (
        <>
          <p>
            <strong>Nesting</strong> means putting one element inside another. You&apos;ve already
            done it: the boilerplate nests <Code>{"<head>"}</Code> and <Code>{"<body>"}</Code>{" "}
            inside <Code>{"<html>"}</Code>.
          </p>
          <p>We describe nested elements like a family tree:</p>
          <ul>
            <li>
              A <strong>parent</strong> is an element that contains others.
            </li>
            <li>
              A <strong>child</strong> is an element directly inside a parent.
            </li>
            <li>
              <strong>Siblings</strong> are children of the same parent, side by side.
            </li>
          </ul>
          <CodeBlock label="Parents, children and siblings">{`
<body>
    <h1>My recipes</h1>
    <p>My favourite is <strong>jollof rice</strong>.</p>
</body>
`}</CodeBlock>
          <p>
            Here <Code>{"<body>"}</Code> is the parent of <Code>{"<h1>"}</Code> and{" "}
            <Code>{"<p>"}</Code>, which are siblings. <Code>{"<strong>"}</Code> is a child of{" "}
            <Code>{"<p>"}</Code>. (<Code>{"<strong>"}</Code> marks words as important; browsers
            show them in bold.)
          </p>
        </>
      ),
    },
    {
      id: "correct-nesting",
      title: "Correct and incorrect nesting",
      body: (
        <>
          <p>
            The rule is simple: <strong>an element must close inside the element it opened
            in.</strong> Whatever you opened last, you close first, like boxes packed inside boxes.
          </p>
          <CodeBlock label="Correct">{`
<p>This is a <strong>very important</strong> message.</p>
`}</CodeBlock>
          <p>
            <Code>{"<strong>"}</Code> opens inside <Code>{"<p>"}</Code> and closes before{" "}
            <Code>{"<p>"}</Code> does. The inner box fits completely inside the outer one.
          </p>
          <CodeBlock label="Incorrect">{`
<p>This is a <strong>very important</p></strong>
`}</CodeBlock>
          <p>
            Here <Code>{"<p>"}</Code> closes while <Code>{"<strong>"}</Code> is still open, so the
            two elements overlap. That breaks the &quot;boxes inside boxes&quot; rule. The browser
            has to guess what you meant, and different guesses can make text bold where you
            didn&apos;t want it or break the layout of what comes next.
          </p>
          <KeyIdea>
            To check nesting, read your closing tags from left to right. They should match your
            opening tags in reverse order.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "nesting-mistakes",
      title: "Common nesting mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Overlapping tags</strong>, as in the incorrect example above.
            </li>
            <li>
              <strong>Forgetting a closing tag.</strong> A missing <Code>{"</strong>"}</Code> can
              make the rest of the page bold.
            </li>
            <li>
              <strong>Closing the wrong tag</strong>, such as opening <Code>{"<h2>"}</Code> and
              closing with <Code>{"</h3>"}</Code>.
            </li>
            <li>
              <strong>Putting a heading or list inside a paragraph.</strong> A paragraph can only
              hold text and small inline elements like <Code>{"<strong>"}</Code> and links. Write{" "}
              <Code>{"<h2>"}</Code> and <Code>{"<ul>"}</Code> next to paragraphs, not inside them.
            </li>
          </ul>
        </>
      ),
    },
    recap("nesting", [
      "Indentation is for people, not browsers. Pick 2 or 4 spaces and stay consistent.",
      "Nesting means putting elements inside other elements: parents contain children, and children of the same parent are siblings.",
      "Close the element you opened last first. Elements must never overlap.",
    ]),
    quickCheck("nesting", [
      {
        id: "nesting-q1",
        question: "What happens if you remove all the indentation from an HTML file?",
        options: [
          "The page stops working",
          "The page looks the same in the browser, but the code is harder to read",
          "All the text becomes one paragraph",
          "The browser shows an error message",
        ],
        answer: 1,
        explanation: "Browsers ignore indentation. It exists only to make code readable for people.",
      },
      {
        id: "nesting-q2",
        question: "Which line is nested correctly?",
        options: [
          "<p>Learn <strong>HTML</p></strong>",
          "<p>Learn <strong>HTML</strong></p>",
          "<strong><p>Learn HTML</strong></p>",
          "<p>Learn <strong>HTML</p>",
        ],
        answer: 1,
        explanation:
          "<strong> opens inside <p> and closes before it. The others overlap or leave <strong> unclosed.",
      },
      {
        id: "nesting-q3",
        question: "In <ul><li>Rice</li><li>Beans</li></ul>, how are the two <li> elements related?",
        options: [
          "They are siblings, both children of <ul>",
          "The first is the parent of the second",
          "They are not related",
          "Each <li> is the parent of <ul>",
        ],
        answer: 0,
        explanation: "Both sit directly inside <ul>, so they are its children and each other's siblings.",
      },
    ]),
  ],
};

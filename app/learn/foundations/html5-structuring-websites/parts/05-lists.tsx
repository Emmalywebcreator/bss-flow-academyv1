import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

const answerClass =
  "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950";
const summaryClass = "cursor-pointer font-medium text-zinc-950 dark:text-zinc-50";

export const lists: LessonPart = {
  slug: "html-lists",
  title: "HTML Lists",
  minutes: 4,
  sections: [
    {
      id: "unordered-lists",
      title: "Unordered lists: <ul>",
      body: (
        <>
          <p>
            An <strong>unordered list</strong> is a list where the order doesn&apos;t matter, like
            a shopping list. The browser shows each item with a bullet point.
          </p>
          <CodeBlock label="A shopping list">{`
<ul>
    <li>Rice</li>
    <li>Tomatoes</li>
    <li>Onions</li>
    <li>Pepper</li>
</ul>
`}</CodeBlock>
          <p>Two elements work together:</p>
          <ul>
            <li>
              <Code>{"<ul>"}</Code> wraps the whole list.
            </li>
            <li>
              <Code>{"<li>"}</Code> (list item) wraps each item. Only <Code>{"<li>"}</Code>{" "}
              elements can go directly inside <Code>{"<ul>"}</Code>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "ordered-lists",
      title: "Ordered lists: <ol>",
      body: (
        <>
          <p>
            An <strong>ordered list</strong> is one where the order matters, like steps in
            instructions. The browser numbers the items for you.
          </p>
          <CodeBlock label="Numbered instructions">{`
<ol>
    <li>Boil some water.</li>
    <li>Put a tea bag in a cup.</li>
    <li>Pour in the hot water.</li>
    <li>Wait three minutes, then remove the tea bag.</li>
</ol>
`}</CodeBlock>
          <p>
            You don&apos;t type the numbers yourself. If you add a step in the middle, the browser
            renumbers everything.
          </p>
        </>
      ),
    },
    {
      id: "choosing-a-list",
      title: "Which list should you use?",
      body: (
        <>
          <p>Ask one question: if I shuffled the items, would the meaning change?</p>
          <ul>
            <li>
              <strong>No</strong> &rarr; use <Code>{"<ul>"}</Code>. Examples: ingredients, features
              of a product, a list of your hobbies.
            </li>
            <li>
              <strong>Yes</strong> &rarr; use <Code>{"<ol>"}</Code>. Examples: recipe steps,
              directions, a top-10 ranking.
            </li>
          </ul>
          <KeyIdea title="Common mistake">
            Don&apos;t type bullets or numbers into paragraphs, like <Code>{"<p>1. Boil water</p>"}</Code>.
            Screen readers announce a real list (&quot;list, 4 items&quot;), and the browser keeps
            the numbering right for you.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "nested-lists",
      title: "Nested lists",
      body: (
        <>
          <p>
            A list can contain another list. Put the inner list <strong>inside an{" "}
            <Code>{"<li>"}</Code></strong>, after that item&apos;s text:
          </p>
          <CodeBlock label="A nested list">{`
<ul>
    <li>Fruit
        <ul>
            <li>Mangoes</li>
            <li>Oranges</li>
        </ul>
    </li>
    <li>Vegetables
        <ul>
            <li>Spinach</li>
            <li>Carrots</li>
        </ul>
    </li>
</ul>
`}</CodeBlock>
          <p>
            Notice that the closing <Code>{"</li>"}</Code> for &quot;Fruit&quot; comes after the
            inner list. The inner list belongs to that item. You can also mix types, for example an
            ordered list of steps with an unordered list of tips inside one step.
          </p>
          <KeyIdea title="Common mistake">
            Placing the inner <Code>{"<ul>"}</Code> directly inside the outer{" "}
            <Code>{"<ul>"}</Code>, between two <Code>{"<li>"}</Code> elements, isn&apos;t valid.
            It must sit inside an <Code>{"<li>"}</Code>.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "lists-task",
      title: "Exercise: make both kinds of list",
      body: (
        <>
          <p>
            Create <Code>lists.html</Code> with the boilerplate. In the body, add:
          </p>
          <ol>
            <li>
              An <Code>{"<h1>"}</Code> that says &quot;My Lists&quot;.
            </li>
            <li>
              An <Code>{"<h2>"}</Code> &quot;Things I want to learn&quot;, followed by an
              unordered list of at least three items.
            </li>
            <li>
              An <Code>{"<h2>"}</Code> &quot;How I get ready in the morning&quot;, followed by an
              ordered list of at least four steps.
            </li>
            <li>
              Inside one of the steps, a nested unordered list with two details.
            </li>
          </ol>
          <details className={answerClass}>
            <summary className={summaryClass}>Show a possible answer</summary>
            <div className="mt-4">
              <CodeBlock label="lists.html (body only)">{`
<h1>My Lists</h1>

<h2>Things I want to learn</h2>
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>

<h2>How I get ready in the morning</h2>
<ol>
    <li>Wake up at 6am.</li>
    <li>Have a shower.</li>
    <li>Eat breakfast
        <ul>
            <li>Bread and eggs</li>
            <li>A cup of tea</li>
        </ul>
    </li>
    <li>Leave for work.</li>
</ol>
`}</CodeBlock>
            </div>
          </details>
        </>
      ),
    },
    recap("lists", [
      "<ul> makes a bulleted list where order doesn't matter; <ol> makes a numbered list where it does.",
      "Every item goes in an <li>, and only <li> elements go directly inside <ul> or <ol>.",
      "A nested list goes inside an <li>, after that item's text.",
    ]),
    quickCheck("lists", [
      {
        id: "lists-q1",
        question: "Which list suits the steps of a recipe?",
        options: ["<ul>", "<ol>", "A <p> for each step", "<li> on its own"],
        answer: 1,
        explanation: "Recipe steps must be followed in order, so an ordered list fits.",
      },
      {
        id: "lists-q2",
        question: "What can go directly inside a <ul>?",
        options: ["Any element", "Only <p> elements", "Only <li> elements", "Only text"],
        answer: 2,
        explanation:
          "A list's direct children must be <li> items. Other content, including nested lists, goes inside an <li>.",
      },
      {
        id: "lists-q3",
        question: "Where does a nested list go?",
        options: [
          "Inside an <li> of the outer list",
          "Directly inside the outer <ul>, between items",
          "After the outer list's closing tag",
          "Inside the <head>",
        ],
        answer: 0,
        explanation:
          "The inner list belongs to one item, so it goes inside that <li>, before its closing tag.",
      },
    ]),
  ],
};

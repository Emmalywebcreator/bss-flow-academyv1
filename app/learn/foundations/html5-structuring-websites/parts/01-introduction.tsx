import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

export const introduction: LessonPart = {
  slug: "introduction-to-html5",
  title: "Introduction to HTML5",
  minutes: 5,
  sections: [
    {
      id: "what-is-html",
      title: "What is HTML?",
      body: (
        <>
          <p>
            HTML stands for <strong>HyperText Markup Language</strong>. It&apos;s the language
            every web page is written in. Each part of the name tells you something:
          </p>
          <ul>
            <li>
              <strong>HyperText</strong> is text that contains links to other text. Links are what
              turn separate pages into a web.
            </li>
            <li>
              <strong>Markup</strong> means adding labels around content to say what each piece
              is: &quot;this is a heading&quot;, &quot;this is a paragraph&quot;, &quot;this is an
              image&quot;.
            </li>
            <li>
              <strong>Language</strong> means there is a fixed set of rules for writing those
              labels, so every browser understands them the same way.
            </li>
          </ul>
          <p>
            <strong>HTML5</strong> is the current version of HTML. When people say
            &quot;HTML&quot; today, they mean HTML5, and it&apos;s what this lesson teaches.
          </p>
          <p>
            HTML is not a programming language. It doesn&apos;t make decisions or do
            calculations. It describes content, which makes it the friendliest place to start.
          </p>
        </>
      ),
    },
    {
      id: "html-css-javascript-roles",
      title: "HTML, CSS and JavaScript",
      body: (
        <>
          <p>
            You met these three in the previous lesson. Each one has its own job, and HTML always
            comes first:
          </p>
          <ul>
            <li>
              <strong>HTML</strong> gives a page its <em>structure and meaning</em>: the headings,
              paragraphs, lists, images and links.
            </li>
            <li>
              <strong>CSS</strong> controls how that structure <em>looks</em>: colours, fonts,
              spacing and layout.
            </li>
            <li>
              <strong>JavaScript</strong> adds <em>behaviour</em>: things that happen when you
              click, type or scroll.
            </li>
          </ul>
          <p>
            Think of building a house. HTML is the walls, rooms and doors. CSS is the paint and
            furniture. JavaScript is the electricity that makes the lights switch on. You can live
            in a house without paint, but not without walls. A page with only HTML still works;
            it just looks plain.
          </p>
          <KeyIdea>
            In this lesson you&apos;ll write HTML only. Your pages will look plain, and that&apos;s
            expected. Styling comes in a later lesson.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "elements-and-tags",
      title: "Elements and tags",
      body: (
        <>
          <p>
            HTML is made of <strong>elements</strong>. An element is one piece of content plus the
            labels around it. Here is a paragraph element:
          </p>
          <CodeBlock label="A paragraph element">{`
<p>I am learning HTML.</p>
`}</CodeBlock>
          <p>It has three parts:</p>
          <ul>
            <li>
              The <strong>opening tag</strong>, <Code>{"<p>"}</Code>, marks where the element
              starts. A tag is a name inside angle brackets: <Code>{"<"}</Code> and{" "}
              <Code>{">"}</Code>.
            </li>
            <li>
              The <strong>content</strong>, <Code>I am learning HTML.</Code>, is what the visitor
              sees.
            </li>
            <li>
              The <strong>closing tag</strong>, <Code>{"</p>"}</Code>, marks where it ends. It&apos;s
              the same as the opening tag with a forward slash before the name.
            </li>
          </ul>
          <p>
            People often say &quot;tag&quot; and &quot;element&quot; as if they mean the same
            thing. Strictly, the tags are the labels, and the element is the whole thing: opening
            tag, content and closing tag together.
          </p>
        </>
      ),
    },
    {
      id: "void-elements",
      title: "Void elements: no closing tag",
      body: (
        <>
          <p>
            Some elements have no content, so there&apos;s nothing to wrap and no closing tag.
            These are called <strong>void elements</strong>. Two you&apos;ll use soon:
          </p>
          <ul>
            <li>
              <Code>{"<br>"}</Code> starts a new line.
            </li>
            <li>
              <Code>{"<img>"}</Code> shows an image (you&apos;ll learn it in Part 6).
            </li>
          </ul>
          <CodeBlock label="A void element inside a paragraph">{`
<p>BSS Flow Academy<br>Benin City</p>
`}</CodeBlock>
          <p>
            You may also see void elements written with a slash, like <Code>{"<br />"}</Code>.
            This is sometimes called a &quot;self-closing&quot; tag. HTML5 accepts it, but the
            slash does nothing, so this lesson leaves it out.
          </p>
          <KeyIdea title="Common mistake">
            Don&apos;t write a closing tag for a void element. <Code>{"</br>"}</Code> and{" "}
            <Code>{"</img>"}</Code> are not valid HTML.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "basic-syntax",
      title: "Basic HTML syntax",
      body: (
        <>
          <p>
            &quot;Syntax&quot; means the rules for writing something correctly. For HTML, the main
            rules are:
          </p>
          <ul>
            <li>
              Tag names go inside angle brackets: <Code>{"<h1>"}</Code>.
            </li>
            <li>
              Most elements need a matching closing tag with a slash: <Code>{"</h1>"}</Code>.
            </li>
            <li>Write tag names in lowercase. Browsers accept capitals, but lowercase is the norm.</li>
            <li>
              Extra information goes in <strong>attributes</strong>, inside the opening tag.
            </li>
          </ul>
          <p>An attribute has a name, an equals sign, and a value in quotes:</p>
          <CodeBlock label="An element with an attribute">{`
<p lang="fr">Bonjour tout le monde.</p>
`}</CodeBlock>
          <p>
            Here <Code>lang</Code> is the attribute&apos;s name and <Code>fr</Code> is its value. It
            tells the browser this paragraph is in French. You&apos;ll use attributes for images
            and links later in this lesson.
          </p>
        </>
      ),
    },
    {
      id: "hello-world",
      title: "Your first HTML: Hello, World!",
      body: (
        <>
          <p>
            Programmers traditionally start with a page that says &quot;Hello, World!&quot;. Here
            is yours:
          </p>
          <CodeBlock label="hello.html">{`
<h1>Hello, World!</h1>
<p>This is my first web page.</p>
`}</CodeBlock>
          <p>To see it in your browser:</p>
          <ol>
            <li>
              Open a text editor. <strong>VS Code</strong> is free and widely used; Notepad
              (Windows) or TextEdit (Mac) also works.
            </li>
            <li>Type the two lines above.</li>
            <li>
              Save the file as <Code>hello.html</Code>. The <Code>.html</Code> ending tells your
              computer it&apos;s a web page.
            </li>
            <li>Double-click the file. It opens in your web browser.</li>
          </ol>
          <p>
            You should see &quot;Hello, World!&quot; as a large heading with a sentence underneath.
            The browser read your tags and decided how to show each element.
          </p>
          <KeyIdea title="Tip">
            Notepad sometimes saves files as <Code>hello.html.txt</Code>. In the Save dialog,
            choose &quot;All files&quot; as the file type. In TextEdit, choose Format &rarr; Make
            Plain Text before saving.
          </KeyIdea>
          <p>
            This file works, but it&apos;s missing parts every real page should have. Part 2 adds
            them.
          </p>
        </>
      ),
    },
    recap("intro", [
      "HTML (HyperText Markup Language) describes the structure and meaning of a web page.",
      "HTML gives structure, CSS gives appearance, JavaScript gives behaviour.",
      "An element is an opening tag, content and a closing tag. Void elements such as <br> and <img> have no closing tag.",
      "Attributes add extra information inside the opening tag: name=\"value\".",
    ]),
    quickCheck("intro", [
      {
        id: "intro-q1",
        question: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "High-Tech Modern Language",
          "HyperText Machine Logic",
          "Home Tool Markup Language",
        ],
        answer: 0,
        explanation:
          "HyperText is text with links, markup is the labels around content, and language is the set of rules for writing them.",
      },
      {
        id: "intro-q2",
        question: "Which part of a web page is HTML responsible for?",
        options: [
          "The colours and fonts",
          "The structure and meaning of the content",
          "What happens when you click a button",
          "Storing user accounts",
        ],
        answer: 1,
        explanation:
          "HTML describes what each piece of content is. CSS handles colours and fonts, and JavaScript handles behaviour.",
      },
      {
        id: "intro-q3",
        question: "Which of these is a void element, with no closing tag?",
        options: ["<p>", "<h1>", "<br>", "<strong>"],
        answer: 2,
        explanation:
          "<br> starts a new line and has no content, so it has no closing tag. The others wrap content and need one.",
      },
    ]),
  ],
};

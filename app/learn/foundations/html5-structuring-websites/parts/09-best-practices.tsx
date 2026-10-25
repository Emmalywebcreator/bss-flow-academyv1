import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

export const bestPractices: LessonPart = {
  slug: "best-practices",
  title: "HTML Best Practices",
  minutes: 6,
  sections: [
    {
      id: "document-practices",
      title: "A solid document",
      body: (
        <>
          <p>
            Good HTML is valid, readable and accessible. Most of it comes down to habits you&apos;ve
            already learned. Start every page with:
          </p>
          <ul>
            <li>
              <strong>The full HTML5 structure:</strong> <Code>{"<!DOCTYPE html>"}</Code>,{" "}
              <Code>{"<html>"}</Code>, <Code>{"<head>"}</Code> and <Code>{"<body>"}</Code>.
            </li>
            <li>
              <strong>The page&apos;s language:</strong> <Code>{'<html lang="en">'}</Code>.
            </li>
            <li>
              <strong>A descriptive title</strong> that&apos;s different for every page, such as
              &quot;Contact – My First Website&quot;, not &quot;Untitled&quot; or &quot;Page
              1&quot;.
            </li>
            <li>
              <strong>The charset and viewport</strong> meta tags.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "code-practices",
      title: "Readable code",
      body: (
        <ul>
          <li>Indent consistently, by the same number of spaces at every level.</li>
          <li>Nest correctly: close the element you opened last first.</li>
          <li>Write tag and attribute names in lowercase, and put attribute values in quotes.</li>
          <li>
            Use headings in order, from one <Code>{"<h1>"}</Code> down, without skipping levels.
          </li>
          <li>
            Don&apos;t add elements you don&apos;t need. A paragraph is just{" "}
            <Code>{"<p>"}</Code>; it doesn&apos;t need extra wrappers around it.
          </li>
        </ul>
      ),
    },
    {
      id: "content-practices",
      title: "Accessible content",
      body: (
        <ul>
          <li>
            Give every informative image meaningful <Code>alt</Code> text, and decorative images{" "}
            <Code>alt=&quot;&quot;</Code>.
          </li>
          <li>Write link text that says where the link goes. Avoid &quot;click here&quot;.</li>
          <li>
            Use real lists for lists and real headings for headings, so screen readers can
            describe the page&apos;s structure.
          </li>
        </ul>
      ),
    },
    {
      id: "file-practices",
      title: "Consistent files and paths",
      body: (
        <ul>
          <li>
            Use lowercase filenames with hyphens instead of spaces: <Code>contact-me.html</Code>,{" "}
            <Code>team-photo.jpg</Code>.
          </li>
          <li>
            Keep images in an <Code>images</Code> folder, and use relative paths to reach them.
          </li>
          <li>Name the homepage index.html.</li>
        </ul>
      ),
    },
    {
      id: "semantic-elements",
      title: "Semantic elements",
      body: (
        <>
          <p>
            <strong>Semantic</strong> means &quot;to do with meaning&quot;. Semantic elements
            describe what a part of the page <em>is</em>. You&apos;ve already used some:{" "}
            <Code>{"<h1>"}</Code> means &quot;main heading&quot; and <Code>{"<nav>"}</Code> means
            &quot;navigation&quot;. HTML5 adds a few more for the big areas of a page:
          </p>
          <ul>
            <li>
              <Code>{"<header>"}</Code>: the introductory area at the top, often with the site name
              and navigation.
            </li>
            <li>
              <Code>{"<nav>"}</Code>: a group of main navigation links.
            </li>
            <li>
              <Code>{"<main>"}</Code>: the page&apos;s main content. Use one per page.
            </li>
            <li>
              <Code>{"<section>"}</Code>: a section of related content, usually with its own
              heading.
            </li>
            <li>
              <Code>{"<footer>"}</Code>: the closing area at the bottom, such as copyright or
              contact details.
            </li>
          </ul>
          <CodeBlock label="A page body with semantic elements">{`
<body>
    <header>
        <p>My First Website</p>
        <nav>
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        </nav>
    </header>

    <main>
        <h1>About me</h1>
        <section>
            <h2>My learning plan</h2>
            <p>HTML first, then CSS, then JavaScript.</p>
        </section>
    </main>

    <footer>
        <p>Made by Ada, 2026.</p>
    </footer>
</body>
`}</CodeBlock>
          <p>
            These elements don&apos;t change how the page looks, but they let screen readers jump
            straight to the main content or the navigation. You don&apos;t have to use them all
            straight away. Start with <Code>{"<nav>"}</Code> and <Code>{"<main>"}</Code>, and add
            the others as your pages grow.
          </p>
        </>
      ),
    },
    {
      id: "avoid-obsolete",
      title: "Avoid obsolete HTML",
      body: (
        <>
          <p>
            Old tutorials sometimes use elements that were removed from HTML because appearance
            belongs in CSS. Avoid:
          </p>
          <ul>
            <li>
              <Code>{"<center>"}</Code> and <Code>{"<font>"}</Code>, which changed alignment and
              fonts.
            </li>
            <li>
              Attributes such as <Code>bgcolor</Code> and <Code>align</Code>.
            </li>
            <li>
              Rows of <Code>{"<br>"}</Code> to create space.
            </li>
          </ul>
          <p>If something is about how the page looks, leave it for CSS.</p>
        </>
      ),
    },
    {
      id: "before-and-after",
      title: "Before and after",
      body: (
        <>
          <p>Here is a page with several problems:</p>
          <CodeBlock label="Before">{`
<html>
<body>
<font size="6">My Bakery</font><br><br>
<h3>Our cakes</h3>
<p>We bake fresh every day. <b>Order now!</p></b>
<img src="Images/Cake Photo.JPG">
<a href="menu.html">click here</a> for the menu
</body>
</html>
`}</CodeBlock>
          <p>And the same page, improved:</p>
          <CodeBlock label="After">{`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home – My Bakery</title>
</head>
<body>
    <main>
        <h1>My Bakery</h1>

        <h2>Our cakes</h2>
        <p>We bake fresh every day. <strong>Order now!</strong></p>
        <img src="images/cake-photo.jpg" alt="A chocolate cake on a wooden table" width="400">
        <p>See <a href="menu.html">our full menu</a>.</p>
    </main>
</body>
</html>
`}</CodeBlock>
          <p>What changed:</p>
          <ul>
            <li>Added the DOCTYPE, the language, and a head with charset, viewport and title.</li>
            <li>
              Replaced <Code>{"<font>"}</Code> and <Code>{"<br><br>"}</Code> with a real{" "}
              <Code>{"<h1>"}</Code>, and changed <Code>{"<h3>"}</Code> to <Code>{"<h2>"}</Code>{" "}
              so no level is skipped.
            </li>
            <li>
              Fixed the overlapping tags, using <Code>{"<strong>"}</Code> for important words.
            </li>
            <li>Renamed the image path to lowercase with a hyphen, and added alt text.</li>
            <li>Put the loose text in a paragraph, with descriptive link text.</li>
            <li>Indented everything consistently, and wrapped the content in <Code>{"<main>"}</Code>.</li>
          </ul>
        </>
      ),
    },
    {
      id: "validate",
      title: "Validate and check your pages",
      body: (
        <>
          <p>
            Browsers quietly fix many mistakes, so a page can look fine and still be broken
            underneath. Two habits catch problems early:
          </p>
          <ol>
            <li>
              <strong>Validate your HTML.</strong> The free{" "}
              <a href="https://validator.w3.org/#validate_by_input">W3C Markup Validation Service</a>{" "}
              checks your code against the HTML rules. Paste in your file and it lists any errors,
              with line numbers.
            </li>
            <li>
              <strong>Check every page in the browser.</strong> Click every link, check every
              image, and read each tab&apos;s title. If you can, try it on a phone too.
            </li>
          </ol>
          <KeyIdea title="Tip">
            Don&apos;t worry if the validator lists lots of errors at first. Fix the first one and
            check again: one mistake, such as a missing closing tag, often causes several messages.
          </KeyIdea>
        </>
      ),
    },
    recap("best-practices", [
      "Every page needs the full HTML5 structure, a language and a descriptive title.",
      "Indent consistently, nest correctly, and use headings in order.",
      "Write meaningful alt text and descriptive link text.",
      "Semantic elements such as <header>, <nav>, <main>, <section> and <footer> describe the areas of a page.",
      "Leave appearance to CSS, and validate your HTML.",
    ]),
    quickCheck("best-practices", [
      {
        id: "best-practices-q1",
        question: "Which element should wrap the main content of a page?",
        options: ["<header>", "<main>", "<footer>", "<center>"],
        answer: 1,
        explanation:
          "<main> marks the page's main content, so screen reader users can jump straight to it. <center> is obsolete.",
      },
      {
        id: "best-practices-q2",
        question: "Which filename follows best practice?",
        options: ["My Photo.JPG", "my photo.jpg", "my-photo.jpg", "MyPhoto.Jpg"],
        answer: 2,
        explanation: "Lowercase letters with hyphens instead of spaces avoid broken paths online.",
      },
      {
        id: "best-practices-q3",
        question: "What does the W3C validator do?",
        options: [
          "Makes your page load faster",
          "Checks your HTML against the rules and lists errors",
          "Adds CSS to your page",
          "Publishes your site online",
        ],
        answer: 1,
        explanation: "It reports mistakes in your HTML, with line numbers, so you can fix them.",
      },
    ]),
  ],
};

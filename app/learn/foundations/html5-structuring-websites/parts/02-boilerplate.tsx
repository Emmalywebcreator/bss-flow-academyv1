import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

export const BOILERPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Website</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to my first website.</p>
</body>
</html>
`;

export const boilerplate: LessonPart = {
  slug: "boilerplate-and-doctype",
  title: "The HTML Boilerplate and DOCTYPE",
  minutes: 5,
  sections: [
    {
      id: "what-is-a-boilerplate",
      title: "What is a boilerplate?",
      body: (
        <>
          <p>
            A <strong>boilerplate</strong> is the standard starting code that every HTML page
            shares. You write it once at the top and bottom of each file, then put your own content
            in the middle. It&apos;s like the address and greeting on a formal letter: the same
            shape every time.
          </p>
          <p>Here is a complete, valid HTML5 page. The rest of this part explains each line.</p>
          <CodeBlock label="index.html">{BOILERPLATE}</CodeBlock>
        </>
      ),
    },
    {
      id: "doctype",
      title: "<!DOCTYPE html>",
      body: (
        <>
          <p>
            The first line, <Code>{"<!DOCTYPE html>"}</Code>, tells the browser &quot;this is a
            modern HTML5 document&quot;. It isn&apos;t an element and has no closing tag.
          </p>
          <p>
            Without it, browsers switch to an old compatibility mode (called &quot;quirks
            mode&quot;) that copies the mistakes of 1990s browsers. Pages can then lay out
            differently from one browser to another. Always make it the very first line.
          </p>
        </>
      ),
    },
    {
      id: "html-element",
      title: "The <html> element",
      body: (
        <>
          <p>
            <Code>{"<html>"}</Code> wraps everything else on the page, so it&apos;s called the{" "}
            <strong>root element</strong>. Its closing tag, <Code>{"</html>"}</Code>, is the last
            line of the file.
          </p>
          <p>
            The <Code>lang=&quot;en&quot;</Code> attribute says the page is in English. Screen
            readers use it to pronounce words correctly, and browsers use it to offer translation.
            For a page in French you would write <Code>lang=&quot;fr&quot;</Code>.
          </p>
        </>
      ),
    },
    {
      id: "head-and-body",
      title: "The <head> and <body> elements",
      body: (
        <>
          <p>
            Inside <Code>{"<html>"}</Code> there are exactly two elements, one after the other:
          </p>
          <ul>
            <li>
              <Code>{"<head>"}</Code> holds information <em>about</em> the page: its title, its
              character encoding, and settings for the browser. Visitors don&apos;t see it on the
              page itself.
            </li>
            <li>
              <Code>{"<body>"}</Code> holds the content visitors <em>see</em>: headings,
              paragraphs, images, links and everything else you&apos;ll write in this lesson.
            </li>
          </ul>
          <KeyIdea>
            If you want visitors to see it, it goes in the body. If it&apos;s information for the
            browser or for search engines, it goes in the head.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "head-contents",
      title: "Inside the head: charset, viewport and title",
      body: (
        <>
          <h3>Character encoding</h3>
          <CodeBlock label="In the head">{`
<meta charset="UTF-8">
`}</CodeBlock>
          <p>
            Computers store text as numbers. The <strong>character encoding</strong> tells the
            browser which numbers mean which letters. UTF-8 covers almost every character in every
            language, including accented letters, the naira sign (&#8358;) and emoji. Without it,
            some characters can show up as strange symbols. Put it first inside the head.
          </p>
          <h3>The viewport</h3>
          <CodeBlock label="In the head">{`
<meta name="viewport" content="width=device-width, initial-scale=1.0">
`}</CodeBlock>
          <p>
            Phones have narrow screens. Without this line, a phone browser pretends to be a wide
            desktop screen and shrinks the whole page to fit, so the text becomes tiny.{" "}
            <Code>width=device-width</Code> tells it to use the phone&apos;s real width, and{" "}
            <Code>initial-scale=1.0</Code> means &quot;don&apos;t zoom in or out when the page
            opens&quot;.
          </p>
          <p>
            <Code>{"<meta>"}</Code> is a void element: it has attributes but no content, so there
            is no closing tag.
          </p>
          <h3>The title</h3>
          <CodeBlock label="In the head">{`
<title>My First Website</title>
`}</CodeBlock>
          <p>
            The title appears on the browser tab, in bookmarks, and as the clickable headline in
            search results. Every page needs one, and each page&apos;s title should describe that
            page, such as &quot;About me – My First Website&quot;.
          </p>
        </>
      ),
    },
    {
      id: "boilerplate-shortcut",
      title: "A shortcut in VS Code",
      body: (
        <>
          <p>
            You don&apos;t need to type the boilerplate every time. In VS Code, create a new file
            saved as <Code>.html</Code>, type an exclamation mark <Code>!</Code>, then press Tab or
            Enter. VS Code writes the whole boilerplate for you. Change the title and start adding
            content to the body.
          </p>
          <p>
            Do type it out by hand a few times first, though. Knowing what each line does helps you
            spot problems later.
          </p>
        </>
      ),
    },
    recap("boilerplate", [
      "<!DOCTYPE html> goes on the first line and tells the browser to use modern HTML5 rules.",
      "<html lang=\"en\"> wraps the whole page and states its language.",
      "The head holds information about the page; the body holds what visitors see.",
      "Every page needs a UTF-8 charset, the viewport meta tag and a descriptive title.",
    ]),
    quickCheck("boilerplate", [
      {
        id: "boilerplate-q1",
        question: "Where should <!DOCTYPE html> go?",
        options: [
          "Inside the body",
          "On the very first line of the file",
          "Inside the head, after the title",
          "On the last line of the file",
        ],
        answer: 1,
        explanation:
          "The DOCTYPE must come first, before <html>, so the browser knows to use modern HTML5 rules from the start.",
      },
      {
        id: "boilerplate-q2",
        question: "You want a paragraph of text to appear on the page. Where does it go?",
        options: ["In the head", "In the body", "Before <html>", "Inside the <title>"],
        answer: 1,
        explanation:
          "Everything visitors see belongs in the body. The head holds information about the page, such as its title.",
      },
      {
        id: "boilerplate-q3",
        question: "What does the viewport meta tag do?",
        options: [
          "Sets the page title shown in the tab",
          "Lets the page display at the correct width on phones",
          "Makes text bold",
          "Tells the browser the page is in English",
        ],
        answer: 1,
        explanation:
          "Without it, phone browsers shrink the page as if it were on a wide screen. The title is set by <title> and the language by lang.",
      },
    ]),
  ],
};

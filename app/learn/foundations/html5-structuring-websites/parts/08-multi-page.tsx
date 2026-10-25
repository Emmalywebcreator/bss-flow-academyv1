import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";
import { SITE_FILES, SITE_TREE } from "./site-example";

export const multiPage: LessonPart = {
  slug: "multi-page-website",
  title: "Building a Multi-Page Website",
  minutes: 8,
  sections: [
    {
      id: "project-structure",
      title: "The project structure",
      body: (
        <>
          <p>
            A website is a folder of files that link to each other. In this part you&apos;ll build
            one with three pages. Here is its structure:
          </p>
          <CodeBlock label="Folder structure">{SITE_TREE}</CodeBlock>
          <ul>
            <li>
              <Code>my-website/</Code> is the project folder. Everything for the site lives
              inside it.
            </li>
            <li>
              <Code>index.html</Code> is the homepage.
            </li>
            <li>
              <Code>about.html</Code> tells visitors who you are.
            </li>
            <li>
              <Code>contact.html</Code> tells them how to reach you.
            </li>
            <li>
              <Code>images/</Code> holds the site&apos;s pictures, here{" "}
              <Code>computer.jpg</Code>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "why-index",
      title: "Why the homepage is called index.html",
      body: (
        <>
          <p>
            When someone visits a website address without naming a page, such as{" "}
            <Code>https://example.com/</Code>, the web server looks for a file called{" "}
            <Code>index.html</Code> in that folder and sends it. That&apos;s why the homepage is
            almost always <Code>index.html</Code>.
          </p>
          <p>
            Your computer doesn&apos;t do this when you open files directly, so for now you&apos;ll
            open <Code>index.html</Code> yourself. Once the site is online, the name means visitors
            land on the right page automatically.
          </p>
        </>
      ),
    },
    {
      id: "linking-pages",
      title: "Linking the pages together",
      body: (
        <>
          <p>
            Every page gets the same set of links at the top, so visitors can move between pages
            from anywhere:
          </p>
          <CodeBlock label="The navigation, on every page">{`
<nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
</nav>
`}</CodeBlock>
          <p>
            <Code>{"<nav>"}</Code> marks a group of navigation links. It doesn&apos;t change how
            the links look, but it tells browsers and screen readers what they are. You&apos;ll
            meet more elements like it in Part 9.
          </p>
          <p>
            Because all three pages are in the same folder, each link is just the filename. These
            are <strong>relative paths</strong>, so the links keep working wherever the folder
            goes.
          </p>
        </>
      ),
    },
    {
      id: "page-examples",
      title: "The three pages",
      body: (
        <>
          <p>
            Here are the complete files. Each one starts with the same boilerplate and the same
            navigation, then has its own content.
          </p>
          <h3>index.html</h3>
          <CodeBlock label="my-website/index.html">{SITE_FILES["index.html"]}</CodeBlock>
          <p>
            The image path is <Code>images/computer.jpg</Code>: from <Code>index.html</Code>, go
            into the <Code>images</Code> folder and find the file.
          </p>
          <h3>about.html</h3>
          <CodeBlock label="my-website/about.html">{SITE_FILES["about.html"]}</CodeBlock>
          <h3>contact.html</h3>
          <CodeBlock label="my-website/contact.html">{SITE_FILES["contact.html"]}</CodeBlock>
          <KeyIdea>
            Each page has its own <Code>{"<title>"}</Code>, so visitors can tell the tabs apart.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "testing-the-site",
      title: "Testing your website in a browser",
      body: (
        <>
          <ol>
            <li>
              Open the <Code>my-website</Code> folder and double-click <Code>index.html</Code>.
              The address bar shows a path starting with <Code>file://</Code>, which means
              you&apos;re viewing a file on your own computer.
            </li>
            <li>Check that the image appears.</li>
            <li>Click each link in the navigation, on every page.</li>
            <li>Check each page&apos;s tab shows its own title.</li>
            <li>
              After you change a file, save it, then reload the page in the browser (F5, or
              Cmd+R on a Mac) to see the change.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "path-mistakes",
      title: "Common filename and path mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Capital letters that don&apos;t match.</strong> A link to{" "}
              <Code>about.html</Code> won&apos;t find <Code>About.html</Code> on most web servers.
              Use lowercase names everywhere.
            </li>
            <li>
              <strong>Hidden extensions.</strong> Windows can hide file extensions, so a file that
              looks like <Code>about.html</Code> may really be <Code>about.html.txt</Code>. Turn
              on &quot;File name extensions&quot; in File Explorer&apos;s View menu to check.
            </li>
            <li>
              <strong>Spaces in names.</strong> Use <Code>contact-me.html</Code>, not{" "}
              <Code>contact me.html</Code>.
            </li>
            <li>
              <strong>A file in the wrong folder.</strong> If <Code>about.html</Code> ends up inside{" "}
              <Code>images/</Code>, the link <Code>about.html</Code> can&apos;t find it.
            </li>
            <li>
              <strong>A leading slash.</strong> <Code>/about.html</Code> means &quot;start from
              the very top of the drive or website&quot;, which usually breaks when you open the
              files on your computer. Use <Code>about.html</Code>.
            </li>
            <li>
              <strong>Different folder names.</strong> <Code>Images/</Code> and{" "}
              <Code>images/</Code> aren&apos;t the same folder online.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "multi-page-task",
      title: "Exercise: build and connect the three pages",
      body: (
        <>
          <ol>
            <li>
              Create a folder called <Code>my-website</Code>, and inside it a folder called{" "}
              <Code>images</Code>.
            </li>
            <li>
              Put a photo in <Code>images</Code> and name it <Code>computer.jpg</Code> (or use your
              own name and update the <Code>src</Code>).
            </li>
            <li>
              Create <Code>index.html</Code>, <Code>about.html</Code> and{" "}
              <Code>contact.html</Code> in <Code>my-website</Code>. Copy the examples above, then
              change the text to be about you.
            </li>
            <li>Open index.html and use the navigation to visit every page.</li>
            <li>
              Fix anything that doesn&apos;t work using the list of common mistakes above.
            </li>
          </ol>
          <p>Keep this folder. You&apos;ll build on it in the final project.</p>
        </>
      ),
    },
    recap("multi-page", [
      "A website is a folder of HTML files, with images in their own folder.",
      "index.html is the homepage, because web servers send it when no page is named.",
      "Pages in the same folder link to each other by filename: <a href=\"about.html\">.",
      "Keep names lowercase with no spaces, and test every link and image in the browser.",
    ]),
    quickCheck("multi-page", [
      {
        id: "multi-page-q1",
        question: "Why is the homepage usually named index.html?",
        options: [
          "It loads faster than other names",
          "Web servers send index.html when a visitor doesn't name a page",
          "Browsers can only open files called index.html",
          "It's required for images to work",
        ],
        answer: 1,
        explanation:
          "Visiting https://example.com/ asks for the folder, and the server responds with its index.html.",
      },
      {
        id: "multi-page-q2",
        question: "contact.html and about.html are in the same folder. What href links from contact.html to about.html?",
        options: ["/about.html", "about.html", "../about.html", "https://about.html"],
        answer: 1,
        explanation:
          "Files in the same folder link to each other by filename. A leading slash or ../ would look somewhere else.",
      },
      {
        id: "multi-page-q3",
        question: "A link works on your computer but breaks once the site is online. What's the most likely cause?",
        options: [
          "The page has too many links",
          "The capital letters in the filename don't match the link",
          "The page has no image",
          "The link is inside <nav>",
        ],
        answer: 1,
        explanation:
          "Many computers ignore capital letters in filenames, but most web servers don't. Keeping everything lowercase avoids this.",
      },
    ]),
  ],
};

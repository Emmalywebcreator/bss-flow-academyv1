import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

export const links: LessonPart = {
  slug: "hyperlinks",
  title: "Creating Hyperlinks with Anchor Tags",
  minutes: 5,
  sections: [
    {
      id: "anchor-element",
      title: "The <a> element",
      body: (
        <>
          <p>
            Links are what make the web a web. You make one with the <Code>{"<a>"}</Code> element,
            short for <strong>anchor</strong>:
          </p>
          <CodeBlock label="A link">{`
<a href="https://example.com">Visit Example</a>
`}</CodeBlock>
          <ul>
            <li>
              <Code>href</Code> (hypertext reference) is where the link goes.
            </li>
            <li>
              The content between the tags, <Code>Visit Example</Code>, is the{" "}
              <strong>link text</strong> that visitors click.
            </li>
          </ul>
          <p>
            Links can sit inside paragraphs, list items and headings, just like{" "}
            <Code>{"<strong>"}</Code>.
          </p>
        </>
      ),
    },
    {
      id: "external-links",
      title: "Linking to other websites",
      body: (
        <>
          <p>
            To link to another website, use its full address, including <Code>https://</Code>:
          </p>
          <CodeBlock label="An external link">{`
<p>Check your HTML with the <a href="https://validator.w3.org/">W3C validator</a>.</p>
`}</CodeBlock>
          <KeyIdea title="Common mistake">
            <Code>{'<a href="www.example.com">'}</Code> doesn&apos;t work. Without{" "}
            <Code>https://</Code>, the browser thinks <Code>www.example.com</Code> is a file in your
            own folder, and the link breaks.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "internal-links",
      title: "Linking to pages on your own site",
      body: (
        <>
          <p>
            To link to another page in your own website, use a <strong>relative path</strong>, the
            same idea as image paths in Part 6. If <Code>about.html</Code> is in the same folder as
            the current page:
          </p>
          <CodeBlock label="An internal link">{`
<a href="about.html">About me</a>
`}</CodeBlock>
          <p>
            If the page is inside a folder, include the folder:{" "}
            <Code>{'<a href="blog/first-post.html">'}</Code>. Part 8 uses internal links to join
            three pages into one website.
          </p>
        </>
      ),
    },
    {
      id: "section-links",
      title: "Linking to a section of the same page",
      body: (
        <>
          <p>
            On a long page, you can link straight to one section. It takes two steps:
          </p>
          <ol>
            <li>
              Give the section an <Code>id</Code>: a unique name, with no spaces.
            </li>
            <li>
              Link to it with <Code>#</Code> followed by that id.
            </li>
          </ol>
          <CodeBlock label="A same-page link">{`
<a href="#opening-hours">See our opening hours</a>

<!-- further down the page -->
<h2 id="opening-hours">Opening hours</h2>
<p>Monday to Friday, 9am to 5pm.</p>
`}</CodeBlock>
          <p>
            Clicking the link scrolls to the heading. The line starting with{" "}
            <Code>{"<!--"}</Code> is an HTML <strong>comment</strong>: a note for people reading
            the code. Browsers don&apos;t show it.
          </p>
          <p>
            You can combine the two kinds of link: <Code>about.html#skills</Code> opens{" "}
            <Code>about.html</Code> and jumps to the element with <Code>id=&quot;skills&quot;</Code>.
          </p>
        </>
      ),
    },
    {
      id: "new-tabs",
      title: "Opening links in a new tab",
      body: (
        <>
          <p>
            Adding <Code>target=&quot;_blank&quot;</Code> opens the link in a new tab:
          </p>
          <CodeBlock label="A link that opens a new tab">{`
<a href="https://example.com/timetable.pdf" target="_blank" rel="noopener noreferrer">
    Download the timetable (opens in a new tab)
</a>
`}</CodeBlock>
          <p>
            When you use <Code>target=&quot;_blank&quot;</Code>, also add{" "}
            <Code>rel=&quot;noopener noreferrer&quot;</Code>:
          </p>
          <ul>
            <li>
              <Code>noopener</Code> stops the new page from being able to control or redirect your
              page.
            </li>
            <li>
              <Code>noreferrer</Code> stops your page&apos;s address being passed to the site
              you&apos;re linking to.
            </li>
          </ul>
          <p>
            Modern browsers already apply <Code>noopener</Code> to new tabs, but writing it keeps
            older browsers safe and makes your intention clear.
          </p>
          <p>
            Use new tabs sparingly. Most visitors expect a link to open in the same tab, and they
            can choose a new tab themselves. A good reason is a document someone will want beside
            the page they&apos;re on. When you do it, say so in the link text, as above.
          </p>
        </>
      ),
    },
    {
      id: "link-text",
      title: "Descriptive link text",
      body: (
        <>
          <p>
            Screen reader users often bring up a list of every link on a page. A list of &quot;click
            here, click here, read more&quot; tells them nothing. The link text should make sense on
            its own:
          </p>
          <ul>
            <li>
              Weak: <Code>{'To see our prices, <a href="prices.html">click here</a>.'}</Code>
            </li>
            <li>
              Better: <Code>{'See <a href="prices.html">our prices</a>.'}</Code>
            </li>
          </ul>
          <p>
            Descriptive text also helps sighted visitors scan the page, and helps search engines
            understand what the linked page is about.
          </p>
        </>
      ),
    },
    {
      id: "email-links",
      title: "Email links",
      body: (
        <>
          <p>
            A link whose <Code>href</Code> starts with <Code>mailto:</Code> opens the
            visitor&apos;s email app with a new message to that address:
          </p>
          <CodeBlock label="An email link">{`
<a href="mailto:hello@example.com">hello@example.com</a>
`}</CodeBlock>
          <p>You&apos;ll use one on the Contact page in Part 8.</p>
        </>
      ),
    },
    {
      id: "link-mistakes",
      title: "Common hyperlink mistakes",
      body: (
        <ul>
          <li>
            Leaving out <Code>https://</Code> on an external link.
          </li>
          <li>
            A typo in a filename: <Code>abuot.html</Code>, or <Code>About.html</Code> when the file
            is <Code>about.html</Code>.
          </li>
          <li>
            Forgetting the <Code>#</Code> in a same-page link, or using an id that doesn&apos;t
            match exactly.
          </li>
          <li>Using vague link text such as &quot;click here&quot;.</li>
          <li>
            Writing <Code>target=&quot;_blank&quot;</Code> without{" "}
            <Code>rel=&quot;noopener noreferrer&quot;</Code>.
          </li>
          <li>Putting a link inside another link. Links can&apos;t be nested.</li>
        </ul>
      ),
    },
    recap("links", [
      "<a href=\"...\">text</a> makes a link. href is where it goes; the content is what visitors click.",
      "External links need the full address with https://. Internal links use relative paths such as about.html.",
      "#id links jump to the element with that id on the page.",
      "Use target=\"_blank\" sparingly, always with rel=\"noopener noreferrer\", and write link text that makes sense on its own.",
    ]),
    quickCheck("links", [
      {
        id: "links-q1",
        question: "Which link to an external website is written correctly?",
        options: [
          "<a href=\"www.example.com\">Example</a>",
          "<a src=\"https://example.com\">Example</a>",
          "<a href=\"https://example.com\">Example</a>",
          "<a>https://example.com</a>",
        ],
        answer: 2,
        explanation:
          "A link needs an href with the full address, including https://. src is for images, not links.",
      },
      {
        id: "links-q2",
        question: "A heading has id=\"faq\". What href links to it from the same page?",
        options: ["faq", "#faq", "faq.html", "id=faq"],
        answer: 1,
        explanation: "Same-page links use # followed by the element's id.",
      },
      {
        id: "links-q3",
        question: "Which link text is most helpful?",
        options: ["Click here", "Read more", "Download the 2026 timetable", "Link"],
        answer: 2,
        explanation:
          "It says exactly where the link goes, so it makes sense even when read on its own in a list of links.",
      },
    ]),
  ],
};

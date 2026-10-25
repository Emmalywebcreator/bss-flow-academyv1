import type { LessonPart } from "@/app/_lessons/lesson";
import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { quickCheck, recap } from "./check";

const answerClass =
  "rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950";
const summaryClass = "cursor-pointer font-medium text-zinc-950 dark:text-zinc-50";

export const images: LessonPart = {
  slug: "inserting-images",
  title: "Inserting Images in HTML",
  minutes: 6,
  sections: [
    {
      id: "img-element",
      title: "The <img> element",
      body: (
        <>
          <p>
            <Code>{"<img>"}</Code> puts an image on the page. Here is a complete example:
          </p>
          <CodeBlock label="An image">{`
<img
    src="images/computer.jpg"
    alt="A laptop computer on a desk"
    width="400"
>
`}</CodeBlock>
          <p>
            The attributes are split over several lines so each one is easy to read. Writing them
            on one line works the same way.
          </p>
          <p>
            <Code>{"<img>"}</Code> is a <strong>void element</strong>: the image itself is the
            content, so there&apos;s nothing to wrap and no <Code>{"</img>"}</Code> closing tag.
          </p>
          <p>Each attribute has a job:</p>
          <ul>
            <li>
              <Code>src</Code> (source) is where the image file is. It&apos;s required.
            </li>
            <li>
              <Code>alt</Code> (alternative text) describes the image in words. It&apos;s required
              too, for the reasons below.
            </li>
            <li>
              <Code>width</Code> sets how wide the image is shown, in pixels. You write just the
              number, without &quot;px&quot;. There is a matching <Code>height</Code> attribute.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "image-paths",
      title: "Relative and absolute paths",
      body: (
        <>
          <p>
            The <Code>src</Code> value is a <strong>path</strong>: directions to the file. There
            are two kinds.
          </p>
          <h3>Relative paths</h3>
          <p>
            A <strong>relative path</strong> starts from the folder your HTML file is in. Imagine
            this project:
          </p>
          <CodeBlock label="Folder structure">{`
my-website/
├── index.html
└── images/
    └── computer.jpg
`}</CodeBlock>
          <p>
            From <Code>index.html</Code>, the path <Code>images/computer.jpg</Code> means
            &quot;go into the <Code>images</Code> folder and find <Code>computer.jpg</Code>&quot;.
            Two more patterns you&apos;ll see:
          </p>
          <ul>
            <li>
              <Code>computer.jpg</Code>: the image is in the same folder as the HTML file.
            </li>
            <li>
              <Code>../computer.jpg</Code>: <Code>..</Code> means &quot;go up one folder
              first&quot;.
            </li>
          </ul>
          <h3>Absolute paths</h3>
          <p>
            An <strong>absolute path</strong> is a full web address, starting with{" "}
            <Code>https://</Code>, such as{" "}
            <Code>https://example.com/images/photo.jpg</Code>. Use it for images hosted on another
            website.
          </p>
          <KeyIdea>
            Use relative paths for your own images. They keep working when you move the whole
            folder to another computer or put it online.
          </KeyIdea>
        </>
      ),
    },
    {
      id: "alt-text",
      title: "Why alternative text matters",
      body: (
        <>
          <p>The alt text is used whenever the image itself can&apos;t be seen:</p>
          <ul>
            <li>
              <strong>Screen readers</strong> read it aloud to blind and visually impaired
              visitors.
            </li>
            <li>
              If the image <strong>fails to load</strong>, for example on a slow connection, the
              browser shows the alt text in its place.
            </li>
            <li>
              <strong>Search engines</strong> use it to understand what the image shows.
            </li>
          </ul>
          <p>Good alt text describes what the image shows, or what it&apos;s for, in a short phrase:</p>
          <ul>
            <li>
              Weak: <Code>alt=&quot;image&quot;</Code> or <Code>alt=&quot;IMG_2041.jpg&quot;</Code>
            </li>
            <li>
              Better: <Code>alt=&quot;A laptop computer on a desk&quot;</Code>
            </li>
          </ul>
          <p>
            Don&apos;t start with &quot;Image of&quot;; screen readers already announce that
            it&apos;s an image. If an image is purely decorative and adds no information, give it
            an empty alt, <Code>alt=&quot;&quot;</Code>, so screen readers skip it. Never leave the
            attribute out entirely.
          </p>
        </>
      ),
    },
    {
      id: "image-dimensions",
      title: "Image dimensions",
      body: (
        <>
          <p>
            Setting <Code>width</Code> and <Code>height</Code> tells the browser how much space to
            save for the image before it finishes loading. Without them, text can jump down the
            page when the image appears.
          </p>
          <CodeBlock label="Width and height">{`
<img src="images/computer.jpg" alt="A laptop computer on a desk" width="400" height="300">
`}</CodeBlock>
          <ul>
            <li>
              Keep the image&apos;s proportions. If the original is 800 by 600 pixels, show it at
              400 by 300, not 400 by 400, or it will look stretched.
            </li>
            <li>
              Don&apos;t use a huge photo and shrink it with <Code>width</Code>. Visitors still
              download the whole large file. Resize the image file itself to roughly the size you
              need.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "image-errors",
      title: "When an image doesn't load",
      body: (
        <>
          <p>
            If you see a broken-image icon or just the alt text, the browser couldn&apos;t find the
            file. Check these, in order:
          </p>
          <ol>
            <li>
              <strong>Spelling.</strong> <Code>computr.jpg</Code> is not{" "}
              <Code>computer.jpg</Code>.
            </li>
            <li>
              <strong>Capital letters.</strong> Many web servers treat <Code>Computer.JPG</Code>{" "}
              and <Code>computer.jpg</Code> as different files. An image can work on your computer
              and break once the site is online. Use lowercase names.
            </li>
            <li>
              <strong>The file extension.</strong> Is it really <Code>.jpg</Code>, or{" "}
              <Code>.jpeg</Code> or <Code>.png</Code>?
            </li>
            <li>
              <strong>The folder.</strong> Is the image actually inside the folder your path
              names?
            </li>
            <li>
              <strong>Spaces in names.</strong> <Code>my photo.jpg</Code> causes trouble. Use{" "}
              <Code>my-photo.jpg</Code> instead.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "image-best-practices",
      title: "Best practices for images",
      body: (
        <ul>
          <li>Always include meaningful alt text, or alt=&quot;&quot; for decoration.</li>
          <li>Keep images in an images folder, with lowercase names and hyphens instead of spaces.</li>
          <li>Set width and height, and keep the proportions.</li>
          <li>
            Use JPEG for photos, PNG for graphics that need a transparent background, and SVG for
            logos and icons.
          </li>
          <li>Only use images you have the right to use: your own, or ones licensed for reuse.</li>
        </ul>
      ),
    },
    {
      id: "images-task",
      title: "Exercise: add an image",
      body: (
        <>
          <ol>
            <li>
              Make a folder called <Code>images</Code> next to an HTML file that has the
              boilerplate.
            </li>
            <li>
              Put a photo in it. Rename it with lowercase letters and no spaces, such as{" "}
              <Code>my-desk.jpg</Code>.
            </li>
            <li>
              Add an <Code>{"<img>"}</Code> to the body with <Code>src</Code>, meaningful{" "}
              <Code>alt</Code> text, and a <Code>width</Code>.
            </li>
            <li>Open the page in your browser and check the image appears.</li>
            <li>
              Now misspell the filename in <Code>src</Code> on purpose and reload. You should see
              your alt text instead. Fix it again.
            </li>
          </ol>
          <details className={answerClass}>
            <summary className={summaryClass}>Show a possible answer</summary>
            <div className="mt-4">
              <CodeBlock label="In the body">{`
<h1>My workspace</h1>
<img src="images/my-desk.jpg" alt="My desk with a laptop and a notebook" width="400">
`}</CodeBlock>
            </div>
          </details>
        </>
      ),
    },
    recap("images", [
      "<img> is a void element with no closing tag. src says where the file is; alt describes it.",
      "Relative paths such as images/computer.jpg start from the HTML file's folder; absolute paths are full web addresses.",
      "Alt text helps screen reader users and appears when an image fails to load.",
      "Most broken images are a spelling, capital-letter or folder mistake in the path.",
    ]),
    quickCheck("images", [
      {
        id: "images-q1",
        question: "Which attribute tells the browser where to find the image file?",
        options: ["alt", "src", "href", "width"],
        answer: 1,
        explanation: "src (source) holds the path to the image. alt describes it, and width sets its size.",
      },
      {
        id: "images-q2",
        question: "Your page is index.html, and the photo is cat.jpg inside a folder called images next to it. What is the src?",
        options: ["cat.jpg", "images/cat.jpg", "../cat.jpg", "images\\cat"],
        answer: 1,
        explanation:
          "From index.html, go into the images folder and find cat.jpg: images/cat.jpg. Paths on the web use forward slashes and include the file extension.",
      },
      {
        id: "images-q3",
        question: "Which alt text is best for a photo of a mango tree in a garden?",
        options: [
          "alt=\"image\"",
          "alt=\"IMG_0042.jpg\"",
          "alt=\"A mango tree in a garden\"",
          "No alt attribute",
        ],
        answer: 2,
        explanation:
          "Good alt text describes what the image shows in a short phrase. Filenames and the word 'image' tell the visitor nothing.",
      },
    ]),
  ],
};

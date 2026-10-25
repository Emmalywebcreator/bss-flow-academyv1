import { Code, CodeBlock, KeyIdea } from "@/app/_lessons/prose";
import { InternetFlowDiagram } from "@/app/_lessons/internet-flow-diagram";
import { Quiz } from "@/app/_lessons/quiz";
import { QUIZ_QUESTIONS } from "./quiz-questions";
import type { LessonPart, LessonSection } from "@/app/_lessons/lesson";

// Example addresses come from ranges reserved for documentation
// (example.com, 203.0.113.0/24), so they never point at a real site.

export const SECTIONS: readonly LessonSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <>
        <p>
          Every time you open a website, a lot happens in less than a second. Your browser finds
          out where the site lives, connects to a computer on the other side of the world, asks it
          for a page, and turns what comes back into the text, images and buttons you see.
        </p>
        <p>
          This lesson walks through that journey one step at a time. You don&apos;t need any
          technical background. By the end you&apos;ll know the main parts of the web, how they
          fit together, and the vocabulary developers use every day — the foundation for
          everything else you&apos;ll build.
        </p>
      </>
    ),
  },
  {
    id: "learning-objectives",
    title: "Learning objectives",
    body: (
      <>
        <p>By the end of this lesson, you will be able to:</p>
        <ul>
          <li>Explain what the internet is, and how it differs from the World Wide Web.</li>
          <li>
            Describe the role of a web browser, domain name, IP address, DNS, web server and
            database.
          </li>
          <li>Outline what happens, step by step, when you visit a website.</li>
          <li>Explain what HTTP and HTTPS are, and read common HTTP status codes.</li>
          <li>Describe how HTML, CSS and JavaScript work together on a page.</li>
          <li>Tell the difference between static and dynamic websites.</li>
          <li>Explain what Git and GitHub are, and why developers use them.</li>
          <li>Take a structured first step when a website doesn&apos;t work.</li>
        </ul>
      </>
    ),
  },
  {
    id: "what-is-the-internet",
    title: "What is the internet?",
    body: (
      <>
        <p>
          The <strong>internet</strong> is a global network of networks. Billions of devices —
          phones, laptops, servers in data centres — are linked together by cables, fibre, radio
          and satellite connections, so that any one of them can send data to any other.
        </p>
        <p>
          Data travels in small pieces called <strong>packets</strong>. A large file is split into
          many packets, each one is passed from network to network by devices called{" "}
          <strong>routers</strong>, and the receiving device puts them back together.
        </p>
        <p>
          For this to work, every device needs to agree on how to talk. Those shared rules are
          called <strong>protocols</strong>. The most basic is the <strong>Internet Protocol (IP)</strong>,
          which gives each device an address and gets packets to it. Other protocols build on top
          of it — including HTTP, which the web uses.
        </p>
        <KeyIdea>
          The internet is the infrastructure: the connections and the rules for moving data. It
          doesn&apos;t care what the data is — a web page, an email, a video call or a game.
        </KeyIdea>
      </>
    ),
  },
  {
    id: "internet-vs-web",
    title: "Internet vs World Wide Web",
    body: (
      <>
        <p>
          People often use the two words as if they meant the same thing, but they don&apos;t.
        </p>
        <ul>
          <li>
            The <strong>internet</strong> is the underlying network that connects computers.
          </li>
          <li>
            The <strong>World Wide Web</strong> (&quot;the web&quot;) is one service that runs on
            the internet: a huge collection of pages and files, linked to each other and opened in
            a web browser using HTTP or HTTPS.
          </li>
        </ul>
        <p>
          Email, online games, video calls and file transfers also use the internet, but
          they aren&apos;t the web. A good comparison is roads and delivery vans: the road network
          is the internet, and the web is one delivery service that uses those roads.
        </p>
        <KeyIdea>
          The internet is the network; the web is a service that runs on it.
        </KeyIdea>
      </>
    ),
  },
  {
    id: "components-of-the-web",
    title: "Important components of the web",
    body: (
      <>
        <p>
          Six parts come up again and again when you talk about websites. Here is what each one
          does.
        </p>

        <h3 id="web-browser">Web browser</h3>
        <p>
          A <strong>web browser</strong> — Chrome, Firefox, Safari, Edge — is the program you use
          to visit websites. It sends requests for pages, receives the responses, and turns HTML,
          CSS and JavaScript into the page you can read and click. In web terms, the browser is
          the <strong>client</strong>: the side that asks.
        </p>

        <h3 id="domain-name">Domain name</h3>
        <p>
          A <strong>domain name</strong> is the human-friendly name of a website, such as{" "}
          <Code>example.com</Code>. It&apos;s part of a <strong>URL</strong> (web address):
        </p>
        <CodeBlock label="Parts of a URL">{`
https://www.example.com/courses/html?level=beginner

scheme    https
hostname  www.example.com
path      /courses/html
query     ?level=beginner
`}</CodeBlock>
        <p>
          The <strong>scheme</strong> (<Code>https</Code>) says how to talk to the server, the{" "}
          <strong>hostname</strong> says which server, and the <strong>path</strong> and{" "}
          <strong>query</strong> say what you want from it. Domain names are rented from
          companies called registrars, usually by the year.
        </p>

        <h3 id="ip-address">IP address</h3>
        <p>
          Computers don&apos;t find each other by name; they use numbers. An{" "}
          <strong>IP address</strong> identifies a device on a network, a bit like a postal
          address. There are two versions in use:
        </p>
        <ul>
          <li>
            <strong>IPv4</strong>, four numbers from 0 to 255: <Code>203.0.113.10</Code>
          </li>
          <li>
            <strong>IPv6</strong>, longer and written in hexadecimal:{" "}
            <Code>2001:db8::10</Code>
          </li>
        </ul>
        <p>
          A popular website may have several IP addresses, and its addresses can change over
          time — one reason we use names instead.
        </p>

        <h3 id="dns">DNS</h3>
        <p>
          The <strong>Domain Name System (DNS)</strong> connects the two: it helps resolve a
          hostname like <Code>www.example.com</Code> to IP address information. It&apos;s often
          described as the internet&apos;s phone book.
        </p>
        <p>
          When your browser needs an address, it first checks whether it, or your operating
          system, already has a recent answer saved — a <strong>cache</strong>. If not, it asks a{" "}
          <strong>DNS resolver</strong> (usually run by your internet provider, or a public one
          such as 1.1.1.1). If the resolver doesn&apos;t have the answer cached either, it works
          it out by asking the DNS servers responsible for that domain, then passes the address
          back.
        </p>
        <p>
          Each answer comes with a <strong>time to live (TTL)</strong> that says how long it may be
          cached. This is why a change to a domain&apos;s DNS settings can take a while to reach
          everyone.
        </p>
        <KeyIdea>
          DNS only answers &quot;where is this server?&quot; It doesn&apos;t download any of the
          web page — that comes from the web server.
        </KeyIdea>

        <h3 id="web-server">Web server</h3>
        <p>
          A <strong>web server</strong> is software, running on a computer that&apos;s always
          connected, that listens for <strong>HTTP requests</strong> and sends back{" "}
          <strong>HTTP responses</strong>. The word also often means the computer itself.
        </p>
        <p>
          <strong>HTTP</strong> (Hypertext Transfer Protocol) is the language browsers and
          servers use. A request names a <strong>method</strong> — such as <Code>GET</Code> to
          fetch something or <Code>POST</Code> to send data — and a path:
        </p>
        <CodeBlock label="An HTTP request (simplified)">{`
GET /courses HTTP/1.1
Host: www.example.com
`}</CodeBlock>
        <p>The server replies with a status code, headers and, usually, a body:</p>
        <CodeBlock label="An HTTP response (simplified)">{`
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html> … </html>
`}</CodeBlock>
        <p>
          <strong>HTTPS</strong> is HTTP sent over an encrypted connection protected by{" "}
          <strong>TLS</strong> (Transport Layer Security). TLS does two jobs: it encrypts the data
          so others on the network can&apos;t read or alter it, and it uses the server&apos;s{" "}
          <strong>certificate</strong> to prove you&apos;re talking to the real site. The padlock
          in your address bar means the connection uses HTTPS. Websites today should always use
          it.
        </p>

        <h3 id="database">Database</h3>
        <p>
          A <strong>database</strong> stores information in an organised way so it can be
          searched and updated: user accounts, products, orders, course progress. Many websites
          run a <strong>backend application</strong> on the server that reads from and writes to
          a database while building its responses.
        </p>
        <p>
          The browser doesn&apos;t talk to the database directly. It talks to the backend
          application, and the application decides what to fetch and what each visitor is
          allowed to see. Not every website needs a database at all.
        </p>
      </>
    ),
  },
  {
    id: "visiting-a-website",
    title: "What happens when you visit a website?",
    body: (
      <>
        <p>
          Now let&apos;s put the parts together. Here is what happens when you type{" "}
          <Code>https://www.example.com</Code> into your browser and press Enter.
        </p>
        <InternetFlowDiagram />
        <ol>
          <li>
            <strong>You enter a URL.</strong> The browser reads the scheme (<Code>https</Code>)
            and the hostname (<Code>www.example.com</Code>).
          </li>
          <li>
            <strong>The browser checks for usable DNS information.</strong> If it, or the
            operating system, looked up this hostname recently and the answer hasn&apos;t
            expired, it uses that.
          </li>
          <li>
            <strong>DNS resolution, when needed.</strong> Otherwise a DNS resolver finds the
            site&apos;s IP address and returns it — for example <Code>203.0.113.10</Code>.
          </li>
          <li>
            <strong>The browser connects.</strong> It opens a connection to that address. For
            HTTPS, a TLS handshake sets up encryption and checks the server&apos;s certificate.
          </li>
          <li>
            <strong>The browser sends an HTTP request,</strong> such as{" "}
            <Code>GET /</Code> for the home page.
          </li>
          <li>
            <strong>The server processes the request.</strong> It may return a file that already
            exists, or run application code to build a response.
          </li>
          <li>
            <strong>The application may query a database</strong> and receive data — for
            example, the latest courses to list on the page.
          </li>
          <li>
            <strong>The server returns an HTTP response,</strong> with a status code like{" "}
            <Code>200 OK</Code> and the page&apos;s HTML.
          </li>
          <li>
            <strong>The browser displays the page.</strong> It reads the HTML, requests the CSS,
            JavaScript, images and fonts the page refers to (each one is another HTTP request),
            applies the styles, runs the scripts, and draws the result.
          </li>
        </ol>
        <h3 id="status-codes">HTTP status codes</h3>
        <p>
          Every response starts with a three-digit <strong>status code</strong> that describes
          the outcome of the request. You&apos;ll meet these often:
        </p>
        <ul>
          <li>
            <strong>200 OK</strong> — the request worked.
          </li>
          <li>
            <strong>301 Moved Permanently</strong> — the resource has a new address; the browser
            follows it automatically.
          </li>
          <li>
            <strong>403 Forbidden</strong> — the server understood but won&apos;t allow it.
          </li>
          <li>
            <strong>404 Not Found</strong> — the server couldn&apos;t find what was asked for,
            often a mistyped or old link.
          </li>
          <li>
            <strong>500 Internal Server Error</strong> — something went wrong on the server
            while handling the request.
          </li>
        </ul>
        <p>
          As a rule of thumb, codes starting with 2 mean success, 3 a redirect, 4 a problem with
          the request, and 5 a problem on the server.
        </p>
      </>
    ),
  },
  {
    id: "html-css-javascript",
    title: "How HTML, CSS, and JavaScript work together",
    body: (
      <>
        <p>Almost every web page is built from three languages, each with its own job.</p>
        <ul>
          <li>
            <strong>HTML</strong> (HyperText Markup Language) provides the{" "}
            <strong>structure</strong> and content: headings, paragraphs, links, images, forms.
          </li>
          <li>
            <strong>CSS</strong> (Cascading Style Sheets) provides the{" "}
            <strong>presentation</strong>: colours, fonts, spacing, layout, and how the page
            adapts to different screen sizes.
          </li>
          <li>
            <strong>JavaScript</strong> provides <strong>behaviour</strong>: responding to clicks
            and typing, changing the page without reloading, and fetching new data.
          </li>
        </ul>
        <p>Here are the three working together on a tiny page:</p>
        <CodeBlock label="index.html">{`
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first page</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
  </head>
  <body>
    <h1>Hello, web</h1>
    <button id="greet">Say hello</button>
  </body>
</html>
`}</CodeBlock>
        <CodeBlock label="styles.css">{`
h1 {
  color: darkgreen;
  font-family: sans-serif;
}
`}</CodeBlock>
        <CodeBlock label="script.js">{`
document.getElementById("greet").addEventListener("click", () => {
  alert("Hello!");
});
`}</CodeBlock>
        <p>
          The browser downloads <Code>index.html</Code> first. The <Code>link</Code> and{" "}
          <Code>script</Code> tags tell it to request <Code>styles.css</Code> and{" "}
          <Code>script.js</Code> as well. It builds the page from the HTML, styles the heading
          with the CSS, and runs the JavaScript so the button shows a message when clicked.
        </p>
        <KeyIdea>
          HTML is the structure, CSS is the presentation, and JavaScript is the behaviour. You
          could think of a house: walls and rooms, then paint and furniture, then electricity
          that makes things work.
        </KeyIdea>
      </>
    ),
  },
  {
    id: "static-vs-dynamic",
    title: "Static websites vs dynamic websites",
    body: (
      <>
        <p>
          A <strong>static website</strong> serves files that already exist. When you request a
          page, the server sends back the same HTML, CSS and JavaScript files to everyone. A
          personal portfolio or a simple landing page is often static. Static sites are fast,
          cheap to host and have little that can break. They can still be interactive — the
          JavaScript runs in your browser.
        </p>
        <p>
          A <strong>dynamic website</strong> uses application logic on the server to generate
          responses. The response can depend on who you are or what you ask for: your inbox, your
          shopping basket, search results. Online banking, social networks and online shops are
          dynamic.
        </p>
        <p>
          A dynamic application often uses a database, but it doesn&apos;t have to query it on
          every request. It may keep frequently used data in a <strong>cache</strong>, or produce
          a page once and reuse it for many visitors.
        </p>
        <KeyIdea>
          Static: the server sends files that already exist. Dynamic: the server runs code to
          build the response.
        </KeyIdea>
      </>
    ),
  },
  {
    id: "introduction-to-git",
    title: "Introduction to Git",
    body: (
      <>
        <p>
          As you build websites you&apos;ll change your files constantly — and sometimes break
          things. <strong>Git</strong> is a <strong>version control system</strong>: it tracks
          changes to files over time, so you can see what changed, when and why, and go back to
          an earlier version if you need to.
        </p>
        <p>Some words you&apos;ll hear:</p>
        <ul>
          <li>
            A <strong>repository</strong> (repo) is a project folder that Git is tracking,
            including its full history.
          </li>
          <li>
            A <strong>commit</strong> is a saved snapshot of your changes, with a message
            describing them.
          </li>
          <li>
            A <strong>branch</strong> is a separate line of work, so you can try something
            without affecting the main version.
          </li>
        </ul>
        <p>A typical first session in a terminal looks like this:</p>
        <CodeBlock label="Terminal">{`
git init                      # start tracking this folder
git add index.html            # choose the changes to save
git commit -m "Add home page" # save a snapshot with a message
git log                       # list the snapshots so far
`}</CodeBlock>
        <p>
          Git runs on your own computer and works without an internet connection. You&apos;ll
          install it and practise these commands in a later lesson.
        </p>
      </>
    ),
  },
  {
    id: "introduction-to-github",
    title: "Introduction to GitHub",
    body: (
      <>
        <p>
          <strong>GitHub</strong> is an online platform for hosting Git repositories and working
          on them with other people. Your repository lives on your computer; GitHub keeps a copy
          online that you and your team can share.
        </p>
        <ul>
          <li>
            <Code>git push</Code> sends your commits up to GitHub, and <Code>git pull</Code>{" "}
            brings other people&apos;s changes down.
          </li>
          <li>
            <Code>git clone</Code> copies a repository from GitHub onto your computer.
          </li>
          <li>
            A <strong>pull request</strong> proposes changes from a branch, so others can review
            them before they&apos;re merged.
          </li>
          <li>Issues track bugs and ideas, and your public repositories become a portfolio.</li>
        </ul>
        <KeyIdea>
          Git is the tool that tracks changes; GitHub is a website that hosts Git repositories
          and helps people collaborate on them. GitLab and Bitbucket are similar platforms, and
          Git works fine without any of them.
        </KeyIdea>
      </>
    ),
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting and debugging",
    body: (
      <>
        <p>
          Things will go wrong — for every developer, every day. <strong>Debugging</strong> is the
          skill of finding out why, calmly and in order:
        </p>
        <ol>
          <li>
            <strong>Reproduce the problem.</strong> Make it happen again, and note the exact
            steps. A problem you can repeat is a problem you can fix.
          </li>
          <li>
            <strong>Read the error message.</strong> It often says exactly what&apos;s wrong, and
            where.
          </li>
          <li>
            <strong>Check the basics.</strong> Is the URL spelled correctly? Are you connected? Does
            the site work on another device or network?
          </li>
          <li>
            <strong>Use the browser&apos;s developer tools</strong> (press F12, or right-click and
            choose Inspect). The <strong>Console</strong> tab shows JavaScript errors; the{" "}
            <strong>Network</strong> tab shows every request and its status code.
          </li>
          <li>
            <strong>Change one thing at a time,</strong> then test again, so you know what made
            the difference.
          </li>
        </ol>
        <p>The kind of error tells you where to look:</p>
        <ul>
          <li>
            <strong>&quot;Server not found&quot; / &quot;DNS address could not be found&quot;</strong>{" "}
            — the name couldn&apos;t be resolved: check the spelling of the domain and your
            connection.
          </li>
          <li>
            <strong>404 Not Found</strong> — the server answered, but the page isn&apos;t there:
            check the path or the link you followed.
          </li>
          <li>
            <strong>500 Internal Server Error</strong> — the request reached the server but
            something failed there; the cause is in the server&apos;s code or logs, not your
            browser.
          </li>
          <li>
            <strong>The page loads but looks wrong or a button does nothing</strong> — check the
            Console for errors, and the Network tab for CSS or JavaScript files that failed to
            load.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "practical-activity",
    title: "Practical activity",
    body: (
      <>
        <p>
          Try these on a laptop or desktop computer (developer tools are limited on phones). Each
          takes a few minutes.
        </p>
        <ol>
          <li>
            <strong>Watch a page load.</strong> Open any website, press F12 and choose the{" "}
            <strong>Network</strong> tab, then reload the page. Find the first request (the HTML
            document). What is its status code? How many other requests did the page make, and
            what kinds of files were they?
          </li>
          <li>
            <strong>Look up an IP address.</strong> Open a terminal (Command Prompt on Windows,
            Terminal on macOS or Linux) and run <Code>nslookup example.com</Code>. Note the
            address it returns. You&apos;ve just done a DNS lookup yourself.
          </li>
          <li>
            <strong>Read some HTML.</strong> On any page, right-click and choose{" "}
            <strong>View page source</strong>. Find a heading, a link (<Code>&lt;a&gt;</Code>) and
            a <Code>&lt;link rel=&quot;stylesheet&quot;&gt;</Code> tag.
          </li>
          <li>
            <strong>Make a 404.</strong> Add a made-up path to a site&apos;s address, such as{" "}
            <Code>/this-page-does-not-exist</Code>. With the Network tab open, confirm the status
            code is 404.
          </li>
          <li>
            <strong>Explain it back.</strong> In your own words, write four or five sentences on
            what happens between typing a URL and seeing the page. If you get stuck, revisit the
            diagram in Part 4.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "knowledge-check",
    title: "Interactive knowledge check",
    body: (
      <>
        <p>
          Eight questions on what you&apos;ve just learned. Choose one answer for each, then check
          your answers to see your score and an explanation for every question.
        </p>
        <Quiz questions={QUIZ_QUESTIONS} />
      </>
    ),
  },
  {
    id: "answers-and-explanations",
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
            {QUIZ_QUESTIONS.map((q) => (
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
    id: "summary",
    title: "Lesson summary",
    body: (
      <ul>
        <li>The internet is a global network of networks; the web is one service that runs on it.</li>
        <li>
          A browser is the client. A domain name is a site&apos;s human-friendly name, and an IP
          address is where its server can be reached.
        </li>
        <li>
          DNS resolves hostnames to IP address information, and its answers may be cached. It
          doesn&apos;t deliver page content.
        </li>
        <li>
          Browsers and servers talk using HTTP requests and responses. HTTPS adds TLS, which
          encrypts the connection and authenticates the server.
        </li>
        <li>
          A web server returns responses; a backend application may query a database first. The
          browser doesn&apos;t talk to the database directly.
        </li>
        <li>Status codes describe outcomes: 200 success, 404 not found, 500 server error.</li>
        <li>HTML gives structure, CSS gives presentation, and JavaScript gives behaviour.</li>
        <li>
          Static sites serve existing files; dynamic sites generate responses with application
          logic, not necessarily with a database query each time.
        </li>
        <li>
          Git tracks changes to your files; GitHub hosts Git repositories and helps people
          collaborate.
        </li>
        <li>When something breaks, reproduce it, read the error, and change one thing at a time.</li>
      </ul>
    ),
  },
];

function sections(...ids: string[]): LessonSection[] {
  return ids.map((id) => {
    const section = SECTIONS.find((s) => s.id === id);
    if (!section) throw new Error(`Unknown lesson section: ${id}`);
    return section;
  });
}

// The lesson is read one part at a time, each on its own page. Every
// section belongs to exactly one part, in the order above. Minutes are
// estimated at about 200 words a minute, with extra time for the
// diagram, the practical activity and the quiz.
export const PARTS: readonly LessonPart[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    minutes: 1,
    sections: sections("introduction", "learning-objectives"),
  },
  {
    slug: "the-internet-and-the-web",
    title: "The internet and the web",
    minutes: 2,
    sections: sections("what-is-the-internet", "internet-vs-web"),
  },
  {
    slug: "parts-of-the-web",
    title: "The parts of the web",
    minutes: 3,
    sections: sections("components-of-the-web"),
  },
  {
    slug: "visiting-a-website",
    title: "Visiting a website",
    minutes: 4,
    sections: sections("visiting-a-website"),
  },
  {
    slug: "building-web-pages",
    title: "How web pages are built",
    minutes: 2,
    sections: sections("html-css-javascript", "static-vs-dynamic"),
  },
  {
    slug: "git-and-github",
    title: "Git and GitHub",
    minutes: 2,
    sections: sections("introduction-to-git", "introduction-to-github"),
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting and practice",
    minutes: 5,
    sections: sections("troubleshooting", "practical-activity"),
  },
  {
    slug: "knowledge-check",
    title: "Knowledge check",
    minutes: 4,
    sections: sections("knowledge-check", "answers-and-explanations"),
  },
  {
    slug: "summary",
    title: "Summary and next steps",
    minutes: 1,
    sections: sections("summary"),
  },
];

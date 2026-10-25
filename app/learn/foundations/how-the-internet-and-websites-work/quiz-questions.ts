import type { QuizQuestion } from "@/app/_lessons/quiz";

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "dns-purpose",
    question: "What is the primary purpose of DNS?",
    options: [
      "To store the files that make up a website",
      "To help resolve domain names to IP address information",
      "To encrypt the connection between the browser and the server",
      "To draw web pages on the screen",
    ],
    answer: 1,
    explanation:
      "DNS turns a name like www.example.com into the IP address the browser connects to. It doesn't store or send the page itself (the web server does that), and encryption is the job of TLS.",
  },
  {
    id: "structure",
    question: "Which technology defines webpage structure?",
    options: ["CSS", "JavaScript", "HTML", "Git"],
    answer: 2,
    explanation:
      "HTML describes what is on the page — headings, paragraphs, links, images — and how it's organised. CSS styles it and JavaScript adds behaviour.",
  },
  {
    id: "web-server",
    question: "What does a web server do?",
    options: [
      "It translates domain names into IP addresses",
      "It receives HTTP requests and returns HTTP responses",
      "It tracks changes to your code over time",
      "It displays the page in your browser window",
    ],
    answer: 1,
    explanation:
      "A web server waits for HTTP requests and answers each one with an HTTP response, such as an HTML page, an image, or an error. Name lookup is DNS, change tracking is Git, and drawing the page is the browser's job.",
  },
  {
    id: "database-access",
    question: "Which component commonly retrieves data from the database?",
    options: ["The web browser", "The DNS resolver", "The backend application", "The CSS stylesheet"],
    answer: 2,
    explanation:
      "The backend application, running on the server, queries the database and uses the results to build its response. Browsers normally never talk to the database directly, which keeps the data protected.",
  },
  {
    id: "git-purpose",
    question: "What is the main purpose of Git?",
    options: [
      "To host websites on the internet",
      "To track changes in files over time",
      "To style web pages",
      "To resolve domain names",
    ],
    answer: 1,
    explanation:
      "Git is a version control system: it records snapshots (commits) of your files so you can see what changed, when, and go back if needed. Hosting repositories online is what platforms like GitHub do.",
  },
  {
    id: "status-404",
    question: "Which HTTP status code commonly indicates a missing resource?",
    options: ["200", "301", "404", "500"],
    answer: 2,
    explanation:
      "404 Not Found means the server couldn't find what was asked for. 200 means success, 301 means the resource has moved permanently, and 500 is an internal server error.",
  },
  {
    id: "interactivity",
    question: "Which technology commonly adds interactive behavior to webpages?",
    options: ["HTML", "CSS", "JavaScript", "DNS"],
    answer: 2,
    explanation:
      "JavaScript runs in the browser and can respond to clicks and typing, change the page, and fetch new data. HTML gives structure and CSS gives presentation.",
  },
  {
    id: "debug-first-step",
    question: "What should you do first when investigating a website error?",
    options: [
      "Reinstall your browser",
      "Change several settings at once and see if it helps",
      "Reproduce the problem and inspect the error message",
      "Assume the server is down and wait",
    ],
    answer: 2,
    explanation:
      "Start by making the problem happen again and reading exactly what the error says. That tells you where to look next; changing many things at once makes it hard to know what fixed (or broke) anything.",
  },
];

import type { QuizQuestion } from "@/app/_lessons/quiz";

// The final knowledge quiz, one or two questions per part of the lesson.
export const FINAL_QUIZ: readonly QuizQuestion[] = [
  {
    id: "final-q1",
    question: "What is HTML's job on a web page?",
    options: [
      "To style the page with colours and fonts",
      "To describe the structure and meaning of the content",
      "To store data in a database",
      "To make buttons respond to clicks",
    ],
    answer: 1,
    explanation:
      "HTML structures content. CSS styles it and JavaScript adds behaviour. (Part 1)",
  },
  {
    id: "final-q2",
    question: "Which of these elements has no closing tag?",
    options: ["<p>", "<a>", "<img>", "<li>"],
    answer: 2,
    explanation: "<img> is a void element: it has attributes but no content to wrap. (Parts 1 and 6)",
  },
  {
    id: "final-q3",
    question: "Which element holds the content that visitors see?",
    options: ["<head>", "<title>", "<meta>", "<body>"],
    answer: 3,
    explanation:
      "The body holds the visible content. The head, including <title> and <meta>, holds information about the page. (Part 2)",
  },
  {
    id: "final-q4",
    question: "What does <meta charset=\"UTF-8\"> do?",
    options: [
      "Makes the page work on phones",
      "Lets the browser display characters from almost every language correctly",
      "Sets the page title",
      "Links to a stylesheet",
    ],
    answer: 1,
    explanation:
      "The character encoding tells the browser how to read the text. UTF-8 covers almost every character, including ₦ and emoji. (Part 2)",
  },
  {
    id: "final-q5",
    question: "Which line is nested correctly?",
    options: [
      "<li><a href=\"about.html\">About</li></a>",
      "<li><a href=\"about.html\">About</a></li>",
      "<a href=\"about.html\"><li>About</a></li>",
      "<li><a href=\"about.html\">About</li>",
    ],
    answer: 1,
    explanation:
      "The link opens inside the list item and closes before it. The element opened last closes first. (Part 3)",
  },
  {
    id: "final-q6",
    question: "A page's sections use <h2>. What should a sub-section inside one of them use?",
    options: ["<h1>", "<h3>", "<h5>", "<p> in bold"],
    answer: 1,
    explanation:
      "Go down one level at a time. A sub-section of an <h2> section is an <h3>. (Part 4)",
  },
  {
    id: "final-q7",
    question: "Which list fits directions from your house to the market?",
    options: ["<ul>", "<ol>", "Paragraphs with typed numbers", "<nav>"],
    answer: 1,
    explanation: "Directions must be followed in order, so use an ordered list. (Part 5)",
  },
  {
    id: "final-q8",
    question: "Your page is about.html and the photo is images/team.jpg in the same project folder. Which <img> is best?",
    options: [
      "<img src=\"Images/Team.JPG\">",
      "<img src=\"images/team.jpg\" alt=\"Our team of four outside the office\">",
      "<img src=\"team\" alt=\"image\">",
      "<img href=\"images/team.jpg\">",
    ],
    answer: 1,
    explanation:
      "It uses the correct relative path, matching lowercase names, and meaningful alt text. Images use src, not href. (Part 6)",
  },
  {
    id: "final-q9",
    question: "Which link opens an external site in a new tab safely?",
    options: [
      "<a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">Example (opens in a new tab)</a>",
      "<a href=\"www.example.com\" target=\"_blank\">Example</a>",
      "<a href=\"https://example.com\" new-tab>Example</a>",
      "<a target=\"_blank\">https://example.com</a>",
    ],
    answer: 0,
    explanation:
      "It has the full https:// address, target=\"_blank\" with rel=\"noopener noreferrer\", and link text that says it opens a new tab. (Part 7)",
  },
  {
    id: "final-q10",
    question: "Your navigation link to about.html works on your laptop but not online. The file is called About.html. What's the fix?",
    options: [
      "Add a leading slash: /about.html",
      "Rename the file to about.html so the name matches exactly",
      "Move the file into the images folder",
      "Use target=\"_blank\"",
    ],
    answer: 1,
    explanation:
      "Most web servers treat capital letters as different, so the names must match exactly. Lowercase filenames avoid the problem. (Parts 8 and 9)",
  },
];

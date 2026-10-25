// What the site says about learning areas, paths and lessons. Learning
// is self-paced; an area is "open" only once it has published lessons.
// Until then it is planned, and the site labels it that way.

export type LearningStatus = "open" | "planned";

export type LearningArea = {
  id: string;
  title: string;
  description: string;
  status: LearningStatus;
};

export const LEARNING_AREAS: readonly LearningArea[] = [
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Build websites and web apps with HTML, CSS and JavaScript, using AI tools along the way.",
    status: "open",
  },
  {
    id: "programming",
    title: "Programming",
    description:
      "Learn to think in code: variables, logic, functions and data, explained from first principles.",
    status: "planned",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    description:
      "Write code other people can read and change, with version control, testing and debugging.",
    status: "planned",
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    description:
      "Understand where software runs: servers, storage, networking and the main cloud platforms.",
    status: "planned",
  },
  {
    id: "devops",
    title: "DevOps",
    description:
      "Get software from your machine to its users reliably, with automation and deployment pipelines.",
    status: "planned",
  },
];

export type LearningStage = {
  title: string;
  level: string;
  description: string;
};

// The intended progression, named after the tagline. Stages, not courses.
export const LEARNING_PATH: readonly LearningStage[] = [
  {
    title: "Foundations",
    level: "Beginner",
    description:
      "How the internet works, how websites are made, and the tools developers use every day.",
  },
  {
    title: "Build",
    level: "Beginner to intermediate",
    description: "Turn the basics into working projects: interactive pages, real data, first apps.",
  },
  {
    title: "Scale",
    level: "Intermediate",
    description: "Write code that holds up as it grows, with clear structure, tests and teamwork.",
  },
  {
    title: "Ship",
    level: "Applied",
    description: "Put your work online and keep it running, with deployment and cloud services.",
  },
];

export type Principle = {
  title: string;
  description: string;
};

export const TEACHING_PRINCIPLES: readonly Principle[] = [
  {
    title: "Plain-language explanations",
    description:
      "New ideas are explained in everyday words before the jargon, so you're never assumed to know it already.",
  },
  {
    title: "A clear order",
    description: "Topics follow a set sequence, so each one builds on what you've just learned.",
  },
  {
    title: "Practice as you go",
    description:
      "Examples and exercises sit next to the explanation, so you try each idea while it's fresh.",
  },
  {
    title: "From basics to real work",
    description:
      "Paths start at the fundamentals and lead toward the skills used on real projects.",
  },
];

export type Lesson = {
  number: number;
  title: string;
  stage: string;
  summary: string;
  // Lessons without a page yet are shown as "Coming soon", never linked.
  status: "published" | "coming-soon";
  href?: string;
};

export const LESSONS: readonly Lesson[] = [
  {
    number: 1,
    title: "How the Internet and Websites Work",
    stage: "Foundations",
    summary:
      "What happens between typing a web address and seeing a page: browsers, DNS, servers, databases, and how HTML, CSS and JavaScript fit together.",
    status: "published",
    href: "/learn/foundations/how-the-internet-and-websites-work",
  },
  {
    number: 2,
    title: "Introduction to HTML",
    stage: "Foundations",
    summary: "Write your first web page and learn the elements that give every page its structure.",
    status: "coming-soon",
  },
];

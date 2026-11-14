/* ============================================================
   Everything the site knows about Ansh Patel.
   Source of truth: Resume.pdf (latest). Nothing here is invented.

   Items marked `needsInput: true` are placeholders waiting on you —
   they render as a visible "waiting on input" slot rather than
   silently disappearing, so nothing gets forgotten.
   ============================================================ */

export const identity = {
  name: "Ansh Patel",
  role: "Full-stack & AI engineer",
  city: "Ahmedabad",
  region: "Gujarat, India",
  timezone: "Asia/Kolkata",
  email: "ansh.worksocial@gmail.com",
  phone: "+91 7046557755",
  availability: "Open to roles from June 2026",
  thesisWide: "I build software that",
  thesisTight: "shows its work.",
  intro:
    "I'm Ansh Patel, a full-stack and AI engineer in Ahmedabad. I build AI-powered applications — retrieval that explains its answers, real-time backends, cross-platform mobile — and I direct AI coding agents inside verification-driven workflows, so what ships has been checked rather than assumed.",
};

export const links = {
  github: "https://github.com/Anshpatel2434",
  linkedin: "https://www.linkedin.com/in/anshpatel2434",
  resume: "/Resume.pdf",
};

export const education = {
  school: "Lok Jagruti Institute of Engineering and Technology",
  degree: "B.E. Computer Science Engineering",
  place: "Ahmedabad, Gujarat",
  graduating: "June 2026",
};

/* ---------- about ---------- */
export const about = {
  lead:
    "I am a final-year computer science student in Ahmedabad who spends most of his time on the part of software that has to be correct rather than the part that has to be impressive.",
  body: [
    "The work I care about is retrieval. Most AI features answer confidently and leave you no way to check them, which is fine in a demo and useless in a product. PrepToDo was built the other way round: a hybrid pipeline where pgvector finds candidates and a knowledge graph decides which of them are actually about the same thing, so the explanation that comes back is grounded in something a person can go and read.",
    "I work the same way I build. I direct AI coding agents — Claude Code, Cursor — inside structured, verification-driven workflows, with harnesses and loops around them, because an agent that is not checked is just a faster way to ship a bug. Explanation and verification are the same discipline, applied once to the product and once to the process of making it.",
    "Before the AI work I shipped for other people: React Native features at Glitch Over, a Figma-to-production site at Unlock Discounts. Two hackathons at DAIICT, one of them a top-14 finish out of a hundred teams.",
  ],
  facts: [
    { k: "Based in", v: "Ahmedabad, Gujarat" },
    { k: "Studying", v: "B.E. Computer Science, LJIET" },
    { k: "Graduating", v: "June 2026" },
    { k: "Working on", v: "Retrieval that explains itself" },
    { k: "Open to", v: "Full-time roles and project work" },
  ],
};

/* ---------- what you can hire me for ---------- */
export type Offer = {
  n: string;
  title: string;
  line: string;
  stack: string[];
};

export const offers: Offer[] = [
  {
    n: "01",
    title: "AI that explains itself",
    line: "Retrieval that cites what it was grounded in, so an answer can be checked instead of trusted.",
    stack: [
      "Retrieval-Augmented Generation",
      "pgvector",
      "Vector search",
      "Knowledge graph",
      "OpenAI GPT",
      "Prompt engineering",
    ],
  },
  {
    n: "02",
    title: "Products, end to end, alone",
    line: "Empty repo to live product without a handoff — interface, API, schema, deploy.",
    stack: [
      "React.js",
      "TypeScript",
      "TailwindCSS",
      "Express.js",
      "Hono",
      "Drizzle ORM",
      "Prisma ORM",
      "PostgreSQL",
    ],
  },
  {
    n: "03",
    title: "Real-time that stays correct",
    line: "Open sockets, async consumers, and notifications that arrive without anyone refreshing.",
    stack: [
      "WebSockets",
      "Django Channels",
      "Django",
      "Node.js",
      "Python",
      "MongoDB",
    ],
  },
  {
    n: "04",
    title: "Cross-platform mobile",
    line: "One codebase, both stores — single sign-on, push, and deep links that survive the round trip.",
    stack: ["React Native", "Expo", "Redux", "OAuth 2.0", "Android Studio"],
  },
];

/* ---------- the stack, in the order it runs ---------- */
export type Stage = {
  n: string;
  title: string;
  blurb: string;
  say: string;
  status: string;
  groups: { k: string; items: string[] }[];
};

export const stages: Stage[] = [
  {
    n: "01",
    title: "Interface",
    blurb:
      "Where the question gets asked. Typed, clean and fast, on whatever the person is holding.",
    say: "A question is typed. <b>No answer exists yet</b> — only a string, and someone waiting to be convinced.",
    status: "idle, awaiting input",
    groups: [
      {
        k: "Build",
        items: ["React.js", "TypeScript", "TailwindCSS", "Redux", "JavaScript", "HTML", "CSS"],
      },
      { k: "Shipped in", items: ["PrepToDo", "UniAsk", "Unlock Discounts"] },
    ],
  },
  {
    n: "02",
    title: "Retrieval",
    blurb:
      "The question becomes a vector. Similarity finds candidates; a knowledge graph decides which of them are actually about the same skill.",
    say: "Embedded, then matched. <b>Similarity finds candidates</b>; the graph decides which ones test the same thing.",
    status: "candidates ranked, graph hop",
    groups: [
      { k: "Retrieval", items: ["RAG", "pgvector", "Vector search", "Knowledge graph"] },
      { k: "Data", items: ["PostgreSQL", "MongoDB", "SQL", "Drizzle ORM", "Prisma ORM"] },
    ],
  },
  {
    n: "03",
    title: "Reasoning",
    blurb:
      "The model answers — and has to justify it from the passages it was handed. This is the layer that makes the whole thing worth building.",
    say: "The model answers from the passages it was handed — and <b>has to show where it got that</b>.",
    status: "rationale grounded",
    groups: [
      { k: "Models", items: ["OpenAI GPT", "LLM APIs", "Prompt engineering"] },
      {
        k: "Agents",
        items: [
          "Claude Code",
          "Cursor",
          "Agent harness",
          "Loop engineering",
          "Verification-driven workflow",
        ],
      },
    ],
  },
  {
    n: "04",
    title: "Real-time",
    blurb:
      "The answer is pushed, not polled. Sockets stay open, consumers stay async, and nobody refreshes anything.",
    say: "Pushed down an open socket. <b>Nobody refreshes anything</b>, and the thread stays correct.",
    status: "delivered, not polled",
    groups: [
      { k: "Transport", items: ["WebSockets", "Django Channels", "Async consumers"] },
      { k: "Server", items: ["Node.js", "Express.js", "Hono", "Django", "Python", "Java"] },
    ],
  },
  {
    n: "05",
    title: "Delivery",
    blurb:
      "Out to both platforms, signed in, deep-linked, deployed. The part where it stops being a demo.",
    say: "Signed in, deep-linked, deployed. <b>The part where it stops being a demo.</b>",
    status: "live on both platforms",
    groups: [
      { k: "Mobile", items: ["React Native", "Expo", "OAuth 2.0", "Android Studio"] },
      { k: "Tooling", items: ["Git", "GitHub", "Postman", "VS Code", "Vercel"] },
    ],
  },
];

/* ---------- live products ---------- */
export type Product = {
  name: string;
  when: string;
  href: string;
  label: string;
  stack: string;
  what: string;
  detail: string[];
  shot: string | null;
  shotNote: string;
};

export const products: Product[] = [
  {
    name: "PrepToDo",
    when: "February 2026",
    href: "https://preptodo.in",
    label: "preptodo.in",
    stack: "React.js · TypeScript · TailwindCSS · Express.js · Drizzle ORM",
    what: "An AI-powered CAT VARC preparation platform built on a hybrid Retrieval-Augmented Generation pipeline — pgvector similarity search combined with a knowledge graph — using the OpenAI GPT API to generate reasoning-based explanations.",
    detail: [
      "Timed RC practice, adaptive VARC drills and AI-generated weak-area tests, each with a personalised LLM-written rationale rather than a bare answer key.",
      "Analytics dashboard tracking accuracy, time, genre mastery, percentile signals and streak performance.",
    ],
    shot: null,
    shotNote: "PrepToDo — analytics dashboard, 16:10",
  },
  {
    name: "UniAsk",
    when: "November 2024",
    href: "https://uni-ask.app",
    label: "uni-ask.app",
    stack: "React.js · TailwindCSS · Django · Django Channels · WebSockets",
    what: "A real-time academic Q&A platform enabling live messaging and instant notifications over WebSockets.",
    detail: [
      "Asynchronous backend built with Django Channels, with the frontend optimised for seamless live updates.",
      "Deployed on Vercel.",
    ],
    shot: null,
    shotNote: "UniAsk — live thread, 16:10",
  },
];

/* ---------- case studies : built, never hosted ----------
   Placeholders. Replace `needsInput` entries with the real ones —
   add as many as you like, the grid takes any number. */
export type CaseStudy = {
  name: string;
  kind: string;
  what: string;
  stack: string[];
  repo: string | null;
  needsInput?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    name: "Case study slot 01",
    kind: "Waiting on you",
    what: "A project you built but never hosted. Tell me the name, what problem it solved, what you chose and why, and the stack — I'll write it up the way the products above are written.",
    stack: [],
    repo: null,
    needsInput: true,
  },
  {
    name: "Case study slot 02",
    kind: "Waiting on you",
    what: "Same again. These are worth real estate even unhosted — a decision you made and can defend reads stronger than another live link.",
    stack: [],
    repo: null,
    needsInput: true,
  },
  {
    name: "Case study slot 03",
    kind: "Waiting on you",
    what: "If any of these has a repo, give me the URL and it becomes a link. If it has a screenshot, even better.",
    stack: [],
    repo: null,
    needsInput: true,
  },
];

/* ---------- corporate exposure ---------- */
export type Role = {
  company: string;
  title: string;
  from: string;
  to: string;
  place: string;
  stack: string[];
  bullets: string[];
};

export const roles: Role[] = [
  {
    company: "Glitch Over",
    title: "React Native Developer",
    from: "Dec 2024",
    to: "Feb 2025",
    place: "Ahmedabad, Gujarat",
    stack: ["React Native", "Redux", "Expo", "Android Studio"],
    bullets: [
      "Engineered scalable cross-platform mobile features, improving application responsiveness and reducing UI latency across Android and iOS.",
      "Implemented secure OAuth 2.0 authentication using Google and Discord APIs, for a seamless single sign-on experience on both platforms.",
      "Integrated push notifications and deep linking, improving the onboarding flow and feature accessibility.",
      "Optimised the development workflow by independently resolving environment and dependency conflicts, accelerating delivery.",
    ],
  },
  {
    company: "Unlock Discounts",
    title: "Full Stack Developer Intern",
    from: "Oct 2024",
    to: "Dec 2024",
    place: "Remote",
    stack: ["React.js", "Express.js", "MongoDB"],
    bullets: [
      "Converted Figma designs into a production-ready website in React.js, with pixel-perfect implementation.",
      "Developed reusable, modular frontend components, improving maintainability and reducing development time.",
      "Integrated the frontend with backend REST APIs for dynamic content rendering.",
      "Identified and resolved critical bugs during QA, improving performance and user experience.",
    ],
  },
];

/* ---------- competitions ---------- */
export type Award = {
  name: string;
  host: string;
  year: string;
  result: string;
  detail: string;
  repo: string | null;
};

export const awards: Award[] = [
  {
    name: "Tic-Tech-Toe '24",
    host: "DAIICT",
    year: "2024",
    result: "Top 14 of 100+ teams",
    detail:
      "Built a full-stack application within 48 hours, placing as a top-14 finalist on technical implementation and innovation.",
    repo: "https://github.com/Anshpatel2434/Tic-Tech-Toe-24",
  },
  {
    name: "Hackout '24",
    host: "DAIICT",
    year: "2024",
    result: "Built and deployed in 48 hours",
    detail:
      "Built and deployed a full-stack web application during a competitive hackathon, applying rapid prototyping and debugging to ship a working solution before the deadline.",
    repo: "https://github.com/Anshpatel2434/Hackout24",
  },
];

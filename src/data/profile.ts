import PrepToDoShot from "../assets/shots/preptodo-analytics.jpg";

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

/* Every section says its line, then explains it. The heading is the
   voice; the subhead is for anyone who would otherwise have to guess. */
export const sections = {
  offer: {
    say: "The other half is the hard part.",
    sub: "Anyone can make a screen look right. Making it stay right — under load, under scrutiny, six months later — is the work. This is what I do on that side.",
  },
  work: {
    say: "Two I would put my name on.",
    sub: "Both happen to be live, but that is not the point. These are the two where every decision was mine, end to end, and I can defend all of them.",
  },
  experience: {
    say: "Before that, other people's deadlines.",
    sub: "Paid work inside someone else's team, to someone else's schedule — a different discipline from building your own thing, and worth listing separately.",
  },
  cases: {
    say: "And the ones that never shipped.",
    sub: "Case studies. Projects built to work something out rather than to launch — there is no live link, but the problem and the decision behind it are the part worth reading.",
  },
  stack: {
    say: "All of it, and where it runs.",
    sub: "Every tool I work with, placed at the layer it actually runs on. Follow one question from the screen it is typed on to the answer that comes back.",
  },
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
    title: "Interfaces people trust",
    line: "The easy half, done properly — interfaces that are quick, legible and still there after six months of changes.",
    stack: [
      "React.js",
      "TypeScript",
      "TailwindCSS",
      "Design systems",
      "Redux",
      "Motion",
    ],
  },
  {
    n: "02",
    title: "Architecture that holds",
    line: "The part nobody sees. Schemas, APIs, queues and data models that stay correct when the load and the team both grow.",
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
    title: "AI that cites its sources",
    line: "Retrieval that shows what it was grounded in, so an answer can be checked rather than believed. Real-time where it needs to be live.",
    stack: [
      "Retrieval-Augmented Generation",
      "pgvector",
      "Knowledge graph",
      "OpenAI GPT",
      "WebSockets",
      "Django Channels",
    ],
  },
  {
    n: "04",
    title: "Shipped, start to finish",
    line: "Empty repo to something a person can open — design, build, deploy, both app stores. No handoff, because there is nobody to hand off to.",
    stack: ["React Native", "Expo", "OAuth 2.0", "Vercel", "Git", "Android Studio"],
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
  repo: string | null;
  repoNote?: string;
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
    repo: null,
    repoNote: "repo link — send me the URL",
    stack: "React.js · TypeScript · TailwindCSS · Supabase · pgvector · Drizzle ORM",
    what: "An AI-powered CAT VARC platform built on a hybrid Retrieval-Augmented Generation pipeline — pgvector similarity search combined with a knowledge graph — that explains its reasoning instead of handing back an answer key.",
    detail: [
      "Cognitive analysis rather than a score: skill proficiency across argument structure, tone and intent, trap avoidance, inference accuracy and evidence evaluation \u2014 so a weak area is named, not guessed at.",
      "Genre performance, speed against accuracy, daily RC drills, spaced vocabulary revision, streaks and leaderboards.",
      "Supabase and pgvector underneath, with the RAG workflow doing the explaining.",
    ],
    shot: PrepToDoShot,
    shotNote: "PrepToDo — analytics dashboard, 16:10",
  },
  {
    name: "UniAsk",
    when: "November 2024",
    href: "https://uni-ask.app",
    label: "uni-ask.app",
    repo: "https://github.com/Anshpatel2434/UniAsk",
    stack: "React.js · TailwindCSS · Django · Django Channels · WebSockets",
    what: "A real-time academic Q&A platform enabling live messaging and instant notifications over WebSockets.",
    detail: [
      "JWT authentication with email-OTP verification, real-time chatrooms, and doubts answered by peers rather than a help desk.",
      "Asynchronous backend on Django Channels; the frontend reconciles live updates optimistically.",
      "Built for LJ University students, who sign in with their enrolment number.",
    ],
    shot: null,
    shotNote: "UniAsk — live thread, 16:10",
  },
];

/* slots on the /work page for projects beyond the two live ones.
   replace these with real entries whenever you have them. */
export const moreWork: { name: string; kind: string; what: string }[] = [
  {
    name: "Work slot 01",
    kind: "Waiting on you",
    what: "Another shipped project — client work, a freelance build, anything with a link or a repo. Give me the name, the stack and what it had to do.",
  },
  {
    name: "Work slot 02",
    kind: "Waiting on you",
    what: "Design work goes here too. A site you designed, an identity, an interface — screenshots and a sentence on the brief is enough to start.",
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
    name: "Kavach \u2014 GST Reconciler",
    kind: "Tool \u00b7 2026",
    what: "Can a CA firm reconcile GSTR-2B against a purchase register without the data ever leaving the machine? A browser-based matching engine that takes the 2B JSON and the register CSV and returns a categorised mismatch report \u2014 with a 25-test edge-case suite behind the matching, encrypted multi-device sync for anyone who wants it, and a free tier that stays entirely in IndexedDB.",
    stack: [
      "Next.js",
      "TypeScript",
      "Neon Postgres",
      "Drizzle",
      "better-auth",
      "Passkeys",
      "AES-256-GCM",
      "IndexedDB",
    ],
    repo: "https://github.com/Anshpatel2434/gst",
  },
  {
    name: "Ouroboros",
    kind: "Agent harness \u00b7 2026",
    what: "What stops a coding agent drifting? Ouroboros interviews you until the project is unambiguous, then generates the harness the agent works inside \u2014 constitution, one-commit backlog, verification suite, scope fences, runner. The decision it is built around: an ambiguity lint blocks generation on open questions and unverifiable acceptance criteria, and there is deliberately no \u201cgenerate anyway\u201d button, because that button is the entire failure mode.",
    stack: [
      "Python",
      "FastAPI",
      "LangChain",
      "Next.js",
      "Structured output",
      "Groq",
      "Claude",
    ],
    repo: "https://github.com/Anshpatel2434/Ouroboros",
  },
  {
    name: "StudyShare",
    kind: "Hackathon \u00b7 Top 14 of 100+ \u00b7 2024",
    what: "An e-library built in 48 hours at Tic-Tech-Toe \u201924. WebSocket chat, a contribution heatmap, a leaderboard, and a recommendation engine using Random Forest Regression with NLP over the catalogue \u2014 the piece that took it from a file-sharing site to something that learns what a reader wants next.",
    stack: ["React", "Django", "WebSockets", "scikit-learn", "Python"],
    repo: "https://github.com/Anshpatel2434/Tic-Tech-Toe-24",
  },
  {
    name: "Hackout \u201924",
    kind: "Hackathon \u00b7 deployed \u00b7 2024",
    what: "Built and deployed inside the deadline at Hackout \u201924, DAIICT. Waiting on a line from you about what it solved \u2014 the repo has the build and the deployment but no write-up.",
    stack: ["TypeScript"],
    repo: "https://github.com/Anshpatel2434/Hackout24",
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

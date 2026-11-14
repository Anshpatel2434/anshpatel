import PrepToDoBand from "../assets/shots/preptodo-band.jpg";
import PrepToDoWide from "../assets/shots/preptodo-wide.jpg";
import UniAskBand from "../assets/shots/uniask-band.jpg";
import UniAskWide from "../assets/shots/uniask-wide.jpg";
import AgroBand from "../assets/shots/agro-band.jpg";
import AgroWide from "../assets/shots/agro-wide.jpg";
import KavachBand from "../assets/shots/kavach-band.jpg";
import KavachWide from "../assets/shots/kavach-wide.jpg";
import OuroborosBand from "../assets/shots/ouroboros-band.jpg";
import OuroborosWide from "../assets/shots/ouroboros-wide.jpg";
import StudyShareBand from "../assets/shots/studyshare-band.jpg";
import StudyShareWide from "../assets/shots/studyshare-wide.jpg";

/* ============================================================
   EVERY PROJECT, IN ONE PLACE

   Work and the case studies are the same list. What separates them
   is only whether anyone can go and open the thing:

     shipped: true   it is deployed, so it belongs under the work
     shipped: false  it was built to answer a question and never
                     launched — "the ones that never shipped"

   `featured` lifts PrepToDo and UniAsk to a full band each;
   everything else is a record.

   Stacks are read off the repositories and the copy off the real
   screens, so both say what is actually there.
   ============================================================ */

export type Project = {
  slug: string;
  name: string;
  /* the occasion, where there was one — a hackathon, a client */
  context?: string;
  year: string;
  shipped: boolean;
  featured?: boolean;
  live?: string;
  liveLabel?: string;
  repo: string;
  /* one line, for the list */
  blurb: string;
  /* the detail page */
  problem: string;
  decision: string;
  build: string[];
  stack: { k: string; items: string[] }[];
  /* the plate on the work band, and a second one for its own page */
  shot?: string;
  shotNote?: string;
  shotWide?: string;
};

export const projects: Project[] = [
  /* ---------------------------------------------------------- */
  {
    slug: "preptodo",
    name: "PrepToDo",
    year: "February 2026",
    shipped: true,
    featured: true,
    live: "https://preptodo.in",
    liveLabel: "preptodo.in",
    repo: "https://github.com/Anshpatel2434/PrepToDo",
    shot: PrepToDoBand,
    shotWide: PrepToDoWide,
    shotNote: "PrepToDo — every wrong answer has a pattern",
    blurb:
      "A CAT VARC platform that names the reasoning pattern behind your wrong answers instead of marking them wrong.",
    problem:
      "Every CAT platform tells you the answer was B. None of them tell you why you picked D, and that is the only information that would change your next attempt. A score is a result. What a reader needs is a diagnosis — and “work on RC” is not one.",
    decision:
      "Retrieval had to be about what a question tests, not what it is about. Pure vector similarity kept returning passages that were topically close but exercised a different skill, so a knowledge-graph hop across genre, skill and trap-type runs before reranking. That is what makes the diagnosis hold up: the platform can say your weakest skill is elimination effectiveness at 0% while tone and intent sensitivity sits at 92%, and point at the attempts that prove it.",
    build: [
      "Skill proficiency measured across eight named reasoning skills — elimination effectiveness, argument structure analysis, detail versus structure balance, inference accuracy, strategic efficiency, trap avoidance rate, evidence evaluation, tone and intent sensitivity.",
      "AI diagnostics on a wrong answer: what the choice assumed, which part of the argument it misread, and the recommended action — not the correct option restated.",
      "Genre performance across twelve genres, from neuroscience to politics and public policy, with reading speed plotted against accuracy so the trade-off is visible.",
      "A personal dictionary built out of practice: double-click any word in a passage for meaning, synonyms and a memory trick, and it is saved to revise.",
      "Daily RC practice with a timed question palette, attempt timings against the average, confidence tracking, streaks, points and custom mocks.",
      "A real admin surface behind it — dashboards, content, user and financial controllers, daily metrics, an activity service — plus cost tracking on every model call, Zod validation, rate limiting and structured logging.",
    ],
    stack: [
      { k: "Interface", items: ["React", "TypeScript", "TailwindCSS", "Redux Toolkit", "Framer Motion", "Recharts", "Vite"] },
      { k: "Retrieval", items: ["RAG", "pgvector", "Knowledge graph", "OpenAI"] },
      { k: "Server", items: ["Express", "Drizzle ORM", "Neon serverless", "Zod", "JWT", "Helmet"] },
      { k: "Operations", items: ["Pino", "Resend", "PostHog", "Turnstile", "Vercel"] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "uniask",
    name: "UniAsk",
    year: "November 2024",
    shipped: true,
    featured: true,
    live: "https://uni-ask.vercel.app",
    liveLabel: "uni-ask.vercel.app",
    repo: "https://github.com/Anshpatel2434/UniAsk",
    shot: UniAskBand,
    shotWide: UniAskWide,
    shotNote: "UniAsk — a year of answers, by day",
    blurb:
      "A real-time academic Q&A platform for LJ University, where a doubt reaches a person rather than a help desk.",
    problem:
      "A student with a doubt at eleven at night has nowhere to put it. Forums answer in days, group chats lose it in scroll, and the faculty inbox is not awake. The gap is not knowledge — it is latency, and nothing about a slower channel makes the answer better.",
    decision:
      "Notifications are the hard half of a chat product, not the messages. Fan-out runs through the Django Channels layer rather than a loop over connected clients, so a busy thread costs one broadcast instead of one query per subscriber, and the frontend reconciles optimistically so a slow network never looks like a dropped message.",
    build: [
      "Topic chatrooms over WebSockets, with notifications fanned out the moment a doubt is answered.",
      "A profile that counts: doubts posted, solutions written, upvotes received, reputation — and a year-long submission heatmap with active days and the longest streak.",
      "A leaderboard ranked on upvotes, so answering well is worth something.",
      "JWT authentication with email-OTP verification; LJ University students sign in with their enrolment number.",
      "Asynchronous consumers on Daphne, PostgreSQL behind Django REST Framework.",
    ],
    stack: [
      { k: "Interface", items: ["React", "TailwindCSS", "Vite", "React Router", "Lucide"] },
      { k: "Real-time", items: ["Django Channels", "Daphne", "WebSockets", "ASGI"] },
      { k: "Server", items: ["Django 5", "Django REST Framework", "PostgreSQL", "JWT"] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "agroquality",
    name: "AgroQuality",
    context: "Hackout '24, DAIICT",
    year: "August 2024",
    shipped: true,
    live: "https://hackout24-mpi8.vercel.app",
    liveLabel: "hackout24-mpi8.vercel.app",
    repo: "https://github.com/Anshpatel2434/Hackout24",
    shot: AgroBand,
    shotWide: AgroWide,
    shotNote: "AgroQuality — a farm, read remotely",
    blurb:
      "Built and deployed inside a 48-hour deadline: live soil and weather readings for a farm, turned into advice a farmer can act on.",
    problem:
      "Precision agriculture already exists; it just does not reach the farmer who would gain most from it. The data needs reading, the dashboards assume you want numbers, and the people who could use it are often the least able to interpret them.",
    decision:
      "Put a person in the loop instead of a tutorial. Job-seeking graduates sign up as field employees, register the farmers they look after, and the platform does the reading — the employee is the interface. Each farm is drawn once as a polygon, and from then on every reading and every tip is tied to that boundary.",
    build: [
      "Per-farm telemetry: soil temperature at 10 cm, soil moisture, UV index, weather group, pressure, humidity and air temperature.",
      "Google's Gemini turns those readings into ten specific tips per farm, grouped by irrigation, fertilisation and pest and disease control — advice for this field this week, not a general guide.",
      "Employee accounts with editable profiles, a client book of registered farmers, and a subscription tier behind a payment gateway.",
      "Farm boundaries as polygons, worked around the data provider's limit of five coordinates and 3,000 acres.",
      "Ten schema migrations inside the 48 hours, which is what a hackathon data model looks like while it is still moving.",
    ],
    stack: [
      { k: "Interface", items: ["React", "NextUI", "Vite", "TailwindCSS", "Zod"] },
      { k: "Server", items: ["Hono", "Prisma", "Prisma Accelerate"] },
      { k: "AI", items: ["Google Gemini"] },
    ],
  },

  /* ================= never shipped ================= */
  {
    slug: "kavach",
    name: "Kavach",
    context: "GST reconciliation for CA practices",
    year: "2026",
    shipped: false,
    repo: "https://github.com/Anshpatel2434/gst",
    shot: KavachBand,
    shotWide: KavachWide,
    shotNote: "Kavach — 45 documents, 33 agree, 12 need a decision",
    blurb:
      "GSTR-2B reconciled against a purchase register, in the browser, without the data ever leaving the machine.",
    problem:
      "A CA firm reconciling GSTR-2B against a purchase register is handling client financial data, and every tool that does this asks them to upload it first. That is the whole objection, and no feature list answers it. The second problem is subtler: reconciliation software reports differences, when what the firm owes its client is a decision before a deadline.",
    decision:
      "Make uploading optional, and make the deadline the subject. The matching engine runs in the browser, the free tier never leaves IndexedDB, and multi-device sync is encrypted with AES-256-GCM so the server stores ciphertext it cannot read. The interface opens not on a table but on a sentence — forty-five documents, thirty-three agree, twelve need your decision, and this much input tax credit is riding on them.",
    build: [
      "A matching engine with a 25-test edge-case suite, proven against real downloaded GSTR-2B JSON and the official GSTN CSV template; differences are typed — taxable value differs, tax differs, other GSTIN under the same PAN, probable match, not in the register.",
      "An append-only record of every decision, each with its reason and the engine version that produced it, so a fixed-fee retainer can show what it recovered and what it cost: amounts recovered, deemed acceptances averted, hours spent on decisions nobody needed to make.",
      "A Command Center across every client and period: what is waiting, what is at stake, which deadline has already passed, and an ITC Expiry Radar counting down Section 16(4).",
      "“Where you overruled the engine” — a list of the cases the rules got wrong, which is where the next version of the rules comes from.",
      "Passwordless by default: email OTP and passkeys, because a password is one more thing a firm can leak.",
      "Its own design system — editorial black on paper, a command palette, light and dark, responsive down to a phone.",
    ],
    stack: [
      { k: "Interface", items: ["Next.js", "React", "TypeScript", "Command palette"] },
      { k: "Engine", items: ["Papaparse", "xlsx", "Zod", "25-test suite"] },
      { k: "Data", items: ["Neon Postgres", "Drizzle", "IndexedDB", "AES-256-GCM"] },
      { k: "Auth", items: ["better-auth", "Passkeys", "Email OTP", "Resend"] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "ouroboros",
    name: "Ouroboros",
    context: "An agent harness generator",
    year: "2026",
    shipped: false,
    repo: "https://github.com/Anshpatel2434/Ouroboros",
    shot: OuroborosBand,
    shotWide: OuroborosWide,
    shotNote: "Ouroboros — the pipeline, and what it writes",
    blurb:
      "Interviews a project until it is unambiguous, then generates the harness a coding agent has to work inside.",
    problem:
      "An autonomous coding agent given a vague spec does not stop and ask. It invents the requirement, drifts from the brief, and quietly deletes the failing test. The failure is never really the model — it is that nobody checked the spec was answerable before the agent started.",
    decision:
      "Refuse to generate from a spec it would have to guess about. An ambiguity lint blocks generation on open questions, placeholder text, acceptance criteria no script could check, dangling dependencies, components with no scope fence, and stacks the corpus has never researched. There is deliberately no “generate anyway” button, because that button is the entire failure mode this exists to prevent.",
    build: [
      "Produces the harness rather than the code: the constitution, a one-commit backlog with a scope fence per task, the verification suite, the pre-commit gate, and the runner that drives the agent through them — serially, or as a fleet across parallel git worktrees.",
      "The interview asks two or three questions at a time, each naming the spec field it fills; a stack the corpus has never seen is researched once and written back, so the corpus compounds.",
      "Deterministic lint first, because it is free and unarguable, then an LLM pass for contradictions and coverage holes.",
      "Structured output uses json_schema rather than tool calling, because function calling fails on schemas the size of the spec draft — and when a call is rejected anyway, the JSON is salvaged from the error rather than paid for twice.",
      "Provider-agnostic: Groq by default, Anthropic when its key is present, with per-role output caps and a rolling token bucket paced against the live quota rather than an assumed one.",
      "180 tests that run against a scripted model — no network, no API key — and that execute what the generator emits, so verify.sh and both pre-commit paths run for real.",
    ],
    stack: [
      { k: "Core", items: ["Python", "LangGraph", "LangChain", "Pydantic"] },
      { k: "Models", items: ["Groq", "Claude", "json_schema output", "Ambiguity lint"] },
      { k: "Surface", items: ["FastAPI", "Uvicorn", "Next.js"] },
      { k: "Proof", items: ["180 tests", "BM25 corpus", "45 documents", "10 playbooks"] },
    ],
  },

  /* ---------------------------------------------------------- */
  {
    slug: "studyshare",
    name: "StudyShare",
    context: "Tic-Tech-Toe '24 — top 14 of 100+ teams",
    year: "September 2024",
    shipped: false,
    repo: "https://github.com/Anshpatel2434/Tic-Tech-Toe-24",
    shot: StudyShareBand,
    shotWide: StudyShareWide,
    shotNote: "StudyShare — ranked by what people actually read",
    blurb:
      "An e-library built in 48 hours, where the catalogue learns what to put in front of you next.",
    problem:
      "A shared drive full of study material is not a library. Nothing surfaces, nothing is ranked, and the best set of notes in the folder is the one nobody opens because it is twelve files down.",
    decision:
      "Make the catalogue learn. A Random Forest regressor over engagement — ratings given, resources viewed, categories returned to — with NLP across the material itself, drives the recommendations. That is what turned a file-sharing site into something that answers what to read next, and it was the only part of the 48 hours worth spending there; uploads are a solved problem.",
    build: [
      "Popularity from real signals: views and ratings update live, and the ranking moves with them.",
      "Recommendations drawn from what a reader has rated and viewed, by category rather than by file.",
      "WebSocket chat rooms for collaborative study, with messages persisted as they are sent.",
      "A contribution heatmap, a leaderboard ranked on ratings received, and a dashboard over both.",
      "Bookmarks, tag filtering across subjects, search, in-browser reading and downloads.",
    ],
    stack: [
      { k: "Interface", items: ["React", "Vite", "TailwindCSS", "react-pdf", "Heatmap"] },
      { k: "Server", items: ["Django 5", "Channels", "Daphne", "PostgreSQL"] },
      { k: "Learning", items: ["scikit-learn", "Random Forest", "NLP"] },
    ],
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const featured = projects.filter((p) => p.featured);
export const alsoShipped = projects.filter((p) => p.shipped && !p.featured);
export const unshipped = projects.filter((p) => !p.shipped);

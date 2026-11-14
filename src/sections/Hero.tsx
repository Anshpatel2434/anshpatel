import { identity } from "../data/profile";

/* ============================================================
   HERO

   The catchphrase, one line of intro, and a constellation that is
   both the navigation and the first move of the crawler's walk.
   The canvas draws an edge from the crawler's origin to each node,
   so the page opens by showing you where it is about to take you.

   Nothing from further down the page is repeated here.
   ============================================================ */

const NODES = [
  { href: "#offer", label: "what I can do", x: 16, y: 18 },
  { href: "#work", label: "work", x: 68, y: 8 },
  { href: "#experience", label: "experience", x: 86, y: 44 },
  { href: "#cases", label: "case studies", x: 58, y: 74 },
  { href: "#stack", label: "the stack", x: 10, y: 62 },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-in">
        <div className="hero-say">
          <h1 className="hero-type">
            <span className="ht">Pretty is</span>
            <span className="ht ht-b">the easy half.</span>
          </h1>
          <p className="hero-note">
            I&rsquo;m {identity.name}. I design the thing, then I architect what
            holds it up &mdash; interfaces, retrieval systems, real-time
            backends, mobile. Based in {identity.city}.
          </p>

          <div className="hero-cta">
            <a className="btn" href="#work">
              See the work
            </a>
            <a className="btn ghost" href={`mailto:${identity.email}`}>
              Start a conversation
            </a>
          </div>

          <div className="hero-reach">
            <a href={`mailto:${identity.email}`}>{identity.email}</a>
            <span className="hero-open">
              <i aria-hidden="true" />
              {identity.availability}
            </span>
          </div>
        </div>

        {/* the crawler's origin, and its first five neighbours */}
        <div className="cons" aria-label="Sections">
          <span className="cons-origin" data-spine="hero" aria-hidden="true" />
          {NODES.map((n) => (
            <a
              key={n.href}
              className="cons-node"
              href={n.href}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span data-cons aria-hidden="true" />
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

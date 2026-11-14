import { identity } from "../data/profile";

/* ============================================================
   HERO

   Back to the arrangement that worked: headline top-left, the
   crawler resting on the right with its five navigation nodes
   around it, and the reading copy down in the lower left.

   No CTA buttons — the nodes are the way in, and the email sits
   with the copy for anyone who wants to skip straight to it.
   ============================================================ */

const NODES = [
  { href: "#offer", label: "what I can do", x: 16, y: 18 },
  { href: "#work", label: "work", x: 68, y: 8 },
  { href: "#experience", label: "experience", x: 86, y: 44 },
  { href: "#unshipped", label: "the unshipped", x: 58, y: 74 },
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

          <div className="hero-foot">
            <p className="hero-note">
              I&rsquo;m {identity.name}. I design the thing, then I architect
              what holds it up &mdash; interfaces, retrieval systems, real-time
              backends, mobile. Based in {identity.city}.
            </p>
            <a className="hero-mail" href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
            <p className="hero-open">
              <i aria-hidden="true" />
              {identity.availability}
            </p>
          </div>
        </div>

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

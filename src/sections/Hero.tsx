import { identity } from "../data/profile";

/* ============================================================
   HERO

   Headline top-left. The reading copy is pushed to the right,
   small and set in mono — the opposite weight to the headline.
   The crawler stands underneath, legs splayed out and planted on
   the five navigation nodes.

   Those nodes are the only call to action on this screen: no
   "See the work" button, because the creature's feet already are
   the way in. Start scrolling and it lifts them off.
   ============================================================ */

const FEET = [
  { href: "#offer", label: "what I can do", x: 9, y: 24 },
  { href: "#work", label: "work", x: 37, y: 6 },
  { href: "#experience", label: "experience", x: 71, y: 20 },
  { href: "#cases", label: "case studies", x: 86, y: 63 },
  { href: "#stack", label: "the stack", x: 22, y: 76 },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-top">
        <h1 className="hero-type">
          <span className="ht">Pretty is</span>
          <span className="ht ht-b">the easy half.</span>
        </h1>

        <div className="hero-side">
          <p className="hero-note">
            {identity.name} &mdash; I design the thing, then I architect what
            holds it up. Interfaces, retrieval systems, real-time backends,
            mobile. {identity.city}.
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

      {/* the crawler, standing — its feet are the navigation */}
      <div className="feet" aria-label="Sections">
        <span className="feet-origin" data-spine="hero" aria-hidden="true" />
        {FEET.map((f) => (
          <a
            key={f.href}
            className="foot"
            href={f.href}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            <span data-cons aria-hidden="true" />
            {f.label}
          </a>
        ))}
        <span className="feet-hint">it walks when you scroll</span>
      </div>
    </section>
  );
}

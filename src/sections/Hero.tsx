import { identity } from "../data/profile";

/* ============================================================
   HERO — the type is the layout.

   No right-hand panel, no status card, no product list. Four
   lines of ultra-condensed black at viewport scale, bleeding past
   the container on the left, with the crawler running behind
   them. Everything else is 11px monospace pinned to the bottom
   corners: the scale contrast is roughly 12:1, which is the ratio
   Daksh uses and the thing our page was most obviously missing.
   ============================================================ */

export default function Hero() {
  return (
    <section className="hero" id="top">
      <h1 className="hero-type">
        <span className="ht">I build</span>
        <span className="ht ht-b">software</span>
        <span className="ht">that shows</span>
        <span className="ht ht-b">its work.</span>
      </h1>

      <div className="hero-foot">
        <p className="hero-note mono">
          Full-stack and AI engineer in {identity.city}. Retrieval that
          explains its answers, real-time backends, cross-platform mobile —
          and AI coding agents run inside verification-driven workflows, so
          what ships has been checked rather than assumed.
        </p>

        <div className="hero-meta mono">
          <span className="hero-open">
            <i aria-hidden="true" />
            {identity.availability}
          </span>
          <a href="#offer" className="hero-scroll">
            Scroll <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

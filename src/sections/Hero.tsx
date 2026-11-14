import { identity } from "../data/profile";

/* ============================================================
   HERO — a full-bleed type poster, not a two-column slide.

   LAYOUT LANGUAGE: edge-to-edge. Three lines of the thesis set at
   three different widths on Archivo's variable axis, each indented
   differently, so the block has a ragged left as well as a ragged
   right. Metadata is pushed into the four corners the way a plate
   carries its registration marks. Nothing sits "on the right".

   Contrast of extension: the only chromatic things here are a
   6px dot and one rule. Everything else is the light-dark ladder.
   ============================================================ */

export default function Hero() {
  return (
    <section className="hero k-slate" id="top">
      <div className="wrap hero-in">
        <div className="hero-corners">
          <span className="hero-c tl mono">
            {identity.name} — {identity.role}
          </span>
          <span className="hero-c tr mono">
            {identity.region} · 23°02′N 72°34′E
          </span>
        </div>

        <h1 className="hero-type">
          <span className="ht ht-1">I build</span>
          <span className="ht ht-2">software</span>
          <span className="ht ht-3">that shows</span>
          <span className="ht ht-4">its work.</span>
        </h1>

        <div className="hero-base">
          <p className="hero-intro">{identity.intro}</p>
          <div className="hero-act">
            <a className="pill" href="#work">
              See the work <span aria-hidden="true">→</span>
            </a>
            <a className="link-u" href="#about">
              Who I am
            </a>
            <span className="hero-avail mono">
              <span className="dot" aria-hidden="true" />
              {identity.availability}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

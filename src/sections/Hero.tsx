import type { CSSProperties } from "react";
import { identity } from "../data/profile";

/* ============================================================
   HERO

   Back to the arrangement that worked: headline top-left, the
   crawler resting on the right with its five navigation nodes
   around it, and the reading copy down in the lower left.

   No CTA buttons — the nodes are the way in, and the email sits
   with the copy for anyone who wants to skip straight to it.
   ============================================================ */

/* Two sets of coordinates for one constellation. The phone needs
   its own because a label is nowrap and the desktop arrangement
   hangs two of them off the right edge of a 390px screen — but it
   is the same five points, and the crawler still comes out of them
   the same way. mx/my are chosen so that every label, at its own
   width, stays inside the gutters. */
const NODES = [
  { href: "#offer", label: "what I can do", x: 16, y: 18, mx: 30, my: 11 },
  { href: "#work", label: "work", x: 68, y: 8, mx: 78, my: 30 },
  { href: "#experience", label: "experience", x: 86, y: 44, mx: 72, my: 70 },
  { href: "#unshipped", label: "the unshipped", x: 58, y: 74, mx: 35, my: 90 },
  { href: "#stack", label: "the stack", x: 10, y: 62, mx: 20, my: 51 },
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
          </div>
        </div>

        <div className="cons" aria-label="Sections">
          <span className="cons-origin" data-spine="hero" aria-hidden="true" />
          {NODES.map((n) => (
            <a
              key={n.href}
              className="cons-node"
              href={n.href}
              style={
                {
                  "--x": `${n.x}%`,
                  "--y": `${n.y}%`,
                  "--mx": `${n.mx}%`,
                  "--my": `${n.my}%`,
                } as CSSProperties
              }
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

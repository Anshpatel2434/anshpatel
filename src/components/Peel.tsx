import { useEffect, useRef } from "react";
import type { Project } from "../data/projects";

/* ============================================================
   PEEL — the corner comes up as you scroll past it.

   The site's whole claim is that pretty is the easy half. On the
   two projects that get the room, that stops being a sentence: the
   designed screen is laid over the thing holding it up, and the
   join between them opens as the plate goes by.

   It used to take the whole cover off, travelling a seam right
   across the frame. That read well on its own and cost too much:
   by the end you were looking at a schematic and the product had
   gone, and the claims pinned to the screen were pointing at
   nothing. So it lifts a corner now — the screen stays, in its own
   colours, and what holds it up shows through the fold.

   Nothing to click, nothing to drag. Reading the page is the
   gesture.
   ============================================================ */

export default function Peel({ project: p }: { project: Project }) {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.setProperty("--peel", "1");
      return;
    }

    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      /* The whole lift has to happen while the plate is actually on
         screen: from it settling low in the viewport to it sitting
         high but still in full view. */
      const t = (vh * 0.78 - mid) / (vh * 0.5);
      el.style.setProperty("--peel", String(Math.min(1, Math.max(0, t))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="peel" ref={boxRef}>
      <img className="peel-under" src={p.under} alt="" aria-hidden="true" loading="lazy" />
      {/* the project in its own colours — which is the only reason
          to put a screenshot on a page at all */}
      <img className="peel-over" src={p.coverLive} alt={p.name} loading="lazy" />

      <span className="peel-tag mono" aria-hidden="true">
        what holds it up
      </span>
    </div>
  );
}

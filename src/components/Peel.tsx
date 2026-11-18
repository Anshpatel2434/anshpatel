import { useEffect, useRef } from "react";
import type { Project } from "../data/projects";

/* ============================================================
   PEEL — the cover comes off as you scroll past it.

   The site's whole claim is that pretty is the easy half. On the
   two projects that get the room, that stops being a sentence: the
   designed screen is laid over the thing holding it up, and the
   seam between them travels across the frame as the band goes by.

   You see the screen on the way in, it comes off while the band is
   centred, and what is underneath is what you are left looking at
   on the way out. Nothing to click, nothing to drag — reading the
   page is the gesture.

   Both halves are drawn in the page's two colours, so the reveal
   is about what is there, not about a change of palette.
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
      /* The whole reveal has to happen while the frame is actually
         on screen. Timed off the band being centred, it finished as
         the band was leaving the top — you got the gesture but never
         saw what it uncovered. It now runs from the band settling
         low in the viewport to it sitting high but still in full
         view, so the second half is read, not glimpsed. */
      const t = (vh * 0.74 - mid) / (vh * 0.46);
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
      <img className="peel-over" src={p.coverRest} alt={p.name} loading="lazy" />
      <span className="peel-seam" aria-hidden="true" />

      {/* which half you are looking at, said once */}
      <span className="peel-tag peel-tag-a mono" aria-hidden="true">
        the screen
      </span>
      <span className="peel-tag peel-tag-b mono" aria-hidden="true">
        what holds it up
      </span>
    </div>
  );
}

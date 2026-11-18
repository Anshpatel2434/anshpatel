import { useEffect, useRef } from "react";
import type { Project } from "../data/projects";
import Peel from "./Peel";

/* ============================================================
   SHEET — the project as an annotated plate.

   A screenshot on one side and a paragraph on the other is the
   most common layout a portfolio has, and it leaves the picture
   doing all the work: a pretty screen, and no claim about it that
   anyone has to stand behind.

   So the screen gets smaller and becomes evidence. Three leader
   lines run off it into the open margin, each ending in one short
   claim about the exact thing it is pointing at. The claim is what
   is being said; the screen is what makes it checkable. It is the
   draughtsman's device the rest of the page already speaks in —
   the crawler's line-work, the architecture drawings, the hairline
   rules — finally used on the two projects that matter most.

   The lines draw themselves as the sheet arrives, which is reading
   the page, not clicking it. On a phone the geometry would be a
   lie, so the lines go and the pins stay: numbered on the screen,
   numbered again in the key underneath.
   ============================================================ */

/* Where each claim sits in the margin, and where its line bends.
   One set of numbers for a plate on the left, mirrored for a plate
   on the right — percentages of the whole sheet, so the pin and
   its note share one coordinate space and nothing has to be
   measured at runtime. */
const LAY = {
  left: { plate: [0, 56], note: 63, elbow: 59.5, anchor: "start" },
  right: { plate: [44, 100], note: 37, elbow: 40.5, anchor: "end" },
} as const;

const AT_Y = [17, 48, 79];

type Props = { project: Project; n: number; side: "left" | "right" };

export default function Sheet({ project: p, n, side }: Props) {
  const box = useRef<HTMLDivElement | null>(null);
  const marks = p.marks ?? [];
  const l = LAY[side];

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.setProperty("--draw", "1");
      return;
    }

    /* once, on arrival — a line that redraws every scroll frame
       reads as a fidget, not as a drawing being annotated */
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            el.style.setProperty("--draw", "1");
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={"sheet sheet-" + side} ref={box}>
      {/* the plate itself — the project in its own colours, which is
          the whole point of showing it at all */}
      <div className="sheet-plate">
        <Peel project={p} />

        <ul className="sheet-pins" aria-hidden="true">
          {marks.map((m, i) => (
            <li
              className="sheet-pin"
              key={m.say}
              style={{ left: `${m.at[0]}%`, top: `${m.at[1]}%`, "--i": i } as React.CSSProperties}
            >
              <span>{i + 1}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* the leader lines, drawn across the whole sheet so a pin and
          its claim are in one coordinate space */}
      <svg
        className="sheet-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {marks.map((m, i) => {
          const px = l.plate[0] + (m.at[0] / 100) * (l.plate[1] - l.plate[0]);
          const py = (m.at[1] / 100) * 100;
          const ny = AT_Y[i] ?? 50;
          const d = `M ${px} ${py} L ${l.elbow} ${ny} L ${l.note} ${ny}`;
          const st = { "--i": i } as React.CSSProperties;
          return (
            <g key={m.say}>
              {/* a backing stroke, so the leader reads as drawn over
                  the screen rather than scratched into it */}
              <path className="lead-back" d={d} pathLength={1} style={st} />
              <path className="lead" d={d} pathLength={1} style={st} />
            </g>
          );
        })}
      </svg>

      {/* the claims */}
      <ol className="sheet-notes">
        {marks.map((m, i) => (
          <li
            className="sheet-note"
            key={m.say}
            style={{ top: `${AT_Y[i] ?? 50}%`, "--i": i } as React.CSSProperties}
          >
            <span className="sheet-note-n mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="sheet-note-say">{m.say}</span>
          </li>
        ))}
      </ol>

      <span className="sheet-no d-tight" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </span>
    </div>
  );
}

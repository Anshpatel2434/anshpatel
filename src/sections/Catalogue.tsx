import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { catalogue } from "../data/projects";
import Plate from "../components/Plate";

/* ============================================================
   THE ARCHIVE

   It was a two-column grid with six identical cells, which is the
   most ordinary thing a page can be. Equal footing does not need
   equal geometry — it needs equal treatment. So the plates are
   laid down the page by hand instead: different widths, a
   different side each time, pulled up into each other's rows, each
   one turned a fraction off square the way something looks when it
   was put down rather than placed.

   Every plate gets the same treatment, which is where the equal
   footing actually lives: each holds its real colours back until
   you reach it, takes them on as it crosses the middle of the
   screen, and gives them up again as it leaves. Walking the
   archive lights the plates one at a time. Nothing to click.
   ============================================================ */

/* Where each plate sits on a twelve-column measure, how far down
   its row it is dropped, and how far off square.

   The drop is positive on purpose. Pulling a plate UP into the row
   above gives a better interleave and buries the previous entry's
   own caption under it — which happened on both sides, because any
   two plates a row apart share a column band. Dropping gives the
   same uneven rhythm and cannot collide with anything. */
const LAY = [
  { col: "1 / span 7", drop: 0, tilt: -0.7 },
  { col: "8 / span 5", drop: 7, tilt: 0.8 },
  { col: "2 / span 6", drop: 2, tilt: 0.5 },
  { col: "8 / span 5", drop: 8, tilt: -0.6 },
  { col: "1 / span 6", drop: 1, tilt: 0.7 },
  { col: "7 / span 6", drop: 6, tilt: -0.8 },
];

export default function Catalogue() {
  const cells = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      cells.current.forEach((el) => el?.style.setProperty("--lit", "1"));
      return;
    }

    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      cells.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        /* full at the middle of the screen, out again by the edges */
        const d = Math.abs(mid - vh / 2) / (vh * 0.52);
        el.style.setProperty("--lit", String(Math.min(1, Math.max(0, 1 - d))));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    const settle = window.setTimeout(read, 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="section arch" id="catalogue">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="cat" aria-hidden="true" />
        <ol className="arch-lay">
          {catalogue.map((p, i) => {
            const l = LAY[i % LAY.length];
            return (
              <li
                className="arch-cell"
                key={p.slug}
                ref={(el) => {
                  cells.current[i] = el;
                }}
                style={{
                  gridColumn: l.col,
                  marginTop: `${l.drop}vw`,
                  ["--tilt" as string]: `${l.tilt}deg`,
                }}
              >
                <Link className="arch-hit" to={`/project/${p.slug}`}>
                  <span className="arch-plate">
                    <Plate project={p} />
                  </span>

                  <span className="arch-copy">
                    <span className="arch-meta mono">
                      <i
                        className={p.shipped ? "dot live" : "dot"}
                        aria-hidden="true"
                      />
                      {p.shipped ? "Deployed" : "Never shipped"}
                      {" · "}
                      {p.year}
                    </span>
                    <h2 className="vh">{p.name}</h2>
                    {p.context && (
                      <span className="arch-ctx mono">{p.context}</span>
                    )}
                    <span className="arch-what">{p.blurb}</span>
                    <span className="arch-stack mono">
                      {p.stack
                        .flatMap((g) => g.items)
                        .slice(0, 5)
                        .join(" · ")}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { stages } from "../data/profile";

/* ============================================================
   THE STACK, IN THE ORDER IT RUNS

   A schematic pinned beside a scrolling list of layers. A question
   enters at the top and travels down; whichever layer is crossing
   the middle of the viewport is the live one, and the token moves
   to it. Stages behind it turn solid (already flowed), stages ahead
   stay faint.

   The point of the section, stated plainly in its heading: this is
   every technology Ansh works with, placed at the layer where it
   actually runs — rather than a logo wall with no hierarchy.

   Mobile: the schematic is too tall to pin, so the panel collapses
   to a sticky five-segment progress bar with the same readout.
   ============================================================ */

/* centre of each node box in the 400x572 viewBox */
const TOKEN_POS: [number, number][] = [
  [125, 67],
  [275, 177],
  [125, 287],
  [275, 397],
  [125, 507],
];

export default function Pipeline() {
  const [at, setAt] = useState(0);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let queued = 0;

    const sync = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setAt(best);
    };

    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        sync();
      });
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const jump = (i: number) => {
    const el = stageRefs.current[i];
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - window.innerHeight / 2 + el.offsetHeight / 2;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const live = stages[at];

  return (
    <section className="section pipeline" id="stack">
      <div className="wrap">
        <div className="work-head">
          <h2 className="h-lg d-tight">
            Everything I work with,
            <br />
            and where it runs.
          </h2>
          <p className="note">
            One question, followed from the screen it is typed on to the answer
            that comes back. At every stage, the tools I actually reach for —
            scroll, or tap a stage to jump to it.
          </p>
        </div>

        <div className="pipe-grid">
          <aside className="panel">
            <div className="p-cap">
              Stage {live.n} of 05 · {live.title}
            </div>
            <p
              className="p-say"
              dangerouslySetInnerHTML={{ __html: live.say }}
            />

            {/* desktop: the full schematic */}
            <div className="p-svg">
              <svg viewBox="0 0 400 572" role="img" aria-labelledby="pipe-title">
                <title id="pipe-title">
                  A question travelling through five stages: interface,
                  retrieval, reasoning, real-time, delivery
                </title>

                {[
                  "M125 102 V122 H275 V142",
                  "M275 212 V232 H125 V252",
                  "M125 322 V342 H275 V362",
                  "M275 432 V452 H125 V472",
                ].map((d, i) => (
                  <path
                    key={d}
                    className={"pipe" + (i < at ? " flowed" : "")}
                    d={d}
                  />
                ))}

                {stages.map((s, i) => {
                  const left = i % 2 === 0;
                  const x = left ? 40 : 190;
                  const y = 32 + i * 110;
                  return (
                    <g
                      key={s.n}
                      className={
                        "node" + (i === at ? " on" : i < at ? " done" : "")
                      }
                      role="button"
                      tabIndex={0}
                      onClick={() => jump(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          jump(i);
                        }
                      }}
                    >
                      <rect x={x} y={y} width="170" height="70" rx="9" />
                      <text x={x + 18} y={y + 16}>
                        {s.n} {s.title.toUpperCase()}
                      </text>
                      <Glyph i={i} x={x} y={y} />
                    </g>
                  );
                })}

                <g
                  id="token"
                  transform={`translate(${TOKEN_POS[at][0]},${TOKEN_POS[at][1]})`}
                >
                  <circle className="halo" r="13" />
                  <circle r="5" />
                </g>
              </svg>
            </div>

            {/* mobile: five segments standing in for the schematic */}
            <div className="p-mini" aria-hidden="true">
              {stages.map((s, i) => (
                <button
                  key={s.n}
                  className={
                    "p-seg" + (i === at ? " on" : i < at ? " done" : "")
                  }
                  onClick={() => jump(i)}
                  tabIndex={-1}
                >
                  <span />
                  <em>{s.n}</em>
                </button>
              ))}
            </div>

            <div className="p-foot">
              <span>Scroll, or tap a stage</span>
              <span>
                Stage {live.n} · <b>{live.status}</b>
              </span>
            </div>
          </aside>

          <div className="stages">
            {stages.map((s, i) => (
              <section
                key={s.n}
                className={"stage" + (i === at ? " live" : "")}
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
              >
                <div className="s-n">{s.n} / 05</div>
                <div className="s-title">{s.title}</div>
                <p className="s-blurb">{s.blurb}</p>
                <div className="s-rows">
                  {s.groups.map((g) => (
                    <div className="s-row" key={g.k}>
                      <span className="s-k">{g.k}</span>
                      <span className="chips">
                        {g.items.map((it) => (
                          <span className="chip" key={it}>
                            {it}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* a small technical mark inside each node box */
function Glyph({ i, x, y }: { i: number; x: number; y: number }) {
  const gx = x + 18;
  const gy = y + 28;
  switch (i) {
    case 0:
      return (
        <>
          <path className="g" d={`M${gx} ${gy + 4} h26 M${gx} ${gy + 12} h40 M${gx} ${gy + 20} h18`} />
          <circle className="g" cx={x + 148} cy={y + 20} r="4" />
        </>
      );
    case 1:
      return (
        <>
          <path className="g" d={`M${gx} ${gy + 14} l12 -12 l12 12 l12 -12 l12 12`} />
          <circle className="g" cx={x + 110} cy={y + 44} r="9" />
          <path className="g" d={`M${x + 117} ${y + 51} l8 8`} />
        </>
      );
    case 2:
      return (
        <>
          <circle className="g" cx={gx + 14} cy={gy + 16} r="5" />
          <circle className="g" cx={gx + 42} cy={gy + 2} r="5" />
          <circle className="g" cx={gx + 70} cy={gy + 20} r="5" />
          <circle className="g" cx={gx + 98} cy={gy + 4} r="5" />
          <path
            className="g"
            d={`M${gx + 19} ${gy + 14} L${gx + 37} ${gy + 4} M${gx + 47} ${gy + 3} L${gx + 65} ${gy + 18} M${gx + 75} ${gy + 18} L${gx + 93} ${gy + 6}`}
          />
        </>
      );
    case 3:
      return (
        <>
          <path className="g" d={`M${gx} ${gy + 26} q14 -20 28 0 q14 20 28 0 q14 -20 28 0`} />
          <circle className="g" cx={x + 140} cy={y + 44} r="4" />
          <path
            className="g"
            d={`M${x + 132} ${y + 36} a11 11 0 0 1 0 16 M${x + 126} ${y + 30} a19 19 0 0 1 0 28`}
          />
        </>
      );
    default:
      return (
        <>
          <rect className="g" x={gx} y={gy + 2} width="22" height="34" rx="3" />
          <path className="g" d={`M${gx + 38} ${gy + 10} h40 M${gx + 38} ${gy + 20} h30 M${gx + 38} ${gy + 30} h40`} />
        </>
      );
  }
}

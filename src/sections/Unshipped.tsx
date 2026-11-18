import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { unshipped } from "../data/projects";

/* ============================================================
   THE ONES THAT NEVER SHIPPED

   These have no product to show, so showing them as small entries
   in a list was showing the wrong thing. What they have is a
   question each, and an answer each — that is the entire asset.

   So the question is the section. Set large, in hollow letters:
   stroke, no fill, because it has not been answered yet. As it
   crosses the middle of the screen the letters flood with ink from
   the left, and the answer is written underneath as they fill.

   The same ink the nav uses, so the page has a vocabulary rather
   than a pile of effects. Driven by the scroll, so reading is all
   anyone has to do.
   ============================================================ */

export default function Unshipped() {
  const askRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      askRefs.current.forEach((el) => el?.style.setProperty("--ink", "1"));
      return;
    }

    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      askRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        /* fills across the middle third of the screen, so a question
           is full by the time you have finished reading it */
        const t = (vh * 0.70 - mid) / (vh * 0.34);
        el.style.setProperty("--ink", String(Math.min(1, Math.max(0, t))));
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
    <section className="section asks" id="unshipped">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="cases" aria-hidden="true" />
        <h2 className="h-md d-tight sec-say">{sections.cases.say}</h2>
        <p className="sec-sub asks-sub">{sections.cases.sub}</p>

        <ol className="ask-list">
          {unshipped.map((p, i) => (
            <li className="ask" key={p.slug}>
              <Link className="ask-hit" to={`/project/${p.slug}`}>
                <span className="ask-n mono">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className="ask-q d-tight"
                  ref={(el) => {
                    askRefs.current[i] = el;
                  }}
                >
                  {p.question}
                </h3>

                <div className="ask-ans">
                  <p className="ask-said">{p.answer}</p>
                  <p className="ask-who mono">
                    <span>{p.name}</span>
                    {p.context && <span className="ask-ctx">{p.context}</span>}
                    <span className="ask-stack">
                      {p.stack
                        .flatMap((g) => g.items)
                        .slice(0, 4)
                        .join(" · ")}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

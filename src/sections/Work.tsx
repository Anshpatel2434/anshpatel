import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { featured } from "../data/projects";
import Peel from "../components/Peel";

/* ============================================================
   WORK, ON THE HOME PAGE — the two, and a door.

   Twice now the picture has run the section. First as a banner
   beside a paragraph, then as a plate with claims hung off it on
   leader lines: smaller, but still the thing the whole band was
   built around, and still costing a screen and a half each.

   The order a visitor actually reads in is the name, then what it
   does, and only then — if either of those landed — what it looks
   like. So that is the order it is set in. The name takes the
   full measure and fills with ink as you reach it, the way the
   nav words do. Under it, one tight row: what it is, what is in
   it, and the screen at the end of that row as a thumbnail,
   because a thumbnail is what it is for.

   Two projects used to take 2300px. They take about half that
   now, and the picture is a part of each one rather than the
   point of it.
   ============================================================ */

export default function Work() {
  const names = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      names.current.forEach((el) => el?.style.setProperty("--ink", "1"));
      return;
    }

    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      names.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        /* floods while the name climbs the lower half of the
           screen, so it is full by the time you are reading the
           row underneath it */
        const t = (vh * 0.82 - mid) / (vh * 0.34);
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
    <section className="section work" id="work">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="work" aria-hidden="true" />

        <div className="work-head">
          <div>
            <h2 className="h-lg d-tight sec-say">{sections.work.say}</h2>
            <p className="sec-sub">{sections.work.sub}</p>
          </div>
          <Link className="work-all" to="/work">
            <span className="work-all-n mono">06</span>
            <span className="work-all-say">See all work</span>
            <i aria-hidden="true" />
          </Link>
        </div>

        <ol className="ledes">
          {featured.map((p, i) => (
            <li className="lede" key={p.slug}>
              <p className="lede-k mono">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
                {p.year}
                <i aria-hidden="true" />
                <a href={p.live} target="_blank" rel="noopener noreferrer">
                  {p.liveLabel}
                </a>
              </p>

              <h3
                className="lede-name d-tight"
                ref={(el) => {
                  names.current[i] = el;
                }}
              >
                <Link to={`/project/${p.slug}`}>{p.name}</Link>
              </h3>

              <div className="lede-row">
                <div className="lede-say">
                  <p className="lede-what">{p.blurb}</p>
                  <p className="lede-stack mono">
                    {p.stack
                      .flatMap((g) => g.items)
                      .slice(0, 6)
                      .join(" · ")}
                  </p>
                  <Link className="act" to={`/project/${p.slug}`}>
                    Read how it was built
                  </Link>
                </div>

                <ol className="lede-says">
                  {(p.marks ?? []).map((m, j) => (
                    <li key={m.say}>
                      <span className="mono">{String(j + 1).padStart(2, "0")}</span>
                      {m.say}
                    </li>
                  ))}
                </ol>

                {/* last, and small — you look at it once the name and
                    the claim have earned the curiosity */}
                <Link className="lede-shot" to={`/project/${p.slug}`} tabIndex={-1} aria-hidden="true">
                  <Peel project={p} />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

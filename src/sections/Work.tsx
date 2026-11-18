import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { featured } from "../data/projects";
import Sheet from "../components/Sheet";

/* ============================================================
   WORK, ON THE HOME PAGE — the two, and a door.

   It was a screenshot on one side and a paragraph on the other,
   alternating, which is the layout every portfolio has. The
   picture carried the section and said nothing in particular.

   Each project is a plate now: the name across the full measure,
   the real screen below it at a size that leaves room, and three
   claims hung off leader lines that point at the exact part of the
   product each one is about. The screen stops being the hero and
   becomes the evidence.

   The door to the rest sits up in the heading, not stranded at the
   bottom — a button down there put a dead row between this section
   and the next, and anyone who wanted the full list had to read
   the whole page to find out it existed.
   ============================================================ */

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="work" aria-hidden="true" />

        <div className="work-head">
          <div>
            <h2 className="h-lg d-tight sec-say">{sections.work.say}</h2>
            <p className="sec-sub">{sections.work.sub}</p>
          </div>
          <Link className="work-all mono" to="/work">
            All work
            <i aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="sheets">
        {featured.map((p, i) => (
          <article className="sheet-row" key={p.slug}>
            <div className="wrap">
              <header className="sheet-head">
                <p className="sheet-k mono">
                  Plate {String(i + 1).padStart(2, "0")}
                  <i aria-hidden="true" />
                  {p.year}
                </p>
                <h3 className="sheet-name d-tight">
                  <Link to={`/project/${p.slug}`}>{p.name}</Link>
                </h3>
                <p className="sheet-what">{p.blurb}</p>
              </header>

              <Sheet project={p} n={i + 1} side={i % 2 ? "right" : "left"} />

              <footer className="sheet-foot">
                <span className="sheet-stack mono">
                  {p.stack
                    .flatMap((g) => g.items)
                    .slice(0, 6)
                    .join(" · ")}
                </span>
                <span className="sheet-acts">
                  <Link className="act" to={`/project/${p.slug}`}>
                    Read how it was built
                  </Link>
                  <a
                    className="act-quiet"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {p.liveLabel}
                  </a>
                </span>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

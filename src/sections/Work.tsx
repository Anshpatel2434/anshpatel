import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { featured } from "../data/projects";
import Peel from "../components/Peel";

/* ============================================================
   WORK, ON THE HOME PAGE — the two, and a door.

   LAYOUT LANGUAGE: a full-width band each, alternating which side
   the plate falls on, with an oversized numeral in the margin.
   Only these two. Everything else I have deployed is behind one
   link, because a home page that lists everything has argued
   nothing.
   ============================================================ */

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="work" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.work.say}</h2>
        <p className="sec-sub">{sections.work.sub}</p>
      </div>

      <div className="bands">
        {featured.map((p, i) => (
          <article className={"band" + (i % 2 ? " flip" : "")} key={p.slug}>
            <div className="wrap band-in">
              <div className="band-plate">
                <Peel project={p} />
              </div>

              <div className="band-copy">
                <span className="band-n d-tight" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="band-title">
                  <Link to={`/project/${p.slug}`}>{p.name}</Link>
                </h3>
                <div className="band-stack note">
                  {p.stack
                    .flatMap((g) => g.items)
                    .slice(0, 6)
                    .join(" \u00b7 ")}
                </div>
                <p className="band-what">{p.blurb}</p>
                <ul className="band-detail">
                  {p.build.slice(0, 3).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="band-foot">
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
                  <span className="note band-when">{p.year}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="wrap">
        <Link className="btn work-all" to="/work">
          View all work
        </Link>
      </div>
    </section>
  );
}

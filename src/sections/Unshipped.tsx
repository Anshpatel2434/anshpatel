import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { unshipped } from "../data/projects";

/* ============================================================
   THE ONES THAT NEVER SHIPPED.

   LAYOUT LANGUAGE: the most compressed block on the site — a ruled
   index, no plates, no live links, because there is nothing to go
   and open. The name is the door: it opens the project's own page,
   where the repository button lives. Clicking a project name should
   never fling someone out to GitHub without warning.
   ============================================================ */

export default function Unshipped() {
  return (
    <section className="section cases" id="unshipped">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="cases" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.cases.say}</h2>
        <p className="sec-sub">{sections.cases.sub}</p>

        <ul className="idx2">
          {unshipped.map((p, i) => (
            <li className="idx2-row" key={p.slug}>
              <Link className="idx2-hit" to={`/project/${p.slug}`}>
                <span className="idx2-n mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="idx2-name">{p.name}</span>
                {p.context && (
                  <span className="idx2-ctx mono">{p.context}</span>
                )}
                <span className="idx2-what">{p.blurb}</span>
                <span className="idx2-stack mono">
                  {p.stack
                    .flatMap((g) => g.items)
                    .slice(0, 4)
                    .join(" · ")}
                </span>
                <span className="idx2-go mono" aria-hidden="true">
                  Read it
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

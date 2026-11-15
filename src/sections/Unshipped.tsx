import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { unshipped } from "../data/projects";

/* ============================================================
   THE ONES THAT NEVER SHIPPED.

   LAYOUT LANGUAGE: the heading holds the left, the list runs down
   the right in a column narrower than anything in the work above.
   These sit directly under the work so the connection is obvious
   — same hands, same two halves, no live link — but they do not
   get the full measure, because they did not earn it. A rule, a
   name, a line, the stack. The whole row is the link, so there is
   nothing to call a button.
   ============================================================ */

export default function Unshipped() {
  return (
    <section className="section cases" id="unshipped">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="cases" aria-hidden="true" />
        <div className="cases-in">
          <div className="cases-head">
            <h2 className="h-md d-tight sec-say">{sections.cases.say}</h2>
            <p className="sec-sub cases-sub">{sections.cases.sub}</p>
          </div>

          <ul className="idx2">
            {unshipped.map((p) => (
              <li className="idx2-row" key={p.slug}>
                <Link className="idx2-hit" to={`/project/${p.slug}`}>
                  <span className="idx2-name">{p.name}</span>
                  <span className="idx2-what">{p.blurb}</span>
                  {p.context && (
                    <span className="idx2-ctx mono">{p.context}</span>
                  )}
                  <span className="idx2-stack mono">
                    {p.stack
                      .flatMap((g) => g.items)
                      .slice(0, 4)
                      .join(" \u00b7 ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

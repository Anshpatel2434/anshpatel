import { Link } from "react-router-dom";
import { catalogue } from "../data/projects";
import Plate from "../components/Plate";

/* ============================================================
   THE CATALOGUE — every project, on the same footing.

   The home page argues: two in full bands, the rest behind a
   link. This page does not argue, it records. Same plate size,
   same fields, same order of reading, newest first. Nothing is
   numbered, nothing is promoted, and whether a thing is deployed
   is one line of status rather than a tier.

   That is the whole difference from the home page, and it is the
   point: here, each piece of work is worth the same look.
   ============================================================ */

export default function Catalogue() {
  return (
    <section className="section cat" id="catalogue">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="cat" aria-hidden="true" />
        <ul className="cat-grid">
          {catalogue.map((p) => (
            <li className="cat-cell" key={p.slug}>
              <Link className="cat-hit" to={`/project/${p.slug}`}>
                <Plate project={p} />

                <div className="cat-copy">
                  <h2 className="vh">{p.name}</h2>
                  <p className="cat-meta mono">
                    <span className={p.shipped ? "dot live" : "dot"} aria-hidden="true" />
                    {p.shipped ? "Deployed" : "Never shipped"}
                    {" \u00b7 "}
                    {p.year}
                  </p>
                  {p.context && <p className="cat-ctx mono">{p.context}</p>}
                  <p className="cat-what">{p.blurb}</p>
                  <p className="cat-stack mono">
                    {p.stack
                      .flatMap((g) => g.items)
                      .slice(0, 5)
                      .join(" \u00b7 ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

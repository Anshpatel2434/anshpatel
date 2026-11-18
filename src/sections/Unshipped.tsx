import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { unshipped } from "../data/projects";
import Stamp from "../components/Stamp";

/* ============================================================
   THE ONES THAT NEVER SHIPPED

   These are a footnote to the work above, not a rival to it. Set
   as three huge questions they took more of the home page than
   the two products did, and the project itself disappeared behind
   the writing — you could read the whole block without learning
   that Kavach was a thing that got built.

   So: the name is the heading again, because that is what a
   visitor is being told about. The question it answered drops to
   a line underneath it. Three cards in a row, each one plainly a
   card and plainly a link to the longer version, each stamped
   with what it is. The whole section is now shorter than one of
   the questions used to be.
   ============================================================ */

export default function Unshipped() {
  return (
    <section className="section np" id="unshipped">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="cases" aria-hidden="true" />

        <div className="np-head">
          <h2 className="h-md d-tight sec-say">{sections.cases.say}</h2>
          <p className="sec-sub np-sub">{sections.cases.sub}</p>
        </div>

        <ol className="np-row">
          {unshipped.map((p) => (
            <li className="np-card" key={p.slug}>
              <Link className="np-hit" to={`/project/${p.slug}`}>
                <Stamp>Not shipped</Stamp>

                <h3 className="np-name d-tight">{p.name}</h3>
                {p.context && <p className="np-ctx mono">{p.context}</p>}

                <p className="np-ask">{p.question}</p>

                <div className="chips chips-sm np-chips">
                  {p.stack
                    .flatMap((g) => g.items)
                    .slice(0, 3)
                    .map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                </div>

                <span className="np-go mono">Read the decision</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

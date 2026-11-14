import { Link } from "react-router-dom";
import { caseStudies } from "../data/profile";

/* ============================================================
   CASE STUDIES — a dense index.

   LAYOUT LANGUAGE: a tight tabular list, the most compressed block
   on the page. These were built to answer a question rather than to
   ship, so there is no link and no image; what is worth reading is
   the problem and the choice. A record, not a card.
   ============================================================ */

export default function CaseStudies({ full = false }: { full?: boolean }) {
  const shown = full ? caseStudies : caseStudies.slice(0, 2);
  return (
    <section className="section cases " id="cases">
      <div className="wrap">
        <p className="eyebrow">Case studies</p>
        <div className="sec-head">
          <h2 className="h-lg d-tight">Built, never hosted.</h2>
          <p>
            Things made to answer a question rather than to ship. No live link
            — the problem and the decision are the whole point.
          </p>
        </div>

        <table className="idx">
          <thead>
            <tr>
              <th scope="col" className="mono">
                №
              </th>
              <th scope="col" className="mono">
                Project
              </th>
              <th scope="col" className="mono">
                What it answered
              </th>
              <th scope="col" className="mono">
                Stack
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c, i) => (
              <tr
                key={c.name}
                className={c.needsInput ? "idx-awaiting" : undefined}
              >
                <td className="mono idx-n">{String(i + 1).padStart(2, "0")}</td>
                <td className="idx-name">
                  {c.repo ? (
                    <a href={c.repo} target="_blank" rel="noopener noreferrer">
                      {c.name} ↗
                    </a>
                  ) : (
                    c.name
                  )}
                  {c.needsInput && (
                    <span className="idx-flag mono">waiting on you</span>
                  )}
                </td>
                <td className="idx-what">{c.what}</td>
                <td className="idx-stack">
                  {c.stack.length ? (
                    <span className="chips">
                      {c.stack.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="mono idx-dash">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!full && (
          <Link className="see-all" to="/case-studies">
            <span>See all case studies</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </section>
  );
}

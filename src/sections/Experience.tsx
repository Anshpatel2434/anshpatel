import { roles, awards, education } from "../data/profile";

/* ============================================================
   EXPERIENCE — a dated rail.

   LAYOUT LANGUAGE: a single continuous vertical line down the left
   with dates pinned to it, and the record set to its right. Time is
   the organising axis here, which it is nowhere else on the page.

   Deliberately no screenshots and no plates: this is credential,
   not showcase, and the absence of imagery is the signal.
   ============================================================ */

export default function Experience() {
  return (
    <section className="section exp " id="experience">
      <div className="wrap">
        <p className="eyebrow">Corporate exposure</p>
        <div className="sec-head">
          <h2 className="h-lg d-tight">Hired to ship it.</h2>
          <p>
            Work done inside someone else&rsquo;s team, to someone else&rsquo;s
            deadline — a different skill from building your own thing, and
            worth listing on its own terms.
          </p>
        </div>

        <ol className="rail">
          {roles.map((r) => (
            <li className="rail-item" key={r.company}>
              <div className="rail-date mono">
                <span className="rail-dot" aria-hidden="true" />
                <span className="rail-from">{r.from}</span>
                <span className="rail-to">{r.to}</span>
              </div>
              <div className="rail-body">
                <div className="rail-head">
                  <h3 className="h-sm d-tight">{r.company}</h3>
                  <span className="rail-place mono">{r.place}</span>
                </div>
                <div className="rail-role">{r.title}</div>
                <div className="chips rail-chips">
                  {r.stack.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="rail-points">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}

          {awards.map((a) => (
            <li className="rail-item compact" key={a.name}>
              <div className="rail-date mono">
                <span className="rail-dot hollow" aria-hidden="true" />
                <span className="rail-from">{a.year}</span>
              </div>
              <div className="rail-body">
                <div className="rail-head">
                  <h3 className="rail-small">{a.name}</h3>
                  <span className="rail-result mono">{a.result}</span>
                </div>
                <div className="rail-role">{a.host} · Hackathon</div>
                <p className="rail-note">{a.detail}</p>
                {a.repo && (
                  <a
                    className="arrow-link"
                    href={a.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Repository ↗
                  </a>
                )}
              </div>
            </li>
          ))}

          <li className="rail-item compact" key="edu">
            <div className="rail-date mono">
              <span className="rail-dot hollow" aria-hidden="true" />
              <span className="rail-from">{education.graduating}</span>
            </div>
            <div className="rail-body">
              <div className="rail-head">
                <h3 className="rail-small">{education.school}</h3>
                <span className="rail-result mono">{education.place}</span>
              </div>
              <div className="rail-role">{education.degree}</div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

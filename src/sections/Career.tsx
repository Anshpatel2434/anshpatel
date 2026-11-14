import { roles, awards, education } from "../data/profile";

/* Corporate exposure kept apart from the work.

   The products above are things Ansh owns. These are things he was
   hired to do inside someone else's team, under someone else's
   deadlines — a different kind of evidence, so it gets a different
   treatment: ruled records, no plates, no screenshots. */

export default function Career() {
  return (
    <section className="section career" id="career">
      <div className="wrap">
        <p className="eyebrow">Corporate exposure</p>
        <div className="sec-head">
          <h2 className="h-lg d-tight">Hired to ship it.</h2>
          <p>
            Work done inside someone else&rsquo;s team, to someone else&rsquo;s
            deadline — which is a different skill from building your own thing,
            and worth listing separately.
          </p>
        </div>

        <div className="roles">
          {roles.map((r) => (
            <article className="role" key={r.company}>
              <div className="role-when mono">
                <span className="role-dates">
                  {r.from} — {r.to}
                </span>
                <span className="role-place">{r.place}</span>
              </div>

              <div className="role-body">
                <h3 className="h-sm d-tight">{r.company}</h3>
                <div className="role-title">{r.title}</div>
                <div className="chips role-chips">
                  {r.stack.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="role-points">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="career-foot">
          <div className="awards">
            <p className="eyebrow">Competitions</p>
            {awards.map((a) => (
              <article className="award" key={a.name}>
                <div className="award-top">
                  <h4 className="award-name">{a.name}</h4>
                  <span className="award-result mono">{a.result}</span>
                </div>
                <div className="award-host mono">
                  {a.host} · {a.year}
                </div>
                <p>{a.detail}</p>
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
              </article>
            ))}
          </div>

          <div className="edu">
            <p className="eyebrow">Education</p>
            <h4 className="award-name">{education.school}</h4>
            <div className="award-host mono">{education.place}</div>
            <p>
              {education.degree} — graduating{" "}
              <strong>{education.graduating}</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

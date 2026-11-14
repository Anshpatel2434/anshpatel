import { roles, awards, education, sections } from "../data/profile";

/* ============================================================
   EXPERIENCE

   No timeline rail, no dots, no vertical line — that shape is on
   every portfolio. Each role is a full-width record with the
   company name set at display scale, and everything else in
   columns beneath it, so the row actually uses the width instead
   of leaving half the screen empty.
   ============================================================ */

export default function Experience() {
  return (
    <section className="section exp" id="experience">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="experience" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.experience.say}</h2>
        <p className="sec-sub">{sections.experience.sub}</p>

        <div className="roles">
          {roles.map((r) => (
            <article className="role" key={r.company}>
              <div className="role-name">{r.company}</div>
              <div className="role-cols">
                <div className="role-col">
                  <span className="role-k">Role</span>
                  <p>{r.title}</p>
                  <span className="role-k">When</span>
                  <p>
                    {r.from} &ndash; {r.to}
                  </p>
                  <span className="role-k">Where</span>
                  <p>{r.place}</p>
                </div>
                <div className="role-col wide">
                  <span className="role-k">What it involved</span>
                  <ul>
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className="role-col">
                  <span className="role-k">Built with</span>
                  <div className="run">
                    {r.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="aside-row">
          {awards.map((a) => (
            <div className="aside" key={a.name}>
              <span className="role-k">
                {a.host} &middot; {a.year}
              </span>
              <h3 className="aside-name">{a.name}</h3>
              <p className="aside-res">{a.result}</p>
              <p>{a.detail}</p>
              {a.repo && (
                <a className="act-quiet" href={a.repo} target="_blank" rel="noopener noreferrer">
                  Repository
                </a>
              )}
            </div>
          ))}
          <div className="aside">
            <span className="role-k">{education.place}</span>
            <h3 className="aside-name">{education.school}</h3>
            <p className="aside-res">Graduating {education.graduating}</p>
            <p>{education.degree}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

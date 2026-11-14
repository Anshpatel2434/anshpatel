import { roles, awards, education, sections } from "../data/profile";

/* ============================================================
   EXPERIENCE

   Deliberately the quietest block on the page. Two roles sit side
   by side in two columns, compact, so the section reads as
   supporting evidence rather than the main event — it is not
   worth the full width, and giving it the full width was telling
   the reader it mattered more than the work above it.
   ============================================================ */

export default function Experience() {
  return (
    <section className="section exp" id="experience">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="experience" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.experience.say}</h2>
        <p className="sec-sub">{sections.experience.sub}</p>

        <div className="jobs">
          {roles.map((r) => (
            <article className="job" key={r.company}>
              <header className="job-top">
                <h3 className="job-co">{r.company}</h3>
                <span className="job-when">
                  {r.from} &ndash; {r.to}
                </span>
              </header>
              <p className="job-role">
                {r.title} &middot; {r.place}
              </p>
              <ul className="job-points">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="run job-run">
                {r.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="extras">
          {awards.map((a) => (
            <div className="extra" key={a.name}>
              <span className="extra-k">
                {a.host} &middot; {a.year}
              </span>
              <h4 className="extra-name">{a.name}</h4>
              <p className="extra-res">{a.result}</p>
              {a.repo && (
                <a className="act-quiet" href={a.repo} target="_blank" rel="noopener noreferrer">
                  Repository
                </a>
              )}
            </div>
          ))}
          <div className="extra">
            <span className="extra-k">{education.place}</span>
            <h4 className="extra-name">{education.school}</h4>
            <p className="extra-res">
              {education.degree} &middot; {education.graduating}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

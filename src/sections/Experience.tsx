import { roles, awards, education, sections } from "../data/profile";

/* ============================================================
   EXPERIENCE

   Deliberately the quietest block on the page. Two roles sit side
   by side in two columns, compact, so the section reads as
   supporting evidence rather than the main event — it is not
   worth the full width, and giving it the full width was telling
   the reader it mattered more than the work above it.
   ============================================================ */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* How long it ran, from the two dates already in the data, so the
   two can never disagree. */
function span(from: string, to: string) {
  const read = (v: string) => {
    const [m, y] = v.split(" ");
    const i = MONTHS.indexOf(m);
    return i < 0 ? null : Number(y) * 12 + i;
  };
  const a = read(from);
  const b = read(to);
  if (a === null || b === null) return "";
  const n = b - a + 1;
  return n < 12 ? `${n} months` : `${Math.round((n / 12) * 10) / 10} years`;
}

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
              {/* the dates lead, because when something happened is
                  the first thing anyone reads a job entry for */}
              <p className="job-when mono">
                <time>{r.from}</time>
                <i aria-hidden="true" />
                <time>{r.to}</time>
                <span className="job-span">{span(r.from, r.to)}</span>
              </p>
              <h3 className="job-co">{r.company}</h3>
              <p className="job-role">
                {r.title} &middot; {r.place}
              </p>
              <ul className="job-points">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="job-stack">
                <span className="label">Built with</span>
                <div className="chips">
                  {r.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
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
              {a.stack && a.stack.length > 0 && (
                <div className="chips chips-sm">
                  {a.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}
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

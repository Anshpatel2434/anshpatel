import { roles, awards, education, sections } from "../data/profile";
import Stamp from "../components/Stamp";

/* ============================================================
   EXPERIENCE, IN THE ORDER IT MATTERS

   Putting all of it on one date scale sorted it by when, which
   put two weekend hackathons above both internships — the first
   thing a reader met was the least important thing in the
   section.

   Weight is the answer, not chronology. Three tiers, each
   introduced by what it is and each given the room it deserves:
   paid work inside someone else's team takes the full measure,
   the two sprints share a row, and the degree is one line at the
   bottom, where background belongs.

   The duration survives as a stamp — three months, forty-eight
   hours — which is the useful half of a timeline without a chart
   to read it off.
   ============================================================ */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* "Mon YYYY" as a month index. The data says both "Feb 2025" and
   "June 2026", so it matches on the first three letters. */
function at(v: string) {
  const [m, y] = v.trim().split(/\s+/);
  const i = MONTHS.indexOf((m || "").slice(0, 3));
  return i < 0 ? null : Number(y) * 12 + i;
}

function held(from: string, to: string) {
  const a = at(from);
  const b = at(to);
  if (a === null || b === null) return "";
  const n = b - a + 1;
  return n < 12 ? `${n} months` : `${Math.round((n / 12) * 10) / 10} years`;
}

export default function Experience() {
  /* most recent first, inside the tier that matters most */
  const paid = [...roles].sort((a, b) => (at(b.from) ?? 0) - (at(a.from) ?? 0));

  return (
    <section className="section exp" id="experience">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="experience" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.experience.say}</h2>
        <p className="sec-sub">{sections.experience.sub}</p>

        {/* ---- the main event ---- */}
        <div className="tier">
          <p className="tier-k mono">Paid work, in someone else&rsquo;s team</p>

          <ol className="recs">
            {paid.map((r) => (
              <li className="rec" key={r.company}>
                <div className="rec-top">
                  <p className="rec-when mono">
                    <time>{r.from}</time>
                    <i aria-hidden="true" />
                    <time>{r.to}</time>
                  </p>
                  <Stamp tone="quiet">{held(r.from, r.to)}</Stamp>
                </div>

                <h3 className="rec-name d-tight">{r.company}</h3>
                <p className="rec-role">
                  {r.title} &middot; {r.place}
                </p>

                <ul className="rec-points">
                  {r.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <div className="chips rec-chips">
                  {r.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- the sprints, sharing one row ---- */}
        <div className="tier">
          <p className="tier-k mono">Forty-eight hours, twice</p>

          <ol className="sprints">
            {awards.map((a) => (
              <li className="sprint" key={a.name}>
                <div className="rec-top">
                  <p className="rec-when mono">
                    {a.host} &middot; {a.from}
                  </p>
                  <Stamp>48 hours</Stamp>
                </div>

                <h3 className="sprint-name d-tight">{a.name}</h3>
                <p className="sprint-res">{a.result}</p>

                {a.stack && (
                  <div className="chips chips-sm">
                    {a.stack.slice(0, 4).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* ---- and the background ---- */}
        <p className="tier-edu">
          <span className="mono tier-edu-k">Studying</span>
          <span className="tier-edu-v">
            <strong>{education.school}</strong>
            {education.degree} &middot; {education.place} &middot; graduating{" "}
            {education.graduating}
          </span>
        </p>
      </div>
    </section>
  );
}

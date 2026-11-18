import { useEffect, useRef } from "react";
import { roles, awards, education, sections } from "../data/profile";
import Stamp from "../components/Stamp";

/* ============================================================
   EXPERIENCE, IN THE ORDER IT MATTERS

   Weight, not chronology: a date scale sorted five entries by
   when, which put two weekend hackathons above both internships.

   Each role is a spread now, the way a page out of a work log
   would be set — the account on the left at a readable measure,
   and a docket on the right holding what the account does not
   say in prose: how long, where, and what it was built with. That
   is the half that used to be crammed under the bullets, and it
   is why the right of this section was empty.

   The sprints say outright that they are hackathons, because
   "forty-eight hours" only reads as one if you already knew. And
   the degree stops being a line of text: it is the one entry
   still running, so it is the one entry where a measure is the
   information — a rule showing how much of it is behind me.
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

  const edu = useRef<HTMLDivElement | null>(null);

  /* how far through the degree, as a fraction — the one measure in
     this section that is still moving */
  const start = at(education.started) ?? 0;
  const end = at(education.graduating) ?? 0;
  const now = new Date().getFullYear() * 12 + new Date().getMonth();
  const through =
    end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0;
  /* The data says "graduating June 2026". Whether that is ahead or
     behind depends on the day the page is read, and a progress rule
     that claims a degree is still running after it finished is just
     a wrong fact rendered prettily. So the entry asks. */
  const done = now >= end;

  useEffect(() => {
    const el = edu.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            el.style.setProperty("--through", String(through));
            io.disconnect();
          }
        }),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [through]);

  return (
    <section className="section exp" id="experience">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="experience" aria-hidden="true" />

        <div className="exp-head">
          <div>
            <h2 className="h-lg d-tight sec-say">{sections.experience.say}</h2>
            <p className="sec-sub">{sections.experience.sub}</p>
          </div>
          <p className="exp-count mono">
            {roles.length} internships
            <i aria-hidden="true" />
            {awards.length} hackathons
            <i aria-hidden="true" />1 degree
          </p>
        </div>

        {/* ---- the main event ---- */}
        <div className="tier">
          <p className="tier-k mono">Paid work, in someone else&rsquo;s team</p>

          <ol className="recs">
            {paid.map((r) => (
              <li className="rec" key={r.company}>
                <div className="rec-say">
                  <p className="rec-when mono">
                    <time>{r.from}</time>
                    <i aria-hidden="true" />
                    <time>{r.to}</time>
                  </p>
                  <h3 className="rec-name d-tight">{r.company}</h3>
                  <p className="rec-role">{r.title}</p>

                  <ul className="rec-points">
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* what the account does not say in prose */}
                <aside className="docket">
                  <Stamp tone="quiet">{held(r.from, r.to)}</Stamp>
                  <dl className="docket-rows">
                    <div>
                      <dt className="mono">Where</dt>
                      <dd>{r.place}</dd>
                    </div>
                    <div>
                      <dt className="mono">Built with</dt>
                      <dd>
                        <ul className="docket-stack">
                          {r.stack.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </aside>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- the sprints, sharing one row ---- */}
        <div className="tier">
          <p className="tier-k mono">Hackathons &mdash; forty-eight hours, twice</p>

          <ol className="sprints">
            {awards.map((a) => (
              <li className="sprint" key={a.name}>
                <div className="rec-top">
                  <p className="rec-when mono">
                    {a.host} &middot; {a.from}
                  </p>
                  <Stamp>Hackathon</Stamp>
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

                <p className="sprint-clock mono" aria-hidden="true">
                  48 hours
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- and the one still running ---- */}
        <div className="tier">
          <p className="tier-k mono">{done ? "Where it started" : "Still running"}</p>

          <div className="edu" ref={edu}>
            <div className="edu-say">
              <p className="rec-when mono">
                <time>{education.started}</time>
                <i aria-hidden="true" />
                <time>{education.graduating}</time>
              </p>
              <h3 className="edu-name d-tight">{education.school}</h3>
              <p className="rec-role">
                {education.degree} &middot; {education.place}
              </p>
            </div>

            <div className="edu-measure">
              <Stamp>
                {done ? "Graduated " : "Graduating "}
                {education.graduating}
              </Stamp>
              {/* a measure only while there is something left to
                  measure; afterwards the span is the whole fact */}
              <div className="edu-bar" aria-hidden="true">
                <span />
              </div>
              <p className="edu-read mono" aria-hidden="true">
                {done
                  ? `${Math.round((end - start) / 12)} years, start to finish`
                  : `${Math.round(through * 100)}% behind me`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

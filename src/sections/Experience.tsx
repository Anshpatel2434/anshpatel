import { useEffect, useRef } from "react";
import { roles, awards, education, sections } from "../data/profile";

/* ============================================================
   EXPERIENCE, PUT ON A SCALE

   Everything here is about time, and a list is the one shape that
   throws time away. Two internships, two hackathons and a degree
   were sitting in two unrelated blocks with their dates printed as
   text, which tells you when but never how long, and never how
   they sat against each other.

   So there is one scale across the section — the twenty-three
   months from the first hackathon to graduation — and every entry
   is placed on it at its true start, with a bar at its true width.
   The two internships abut. The hackathons are slivers, because
   that is what forty-eight hours is next to a term. The run to
   graduation is long and empty, which is also true.

   The bars draw themselves as the section arrives. Nothing to
   click: the shape of two years is the first thing you see, and
   the detail is already there underneath it.
   ============================================================ */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* "Mon YYYY" as a month index, so two dates can be subtracted. The
   data says both "Feb 2025" and "June 2026", so it matches on the
   first three letters rather than the whole word. */
function at(v: string) {
  const [m, y] = v.trim().split(/\s+/);
  const i = MONTHS.indexOf((m || "").slice(0, 3));
  return i < 0 ? null : Number(y) * 12 + i;
}

function span(from: string, to: string) {
  const a = at(from);
  const b = at(to);
  if (a === null || b === null) return "";
  const n = b - a + 1;
  return n < 12 ? `${n} months` : `${Math.round((n / 12) * 10) / 10} years`;
}

type Entry = {
  key: string;
  from: string;
  to: string;
  kind: "role" | "award" | "school";
  name: string;
  under: string;
  held: string;
  points?: string[];
  stack?: string[];
};

export default function Experience() {
  const trackRefs = useRef<(HTMLElement | null)[]>([]);

  /* one list, in the order it happened */
  const entries: Entry[] = [
    ...awards.map((a) => ({
      key: a.name,
      from: a.from,
      to: a.to,
      kind: "award" as const,
      name: a.name,
      under: a.result,
      held: "48 hours",
      points: [a.detail],
      stack: a.stack,
    })),
    ...roles.map((r) => ({
      key: r.company,
      from: r.from,
      to: r.to,
      kind: "role" as const,
      name: r.company,
      under: `${r.title} · ${r.place}`,
      held: span(r.from, r.to),
      points: r.bullets,
      stack: r.stack,
    })),
    {
      key: "school",
      from: "Jul 2022",
      to: education.graduating,
      kind: "school" as const,
      name: education.school,
      under: `${education.degree} · ${education.place}`,
      held: `graduating ${education.graduating}`,
    },
  ];

  const work = entries.filter((e) => e.kind !== "school");
  work.sort((a, b) => (at(a.from) ?? 0) - (at(b.from) ?? 0));
  /* the degree runs underneath all of it and ends last, so it is
     listed last rather than sorted in by the year it started */
  const ordered = [...work, ...entries.filter((e) => e.kind === "school")];

  /* The scale starts at the first piece of work, not at the first
     day of college — anchored four years back, everything that
     actually happened bunches into the last tenth of the ruler. */
  const lo = Math.min(...work.map((e) => at(e.from) ?? 0));
  const hi = Math.max(...work.map((e) => at(e.to) ?? 0));
  const span12 = Math.max(1, hi - lo + 1);
  const place = (e: Entry) => {
    const a = Math.max(0, (at(e.from) ?? lo) - lo);
    const b = Math.max(a, (at(e.to) ?? lo) - lo);
    const left = Math.min(100, (a / span12) * 100);
    const width = Math.max(1.1, ((b - a + 1) / span12) * 100);
    return { left, width: Math.min(width, 100 - left) };
  };

  /* Ticks every few months rather than every year: over a span this
     short, year marks give you one line and no sense of pace. */
  const step = Math.max(1, Math.round(span12 / 5));
  const ticks: { k: string; label: string; at: number }[] = [];
  for (let m = lo; m <= hi; m += step) {
    ticks.push({
      k: String(m),
      label: `${MONTHS[m % 12]} ’${String(Math.floor(m / 12)).slice(-2)}`,
      at: ((m - lo) / span12) * 100,
    });
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      trackRefs.current.forEach((el) => el?.style.setProperty("--draw", "1"));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.setProperty("--draw", "1");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    trackRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section exp" id="experience">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="experience" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.experience.say}</h2>
        <p className="sec-sub">{sections.experience.sub}</p>

        {/* the scale itself, named once at the top */}
        <div className="scale" aria-hidden="true">
          {ticks.map((t) => (
            <span className="scale-y mono" key={t.k} style={{ left: `${t.at}%` }}>
              {t.label}
            </span>
          ))}
        </div>

        <ol className="runs">
          {ordered.map((e, i) => {
            const pos = place(e);
            return (
              <li className={"run-i run-" + e.kind} key={e.key}>
                <div
                  className="run-track"
                  ref={(el) => {
                    trackRefs.current[i] = el;
                  }}
                >
                  <span
                    className="run-bar"
                    style={{ left: `${pos.left}%`, width: `${pos.width}%` }}
                  />
                </div>

                <p className="run-when mono">
                  <time>{e.from}</time>
                  {e.to !== e.from && (
                    <>
                      <i aria-hidden="true" />
                      <time>{e.to}</time>
                    </>
                  )}
                  <span className="run-held">{e.held}</span>
                </p>

                <h3 className="run-name">{e.name}</h3>
                <p className="run-under">{e.under}</p>

                {e.points && (
                  <ul className="run-points">
                    {e.points.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}

                {e.stack && e.stack.length > 0 && (
                  <div className="chips run-chips">
                    {e.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

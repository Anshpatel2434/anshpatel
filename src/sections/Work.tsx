import { Link } from "react-router-dom";
import { sections } from "../data/profile";
import { featured, alsoShipped } from "../data/projects";

/* ============================================================
   WORK — everything that is deployed.

   LAYOUT LANGUAGE: the two I would put my name on take a full-width
   band each, alternating which side the plate falls on, with an
   oversized numeral in the margin. Everything else that is live
   sits underneath as a record — a line, not a card, because it is
   evidence rather than an argument.

   The plate holds back: blurred and drained until the pointer is on
   the band, then it resolves. The point is that a screenshot should
   have to be asked for, the same way the work does.
   ============================================================ */

function Plate({
  shot,
  note,
  name,
}: {
  shot?: string;
  note?: string;
  name: string;
}) {
  return (
    <div className="plate">
      {shot ? (
        <img src={shot} alt={`${name}`} loading="lazy" />
      ) : (
        <div className="plate-ph" aria-hidden="true" />
      )}
      <span className="plate-veil" aria-hidden="true" />
      <span className="plate-note mono" aria-hidden="true">
        {shot ? note : `${note} — waiting on you`}
      </span>
    </div>
  );
}

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="work" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.work.say}</h2>
        <p className="sec-sub">{sections.work.sub}</p>
      </div>

      <div className="bands">
        {featured.map((p, i) => (
          <article className={"band" + (i % 2 ? " flip" : "")} key={p.slug}>
            <div className="wrap band-in">
              <div className="band-plate">
                <Plate shot={p.shot} note={p.shotNote} name={p.name} />
              </div>

              <div className="band-copy">
                <span className="band-n d-tight" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="band-title">
                  <Link to={`/project/${p.slug}`}>{p.name}</Link>
                </h3>
                <div className="band-stack note">
                  {p.stack
                    .flatMap((g) => g.items)
                    .slice(0, 6)
                    .join(" · ")}
                </div>
                <p className="band-what">{p.blurb}</p>
                <ul className="band-detail">
                  {p.build.slice(0, 3).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="band-foot">
                  <Link className="act" to={`/project/${p.slug}`}>
                    Read how it was built
                  </Link>
                  <a
                    className="act-quiet"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {p.liveLabel}
                  </a>
                  <span className="note band-when">{p.year}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {alsoShipped.length > 0 && (
        <div className="wrap">
          <p className="label also-label">Also deployed</p>
          <ul className="also">
            {alsoShipped.map((p) => (
              <li className="also-row" key={p.slug}>
                <Link className="also-name" to={`/project/${p.slug}`}>
                  {p.name}
                </Link>
                <span className="also-what">
                  {p.blurb}
                  {p.context && (
                    <span className="also-ctx mono">{p.context}</span>
                  )}
                </span>
                <span className="also-when mono">{p.year}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

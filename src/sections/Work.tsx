import { Link } from "react-router-dom";
import { products, moreWork, sections } from "../data/profile";

/* ============================================================
   WORK — alternating full-width bands.

   LAYOUT LANGUAGE: each product takes the whole width and
   alternates which side the plate falls on, with an oversized
   numeral set in the margin. Nothing is in a grid of equal cards,
   because these are not equal to anything else on the page — they
   are the two things you can actually go and open.
   ============================================================ */

export default function Work({ full = false }: { full?: boolean }) {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <span className="spine-node sn-r" data-spine="work" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.work.say}</h2>
        <p className="sec-sub">{sections.work.sub}</p>
        </div>

      <div className="bands">
        {products.map((p, i) => (
          <article className={"band" + (i % 2 ? " flip" : "")} key={p.name}>
            <div className="wrap band-in">
              <div className="band-plate">
                {p.shot ? (
                  <img src={p.shot} alt={`${p.name} screenshot`} />
                ) : (
                  <div className="placeholder band-ph">
                    <span>
                      waiting on you — screenshot
                      <br />
                      {p.shotNote}
                    </span>
                  </div>
                )}
              </div>

              <div className="band-copy">
                <span className="band-n d-tight" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="band-title">{p.name}</div>
                <div className="band-stack note">{p.stack}</div>
                <p className="band-what">{p.what}</p>
                <ul className="band-detail">
                  {p.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="band-foot">
                  <a
                    className="act"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {p.label}
                  </a>
                  {p.repo ? (
                    <a
                      className="act-quiet"
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source on GitHub
                    </a>
                  ) : (
                    <span className="act-quiet waiting">{p.repoNote}</span>
                  )}
                  <span className="note band-when">{p.when}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="wrap">
        {full ? (
          <div className="more-slots">
            {moreWork.map((m) => (
              <article className="slot" key={m.name}>
                <span className="slot-kind">{m.kind}</span>
                <div className="slot-name">{m.name}</div>
                <p>{m.what}</p>
              </article>
            ))}
          </div>
        ) : (
          <Link className="act see-all" to="/work">
            <span>See all the work</span>
          </Link>
        )}
      </div>
    </section>
  );
}

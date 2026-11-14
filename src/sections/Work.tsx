import { Link } from "react-router-dom";
import { products, moreWork } from "../data/profile";

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
    <section className="section work " id="work">
      <div className="wrap">
        <p className="eyebrow">Live products</p>
        <div className="sec-head">
          <h2 className="h-lg d-tight">Work you can open.</h2>
          <p>
            Both are deployed and running right now. Click through and use
            them — a working link is worth more than a screenshot of one.
          </p>
        </div>
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
                <h3 className="h-md d-tight">{p.name}</h3>
                <div className="band-stack mono">{p.stack}</div>
                <p className="band-what">{p.what}</p>
                <ul className="band-detail">
                  {p.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="band-foot">
                  <a
                    className="pill"
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {p.label} <span aria-hidden="true">↗</span>
                  </a>
                  <span className="mono band-when">{p.when}</span>
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
                <span className="slot-kind mono">{m.kind}</span>
                <h3 className="h-sm d-tight">{m.name}</h3>
                <p>{m.what}</p>
              </article>
            ))}
          </div>
        ) : (
          <Link className="see-all" to="/work">
            <span>See all the work</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </section>
  );
}

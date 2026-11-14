import { products, caseStudies } from "../data/profile";

/* Two blocks, deliberately different in weight.

   PRODUCTS are live and openable, so they get plates — the big
   duotone frames that carry a screenshot.

   CASE STUDIES were built but never hosted. There is no link to
   give, so they get no plate; they are set as typographic records
   instead. That difference is the information: a plate means you
   can go and look at it. */

export default function Work() {
  return (
    <>
      <section className="section work" id="work">
        <div className="wrap">
          <p className="eyebrow">Live products</p>
          <div className="sec-head">
            <h2 className="h-lg d-tight">Work you can open.</h2>
            <p>
              Both are deployed and running right now. Click through and use
              them — a working link is worth more than a screenshot of one.
            </p>
          </div>

          <div className="prod-grid">
            {products.map((p) => (
              <article className="prod" key={p.name}>
                <div className="prod-plate">
                  {p.shot ? (
                    <img src={p.shot} alt={`${p.name} screenshot`} />
                  ) : (
                    <div className="placeholder prod-ph">
                      <span>
                        waiting on you — screenshot
                        <br />
                        {p.shotNote}
                      </span>
                    </div>
                  )}
                </div>

                <div className="prod-meta mono">
                  <span>{p.when}</span>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {p.label} ↗
                  </a>
                </div>

                <h3 className="h-sm d-tight">{p.name}</h3>
                <div className="prod-stack mono">{p.stack}</div>
                <p className="prod-what">{p.what}</p>
                <ul className="prod-detail">
                  {p.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cases" id="cases">
        <div className="wrap">
          <p className="eyebrow">Case studies</p>
          <div className="sec-head">
            <h2 className="h-lg d-tight">Built, never hosted.</h2>
            <p>
              Things I made to answer a question rather than to ship. No live
              link — what is worth reading here is the problem and the choice I
              made about it.
            </p>
          </div>

          <div className="case-list">
            {caseStudies.map((c, i) => (
              <article
                className={"case" + (c.needsInput ? " awaiting" : "")}
                key={c.name}
              >
                <span className="case-n mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="case-body">
                  <div className="case-top">
                    <h3 className="h-sm d-tight">{c.name}</h3>
                    <span className="case-kind mono">{c.kind}</span>
                  </div>
                  <p>{c.what}</p>
                  {c.stack.length > 0 && (
                    <div className="chips">
                      {c.stack.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {c.repo && (
                    <a
                      className="arrow-link case-repo"
                      href={c.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Repository ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

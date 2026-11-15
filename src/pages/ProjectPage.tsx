import { Link, useParams } from "react-router-dom";
import { bySlug } from "../data/projects";
import PageHead from "../components/PageHead";
import Plate from "../components/Plate";

/* ============================================================
   ONE PROJECT.

   The page a project's name opens. It answers three things in
   order — what was wrong, what I decided, what that decision cost
   to build — and only then offers the repository, as a button you
   choose to press rather than a link that fires under your cursor.
   ============================================================ */

export default function ProjectPage() {
  const { slug } = useParams();
  const p = slug ? bySlug(slug) : undefined;

  if (!p) {
    return (
      <PageHead
        eyebrow="Not found"
        title="No project by that name."
        lead="The link is wrong or the project has been renamed. Everything I have built is on the work page."
      />
    );
  }

  return (
    <article className="project">
      <header className="page-head proj-head">
        <div className="wrap">
          <span className="spine-node sn-l" data-spine="proj" aria-hidden="true" />
          <Link className="btn ghost back-home" to="/work">
            All the work
          </Link>
          <p className="label">
            {p.shipped ? "Deployed" : "Never shipped"} · {p.year}
            {p.context ? ` · ${p.context}` : ""}
          </p>
          <h1 className="h-lg d-tight page-title">{p.name}</h1>
          <p className="page-lead say">{p.blurb}</p>

          <div className="proj-acts">
            {p.live && (
              <a
                className="btn"
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open {p.liveLabel}
              </a>
            )}
            <a
              className="btn ghost"
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the source on GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="wrap proj-plate">
        <Plate project={p} wide silent />
      </div>

      <div className="wrap proj-body">
        <section className="proj-part">
          <p className="label">What was wrong</p>
          <p className="proj-prose">{p.problem}</p>
        </section>

        <section className="proj-part">
          <span className="spine-node sn-r" data-spine="proj-why" aria-hidden="true" />
          <p className="label">The decision</p>
          <p className="proj-prose">{p.decision}</p>
        </section>

        <section className="proj-part">
          <p className="label">What that meant building</p>
          <ul className="proj-list">
            {p.build.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="proj-part">
          <span className="spine-node sn-l" data-spine="proj-stack" aria-hidden="true" />
          <p className="label">What it runs on</p>
          <dl className="proj-stack">
            {p.stack.map((g) => (
              <div className="proj-layer" key={g.k}>
                <dt className="mono">{g.k}</dt>
                <dd>
                  {g.items.map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

      </div>
    </article>
  );
}

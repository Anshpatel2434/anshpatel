import { Link } from "react-router-dom";
import { identity, products, stages } from "../data/profile";

/* ============================================================
   HERO

   The previous one was four lines of type on an empty field with
   two links jammed under it. This one fills the screen with things
   that are actually true, arranged as an opening spread:

     left    the thesis, then the introduction, then one CTA
     right   a live status card — where he is, what is running,
             what he is open to — and the two products as openable
             rows, so the first screen already contains proof
     foot    the stack, named, as a single scannable line

   The accent appears exactly twice: the primary CTA and the live
   dot. That is the 10 of 60-30-10.
   ============================================================ */

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-in">
        <div className="hero-main">
          <div className="hero-left">
            <h1 className="hero-type">
              <span className="ht ht-1">I build</span>
              <span className="ht ht-2">software</span>
              <span className="ht ht-3">that shows</span>
              <span className="ht ht-4">its work.</span>
            </h1>

            <p className="hero-intro">{identity.intro}</p>

            <div className="hero-act">
              <a className="pill" href="#offer">
                What I can do for you <span aria-hidden="true">↓</span>
              </a>
              <Link className="link-u" to="/about">
                About me
              </Link>
            </div>
          </div>

          <aside className="hero-side">
            <div className="hero-card">
              <div className="hc-row">
                <span className="hc-k mono">Status</span>
                <span className="hc-v hc-live">
                  <span className="dot" aria-hidden="true" />
                  {identity.availability}
                </span>
              </div>
              <div className="hc-row">
                <span className="hc-k mono">Based</span>
                <span className="hc-v">{identity.region}</span>
              </div>
              <div className="hc-row">
                <span className="hc-k mono">Role</span>
                <span className="hc-v">{identity.role}</span>
              </div>
            </div>

            <div className="hero-live">
              <span className="hl-head mono">Running right now</span>
              {products.map((p) => (
                <a
                  className="hl-row"
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hl-name">{p.name}</span>
                  <span className="hl-note mono">{p.label}</span>
                  <span className="hl-go" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="hero-foot">
          <span className="hf-k mono">The stack</span>
          <span className="hf-v">
            {stages.map((s, i) => (
              <span key={s.n}>
                {i > 0 && <i aria-hidden="true"> / </i>}
                {s.title}
              </span>
            ))}
          </span>
          <a className="hf-more arrow-link" href="#stack">
            All of it
          </a>
        </div>
      </div>
    </section>
  );
}

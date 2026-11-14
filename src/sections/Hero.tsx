import { identity } from "../data/profile";
import HeroArt from "../components/HeroArt";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="hero-thesis">
              <span className="d-wide h-xl">{identity.thesisWide}</span>
              <span className="d-tight h-xl">{identity.thesisTight}</span>
            </h1>

            <p className="hero-intro">{identity.intro}</p>

            <div className="hero-cta">
              <a className="pill" href="#work">
                See the work <span aria-hidden="true">→</span>
              </a>
              <a className="link-u" href="#stack">
                What I work with
              </a>
            </div>

            <p className="hero-avail mono">
              <span className="dot" aria-hidden="true" />
              {identity.availability}
            </p>
          </div>

          <HeroArt />
        </div>
      </div>
    </section>
  );
}

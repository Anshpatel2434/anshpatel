import { about, identity } from "../data/profile";
import MyPic from "../assets/images/mypic.jpg";

/* ============================================================
   ABOUT — the only filled band on the page.

   LAYOUT LANGUAGE: full-bleed tinted band, breaking the white
   ground that every other section shares. Portrait bleeds off the
   left edge; the prose runs in a single measured column; the facts
   sit underneath as a ruled definition list.

   This is the section that answers "who is this person", so it is
   also the one allowed to look least like a product page.
   ============================================================ */

export default function About() {
  return (
    <section className="about k-mauve" id="about">
      <div className="about-band">
        <div className="wrap about-in">
          <figure className="about-pic">
            <img src={MyPic} alt={identity.name} />
            <figcaption className="mono">
              {identity.name} · {identity.city}
            </figcaption>
          </figure>

          <div className="about-text">
            <p className="eyebrow">About</p>
            <p className="about-lead">{about.lead}</p>
            {about.body.map((para) => (
              <p className="about-para" key={para.slice(0, 32)}>
                {para}
              </p>
            ))}
          </div>

          <dl className="about-facts">
            {about.facts.map((f) => (
              <div className="fact" key={f.k}>
                <dt className="mono">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

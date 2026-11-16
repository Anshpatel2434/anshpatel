import { identity, links } from "../data/profile";
import MyPic from "../assets/images/mypic.jpg";
import Mark from "../components/Mark";

/* ============================================================
   THE FOOTER — one block, not two.

   This used to be a contact section and then a separate footer
   under it, with a rule between them. Everything that belongs to
   an ending — the ask, the address, the links, the colophon —
   was split across that rule, so the links read as the last
   thing in the page rather than the first thing in the footer.

   It is one element now. The ask sits at the top of it, the
   colophon along the bottom, and the three links sit in that
   bottom row where footer links belong.
   ============================================================ */

export default function Contact() {
  return (
    <footer className="foot" id="contact">
      <div className="wrap">
        <span className="spine-node sn-c" data-spine="contact" aria-hidden="true" />

        <p className="label">Next</p>

        <div className="foot-ask">
          {/* closes the loop the hero opens: pretty is the easy half */}
          <h2 className="h-lg d-tight foot-line">
            Bring me
            <br />
            both halves.
          </h2>

          <div className="foot-reach">
            <p className="foot-gloss">
              The one that has to look right, and the one that has to be
              right.
            </p>
            <a className="foot-mail" href={`mailto:${identity.email}`}>
              {identity.email}
            </a>
            <p className="foot-where">{identity.region}</p>
          </div>
        </div>

        {/* the colophon: who made it, where else to find him, when */}
        <div className="foot-base">
          <div className="foot-who">
            <img src={MyPic} alt={identity.name} width={52} height={52} />
            <div>
              <strong>{identity.name}</strong>
              <span>{identity.role}</span>
            </div>
          </div>

          <nav className="foot-links" aria-label="Elsewhere">
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              <Mark name="github" />
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              <Mark name="linkedin" />
              LinkedIn
            </a>
            <a href={links.resume} target="_blank" rel="noopener noreferrer">
              <Mark name="cv" />
              R&eacute;sum&eacute;
            </a>
          </nav>

          <span className="foot-note">
            Designed and built by {identity.name} &middot;{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </div>

      {/* the ending. pressed into the stock rather than printed on it. */}
      <div className="watermark" aria-hidden="true">
        ansh patel
      </div>
    </footer>
  );
}

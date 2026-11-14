import { identity, links } from "../data/profile";
import MyPic from "../assets/images/mypic.jpg";

export default function Contact() {
  return (
    <>
      <section className="section contact" id="contact">
        <div className="wrap">
        <span className="spine-node sn-c" data-spine="contact" aria-hidden="true" />
          <p className="label">Next</p>
          <div className="contact-grid">
            <h2 className="h-lg d-tight contact-ask">
              Bring me something
              <br />
              that has to be right.
            </h2>

            <div className="contact-side">
              <a className="contact-mail" href={`mailto:${identity.email}`}>
                {identity.email}
              </a>
              <p className="contact-where">
                {identity.region} · {identity.availability}
              </p>
              <div className="contact-links">
                <a href={links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href={links.resume} target="_blank" rel="noopener noreferrer">
                  Résumé
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap foot-in">
          <div className="foot-who">
            <img src={MyPic} alt={identity.name} width={52} height={52} />
            <div>
              <strong>{identity.name}</strong>
              <span>{identity.role}</span>
            </div>
          </div>
          <span className="foot-note">
            Designed and built by Ansh Patel · {new Date().getFullYear()}
          </span>
        </div>

        {/* the ending. pressed into the stock rather than printed on it. */}
        <div className="watermark" aria-hidden="true">
          ansh patel
        </div>
      </footer>
    </>
  );
}

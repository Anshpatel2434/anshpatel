import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { identity, links } from "../data/profile";

/* every one of these is its own page, not an anchor on the home page */
const ITEMS = [
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/experience", label: "Experience" },
  { to: "/case-studies", label: "Case studies" },
  { to: "/stack", label: "Stack" },
];

function useLocalTime(timezone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timezone]);
  return time;
}

export default function Nav() {
  const time = useLocalTime(identity.timezone);
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link to="/" className="nav-mark d-tight">
          ANSH PATEL
        </Link>

        <nav className="nav-items" aria-label="Sections">
          {ITEMS.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) => (isActive ? "on" : undefined)}
            >
              {i.label}
            </NavLink>
          ))}
          <a href={links.resume} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </nav>

        <div className="nav-right">
          <span className="mono nav-clock">
            {identity.city} {time}
          </span>
          <a className="pill" href="#contact">
            Let&rsquo;s talk
          </a>
          <button
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* mobile sheet — the pill nav has nowhere to go under ~720px,
          so it becomes a full-width drawer instead of shrinking */}
      <div className={"nav-sheet" + (open ? " open" : "")}>
        {ITEMS.map((i) => (
          <Link key={i.to} to={i.to} onClick={() => setOpen(false)}>
            {i.label}
          </Link>
        ))}
        <a href={links.resume} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
        <a href="#contact" onClick={() => setOpen(false)}>
          Contact
        </a>
      </div>
    </header>
  );
}

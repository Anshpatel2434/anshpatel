import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { links } from "../data/profile";

/* ============================================================
   NAV — corner text, not an object.

   Denny and Daksh both do this: a small mark top-left, tiny
   uppercase letter-spaced links top-right, and nothing else. No
   pill, no box, no background, no spine. The nav should be
   findable and otherwise invisible, because on those sites the
   page itself is the thing you are meant to look at.
   ============================================================ */

type Item = { to: string; label: string; hash?: string };

const ITEMS: Item[] = [
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/", label: "Experience", hash: "#experience" },
  { to: "/case-studies", label: "Cases" },
  { to: "/", label: "Stack", hash: "#stack" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goHash = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    setOpen(false);
    const scroll = () =>
      document.querySelector(item.hash!)?.scrollIntoView({ behavior: "smooth" });
    if (pathname !== "/") {
      navigate("/");
      window.setTimeout(scroll, 110);
    } else scroll();
  };

  return (
    <header className="top">
      <Link to="/" className="top-mark">
        Ansh&nbsp;Patel
      </Link>

      <nav className={"top-nav" + (open ? " open" : "")} aria-label="Main">
        {ITEMS.map((i) =>
          i.hash ? (
            <a key={i.label} href={i.hash} onClick={(e) => goHash(e, i)}>
              {i.label}
            </a>
          ) : (
            <NavLink
              key={i.label}
              to={i.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "on" : undefined)}
            >
              {i.label}
            </NavLink>
          )
        )}
        <a
          href={links.resume}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          CV
        </a>
      </nav>

      <button
        className="top-toggle"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
    </header>
  );
}

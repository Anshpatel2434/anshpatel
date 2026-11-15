import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { links } from "../data/profile";
import { scrollPageTo } from "../lib/motion";

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
  { to: "/", label: "Stack", hash: "#stack" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  /* Put the section in the URL and let ScrollToTop act on it. Two
     things moving the page at once is how it ends up halfway. */
  const goHash = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === "/" && hash === item.hash) {
      const el = document.querySelector<HTMLElement>(item.hash);
      if (el) scrollPageTo(el);
      return;
    }
    navigate({ pathname: "/", hash: item.hash });
  };

  return (
    <header className="top">
      <Link to="/" className="top-mark">
        Ansh&nbsp;Patel
      </Link>

      <nav className={"top-nav" + (open ? " open" : "")} aria-label="Main">
        {ITEMS.map((i) =>
          i.hash ? (
            <a
              key={i.label}
              href={i.hash}
              data-own-scroll
              onClick={(e) => goHash(e, i)}
            >
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

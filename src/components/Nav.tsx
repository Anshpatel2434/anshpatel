import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { identity, links } from "../data/profile";
import { scrollPageTo } from "../lib/motion";

/* ============================================================
   NAV — the words fill as you read them.

   There is no bar, no rail, no travelling dot. The indicator is
   the navigation itself: each word that names a section of this
   page fills with ink, left to right, as that section passes the
   middle of the screen. Half-read section, half-inked word.

   So the bar shows three things at once with nothing added to it
   — where you are, how far through it you are, and what is still
   ahead, all of it in the type that was already there. The two
   words that leave the page instead of moving down it, About and
   CV, never fill, which is the truth about them.

   The fill is written straight to the nodes as a custom property.
   React is told nothing at all while you scroll.
   ============================================================ */

type Item = { to: string; label: string; hash?: string };

const ITEMS: Item[] = [
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/", label: "Experience", hash: "#experience" },
  { to: "/", label: "Stack", hash: "#stack" },
];

/* which words are parts of this document rather than exits from it */
const READS: Record<string, string> = {
  Work: "work",
  Experience: "experience",
  Stack: "stack",
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  const wordRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const onHome = pathname === "/";

  /* The panel covers the page, so the page behind it should not
     still be scrolling under the thumb. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    let raf = 0;

    const read = () => {
      raf = 0;
      const y = window.scrollY;
      setLifted(y > 24);

      /* the line you are reading at: the middle of the screen */
      const eye = y + window.innerHeight / 2;

      for (const [label, id] of Object.entries(READS)) {
        const node = wordRefs.current[label];
        if (!node) continue;
        if (!onHome) {
          node.style.setProperty("--f", "0");
          continue;
        }
        const el = document.getElementById(id);
        if (!el) continue;
        const box = el.getBoundingClientRect();
        const top = box.top + y;
        const h = box.height || 1;
        const f = Math.min(1, Math.max(0, (eye - top) / h));
        node.style.setProperty("--f", f.toFixed(4));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    /* sections move when a webfont lands or an image arrives */
    const settle = window.setTimeout(read, 400);
    const ro = new ResizeObserver(read);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, onHome]);

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
    <header className={"top" + (lifted ? " lifted" : "") + (open ? " shown" : "")}>
      <Link to="/" className="top-mark" onClick={() => setOpen(false)}>
        Ansh&nbsp;Patel
      </Link>

      <nav className={"top-nav" + (open ? " open" : "")} aria-label="Main">
        {ITEMS.map((i) =>
          i.hash ? (
            <a
              key={i.label}
              href={i.hash}
              data-own-scroll
              data-reads={READS[i.label] ? "" : undefined}
              ref={(el) => {
                wordRefs.current[i.label] = el;
              }}
              onClick={(e) => goHash(e, i)}
            >
              {i.label}
            </a>
          ) : (
            <NavLink
              key={i.label}
              to={i.to}
              data-reads={READS[i.label] && onHome ? "" : undefined}
              ref={(el) => {
                wordRefs.current[i.label] = el;
              }}
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

        {/* On a phone this sheet is the whole site in one view, so
            it ends with the one thing a visitor might want from it. */}
        <div className="top-foot">
          <a className="top-mail" href={`mailto:${identity.email}`}>
            {identity.email}
          </a>
        </div>
      </nav>

      <button
        className="top-toggle"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="top-toggle-word">{open ? "Close" : "Menu"}</span>
        <span className="top-toggle-bars" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
    </header>
  );
}

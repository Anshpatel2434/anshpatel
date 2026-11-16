import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { identity, links } from "../data/profile";
import { scrollPageTo } from "../lib/motion";

/* ============================================================
   NAV — corner text at the top, a rule once you move.

   It used to blend in difference mode, which was the right answer
   when sections alternated between a parchment and a near-black
   ground: one rule, legible over both, no scroll listener. Those
   alternating grounds were removed a long time ago, so all the
   blend did afterwards was invert the nav against whatever heading
   happened to be passing under it — which is the "merging with the
   text" problem. It is gone.

   In its place: at the top of a page the bar is plain text on
   parchment, because there is nothing behind it. The moment you
   scroll it earns its own ground, so it never sits directly on
   type again — and that ground carries a rule showing how far down
   the document you are, with the section you are currently in
   marked in the list. The bar stops being decoration and starts
   telling you where you are.
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
  const [lifted, setLifted] = useState(false);
  const [here, setHere] = useState("");
  const progRef = useRef<HTMLSpanElement | null>(null);

  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

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

  /* How far down we are. The rule is written straight to the node
     rather than through state, so a scroll does not re-render the
     whole bar sixty times a second. */
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setLifted(y > 24);
      const el = progRef.current;
      if (el) {
        const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        el.style.transform = `scaleX(${p})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* Which section is under the middle of the screen. Only the home
     page has sections to be in. */
  useEffect(() => {
    if (pathname !== "/") {
      setHere("");
      return;
    }
    const targets = ITEMS.filter((i) => i.hash)
      .map((i) => document.getElementById(i.hash!.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (seen.length) setHere("#" + seen[0].target.id);
        else setHere("");
      },
      /* a band across the middle of the viewport: you are "in" the
         section the middle of the screen is looking at */
      { rootMargin: "-48% 0px -48% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

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
              className={here === i.hash ? "on" : undefined}
              aria-current={here === i.hash ? "true" : undefined}
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

        {/* On a phone this sheet is the whole site in one view, so
            it ends with the one thing a visitor might actually want
            from it. */}
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

      {/* how far down the document you are */}
      <span className="top-prog" ref={progRef} aria-hidden="true" />
    </header>
  );
}

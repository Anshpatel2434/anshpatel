import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { identity, links } from "../data/profile";
import { scrollPageTo } from "../lib/motion";

/* ============================================================
   NAV — the bar's edge is the document, drawn to scale.

   A progress bar tells you how far you have come and nothing
   else. This tells you what the page is made of and where you
   are inside it: the hairline along the bottom of the bar is the
   whole document laid end to end, each section marked at its own
   proportional position on it, and the crawler walking that line
   at the point you have reached.

   So the five marks are not evenly spaced — the work is a long
   stretch of this page and the unshipped is a short one, and the
   spacing says so. The bar stops being a list of places and
   becomes a map of this one.

   Everything to do with scrolling is written straight to the
   nodes. React is told only when the section changes.
   ============================================================ */

type Item = { to: string; label: string; hash?: string };

const ITEMS: Item[] = [
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/", label: "Experience", hash: "#experience" },
  { to: "/", label: "Stack", hash: "#stack" },
];

/* the document, in the order you meet it */
const MAP = [
  { id: "offer", label: "what I can do" },
  { id: "work", label: "the work" },
  { id: "unshipped", label: "never shipped" },
  { id: "experience", label: "experience" },
  { id: "stack", label: "the stack" },
];

type Tick = { id: string; label: string; at: number };

/* The creature, at the size of a piece of punctuation. Six legs
   radiating from a body is a star at 14px, not an animal — so this
   is what the big one actually reduces to: the body and its halo,
   with the legs bent under it the way they are when it stands. */
function Walker() {
  return (
    <svg width="26" height="16" viewBox="0 0 26 16" aria-hidden="true" focusable="false">
      <circle cx="13" cy="8" r="7" fill="currentColor" opacity="0.1" />
      <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none">
        <path d="M13 8c-3 0-4.6-1.6-6.2-3.6M13 8c-3.2 0-5 .8-6.8 2.4M13 8c3 0 4.6-1.6 6.2-3.6M13 8c3.2 0 5 .8 6.8 2.4" />
      </g>
      <ellipse cx="13" cy="8" rx="2.4" ry="2.9" fill="currentColor" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [here, setHere] = useState("");
  const [ticks, setTicks] = useState<Tick[]>([]);

  const fillRef = useRef<HTMLSpanElement | null>(null);
  const walkRef = useRef<HTMLSpanElement | null>(null);

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

  /* Where each section falls along the document. Measured, not
     guessed, and measured again whenever the page changes height —
     a webfont landing or an image loading moves every one of them. */
  const measure = useCallback(() => {
    if (!onHome) {
      setTicks([]);
      return;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const next: Tick[] = [];
    for (const m of MAP) {
      const el = document.getElementById(m.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      next.push({ ...m, at: Math.max(0, Math.min(100, (top / max) * 100)) });
    }
    setTicks((prev) =>
      prev.length === next.length &&
      prev.every((p, i) => p.id === next[i].id && Math.abs(p.at - next[i].at) < 0.4)
        ? prev
        : next
    );
  }, [onHome]);

  useEffect(() => {
    const id = window.setTimeout(measure, 280);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    window.addEventListener("load", measure);
    return () => {
      window.clearTimeout(id);
      ro.disconnect();
      window.removeEventListener("load", measure);
    };
  }, [measure]);

  /* How far along the thread the creature has walked. */
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      setLifted(y > 24);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (walkRef.current) walkRef.current.style.left = `${p * 100}%`;
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

  /* Which section the middle of the screen is looking at. */
  useEffect(() => {
    if (!onHome) {
      setHere("");
      return;
    }
    const targets = MAP.map((m) => document.getElementById(m.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!targets.length) return;

    /* The callback reports only what CHANGED, so deciding from the
       entries alone clears the mark whenever one section leaves the
       band while another is still inside it. */
    const inside = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inside.add(e.target.id);
          else inside.delete(e.target.id);
        }
        const first = targets.find((t) => inside.has(t.id));
        setHere(first ? first.id : "");
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [onHome]);

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

  const goTick = (id: string) => {
    const el = document.getElementById(id);
    if (el) scrollPageTo(el);
  };

  const nowLabel = ticks.find((t) => t.id === here)?.label;

  return (
    <header className={"top" + (lifted ? " lifted" : "") + (open ? " shown" : "")}>
      <Link to="/" className="top-mark" onClick={() => setOpen(false)}>
        Ansh&nbsp;Patel
      </Link>

      {/* where you are, named, so the thread never has to be
          deciphered to be useful */}
      <span className="top-now mono" aria-hidden="true">
        {nowLabel || ""}
      </span>

      <nav className={"top-nav" + (open ? " open" : "")} aria-label="Main">
        {ITEMS.map((i) =>
          i.hash ? (
            <a
              key={i.label}
              href={i.hash}
              data-own-scroll
              className={"#" + here === i.hash ? "on" : undefined}
              aria-current={"#" + here === i.hash ? "true" : undefined}
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

      {/* the document, to scale, along the edge of the bar */}
      <div className={"top-thread" + (ticks.length ? " mapped" : "")}>
        <span className="top-thread-fill" ref={fillRef} aria-hidden="true" />
        {ticks.map((t) => (
          <button
            key={t.id}
            type="button"
            className={"top-tick" + (here === t.id ? " on" : "")}
            style={{ left: `${t.at}%` }}
            onClick={() => goTick(t.id)}
            aria-label={`Go to ${t.label}`}
          >
            <span className="top-tick-label mono">{t.label}</span>
          </button>
        ))}
        <span className="top-walker" ref={walkRef} aria-hidden="true">
          <Walker />
        </span>
      </div>
    </header>
  );
}

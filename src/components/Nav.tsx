import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { identity, links } from "../data/profile";

/* ============================================================
   NAV — a vertical rail down the left edge.

   Not a centred pill at the top with a name on one side and a
   button on the other; that is the shape every portfolio uses.
   This runs down the edge like the spine of a book: monogram at
   the top, labels set vertically in the middle reading bottom to
   top, the contact mark at the foot. A hairline fills as you
   scroll, so the rail doubles as a progress indicator.

   It also frees the entire top of the page, which is what lets
   the hero start at the very top of the viewport.

   Under 980px the rail becomes a floating dock at the bottom —
   thumb height, horizontal labels, no rotated text to squint at.
   ============================================================ */

type Item = { to: string; label: string; hash?: string };

/* About, Work and Case studies are pages. Experience and Stack
   live on the home page, so they navigate home and then scroll. */
const ITEMS: Item[] = [
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/", label: "Experience", hash: "#experience" },
  { to: "/case-studies", label: "Case studies" },
  { to: "/", label: "Stack", hash: "#stack" },
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

function useScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let queued = 0;
    const read = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        read();
      });
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", read);
    };
  }, []);
  return pct;
}

export default function Nav() {
  const time = useLocalTime(identity.timezone);
  const progress = useScrollProgress();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* a hash item is "active" only when we are on the home page */
  const isOn = (item: Item) =>
    item.hash ? pathname === "/" : pathname === item.to;

  const goHash = (e: React.MouseEvent, item: Item) => {
    if (!item.hash) return;
    e.preventDefault();
    if (pathname !== "/") {
      navigate("/" + item.hash);
      /* let the home page mount before looking for the section */
      window.setTimeout(() => {
        document.querySelector(item.hash!)?.scrollIntoView({ behavior: "smooth" });
      }, 90);
    } else {
      document.querySelector(item.hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="spine" aria-label="Main">
      <Link to="/" className="spine-mark" aria-label="Home">
        <span className="rm-a">A</span>
        <span className="rm-b">P</span>
      </Link>

      <span className="spine-line" aria-hidden="true">
        <span className="spine-fill" style={{ transform: `scaleY(${progress})` }} />
      </span>

      <ul className="spine-items">
        {ITEMS.map((i) => (
          <li key={i.label}>
            {i.hash ? (
              <a
                href={i.hash}
                onClick={(e) => goHash(e, i)}
                className={isOn(i) ? "soft" : undefined}
              >
                {i.label}
              </a>
            ) : (
              <NavLink
                to={i.to}
                className={({ isActive }) => (isActive ? "on" : undefined)}
              >
                {i.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="spine-foot">
        <span className="spine-time mono">{time}</span>
        <a className="spine-talk" href={`mailto:${identity.email}`}>
          <span>Let&rsquo;s talk</span>
        </a>
        <a
          className="spine-cv mono"
          href={links.resume}
          target="_blank"
          rel="noopener noreferrer"
        >
          CV
        </a>
      </div>
    </nav>
  );
}

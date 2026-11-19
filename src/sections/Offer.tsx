import { useEffect, useRef, useState } from "react";
import { offers, sections } from "../data/profile";

/* ============================================================
   WHAT I CAN DO

   Four labels set at different angles and sizes, overlapping,
   each in its own tint, with the detail opening beside them.

   Two things were wrong with that. Nothing told you the labels
   were worth touching — a visitor scrolled past four big words
   and never learned there was a second half to the section. And
   at full size it took a screen and a half to get through, which
   is a lot of page to spend on four claims.

   So it advances itself: whichever label is at the reading line
   is the one open in the panel, which means scrolling through
   the section shows you every answer in turn and demonstrates
   that the labels do something. Click one and it stops
   advancing — you have taken over, and the page should not argue
   with you about what you are reading.
   ============================================================ */

const TILT = [-4.5, 3.2, -2.1, 5.4, -3.6];
const OFFSET = ["0%", "9%", "3%", "14%", "6%"];

export default function Offer() {
  const [open, setOpen] = useState(0);
  const [pinned, setPinned] = useState(false);
  /* Says what is actually true of this screen. On a phone nothing
     advances on its own, so promising that it will is worse than
     saying nothing. */
  const [hint, setHint] = useState("Pick one to change this");
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const live = offers[open];

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 900px)");
    const say = () =>
      setHint(
        narrow.matches
          ? "Tap one to change this"
          : pinned
            ? "Pick another to change this"
            : "Keep scrolling, or pick one",
      );
    say();
    narrow.addEventListener("change", say);
    return () => narrow.removeEventListener("change", say);
  }, [pinned]);

  useEffect(() => {
    if (pinned) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    /* One column, and the whole section inside one screen: every
       label crosses the reading line within a single flick, so
       advancing on scroll just strobes. Below this width the
       labels wait to be tapped. */
    const narrow = window.matchMedia("(max-width: 900px)");
    if (narrow.matches) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      /* the one closest to the line a person reads on */
      const line = window.innerHeight * 0.46;
      let best = 0;
      let near = Infinity;
      labels.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - line);
        if (d < near) {
          near = d;
          best = i;
        }
      });
      setOpen((was) => (was === best ? was : best));
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
  }, [pinned]);

  return (
    <section className="section offer" id="offer">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="offer" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.offer.say}</h2>
        <p className="sec-sub">{sections.offer.sub}</p>

        <div className="offer-lay">
          <div className="stickers">
            {offers.map((o, i) => (
              <button
                key={o.n}
                type="button"
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className={"sticker s" + (i + 1) + (open === i ? " on" : "")}
                style={{ transform: `rotate(${TILT[i]}deg)`, marginLeft: OFFSET[i] }}
                onClick={() => {
                  setOpen(i);
                  setPinned(true);
                }}
                aria-pressed={open === i}
              >
                {o.title}
              </button>
            ))}
          </div>

          <aside className="offer-panel" aria-live="polite">
            <div className="offer-panel-in" key={live.n}>
              <p className="offer-count mono">
                <span>{String(open + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
                <span className="offer-of">{String(offers.length).padStart(2, "0")}</span>
              </p>

              <p className="offer-say">{live.line}</p>

              <div className="chips chips-sm offer-chips">
                {live.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>

            {/* say that the labels do something, rather than hoping
                somebody tries one */}
            <p className="offer-hint mono">{hint}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

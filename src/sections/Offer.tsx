import { useState } from "react";
import { offers } from "../data/profile";

/* Four lines. Hovering one drops the other three back, widens the
   live one on Archivo's width axis, and unfolds its stack. Not a
   card grid — a typographic index that physically focuses on
   whatever you point at. Tap does the same on touch. */

export default function Offer() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="offer invert bleed" id="offer">
      <div className="wrap">
        <div className="o-head">
          <h2 className="h-lg d-tight">What you can<br />hire me for.</h2>
          <span className="o-count">04 / things</span>
        </div>

        <div className="o-list">
          {offers.map((o, i) => {
            const isOpen = open === i;
            return (
              <div
                key={o.n}
                className={"o-row" + (isOpen ? " open" : "")}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(isOpen ? null : i);
                  }
                }}
              >
                <span className="o-n">{o.n}</span>
                <h3 className="o-title">{o.title}</h3>
                <span className="o-arrow" aria-hidden="true">
                  →
                </span>
                <div className="o-detail">
                  <p>{o.line}</p>
                  <div className="run">
                    {o.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

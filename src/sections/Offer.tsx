import { useState } from "react";
import { offers } from "../data/profile";

/* Four lines. Hovering one drops the other three back, widens the
   live one on Archivo's width axis, and unfolds its stack. Not a
   card grid — a typographic index that physically focuses on
   whatever you point at. Tap does the same on touch. */

export default function Offer() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section offer" id="offer">
      <div className="wrap">
        <p className="eyebrow">What you can hire me for</p>

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
                <span className="o-n mono">{o.n}</span>
                <h3 className="o-title d-tight">{o.title}</h3>
                <span className="o-arrow" aria-hidden="true">
                  →
                </span>
                <div className="o-detail">
                  <p>{o.line}</p>
                  <div className="chips">
                    {o.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
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

import { useState } from "react";
import { offers, sections } from "../data/profile";

/* ============================================================
   WHAT I CAN DO

   Not numbered rows with an arrow on the right — that shape is
   everywhere. Four labels set at different angles and sizes,
   overlapping, each in its own tint.

   The detail used to open underneath them, which pushed the
   answer below the fold and left the whole right half of the
   section empty. It opens beside them now, in the space that was
   doing nothing: you see the claim next to the label you picked
   instead of having to go looking for it, and nothing below moves
   when you change your mind.

   One is always open, so the panel is never an empty box waiting
   to be clicked.
   ============================================================ */

const TILT = [-4.5, 3.2, -2.1, 5.4];
const OFFSET = ["0%", "11%", "4%", "17%"];

export default function Offer() {
  const [open, setOpen] = useState(0);
  const live = offers[open];

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
                className={"sticker s" + (i + 1) + (open === i ? " on" : "")}
                style={{ transform: `rotate(${TILT[i]}deg)`, marginLeft: OFFSET[i] }}
                onClick={() => setOpen(i)}
                aria-pressed={open === i}
              >
                {o.title}
              </button>
            ))}
          </div>

          {/* the answer, in the margin that was empty */}
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
          </aside>
        </div>
      </div>
    </section>
  );
}

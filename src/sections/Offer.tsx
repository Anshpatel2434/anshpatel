import { useState } from "react";
import { offers, sections } from "../data/profile";

/* ============================================================
   WHAT I CAN DO

   Not numbered rows with an arrow on the right — that shape is
   everywhere. Four labels set at different angles and sizes,
   overlapping, each in its own tint. Pick one and its detail
   opens underneath.
   ============================================================ */

const TILT = [-4.5, 3.2, -2.1, 5.4];
const OFFSET = ["0%", "14%", "5%", "22%"];

export default function Offer() {
  const [open, setOpen] = useState<number | null>(0);
  const live = open === null ? null : offers[open];

  return (
    <section className="section offer" id="offer">
      <div className="wrap">
        <span className="spine-node sn-l" data-spine="offer" aria-hidden="true" />
        <h2 className="h-lg d-tight sec-say">{sections.offer.say}</h2>
        <p className="sec-sub">{sections.offer.sub}</p>

        <div className="stickers">
          {offers.map((o, i) => (
            <button
              key={o.n}
              type="button"
              className={"sticker s" + (i + 1) + (open === i ? " on" : "")}
              style={{ transform: `rotate(${TILT[i]}deg)`, marginLeft: OFFSET[i] }}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              {o.title}
            </button>
          ))}
        </div>

        <div className="sticker-out" aria-live="polite">
          {live && (
            <>
              <p className="sticker-say">{live.line}</p>
              <div className="run">
                {live.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

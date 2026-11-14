import { useEffect, useState } from "react";

/* Dev-only. Flips data-palette on <html> so the three palettes can
   be compared on the real site instead of in a mockup. The choice
   is remembered so a reload does not reset it. */

const PALETTES = [
  { id: "vellum", label: "Vellum", note: "warm analogous - parchment, umber, oxblood" },
  { id: "ember", label: "Ember", note: "split-complementary - teal + ember (checkpoint)" },
];

export default function PaletteSwitch() {
  const [active, setActive] = useState("vellum");

  useEffect(() => {
    let saved = "vellum";
    try {
      saved = localStorage.getItem("palette") || "vellum";
    } catch {
      /* private window, blocked storage — the default is fine */
    }
    setActive(saved);
    document.documentElement.dataset.palette = saved;
  }, []);

  const pick = (id: string) => {
    setActive(id);
    document.documentElement.dataset.palette = id;
    try {
      localStorage.setItem("palette", id);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pal-switch" role="group" aria-label="Preview palette">
      <span className="pal-label mono">palette</span>
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          className={"pal-btn" + (active === p.id ? " on" : "")}
          onClick={() => pick(p.id)}
          title={p.note}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

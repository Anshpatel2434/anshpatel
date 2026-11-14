import { useEffect, useRef, useState } from "react";

/* ============================================================
   HERO ART — "the graph, printed twice"

   A knowledge graph of the things Ansh actually builds with,
   silkscreened in Palette B's flat duotone pair: the same drawing
   laid down twice, ultramarine then ochre, deliberately out of
   register. That misregistration is the whole point of the palette
   — two hues at near-identical lightness, so neither plate reads as
   background and neither reads as accent.

   Moving the pointer pulls the plates apart and pushes them back
   together, the way a badly-registered riso print breathes.

   It is art, and it is also the thing he builds: a graph where
   proximity means relatedness. Hovering a node lights its edges.
   ============================================================ */

type Node = {
  id: string;
  x: number;
  y: number;
  r: number;
  label: string;
  dy?: number;
};

const NODES: Node[] = [
  { id: "rag", x: 275, y: 205, r: 37, label: "RAG" },
  { id: "pgv", x: 140, y: 118, r: 24, label: "pgvector" },
  { id: "kg", x: 150, y: 292, r: 26, label: "knowledge graph" },
  { id: "gpt", x: 412, y: 122, r: 25, label: "GPT" },
  { id: "agt", x: 432, y: 278, r: 24, label: "agents" },
  { id: "rct", x: 258, y: 66, r: 19, label: "React", dy: -14 },
  { id: "ts", x: 66, y: 202, r: 17, label: "TypeScript" },
  { id: "ws", x: 300, y: 358, r: 22, label: "WebSockets" },
  { id: "dj", x: 162, y: 398, r: 19, label: "Django" },
  { id: "rn", x: 468, y: 386, r: 19, label: "React Native" },
  { id: "pg", x: 58, y: 330, r: 17, label: "PostgreSQL" },
];

const EDGES: [string, string][] = [
  ["rag", "pgv"],
  ["rag", "kg"],
  ["rag", "gpt"],
  ["rag", "agt"],
  ["rag", "rct"],
  ["rag", "ws"],
  ["pgv", "ts"],
  ["pgv", "pg"],
  ["kg", "pg"],
  ["kg", "dj"],
  ["gpt", "agt"],
  ["agt", "rn"],
  ["ws", "dj"],
  ["rct", "ts"],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

function Plate({
  cls,
  lit,
  onEnter,
  onLeave,
  showLabels,
}: {
  cls: string;
  lit: string | null;
  onEnter?: (id: string) => void;
  onLeave?: () => void;
  showLabels: boolean;
}) {
  return (
    <g className={cls}>
      {EDGES.map(([a, b], i) => {
        const A = byId(a);
        const B = byId(b);
        const on = lit === a || lit === b;
        return (
          <line
            key={a + b}
            className={"ha-edge" + (on ? " on" : "")}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            style={{ animationDelay: `${0.25 + i * 0.045}s` }}
          />
        );
      })}

      {NODES.map((n, i) => {
        const on = lit === n.id;
        return (
          <g
            key={n.id}
            className={"ha-node" + (on ? " on" : "")}
            style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            onPointerEnter={onEnter ? () => onEnter(n.id) : undefined}
            onPointerLeave={onLeave}
          >
            <circle cx={n.x} cy={n.y} r={n.r} className="ha-ring" />
            <circle cx={n.x} cy={n.y} r={2.6} className="ha-dot" />
            {showLabels && (
              <text
                x={n.x}
                y={n.y + n.r + (n.dy ?? 15)}
                className="ha-label"
                textAnchor="middle"
              >
                {n.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function HeroArt() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const [off, setOff] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        setOff({ x: nx * 9, y: ny * 9 });
      });
    };
    const reset = () => setOff({ x: 0, y: 0 });

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div className="hero-art" ref={wrapRef}>
      <svg viewBox="0 0 540 450" role="img" aria-labelledby="ha-title">
        <title id="ha-title">
          A knowledge graph of the technologies Ansh Patel builds with, printed
          as two misregistered colour plates
        </title>

        {/* plate one — ultramarine, pulled one way */}
        <g
          className="ha-plate a"
          style={{ transform: `translate(${-off.x - 3}px, ${-off.y - 2}px)` }}
        >
          <Plate cls="" lit={lit} showLabels={false} />
        </g>

        {/* plate two — ochre, pulled the other. this one takes the
            pointer, carries the labels, and sits on top. */}
        <g
          className="ha-plate b"
          style={{ transform: `translate(${off.x + 3}px, ${off.y + 2}px)` }}
        >
          <Plate
            cls=""
            lit={lit}
            onEnter={setLit}
            onLeave={() => setLit(null)}
            showLabels
          />
        </g>
      </svg>

      <span className="hero-art-cap mono">
        {lit ? byId(lit).label : "the graph, printed twice — point at a node"}
      </span>
    </div>
  );
}

import { useEffect, useRef } from "react";

/* ============================================================
   CRAWLER FIELD

   A fixed canvas sitting behind the whole site. Points drift in a
   2-D projection of vector space; the cursor is the query. Every
   frame it runs a k-nearest-neighbour search and draws the edges.

   It is not decoration — it is pgvector similarity search, rendered.
   That is why it earns a place on a portfolio about retrieval.

   Palette B is used exactly as intended: the points take the
   ultramarine of the flat pair, the query and its edges take the
   ochre. Two hues ~170 deg apart at near-identical lightness, so
   neither dominates.
   ============================================================ */

/* hex approximations of --plate-a / --plate-b / --ink from tokens.css.
   Hardcoded rather than read from CSS so canvas never depends on the
   browser parsing oklch() in a 2-D context. */
const ULTRA = "90, 109, 166";
const OCHRE = "150, 118, 58";
const INK = "28, 32, 56";

type Pt = {
  bx: number;
  by: number;
  x: number;
  y: number;
  phase: number;
  speed: number;
  amp: number;
  r: number;
};

export default function CrawlerField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;

    /* explicitly typed aliases so the narrowing survives into the
       animation closures below, whichever compiler is in use */
    const cv: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let pts: Pt[] = [];
    let raf = 0;
    let scrollShift = 0;

    /* fewer neighbours and fewer points on small screens — the effect
       reads the same and a mid-range phone keeps its frame budget */
    const isSmall = () => window.innerWidth < 760;

    const query = {
      x: -9999,
      y: -9999,
      tx: -9999,
      ty: -9999,
      auto: true,
    };

    function seed() {
      const density = isSmall() ? 13000 : 8200;
      const n = Math.max(40, Math.min(170, Math.round((W * H) / density)));
      pts = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        pts.push({
          bx: x,
          by: y,
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          speed: 0.00018 + Math.random() * 0.00038,
          amp: 6 + Math.random() * 16,
          r: 0.9 + Math.random() * 1.4,
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (!W || document.hidden) return;

      ctx.clearRect(0, 0, W, H);

      /* the field drifts a little as the page scrolls, so it reads as
         one continuous space rather than a sticker on the viewport */
      const sy = scrollShift * 0.035;

      for (const p of pts) {
        p.x = p.bx + Math.cos(t * p.speed + p.phase) * p.amp;
        p.y =
          ((p.by + Math.sin(t * p.speed * 1.27 + p.phase) * p.amp * 0.7 - sy) %
            (H + 120) +
            (H + 120)) %
          (H + 120);
      }

      /* with no pointer, the query roams by itself — the page is never still */
      if (query.auto) {
        const k = t * 0.000115;
        query.tx = W * (0.5 + 0.37 * Math.cos(k) * Math.cos(k * 0.41));
        query.ty = H * (0.5 + 0.32 * Math.sin(k * 1.19));
      }
      query.x += (query.tx - query.x) * 0.07;
      query.y += (query.ty - query.y) * 0.07;

      const K = isSmall() ? 5 : 7;
      const scored = pts.map((p, i) => {
        const dx = p.x - query.x;
        const dy = p.y - query.y;
        return { i, d: dx * dx + dy * dy };
      });
      scored.sort((a, b) => a.d - b.d);
      const near = scored.slice(0, K);
      const hit = new Set(near.map((n) => n.i));

      /* edges from the query to its nearest neighbours */
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${OCHRE}, 0.40)`;
      ctx.beginPath();
      for (const n of near) {
        ctx.moveTo(query.x, query.y);
        ctx.lineTo(pts[n.i].x, pts[n.i].y);
      }
      ctx.stroke();

      /* the cloud */
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.beginPath();
        if (hit.has(i)) {
          ctx.fillStyle = `rgba(${OCHRE}, 0.95)`;
          ctx.arc(p.x, p.y, p.r + 1.3, 0, Math.PI * 2);
        } else {
          ctx.fillStyle =
            i % 6 === 0 ? `rgba(${ULTRA}, 0.42)` : `rgba(${INK}, 0.18)`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      /* the query itself */
      ctx.beginPath();
      ctx.fillStyle = `rgba(${OCHRE}, 0.14)`;
      ctx.arc(query.x, query.y, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${OCHRE}, 1)`;
      ctx.arc(query.x, query.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }

    function onPointer(e: PointerEvent) {
      query.auto = false;
      query.tx = e.clientX;
      query.ty = e.clientY;
    }
    /* on a touch screen there is no hover, so a tap hands the query
       over for a moment and then it goes back to roaming */
    let handBack = 0;
    function onTouch(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      query.auto = false;
      query.tx = touch.clientX;
      query.ty = touch.clientY;
      window.clearTimeout(handBack);
      handBack = window.setTimeout(() => {
        query.auto = true;
      }, 2600);
    }
    function onLeave() {
      query.auto = true;
    }
    function onScroll() {
      scrollShift = window.scrollY;
    }

    resize();
    if (reduced) {
      /* draw one still frame and stop */
      frame(0);
      cancelAnimationFrame(raf);
      return;
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(handBack);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="crawler" aria-hidden="true" />;
}

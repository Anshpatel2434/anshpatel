import { useEffect, useRef } from "react";

/* ============================================================
   CRAWLER FIELD

   A fixed canvas behind the whole site. Points sit in a 2-D
   projection of vector space, and a crawler WALKS it — hopping
   node to node along the nearest edges, pausing, choosing again.
   It never follows the cursor and it never stops; because the
   canvas is fixed, it stays inside the viewport no matter how far
   the page is scrolled.

   What it is actually doing is a graph traversal: at each node it
   scans its nearest neighbours, then takes one of those edges.
   That is retrieval, walking.

   Contrast of extension (Itten) governs how it is drawn. The
   crawler and its live edges are the only chromatic things on the
   screen, and they are tiny; everything else is near-neutral at
   low alpha. The eye goes to the crawler precisely because there
   is so little of it.
   ============================================================ */

/* the four equals from tokens.css, as rgb triplets so canvas never
   has to parse oklch() in a 2-D context */
const HUES = [
  "166, 106, 86", /* clay  */
  "106, 142, 86", /* moss  */
  "86, 132, 166", /* slate */
  "150, 100, 160", /* mauve */
];
const NEUTRAL = "40, 48, 46";

type Pt = {
  bx: number;
  by: number;
  x: number;
  y: number;
  ph: number;
  sp: number;
  am: number;
  r: number;
};

export default function CrawlerField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const cv: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let pts: Pt[] = [];
    let raf = 0;
    let scrollShift = 0;

    const small = () => window.innerWidth < 760;

    /* the walker */
    const walk = {
      from: 0,
      to: 1,
      prev: -1,
      t: 1,
      cross: 1700, /* ms to cross one edge */
      rest: 520, /* ms paused at a node   */
      restUntil: 0,
      x: 0,
      y: 0,
      hue: 2,
      trail: [] as { x: number; y: number }[],
    };

    function seed() {
      const density = small() ? 15000 : 9500;
      const n = Math.max(34, Math.min(140, Math.round((W * H) / density)));
      pts = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        pts.push({
          bx: x,
          by: y,
          x,
          y,
          ph: Math.random() * Math.PI * 2,
          sp: 0.00014 + Math.random() * 0.0003,
          am: 5 + Math.random() * 13,
          r: 0.9 + Math.random() * 1.3,
        });
      }
      walk.from = 0;
      walk.to = Math.min(1, pts.length - 1);
      walk.prev = -1;
      walk.t = 1;
      walk.trail = [];
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

    /* the k nearest points to an index */
    function neighbours(i: number, k: number) {
      const a = pts[i];
      if (!a) return [];
      const scored: { i: number; d: number }[] = [];
      for (let j = 0; j < pts.length; j++) {
        if (j === i) continue;
        const dx = pts[j].x - a.x;
        const dy = pts[j].y - a.y;
        scored.push({ i: j, d: dx * dx + dy * dy });
      }
      scored.sort((p, q) => p.d - q.d);
      return scored.slice(0, k);
    }

    function chooseNext(now: number) {
      const near = neighbours(walk.to, small() ? 4 : 6);
      if (!near.length) return;
      /* prefer not to walk straight back where it came from */
      const options = near.filter((n) => n.i !== walk.prev);
      const pool = options.length ? options : near;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      walk.prev = walk.from;
      walk.from = walk.to;
      walk.to = pick.i;
      walk.t = 0;
      walk.restUntil = now + walk.rest;
      walk.hue = (walk.hue + 1) % HUES.length;
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!W || document.hidden || !pts.length) return;
      ctx.clearRect(0, 0, W, H);

      /* the cloud breathes, and drifts a little with the page so the
         field reads as one space rather than a sticker on the screen */
      const sy = scrollShift * 0.03;
      const span = H + 140;
      for (const p of pts) {
        p.x = p.bx + Math.cos(now * p.sp + p.ph) * p.am;
        p.y =
          (((p.by + Math.sin(now * p.sp * 1.3 + p.ph) * p.am * 0.7 - sy) % span) +
            span) %
          span;
      }

      /* advance the walk */
      if (walk.t >= 1) {
        if (now >= walk.restUntil) chooseNext(now);
      } else {
        walk.t = Math.min(1, walk.t + 16.6 / walk.cross);
      }

      const a = pts[walk.from] ?? pts[0];
      const b = pts[walk.to] ?? pts[0];
      /* ease in and out of each hop, so it steps rather than glides */
      const e =
        walk.t < 0.5 ? 4 * walk.t ** 3 : 1 - Math.pow(-2 * walk.t + 2, 3) / 2;
      walk.x = a.x + (b.x - a.x) * e;
      walk.y = a.y + (b.y - a.y) * e;

      walk.trail.push({ x: walk.x, y: walk.y });
      if (walk.trail.length > 26) walk.trail.shift();

      const hue = HUES[walk.hue];

      /* the path already walked, fading behind it */
      for (let i = 1; i < walk.trail.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${hue}, ${(i / walk.trail.length) * 0.3})`;
        ctx.lineWidth = 1;
        ctx.moveTo(walk.trail[i - 1].x, walk.trail[i - 1].y);
        ctx.lineTo(walk.trail[i].x, walk.trail[i].y);
        ctx.stroke();
      }

      /* the scan: edges to whatever it can currently see */
      const seen = neighbours(walk.to, small() ? 4 : 6);
      const lit = new Set(seen.map((s) => s.i));
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${hue}, 0.22)`;
      ctx.beginPath();
      for (const s of seen) {
        ctx.moveTo(walk.x, walk.y);
        ctx.lineTo(pts[s.i].x, pts[s.i].y);
      }
      ctx.stroke();

      /* the cloud — near-neutral, deliberately quiet */
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.beginPath();
        if (lit.has(i)) {
          ctx.fillStyle = `rgba(${hue}, 0.7)`;
          ctx.arc(p.x, p.y, p.r + 1, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(${NEUTRAL}, 0.17)`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      /* the crawler itself: the smallest thing on screen, and the
         only fully saturated one — contrast of extension, exactly */
      ctx.beginPath();
      ctx.fillStyle = `rgba(${hue}, 0.12)`;
      ctx.arc(walk.x, walk.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${hue}, 1)`;
      ctx.arc(walk.x, walk.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const onScroll = () => {
      scrollShift = window.scrollY;
    };

    resize();
    if (reduced) {
      frame(0);
      cancelAnimationFrame(raf);
      return;
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className="crawler" aria-hidden="true" />;
}

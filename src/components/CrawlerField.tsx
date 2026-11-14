import { useEffect, useRef } from "react";

/* ============================================================
   CRAWLER FIELD

   A fixed canvas behind the whole site. Points sit in a 2-D
   projection of vector space and a crawler travels across it.

   Why the previous version danced in one place: it only ever
   hopped to its NEAREST neighbours, and the nearest neighbours of
   a dense cloud are all within a few pixels. It had nowhere to go.

   This one picks its next target from a RING — far enough to be a
   journey, near enough to still look like a graph edge — refuses
   to revisit anything in its recent memory, and moves on a smooth
   constant-speed curve rather than a fixed per-frame step, so it
   reads the same on any refresh rate.
   ============================================================ */

const NEUTRAL = "40, 46, 56";

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
    const node = ref.current;
    if (!node) return;
    const context = node.getContext("2d");
    if (!context) return;
    const cv: HTMLCanvasElement = node;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let pts: Pt[] = [];
    let raf = 0;
    let scrollShift = 0;
    let last = 0;

    /* the accent, read from the live palette so the crawler always
       matches whichever palette is active */
    let accent = "199, 108, 58";
    function readAccent() {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;color:var(--key)";
      document.body.appendChild(probe);
      const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
      probe.remove();
      if (rgb && rgb.length >= 3) {
        accent = `${Math.round(+rgb[0])}, ${Math.round(+rgb[1])}, ${Math.round(+rgb[2])}`;
      }
    }

    const small = () => window.innerWidth < 760;

    const walk = {
      ax: 0, ay: 0, /* from */
      bx: 0, by: 0, /* to   */
      t: 1,
      dur: 2600, /* ms for one journey, scaled by distance */
      x: 0, y: 0,
      target: 0,
      memory: [] as number[],
      trail: [] as { x: number; y: number }[],
    };

    function seed() {
      /* denser than before — the field looked sparse and the walker
         had too few places to go */
      const density = small() ? 9000 : 5200;
      const n = Math.max(70, Math.min(260, Math.round((W * H) / density)));
      pts = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        pts.push({
          bx: x, by: y, x, y,
          ph: Math.random() * Math.PI * 2,
          sp: 0.00012 + Math.random() * 0.00024,
          am: 4 + Math.random() * 11,
          r: 0.8 + Math.random() * 1.2,
        });
      }
      walk.target = Math.floor(Math.random() * pts.length);
      walk.ax = walk.x = pts[walk.target].x;
      walk.ay = walk.y = pts[walk.target].y;
      walk.bx = walk.ax;
      walk.by = walk.ay;
      walk.t = 1;
      walk.memory = [walk.target];
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

    /* pick the next stop from a ring around the crawler: far enough
       that getting there is a journey, close enough that it still
       reads as following an edge */
    function chooseTarget() {
      const minD = Math.min(W, H) * 0.16;
      const maxD = Math.min(W, H) * 0.52;
      const candidates: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        if (walk.memory.includes(i)) continue;
        const dx = pts[i].x - walk.x;
        const dy = pts[i].y - walk.y;
        const d = Math.hypot(dx, dy);
        if (d > minD && d < maxD) candidates.push(i);
      }
      const pool = candidates.length
        ? candidates
        : pts.map((_, i) => i).filter((i) => i !== walk.target);
      if (!pool.length) return;

      walk.target = pool[Math.floor(Math.random() * pool.length)];
      walk.memory.push(walk.target);
      if (walk.memory.length > 9) walk.memory.shift();

      walk.ax = walk.x;
      walk.ay = walk.y;
      walk.bx = pts[walk.target].x;
      walk.by = pts[walk.target].y;
      walk.t = 0;
      /* constant speed: a longer edge simply takes longer */
      const dist = Math.hypot(walk.bx - walk.ax, walk.by - walk.ay);
      walk.dur = Math.max(1500, Math.min(4800, dist * 9));
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!W || !pts.length || document.hidden) return;

      const dt = last ? Math.min(now - last, 48) : 16.7;
      last = now;

      ctx.clearRect(0, 0, W, H);

      const sy = scrollShift * 0.028;
      const span = H + 160;
      for (const p of pts) {
        p.x = p.bx + Math.cos(now * p.sp + p.ph) * p.am;
        p.y =
          (((p.by + Math.sin(now * p.sp * 1.25 + p.ph) * p.am * 0.65 - sy) % span) +
            span) %
          span;
      }

      /* advance along the current edge, in real time */
      if (walk.t >= 1) chooseTarget();
      else walk.t = Math.min(1, walk.t + dt / walk.dur);

      /* gentle ease, no hard stop at either end — this is what makes
         it glide rather than twitch */
      const e = walk.t * walk.t * (3 - 2 * walk.t);
      walk.x = walk.ax + (walk.bx - walk.ax) * e;
      walk.y = walk.ay + (walk.by - walk.ay) * e;

      walk.trail.push({ x: walk.x, y: walk.y });
      if (walk.trail.length > 54) walk.trail.shift();

      /* the path already travelled */
      ctx.lineWidth = 1;
      for (let i = 1; i < walk.trail.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${accent}, ${(i / walk.trail.length) * 0.26})`;
        ctx.moveTo(walk.trail[i - 1].x, walk.trail[i - 1].y);
        ctx.lineTo(walk.trail[i].x, walk.trail[i].y);
        ctx.stroke();
      }

      /* what it can see from where it is */
      const K = small() ? 4 : 7;
      const scored = pts.map((p, i) => ({
        i,
        d: (p.x - walk.x) ** 2 + (p.y - walk.y) ** 2,
      }));
      scored.sort((a, b) => a.d - b.d);
      const seen = scored.slice(0, K);
      const lit = new Set(seen.map((s) => s.i));

      ctx.strokeStyle = `rgba(${accent}, 0.18)`;
      ctx.beginPath();
      for (const s of seen) {
        ctx.moveTo(walk.x, walk.y);
        ctx.lineTo(pts[s.i].x, pts[s.i].y);
      }
      ctx.stroke();

      /* the cloud, deliberately quiet */
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.beginPath();
        if (lit.has(i)) {
          ctx.fillStyle = `rgba(${accent}, 0.62)`;
          ctx.arc(p.x, p.y, p.r + 0.9, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(${NEUTRAL}, 0.15)`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      /* the crawler — the smallest thing on screen and the only
         fully saturated one. Contrast of extension, in one dot. */
      ctx.beginPath();
      ctx.fillStyle = `rgba(${accent}, 0.11)`;
      ctx.arc(walk.x, walk.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${accent}, 0.95)`;
      ctx.arc(walk.x, walk.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const onScroll = () => {
      scrollShift = window.scrollY;
    };

    readAccent();
    resize();

    if (reduced) {
      frame(0);
      cancelAnimationFrame(raf);
      return;
    }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    /* the dev palette switcher stamps data-palette on <html> */
    const mo = new MutationObserver(readAccent);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-palette"],
    });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className="crawler" aria-hidden="true" />;
}

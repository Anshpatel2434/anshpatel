import { useEffect, useRef } from "react";

/* ============================================================
   THE CRAWLER

   One creature, five legs, walking the whole site.

   AT REST, in the hero, its five legs are splayed out and planted
   on the five navigation nodes. That constellation is not a
   decoration next to the crawler — it IS the crawler, standing
   still with its feet on the links.

   WHEN YOU SCROLL it lifts its feet off the nav and starts
   walking. The body is pulled along the spine (the path through
   every section anchor, driven by scroll position) and the legs
   step: each foot lifts, swings ahead, and plants on one of the
   dots in the field. It is walking on the dots, which is what it
   was always doing — the dots were never decoration either.

   Legs step one at a time, and only when a foot has been left too
   far behind, so the gait emerges from the walking rather than
   being animated on top of it.
   ============================================================ */

type Dot = { bx: number; by: number; x: number; y: number; ph: number; sp: number; am: number; r: number };
type Leg = { fx: number; fy: number; ox: number; oy: number; tx: number; ty: number; t: number; rest: number };
type Anchor = { x: number; y: number; el: HTMLElement };

const LEGS = 5;
const READ = 0.45;          /* the body sits at 45% of viewport height */
const REACH = 150;          /* how far a leg will stretch before stepping */
const STEP_MS = 320;

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
    let dots: Dot[] = [];
    let raf = 0;
    let last = 0;

    let accent = "138, 42, 36";
    let faint = "140, 130, 120";
    function readPalette() {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden";
      document.body.appendChild(probe);
      const pick = (v: string, fb: string) => {
        probe.style.color = `var(${v})`;
        const m = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
        return m && m.length >= 3
          ? `${Math.round(+m[0])}, ${Math.round(+m[1])}, ${Math.round(+m[2])}`
          : fb;
      };
      accent = pick("--key", accent);
      faint = pick("--dim", faint);
      probe.remove();
    }

    function seedDots() {
      const n = Math.max(48, Math.min(170, Math.round((W * H) / 9000)));
      dots = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        dots.push({
          bx: x, by: y, x, y,
          ph: Math.random() * Math.PI * 2,
          sp: 0.00011 + Math.random() * 0.00019,
          am: 4 + Math.random() * 9,
          r: 0.8 + Math.random() * 1.1,
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
      seedDots();
    }

    const read = (sel: string) =>
      Array.from(document.querySelectorAll<HTMLElement>(sel)).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });

    /* ---- the creature ---- */
    let bodyX = 0;
    let bodyY = 0;
    let headAng = Math.PI / 2;
    let started = false;
    const legs: Leg[] = Array.from({ length: LEGS }, () => ({
      fx: 0, fy: 0, ox: 0, oy: 0, tx: 0, ty: 0, t: 1, rest: 0,
    }));

    const smooth = (t: number) => t * t * (3 - 2 * t);

    /* a foothold: the nearest dot in roughly the direction the leg
       already points, biased forward along the direction of travel */
    function pickFoot(i: number, dirX: number, dirY: number) {
      const spread = (i / LEGS) * Math.PI * 2;
      const wantX = bodyX + Math.cos(spread) * REACH * 0.72 + dirX * 90;
      const wantY = bodyY + Math.sin(spread) * REACH * 0.72 + dirY * 90;
      let best = -1;
      let bestD = Infinity;
      for (let k = 0; k < dots.length; k++) {
        const dx = dots[k].x - wantX;
        const dy = dots[k].y - wantY;
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = k; }
      }
      return best >= 0 ? { x: dots[best].x, y: dots[best].y } : { x: wantX, y: wantY };
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!W || document.hidden) return;
      const dt = last ? Math.min(now - last, 48) : 16.7;
      last = now;

      ctx.clearRect(0, 0, W, H);

      /* the field it walks on */
      for (const p of dots) {
        p.x = p.bx + Math.cos(now * p.sp + p.ph) * p.am;
        p.y = p.by + Math.sin(now * p.sp * 1.25 + p.ph) * p.am * 0.6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${faint}, 0.26)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const anchors: Anchor[] = read("[data-spine]");
      if (anchors.length < 2) return;

      /* ---- where the body is on the spine ---- */
      const lineY = H * READ;
      let seg = 0;
      let t = 0;
      if (anchors[0].y >= lineY) { seg = 0; t = 0; }
      else if (anchors[anchors.length - 1].y <= lineY) { seg = anchors.length - 2; t = 1; }
      else {
        for (let i = 0; i < anchors.length - 1; i++) {
          if (anchors[i].y <= lineY && anchors[i + 1].y >= lineY) {
            seg = i;
            const span = anchors[i + 1].y - anchors[i].y;
            t = span === 0 ? 0 : (lineY - anchors[i].y) / span;
            break;
          }
        }
      }
      t = Math.min(1, Math.max(0, t));
      const A = anchors[seg];
      const B = anchors[seg + 1];
      const e = smooth(t);
      const tx = A.x + (B.x - A.x) * e;
      const ty = A.y + (B.y - A.y) * e;

      const px = bodyX;
      const py = bodyY;
      if (!started) { bodyX = tx; bodyY = ty; started = true; }
      else {
        bodyX += (tx - bodyX) * 0.11;
        bodyY += (ty - bodyY) * 0.11;
      }
      const vx = bodyX - px;
      const vy = bodyY - py;
      const speed = Math.hypot(vx, vy);
      if (speed > 0.15) headAng = Math.atan2(vy, vx);
      const dirX = speed > 0.01 ? vx / speed : 0;
      const dirY = speed > 0.01 ? vy / speed : 1;

      /* ---- the path ---- */
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${faint}, 0.3)`;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(bodyX, bodyY);
      ctx.lineTo(B.x, B.y);
      for (let i = seg + 1; i < anchors.length - 1; i++) ctx.lineTo(anchors[i + 1].x, anchors[i + 1].y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = `rgba(${accent}, 0.42)`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(anchors[0].x, anchors[0].y);
      for (let i = 1; i <= seg; i++) ctx.lineTo(anchors[i].x, anchors[i].y);
      ctx.lineTo(bodyX, bodyY);
      ctx.stroke();

      anchors.forEach((a, i) => {
        ctx.beginPath();
        ctx.lineWidth = 1.3;
        if (i <= seg) {
          ctx.fillStyle = `rgba(${accent}, 0.85)`;
          ctx.arc(a.x, a.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(${faint}, 0.55)`;
          ctx.arc(a.x, a.y, 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        a.el.dataset.live = i === seg ? "1" : "0";
      });

      /* ---- the legs ----
         In the hero they are planted on the nav nodes. Past it they
         step onto dots, one leg at a time. */
      const navs = read("[data-cons]");
      const planted = seg === 0 && t < 0.12 && navs.length >= LEGS;

      let stepping = legs.some((l) => l.t < 1);
      for (let i = 0; i < LEGS; i++) {
        const leg = legs[i];

        if (planted) {
          const n = navs[i % navs.length];
          if (leg.t >= 1) { leg.fx += (n.x - leg.fx) * 0.18; leg.fy += (n.y - leg.fy) * 0.18; }
          if (!leg.fx && !leg.fy) { leg.fx = n.x; leg.fy = n.y; }
        }

        if (leg.t < 1) {
          leg.t = Math.min(1, leg.t + dt / STEP_MS);
          const s = smooth(leg.t);
          const lift = Math.sin(leg.t * Math.PI) * 16;
          leg.fx = leg.ox + (leg.tx - leg.ox) * s;
          leg.fy = leg.oy + (leg.ty - leg.oy) * s - lift;
        } else if (!planted) {
          leg.rest -= dt;
          const far = Math.hypot(leg.fx - bodyX, leg.fy - bodyY);
          /* one leg steps at a time, and only once it is trailing */
          if (!stepping && leg.rest <= 0 && far > REACH) {
            const f = pickFoot(i, dirX, dirY);
            leg.ox = leg.fx; leg.oy = leg.fy;
            leg.tx = f.x; leg.ty = f.y;
            leg.t = 0;
            leg.rest = 90;
            stepping = true;
          }
        }
      }

      /* draw the legs: body -> knee -> foot, the knee kicked out
         perpendicular so the limb reads as jointed */
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 0; i < LEGS; i++) {
        const leg = legs[i];
        if (!leg.fx && !leg.fy) continue;
        const mx = (bodyX + leg.fx) / 2;
        const my = (bodyY + leg.fy) / 2;
        const nx = -(leg.fy - bodyY);
        const ny = leg.fx - bodyX;
        const nl = Math.hypot(nx, ny) || 1;
        const bend = 15 + (i % 2 === 0 ? 5 : -9);
        const kx = mx + (nx / nl) * bend;
        const ky = my + (ny / nl) * bend - 9;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${accent}, ${leg.t < 1 ? 0.55 : 0.78})`;
        ctx.lineWidth = 1.15;
        ctx.moveTo(bodyX, bodyY);
        ctx.quadraticCurveTo(kx, ky, leg.fx, leg.fy);
        ctx.stroke();

        /* the foot */
        ctx.beginPath();
        ctx.fillStyle = `rgba(${accent}, ${leg.t < 1 ? 0.5 : 0.9})`;
        ctx.arc(leg.fx, leg.fy, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ---- the body ---- */
      const bob = Math.sin(now * 0.0022) * 1.1;
      ctx.save();
      ctx.translate(bodyX, bodyY + bob);
      ctx.rotate(headAng + Math.PI / 2);
      ctx.fillStyle = `rgba(${accent}, 0.1)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${accent}, 1)`;
      ctx.beginPath();
      ctx.ellipse(0, 1.6, 3.4, 4.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -3.4, 2.2, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    readPalette();
    resize();
    if (reduced) { frame(0); cancelAnimationFrame(raf); return; }

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    const mo = new MutationObserver(readPalette);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="crawler" aria-hidden="true" />;
}

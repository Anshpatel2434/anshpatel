import { useEffect, useRef } from "react";

/* ============================================================
   THE SPINE

   The crawler no longer wanders. It is the connective tissue of
   the whole document: one continuous line that travels from the
   hero down through every section in order, driven by scroll.

   - BEHIND it the trail is drawn solid: the path you have already
     come down.
   - AHEAD of it the path sits faint: where it is about to take
     you. That is the "what to read next".
   - ON ARRIVAL at a section's anchor that section lights up.
     Sections never start — the crawler arrives at them. There are
     no seams because there are no section beginnings.
   - IN THE HERO it rests at its origin and draws an edge to each
     navigation node, so the first thing you see is the first move
     of the walk.

   Anchors are real DOM elements carrying `data-spine`, so the path
   follows the actual layout at any viewport size.
   ============================================================ */

type Pt = { bx: number; by: number; x: number; y: number; ph: number; sp: number; am: number; r: number };
type Anchor = { x: number; y: number; el: HTMLElement };

/* the line is read at 45% of the viewport height — slightly above
   centre, which is where the eye naturally sits when scanning */
const READ = 0.45;

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
    let dust: Pt[] = [];
    let raf = 0;

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

    function seedDust() {
      const n = Math.max(40, Math.min(150, Math.round((W * H) / 11000)));
      dust = [];
      for (let i = 0; i < n; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        dust.push({
          bx: x, by: y, x, y,
          ph: Math.random() * Math.PI * 2,
          sp: 0.00011 + Math.random() * 0.0002,
          am: 4 + Math.random() * 10,
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
      seedDust();
    }

    /* every anchor's position, in viewport space, this frame */
    function readAnchors(): Anchor[] {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-spine]")
      );
      return els.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    }

    function readNavNodes() {
      return Array.from(document.querySelectorAll<HTMLElement>("[data-cons]")).map(
        (el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
      );
    }

    const smooth = (t: number) => t * t * (3 - 2 * t);
    let curX = 0;
    let curY = 0;
    let prevX = 0;
    let prevY = 0;
    let heading = Math.PI / 2;
    let gait = 0;
    let started = false;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!W || document.hidden) return;

      ctx.clearRect(0, 0, W, H);

      /* the dust: quiet, never the subject */
      for (const p of dust) {
        p.x = p.bx + Math.cos(now * p.sp + p.ph) * p.am;
        p.y = p.by + Math.sin(now * p.sp * 1.25 + p.ph) * p.am * 0.6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${faint}, 0.26)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const anchors = readAnchors();
      if (anchors.length < 2) return;

      /* ---- where is the crawler on the path right now? ---- */
      const line = H * READ;
      let seg = 0;
      let t = 0;
      if (anchors[0].y >= line) {
        seg = 0;
        t = 0;
      } else if (anchors[anchors.length - 1].y <= line) {
        seg = anchors.length - 2;
        t = 1;
      } else {
        for (let i = 0; i < anchors.length - 1; i++) {
          const a = anchors[i];
          const b = anchors[i + 1];
          if (a.y <= line && b.y >= line) {
            seg = i;
            const span = b.y - a.y;
            t = span === 0 ? 0 : (line - a.y) / span;
            break;
          }
        }
      }
      t = Math.min(1, Math.max(0, t));
      const e = smooth(t);
      const A = anchors[seg];
      const B = anchors[seg + 1];
      const tx = A.x + (B.x - A.x) * e;
      const ty = A.y + (B.y - A.y) * e;

      /* a little lag so the travel feels like movement, not a readout */
      if (!started) {
        curX = prevX = tx;
        curY = prevY = ty;
        started = true;
      } else {
        curX += (tx - curX) * 0.12;
        curY += (ty - curY) * 0.12;
      }

      /* ---- the path ahead: faint, so you can see where it goes ---- */
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${faint}, 0.34)`;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(B.x, B.y);
      for (let i = seg + 1; i < anchors.length - 1; i++) {
        ctx.lineTo(anchors[i + 1].x, anchors[i + 1].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      /* ---- the trail behind: solid, the path already walked ---- */
      ctx.strokeStyle = `rgba(${accent}, 0.5)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(anchors[0].x, anchors[0].y);
      for (let i = 1; i <= seg; i++) ctx.lineTo(anchors[i].x, anchors[i].y);
      ctx.lineTo(curX, curY);
      ctx.stroke();

      /* ---- the anchors themselves ---- */
      anchors.forEach((a, i) => {
        const passed = i <= seg;
        const here = i === seg && t < 0.5;
        ctx.beginPath();
        ctx.lineWidth = 1.4;
        if (passed) {
          ctx.fillStyle = `rgba(${accent}, 0.9)`;
          ctx.arc(a.x, a.y, here ? 5 : 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(${faint}, 0.6)`;
          ctx.arc(a.x, a.y, 3.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        /* tell the DOM which section is live so headings can respond */
        a.el.dataset.live = i === seg ? "1" : "0";
      });

      /* ---- in the hero, the nav constellation ---- */
      if (seg === 0 && t < 0.9) {
        const nodes = readNavNodes();
        const fade = 1 - t / 0.9;
        ctx.strokeStyle = `rgba(${accent}, ${0.3 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const n of nodes) {
          ctx.moveTo(curX, curY);
          ctx.lineTo(n.x, n.y);
        }
        ctx.stroke();
        for (const n of nodes) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${accent}, ${0.75 * fade})`;
          ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ---- the crawler itself ----
         Eight legs on a gait cycle, the body turned to face the way
         it is going. The gait speeds up with travel and idles to a
         slow breath when the page is still, so it always reads as
         alive rather than as a marker parked on a line. */
      const dx = curX - prevX;
      const dy = curY - prevY;
      const speed = Math.hypot(dx, dy);
      prevX = curX;
      prevY = curY;

      if (speed > 0.12) heading = Math.atan2(dy, dx);
      /* step faster the faster it travels; never fully stop */
      gait += 0.055 + Math.min(speed * 0.16, 0.42);

      const scale = 1 + Math.min(speed * 0.012, 0.22);
      const bob = Math.sin(now * 0.0021) * 1.1;

      ctx.save();
      ctx.translate(curX, curY + bob);
      ctx.rotate(heading + Math.PI / 2);
      ctx.scale(scale, scale);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      /* legs: four a side, each a two-segment limb with a knee.
         Opposite sides are half a cycle apart, which is what makes
         it read as walking rather than twitching. */
      const LEGS = [
        { base: -0.62, reach: 13.5, lift: 1.0 },
        { base: -0.18, reach: 15.5, lift: 1.0 },
        { base: 0.18, reach: 15.5, lift: 1.0 },
        { base: 0.62, reach: 13.5, lift: 1.0 },
      ];
      ctx.strokeStyle = `rgba(${accent}, 0.82)`;
      ctx.lineWidth = 1.15;

      for (const side of [-1, 1]) {
        LEGS.forEach((leg, i) => {
          const phase = gait + (i * Math.PI) / 2 + (side < 0 ? Math.PI : 0);
          const swing = Math.sin(phase) * 0.34;
          const step = Math.max(0, Math.cos(phase)) * leg.lift;

          const a = leg.base + swing;
          const hipX = side * 2.2;
          const hipY = leg.base * 3.4;

          const kneeX = hipX + side * leg.reach * 0.52 * Math.cos(a);
          const kneeY = hipY + leg.reach * 0.52 * Math.sin(a) - 3.4 - step * 1.6;
          const footX = hipX + side * leg.reach * Math.cos(a * 0.82);
          const footY = hipY + leg.reach * Math.sin(a * 0.82) + 1.6;

          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
        });
      }

      /* body: abdomen and a smaller head, so it has a direction */
      ctx.fillStyle = `rgba(${accent}, 0.14)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${accent}, 1)`;
      ctx.beginPath();
      ctx.ellipse(0, 2.1, 3.1, 4.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -3.1, 2.1, 2.1, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    readPalette();
    resize();

    if (reduced) {
      frame(0);
      cancelAnimationFrame(raf);
      return;
    }

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

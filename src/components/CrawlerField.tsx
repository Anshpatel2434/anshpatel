import { useEffect, useRef } from "react";

/* ============================================================
   THE CRAWLER

   A small creature that walks the page on the field of dots.

   NO PATH IS DRAWN. Nothing is pre-plotted and nothing is joined
   up with a line — it simply makes its way down the page as you
   scroll, which is enough to suggest where to go next without
   putting a rail on the screen.

   Its legs are SHORT. They reach for dots close by, lift, swing
   and plant. The previous version let them stretch hundreds of
   pixels across the viewport, which is what made it look wrong.

   It drifts rather than travelling in straight lines: the target
   it walks toward carries a slow sideways meander, so the route
   is never a ruled line between two points.

   In the hero it rests among the five navigation nodes and links
   itself to them. Everywhere else it is on its own.
   ============================================================ */

type Dot = { bx: number; by: number; x: number; y: number; ph: number; sp: number; am: number; r: number };
type Leg = { fx: number; fy: number; ox: number; oy: number; tx: number; ty: number; t: number; hold: number };

const LEGS = 8;
const REACH = 46;        /* how far a leg may trail before it steps */
const SPAN = 34;         /* resting distance from body to foot      */
const STEP_MS = 230;
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
      const n = Math.max(50, Math.min(180, Math.round((W * H) / 8200)));
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

    let bodyX = 0;
    let bodyY = 0;
    let headAng = Math.PI / 2;
    let started = false;
    const legs: Leg[] = Array.from({ length: LEGS }, () => ({
      fx: 0, fy: 0, ox: 0, oy: 0, tx: 0, ty: 0, t: 1, hold: 0,
    }));

    const smooth = (t: number) => t * t * (3 - 2 * t);

    /* the nearest dot to where this leg wants to put its foot */
    function foothold(i: number, ang: number) {
      const a = ang + (i / LEGS) * Math.PI * 2;
      const wx = bodyX + Math.cos(a) * SPAN;
      const wy = bodyY + Math.sin(a) * SPAN;
      let bx = wx;
      let by = wy;
      let bd = 40 * 40; /* only snap to a dot that is genuinely close */
      for (const d of dots) {
        const dx = d.x - wx;
        const dy = d.y - wy;
        const q = dx * dx + dy * dy;
        if (q < bd) { bd = q; bx = d.x; by = d.y; }
      }
      return { x: bx, y: by };
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!W || document.hidden) return;
      const dt = last ? Math.min(now - last, 48) : 16.7;
      last = now;

      ctx.clearRect(0, 0, W, H);

      for (const p of dots) {
        p.x = p.bx + Math.cos(now * p.sp + p.ph) * p.am;
        p.y = p.by + Math.sin(now * p.sp * 1.25 + p.ph) * p.am * 0.6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${faint}, 0.26)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ---- where it is heading ----
         Derived from the section anchors so it does make its way
         down the page, but never drawn, and carrying a sideways
         meander so the route is a drift rather than a ruled line. */
      const anchors = read("[data-spine]");
      if (anchors.length < 2) return;

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
      anchors.forEach((a, i) => { a.el.dataset.live = i === seg ? "1" : "0"; });

      const A = anchors[seg];
      const B = anchors[seg + 1];
      const e = smooth(t);
      const baseX = A.x + (B.x - A.x) * e;
      const baseY = A.y + (B.y - A.y) * e;

      /* meander: push sideways off the straight line, slowly */
      const ux = B.x - A.x;
      const uy = B.y - A.y;
      const ul = Math.hypot(ux, uy) || 1;
      const wobble =
        Math.sin(t * Math.PI * 2.2 + now * 0.00022) * 52 +
        Math.sin(now * 0.00041) * 16;
      const tx = baseX + (-uy / ul) * wobble;
      const ty = baseY + (ux / ul) * wobble * 0.22;

      const px = bodyX;
      const py = bodyY;
      if (!started) { bodyX = tx; bodyY = ty; started = true; }
      else {
        const jump = Math.hypot(tx - bodyX, ty - bodyY);
        /* ease toward the target, but cap how far it can move per
           frame so the legs always have a chance to keep up */
        const k = jump > 260 ? 0.14 : 0.055;
        bodyX += (tx - bodyX) * k;
        bodyY += (ty - bodyY) * k;
      }
      const vx = bodyX - px;
      const vy = bodyY - py;
      const speed = Math.hypot(vx, vy);
      if (speed > 0.1) headAng = Math.atan2(vy, vx);

      /* ---- in the hero only, it links itself to the nav ---- */
      if (seg === 0 && t < 0.85) {
        const navs = read("[data-cons]");
        const fade = 1 - t / 0.85;
        ctx.strokeStyle = `rgba(${accent}, ${0.26 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const n of navs) {
          ctx.moveTo(bodyX, bodyY);
          ctx.lineTo(n.x, n.y);
        }
        ctx.stroke();
        for (const n of navs) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${accent}, ${0.7 * fade})`;
          ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ---- legs ----
         At a stroll only one leg lifts at a time, which is what
         makes a gait read as a gait. But a fast scroll moves the
         body further in one frame than a leg can follow, and the
         previous version left seven feet stranded hundreds of
         pixels behind while they queued for their turn — which is
         what made it look like tentacles. So: a few may step at
         once, and any foot left beyond SNAP is simply picked up
         and put down without an animation. A leg never stretches
         further than it can reach. */
      const SNAP = REACH * 1.8;
      let stepping = legs.filter((l) => l.t < 1).length;

      for (let i = 0; i < LEGS; i++) {
        const leg = legs[i];
        if (!leg.fx && !leg.fy) {
          const f = foothold(i, headAng);
          leg.fx = f.x; leg.fy = f.y;
          continue;
        }

        if (leg.t < 1) {
          leg.t = Math.min(1, leg.t + dt / STEP_MS);
          const s = smooth(leg.t);
          const lift = Math.sin(leg.t * Math.PI) * 7;
          leg.fx = leg.ox + (leg.tx - leg.ox) * s;
          leg.fy = leg.oy + (leg.ty - leg.oy) * s - lift;
          continue;
        }

        leg.hold -= dt;
        const trail = Math.hypot(leg.fx - bodyX, leg.fy - bodyY);

        if (trail > SNAP) {
          /* too far gone to walk back — replant it immediately */
          const f = foothold(i, headAng);
          leg.fx = f.x; leg.fy = f.y;
          leg.t = 1; leg.hold = 40;
        } else if (stepping < 3 && leg.hold <= 0 && trail > REACH) {
          const f = foothold(i, headAng);
          leg.ox = leg.fx; leg.oy = leg.fy;
          leg.tx = f.x; leg.ty = f.y;
          leg.t = 0;
          leg.hold = 55;
          stepping++;
        }
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 0; i < LEGS; i++) {
        const leg = legs[i];
        const mx = (bodyX + leg.fx) / 2;
        const my = (bodyY + leg.fy) / 2;
        const nx = -(leg.fy - bodyY);
        const ny = leg.fx - bodyX;
        const nl = Math.hypot(nx, ny) || 1;
        const bend = i % 2 === 0 ? 7 : -7;
        const kx = mx + (nx / nl) * bend;
        const ky = my + (ny / nl) * bend - 5;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${accent}, ${leg.t < 1 ? 0.5 : 0.72})`;
        ctx.lineWidth = 1;
        ctx.moveTo(bodyX, bodyY);
        ctx.quadraticCurveTo(kx, ky, leg.fx, leg.fy);
        ctx.stroke();
      }

      /* ---- the body ---- */
      const bob = Math.sin(now * 0.0024) * 0.8;
      ctx.save();
      ctx.translate(bodyX, bodyY + bob);
      ctx.rotate(headAng + Math.PI / 2);
      ctx.fillStyle = `rgba(${accent}, 0.09)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${accent}, 1)`;
      ctx.beginPath();
      ctx.ellipse(0, 1.4, 2.9, 3.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -2.8, 1.9, 1.9, 0, 0, Math.PI * 2);
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

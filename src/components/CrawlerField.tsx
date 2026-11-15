import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

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
const REACH = 62;        /* how far a leg may trail before it steps */
const SPAN = 46;         /* resting distance from body to foot      */
const STEP_MS = 230;
const READ = 0.45;

/* The five the hero hands it. In the hero these are the labels its
   front legs are gripping; once it lets go and starts walking, they
   are still what it is carrying — so putting the pointer on it hands
   them back. The crawler stops, spreads, and each of the five front
   legs holds one up. */
const CARRIES = [
  { to: "/", hash: "#offer", label: "what I can do" },
  { to: "/work", hash: "", label: "the work" },
  { to: "/", hash: "#experience", label: "experience" },
  { to: "/", hash: "#unshipped", label: "never shipped" },
  { to: "/", hash: "#stack", label: "the stack" },
];

/* how far the legs reach when it is holding them out */
const OPEN_R = 208;
const FAN = [-1.02, -0.52, 0, 0.52, 1.02];

export default function CrawlerField() {
  const { pathname } = useLocation();
  const replantRef = useRef<() => void>(() => {});
  const ref = useRef<HTMLCanvasElement | null>(null);
  const hubRef = useRef<HTMLButtonElement | null>(null);
  const legsRef = useRef<HTMLElement | null>(null);
  const tagRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);

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
          sp: 0.00020 + Math.random() * 0.00034,
          am: 16 + Math.random() * 30,
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
    let lastScroll = -1;
    let idleFor = 0;
    let wanderX = 0;
    let wanderY = 0;
    let wanderSet = false;
    let replant = false;

    /* the menu: open while the pointer is on it, and the five points
       its front legs are holding while it is */
    let open = false;
    let openT = 0;
    let mx = -1e4;
    let my = -1e4;
    const held = Array.from({ length: 5 }, () => ({ x: 0, y: 0 }));
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
      let bd = 52 * 52; /* only snap to a dot that is genuinely close */
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
        p.y = p.by + Math.sin(now * p.sp * 1.25 + p.ph) * p.am * 0.78;
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

      /* A still page should not mean a still creature. When the
         scroll position has not changed for a moment it stops
         tracking the section target and wanders on its own, in a
         slow loop around where it was left. The moment you scroll
         again it goes straight back to leading you down the page. */
      const sy = window.scrollY;
      if (Math.abs(sy - lastScroll) > 0.6) { lastScroll = sy; idleFor = 0; }
      else idleFor += dt;
      const idle = idleFor > 900;

      let aimX = tx;
      let aimY = ty;
      if (idle) {
        if (!wanderSet) {
          wanderX = bodyX;
          wanderY = bodyY;
          wanderSet = true;
        }
        const k = now * 0.00032;
        aimX = wanderX + Math.cos(k) * 128 + Math.cos(k * 2.3) * 42;
        aimY = wanderY + Math.sin(k * 1.37) * 72 + Math.sin(k * 0.61) * 30;
        /* keep it on screen even if it was left near an edge */
        aimX = Math.max(70, Math.min(W - 70, aimX));
        aimY = Math.max(70, Math.min(H - 70, aimY));
      } else {
        wanderSet = false;
      }

      const px = bodyX;
      const py = bodyY;
      if (!started) { bodyX = aimX; bodyY = aimY; started = true; }
      else {
        if (open) { aimX = bodyX; aimY = bodyY; }
        const jump = Math.hypot(aimX - bodyX, aimY - bodyY);
        /* ease toward the target, but cap how far it can move per
           frame so the legs always have a chance to keep up */
        const k = idle ? 0.03 : jump > 260 ? 0.14 : 0.055;
        bodyX += (aimX - bodyX) * k;
        bodyY += (aimY - bodyY) * k;
      }
      /* A new page has a different layout, so the feet left behind
         on the old one are nowhere near the body any more. Put them
         back down around it before anything is drawn. */
      if (replant) {
        for (let i = 0; i < LEGS; i++) {
          const a = headAng + (i / LEGS) * Math.PI * 2;
          const leg = legs[i];
          leg.fx = leg.ox = leg.tx = bodyX + Math.cos(a) * SPAN;
          leg.fy = leg.oy = leg.ty = bodyY + Math.sin(a) * SPAN;
          leg.t = 1;
          leg.hold = 0;
        }
        replant = false;
      }

      /* While it is holding the menu out, the five points are fanned
         to whichever side has room, and clamped so a label never
         leaves the screen. */
      if (open || openT > 0) {
        const base = bodyX > W * 0.55 ? Math.PI : 0;
        for (let i = 0; i < 5; i++) {
          const a = base + FAN[i] * (base ? -1 : 1);
          held[i].x = Math.max(120, Math.min(W - 120, bodyX + Math.cos(a) * OPEN_R));
          held[i].y = Math.max(74, Math.min(H - 74, bodyY + Math.sin(a) * OPEN_R));
        }
      }
      openT += ((open ? 1 : 0) - openT) * 0.18;

      const vx = bodyX - px;
      const vy = bodyY - py;
      const speed = Math.hypot(vx, vy);
      if (speed > 0.1) headAng = Math.atan2(vy, vx);

      /* ---- in the hero, the navigation nodes ARE its feet ----
         The lines reaching the five labels are not a diagram drawn
         next to the creature; they are its legs. It sits in the
         hero gripping the five links, and lets go of them as soon
         as you scroll, which is when the walk begins. */
      const navs = read("[data-cons]");
      /* Grip the navigation only while the hero is genuinely on
         screen. Deriving this from the segment index let it stay
         true for a frame after the hero had scrolled away, and the
         legs would reach hundreds of pixels back up the page for
         nodes that were no longer there. */
      const heroBox = document.querySelector(".cons")?.getBoundingClientRect();
      const heroHere = !!heroBox && heroBox.bottom > H * 0.35 && heroBox.top < H * 0.9;
      const inHero = heroHere && navs.length >= 5;

      if (inHero) {
        for (const n of navs) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${accent}, 0.75)`;
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

        /* Holding the menu out. The five that reach the labels are
           drawn over the page by the overlay, not here — so here the
           legs gather into a compact stance instead, and the body
           reads as something standing still and offering. */
        if (open) {
          const a = headAng + (i / LEGS) * Math.PI * 2;
          const tx = bodyX + Math.cos(a) * SPAN * 0.82;
          const ty = bodyY + Math.sin(a) * SPAN * 0.82;
          leg.fx += (tx - leg.fx) * 0.14;
          leg.fy += (ty - leg.fy) * 0.14;
          leg.t = 1;
          leg.hold = 0;
          continue;
        }

        /* in the hero the front five grip the navigation nodes and
           the back three stay tucked under the body, so the five
           long limbs reaching the labels are the whole silhouette */
        if (inHero) {
          const target = i < 5 ? navs[i] : { x: bodyX, y: bodyY };
          leg.fx += (target.x - leg.fx) * 0.14;
          leg.fy += (target.y - leg.fy) * 0.14;
          leg.t = 1;
          leg.hold = 0;
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
        } else if (stepping < 3 && leg.hold <= 0 && trail > (idle ? REACH * 0.55 : REACH)) {
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
      const CEIL = REACH * 2;
      for (let i = 0; i < LEGS; i++) {
        const leg = legs[i];
        const span = Math.hypot(leg.fx - bodyX, leg.fy - bodyY);
        if (span < 7) continue;
        /* a hard ceiling: whatever happened upstream, a limb is
           never drawn longer than it could physically reach */
        if (!inHero && !open && span > CEIL) {
          const f = foothold(i, headAng);
          leg.fx = f.x; leg.fy = f.y; leg.t = 1;
          continue;
        }
        const mx = (bodyX + leg.fx) / 2;
        const my = (bodyY + leg.fy) / 2;
        const nx = -(leg.fy - bodyY);
        const ny = leg.fx - bodyX;
        const nl = Math.hypot(nx, ny) || 1;
        const bend = (i % 2 === 0 ? 9 : -9) * (inHero ? 2.4 : 1);
        const kx = mx + (nx / nl) * bend;
        const ky = my + (ny / nl) * bend - 5;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${accent}, ${leg.t < 1 ? 0.5 : 0.72})`;
        ctx.lineWidth = 1.15;
        ctx.moveTo(bodyX, bodyY);
        ctx.quadraticCurveTo(kx, ky, leg.fx, leg.fy);
        ctx.stroke();
      }

      /* ---- the body ---- */
      /* The overlay is positioned from here rather than from React,
         so following the body costs nothing per frame. */
      const hub = hubRef.current;
      if (hub) hub.style.transform = `translate3d(${bodyX}px, ${bodyY}px, 0)`;
      const legsEl = legsRef.current;
      if (legsEl) {
        legsEl.classList.toggle("on", open);
        for (let i = 0; i < 5; i++) {
          const tag = tagRefs.current[i];
          if (!tag) continue;
          const t = Math.max(0, Math.min(1, openT * 1.5 - i * 0.08));
          const x = bodyX + (held[i].x - bodyX) * t;
          const y = bodyY + (held[i].y - bodyY) * t;
          tag.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
          tag.style.opacity = String(t);

          /* The canvas sits behind the page, so a leg drawn there
             would disappear under the content it is crossing. These
             five are drawn over it instead, and they are what makes
             the labels read as something the crawler is holding. */
          const ln = lineRefs.current[i];
          if (ln) {
            /* bowed the way the canvas bends a leg, so these read as
               the same creature's limbs rather than as rays */
            const dx = x - bodyX;
            const dy = y - bodyY;
            const nl = Math.hypot(dx, dy) || 1;
            const bend = i % 2 === 0 ? 16 : -16;
            const kx = bodyX + dx / 2 + (-dy / nl) * bend;
            const ky = bodyY + dy / 2 + (dx / nl) * bend - 6;
            ln.setAttribute(
              "d",
              `M ${bodyX} ${bodyY} Q ${kx} ${ky} ${x} ${y}`
            );
            ln.style.opacity = String(t * 0.9);
          }
        }
      }

      const bob = Math.sin(now * 0.0024) * 0.8;
      ctx.save();
      ctx.translate(bodyX, bodyY + bob);
      ctx.rotate(headAng + Math.PI / 2);
      ctx.fillStyle = `rgba(${accent}, 0.09)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      /* one body, not a head and an abdomen — it is a crawler, not
         an anatomy diagram */
      ctx.fillStyle = `rgba(${accent}, 1)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.6, 6.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    replantRef.current = () => {
      started = false;
      replant = true;
      idleFor = 0;
      wanderSet = false;
      lastScroll = -1;
    };

    readPalette();
    resize();
    if (reduced) { frame(0); cancelAnimationFrame(raf); return; }

    /* It stays open while the pointer is anywhere inside the spread,
       so crossing the gap between the body and a label does not
       close it mid-reach. */
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (open && Math.hypot(mx - bodyX, my - bodyY) > OPEN_R + 86) open = false;
    };
    const onEnter = () => { open = true; };
    const onLeaveAll = () => { open = false; };
    /* once it has handed you one, it lets go of the rest */
    const onPick = () => { open = false; };

    document.addEventListener("pointermove", onMove, { passive: true });
    hubRef.current?.addEventListener("pointerenter", onEnter);
    hubRef.current?.addEventListener("focus", onEnter);
    legsRef.current?.addEventListener("focusout", onLeaveAll);
    legsRef.current?.addEventListener("click", onPick);
    window.addEventListener("blur", onLeaveAll);

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    const mo = new MutationObserver(readPalette);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeaveAll);
    };
  }, []);

  /* after the new route has laid itself out, not during */
  useEffect(() => {
    const id = window.setTimeout(() => replantRef.current(), 60);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <>
      <canvas ref={ref} className="crawler" aria-hidden="true" />

      {/* The crawler's purpose, made available: put the pointer on it
          and it hands you the five things it has been carrying. */}
      <div className="crawl-hud">
        <button
          ref={hubRef}
          className="crawl-hub"
          type="button"
          aria-label="Show the crawler's shortcuts"
        />
        <svg className="crawl-web" aria-hidden="true">
          {CARRIES.map((c, i) => (
            <path
              key={c.label}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
            />
          ))}
        </svg>
        <nav ref={legsRef} className="crawl-legs" aria-label="Crawler shortcuts">
          {CARRIES.map((c, i) => (
            <Link
              key={c.label}
              ref={(el) => {
                tagRefs.current[i] = el;
              }}
              to={{ pathname: c.to, hash: c.hash }}
              className="crawl-tag mono"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

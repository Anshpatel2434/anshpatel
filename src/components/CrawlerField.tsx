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

/* how close the pointer has to be before it offers — the same
   radius as the button you are aiming at */
const HUB_R = 52;

/* how far the legs reach when it is holding them out */
const OPEN_R = 208;
const FAN = [-1.02, -0.52, 0, 0.52, 1.02];

export default function CrawlerField() {
  const { pathname } = useLocation();
  const replantRef = useRef<() => void>(() => {});
  const ref = useRef<HTMLCanvasElement | null>(null);
  const hubRef = useRef<HTMLButtonElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
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
    /* It may only open when the pointer has moved since the last
       scroll. Scrolling is how you tell it to get back to work, and
       without this it would re-open the moment it walked back under
       a cursor that had been sitting still the whole time. */
    let armed = true;
    /* whether the menu currently on screen was opened by a finger */
    let byTouch = false;
    /* A pointer hovers; a finger taps. The same menu, opened two
       different ways, because there is nothing to hover with on a
       phone and a tap that only worked by proximity would fire
       every time you scrolled past the thing. */
    const touch = window.matchMedia("(hover: none)").matches;
    /* A phone keeps the constellation and the grip — that emergence
       is the point of the hero. What it cannot keep is the desktop's
       room to swing, so the meander is damped and the body is held
       inside the screen below. */
    const narrow = window.matchMedia("(max-width: 760px)").matches;
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
      const swing = narrow ? 0.34 : 1;
      const wobble =
        (Math.sin(t * Math.PI * 2.2 + now * 0.00022) * 52 +
          Math.sin(now * 0.00041) * 16) * swing;
      const tx = baseX + (-uy / ul) * wobble;
      const ty = baseY + (ux / ul) * wobble * 0.22;

      /* A still page should not mean a still creature. When the
         scroll position has not changed for a moment it stops
         tracking the section target and wanders on its own, in a
         slow loop around where it was left. The moment you scroll
         again it goes straight back to leading you down the page. */
      const sy = window.scrollY;
      const scrolled = lastScroll >= 0 && Math.abs(sy - lastScroll) > 0.6;
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

      /* Spine anchors sit at the edges of the content column, and on
         a narrow screen those edges are the screen's. Wherever the
         aim lands, the whole creature has to stay in view — legs
         included, which is what the margin is for. */
      const edge = narrow ? 58 : 70;
      aimX = Math.max(edge, Math.min(W - edge, aimX));
      aimY = Math.max(edge, Math.min(H - edge, aimY));

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
        if (narrow) {
          /* A fan needs width to open into, and a phone has none —
             the labels land on top of each other and on the page.
             So on a narrow screen it holds them in a column, on
             whichever side of itself has more room. */
          const right = bodyX < W * 0.5;
          const cx = right ? bodyX + 86 : bodyX - 86;
          for (let i = 0; i < 5; i++) {
            held[i].x = Math.max(84, Math.min(W - 84, cx));
            held[i].y = Math.max(70, Math.min(H - 70, bodyY + (i - 2) * 46));
          }
        } else {
          const base = bodyX > W * 0.55 ? Math.PI : 0;
          for (let i = 0; i < 5; i++) {
            const a = base + FAN[i] * (base ? -1 : 1);
            held[i].x = Math.max(120, Math.min(W - 120, bodyX + Math.cos(a) * OPEN_R));
            held[i].y = Math.max(74, Math.min(H - 74, bodyY + Math.sin(a) * OPEN_R));
          }
        }
      }
      /* Scrolling always hands it back its own business: the menu
         closes, the freeze lifts, and it goes back to leading you
         down the page. It will not offer again until you move the
         pointer, so it cannot re-open under a resting cursor. */
      if (scrolled) {
        open = false;
        armed = false;
        byTouch = false;
      }

      /* Opening and closing are the same distance test every frame,
         rather than an event that can be missed while the body is
         moving underneath a still pointer. */
      /* Proximity is how a pointer opens and closes it. A menu a
         finger opened must not answer to it — on a hybrid device
         the mouse may be parked across the room, and on a phone
         there is no mouse position to speak of. */
      const reach = Math.hypot(mx - bodyX, my - bodyY);
      if (!touch && !byTouch) {
        if (armed && reach < HUB_R) open = true;
        if (open && reach > OPEN_R + 70) open = false;
      }
      openT += ((open ? 1 : 0) - openT) * 0.2;
      if (!open && openT < 0.003) openT = 0;

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
      /* Offering: the five legs drawn over the page are the whole
         creature. Drawing these as well gives it thirteen limbs. */
      const offering = openT > 0.02;
      for (let i = 0; i < LEGS && !offering; i++) {
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
      /* The hub is the only part that must follow every frame, because
         it is the target you have to be able to catch. */
      const hub = hubRef.current;
      if (hub) hub.style.transform = `translate3d(${bodyX}px, ${bodyY}px, 0)`;

      /* The class is compared against the element rather than against
         a local mirror. A mirror only has to fall out of step once —
         a re-render, a route change — and the menu is then stuck
         until the next toggle flips it back by luck. */
      const legsEl = legsRef.current;
      const hudEl2 = hudRef.current;
      const live = open || openT > 0.002;
      if (hudEl2 && hudEl2.classList.contains("live") !== live) {
        hudEl2.classList.toggle("live", live);
      }
      if (legsEl && legsEl.classList.contains("on") !== open) {
        legsEl.classList.toggle("on", open);
      }

      /* Shut and settled: nothing to position, so nothing is touched.
         Writing to five shadowed boxes and a viewport-sized SVG every
         frame is what made the whole page feel heavy. */
      if (legsEl && live) {
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
      /* A scroll can fire a synthetic move at the same coordinates;
         only a real change of position counts as you reaching for
         it again. */
      if (e.clientX !== mx || e.clientY !== my) armed = true;
      mx = e.clientX;
      my = e.clientY;
    };
    const onEnter = () => {
      if (touch) return;
      armed = true;
      open = true;
    };
    /* Whether this is a tap is a property of the event, not of the
       device: a tablet with a trackpad does both. A mouse click is
       ignored because hover has already opened it. */
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      open = !open;
      byTouch = open;
    };
    /* anywhere else puts it away again */
    const onTapAway = (e: Event) => {
      if (!byTouch || !open) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest(".crawl-hud")) return;
      open = false;
      byTouch = false;
    };
    const onLeaveAll = () => { open = false; };
    /* once it has handed you one, it lets go of the rest */
    const onPick = () => { open = false; armed = false; };

    /* Held in locals so the cleanup takes them off the same nodes.
       Reading the refs again on the way out can find a different
       element, or null — and a listener left behind keeps a whole
       dead frame loop's state alive, toggling against the live one. */
    const hubEl = hubRef.current;
    const navEl = legsRef.current;

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onTapAway, true);
    hubEl?.addEventListener("pointerenter", onEnter);
    hubEl?.addEventListener("pointerup", onTap as EventListener);
    hubEl?.addEventListener("focus", onEnter);
    navEl?.addEventListener("focusout", onLeaveAll);
    navEl?.addEventListener("click", onPick);
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
      document.removeEventListener("pointerdown", onTapAway, true);
      hubEl?.removeEventListener("pointerenter", onEnter);
      hubEl?.removeEventListener("pointerup", onTap as EventListener);
      hubEl?.removeEventListener("focus", onEnter);
      navEl?.removeEventListener("focusout", onLeaveAll);
      navEl?.removeEventListener("click", onPick);
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
      <div className="crawl-hud" ref={hudRef}>
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

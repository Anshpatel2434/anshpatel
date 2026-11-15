import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------
   Lenis drives the scroll; ScrollTrigger is told about it so the
   two never disagree about where the page is. Anchor links are
   routed through lenis.scrollTo so they ease instead of jumping.
   ------------------------------------------------------------ */
let current: Lenis | null = null;

/* The page can only be in one place at a time, and while Lenis is
   running that place is Lenis's to decide. window.scrollTo is undone
   on the next frame, so every jump goes through here instead. */
export function scrollPageTo(target: HTMLElement | number, smooth = true) {
  if (current) {
    /* lock, because a ScrollTrigger refresh during a route change
       will otherwise restore the old position mid-flight and leave
       the page stranded halfway */
    current.scrollTo(target, {
      offset: -24,
      immediate: !smooth,
      lock: true,
      force: true,
    });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
  } else {
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!a || a.hasAttribute("data-own-scroll")) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -24 });
    };

    document.addEventListener("click", onAnchor);

    return () => {
      document.removeEventListener("click", onAnchor);
      cancelAnimationFrame(raf);
      current = null;
      lenis.destroy();
    };
  }, []);
}

/* ------------------------------------------------------------
   Entrances. Everything starts visible and animates FROM a
   displaced state, so a crawler, a screenshot, or a reader with
   JS disabled still sees a complete page.
   ------------------------------------------------------------ */
export function useReveals(key?: string) {
  useEffect(() => {
    if (prefersReduced()) return;

    const ctx = gsap.context(() => {
      /* hero: the two headline halves, then everything under them */
      gsap.from(".hero-type .ht", {
        yPercent: 106,
        opacity: 0,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.08,
      });
      gsap.from(".hero-c, .hero-base > *", {
        y: 16,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        delay: 0.36,
        stagger: 0.07,
      });

      /* every section head and record rises once as it arrives */
      const risers = gsap.utils.toArray<HTMLElement>(
        ".sec-head, .o-row, .band-copy, .band-plate, .rail-item, .idx tbody tr, .panel, .contact-grid, .about-text, .about-pic, .about-facts"
      );
      risers.forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    });

    /* let layout settle after a route swap before measuring */
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [key]);
}

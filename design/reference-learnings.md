# What the reference sites actually do

Written after finally *looking* at them in a browser rather than
reading their markup. Every point below is a thing our portfolio
was doing the opposite of.

## dennypratama.com

1. **No two-column hero.** One enormous object dead centre; the
   text is pushed out to the four edges around it. Nothing sits in
   a "right-hand panel".
2. **The object transforms on scroll** — the mark rotates, and a
   live readout (`000°` → `072°` → `085°`) counts the angle in the
   accent colour. Scroll is wired to a mechanism, not to a fade.
3. **One accent, one place.** The orange degree counter is the only
   chromatic thing on an otherwise black-and-white screen.
4. **Section headings sit over the artwork**, left-aligned, with a
   tiny numbered eyebrow (`02 · the handoff`). The art never stops.
5. **Zero cards.** No rounded boxes, no tiles, no stat panels.
6. **Credentials are one line of 11px text**, bottom-left, under the
   bio: "Designing since 2018 · 97 projects · 5.0 from 71 reviews".
7. The nav is small, quiet and top-centre. It is not a feature.

## dakshgajjar.com

8. **The type IS the layout.** "I DESIGN PRODUCTS THAT THINK."
   fills the entire viewport in ultra-condensed black and bleeds
   off both edges. No container, no padding safety.
9. **Extreme scale contrast** — ~150px display against ~11px
   monospace support copy. A ratio of about 13:1. Ours was 4:1.
10. **One continuous red thread** winds behind, through and over
    the type. Later the same line straightens into a labelled
    diagram (INTENT / INTERACTION / SYSTEM). One device, two jobs.
11. **Hard full-bleed ground switches** — black to cream with no
    transition. Sections are separated by colour, not by padding.
12. Supporting copy is tiny, monospace, bottom-left. It never
    competes with the display type.
13. Nav: tiny uppercase letter-spaced links, top-right. No pill,
    no box, no background.

## siddhant-xi.vercel.app

14. Two opposite widths in one headline — light-wide over
    black-condensed — so the concept is stated typographically.
15. The stack is a **machine you operate**: a sticky illustration
    whose active floor lights as the right column scrolls, with a
    live status readout.
16. His name set enormous across the full width at the foot of the
    hero.

---

## What we were doing wrong

- A **status card in the hero**. The single most generic thing on
  the internet.
- `eyebrow + h2 + paragraph` repeated at the head of all seven
  sections.
- Rounded cards, pill buttons and hairline rules everywhere, so
  nothing had any weight relative to anything else.
- Monospace labels on every single element, which stops them
  reading as labels at all.
- Display type capped around 94px inside a padded container —
  never bleeding, never at viewport scale.
- Even, predictable vertical rhythm from top to bottom. No
  density, no emptiness, no surprise.

## The rules this rebuild follows

1. Type at viewport scale, bleeding past the container.
2. Scale contrast of at least 10:1 between display and support.
3. No cards. Hard edges. Rules only where they carry meaning.
4. Hard full-bleed ground inversions to separate sections.
5. One accent, spent in very few places.
6. Nav as quiet corner text, not an object.
7. Section heads vary — some are a number, some a single word,
   some nothing at all.

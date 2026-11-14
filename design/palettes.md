# Palette candidates — portfolio 2026

Three palettes to try one at a time on whichever layout we settle on.

**Locked decisions**
- **One theme only.** No light/dark toggle, no `prefers-color-scheme` switching. Each palette below is committed to a single light level.
- **OKLCH** for all colour definition. Perceptually uniform, so equal `L` reads as equally bright. Shipping in all browsers since 2023.
- **Purposeful motion only.** No decorative animation.

**Why each palette is locked to one lightness**

A mid-lightness field cannot carry accessible body text in either direction. Measured against WCAG's 4.5:1 minimum for body copy:

| Field | vs near-black ink (L 19%) | vs near-white chalk (L 95%) |
| --- | --- | --- |
| L 52% (true middle) | ~3.3:1 ✗ | ~3.7:1 ✗ |
| L 73% (light) | ~5.9:1 ✓ | ~1.9:1 ✗ |
| L 34% (dark) | ~1.7:1 ✗ | ~7.1:1 ✓ |

So every palette commits: a light field takes dark type, a dark field takes light type. Ratios below are computed estimates from OKLCH `L` — **verify each in-browser before shipping.**

**The contrast rule that applies to all three**

> Colour at mid lightness is for **marks** — rules, dots, badges, underlines, fills. Colour used as **text** must be pushed to `L ≤ 32%` on a light field, or `L ≥ 78%` on a dark one.

---

## Palette A — Coloured Stock ★ recommended

**The theoretical move:** abandon the neutral ground entirely. The page is neither white nor black — it is a *colour*. This is what print has done with coloured paper stock for two centuries and the web has never done, because web convention insists the page must be a neutral. It sits in the gap Ruxandra Duru describes as the false dichotomy between "colourful" and "sophisticated": unmistakably coloured, and completely calm.

**Why it is unused:** software treats green as semantic — green means success, green means tests passing. Green as the *entire field*, at low chroma, is a ceramics palette, not a software one.

**Committed to: the light field.** Celadon paper, dark ink. Honest to the coloured-stock idea and the more readable of the two.

| Role | OKLCH | Notes |
| --- | --- | --- |
| `field` | `oklch(73% 0.035 175)` | pale petrol / celadon. the page itself |
| `field-raised` | `oklch(77% 0.030 175)` | panels barely lift — almost no contrast step |
| `rule` | `oklch(62% 0.030 175)` | hairlines, dividers |
| `ink` | `oklch(22% 0.030 190)` | body copy · ~5.9:1 ✓ |
| `ink-strong` | `oklch(16% 0.030 190)` | display type · ~7.1:1 ✓ |
| `muted` | `oklch(30% 0.025 185)` | secondary copy · ~4.5:1, borderline — test it |
| `relief` | `oklch(52% 0.13 45)` | clay / rust. **marks only**, ~2.0:1 |
| `relief-text` | `oklch(32% 0.11 40)` | the same accent when it must be read · ~4.2:1 |

`relief` is the completion note — a warm hue against a cool field, used in millimetres. Duru: *"a composition inundated with warm yellows will be balanced by even a pinch of cool color."* This is that, inverted.

**Variant if we ever want the dark version instead (A-dark):** field `oklch(34% 0.040 175)`, type `oklch(95% 0.018 90)` warm chalk (~7.1:1), relief `oklch(72% 0.12 50)`. Same hue family, opposite commitment. Not the default.

---

## Palette B — Flat-lightness Duotone

**The theoretical move:** maximise hue distance, minimise *lightness* distance. Every UI palette does the opposite — a dark ground with a bright accent. Here two hues sit ~170° apart at nearly identical lightness, so neither reads as "background" and neither reads as "accent." They hold each other in tension. High stimulation from the hue gap, calmed by the absence of any brightness step.

**The honest constraint:** a flat pair at mid lightness genuinely cannot carry readable text. So the flat duotone is the **graphic signature** — plates, blocks, bars, fills — while the page ground and type are a high-contrast pair drawn from the same two hues at extreme lightness. The signature survives; the text stays legible.

| Role | OKLCH | Notes |
| --- | --- | --- |
| `field` | `oklch(96% 0.012 75)` | faintest ochre-tinted paper |
| `field-raised` | `oklch(92% 0.016 75)` | |
| `rule` | `oklch(80% 0.020 75)` | |
| `ink` | `oklch(20% 0.040 265)` | near-black with an ultramarine bias · ~15:1 ✓ |
| `muted` | `oklch(44% 0.030 265)` | ~5.4:1 ✓ |
| `plate-a` | `oklch(55% 0.085 265)` | dusty ultramarine — the flat pair |
| `plate-b` | `oklch(56% 0.090 75)` | warm ochre — the flat pair |

`plate-a` and `plate-b` are within 1% lightness of each other by design. That is the whole idea. Never put small text on either.

---

## Palette C — Recreating Light

**The theoretical move:** no accent at all. Four low-chroma hues at *identical* lightness and chroma, spaced evenly around the wheel so they sum to neutral — the principle colourist Donald Kaufman calls "recreating light," cited in the Google piece. Because all four match in lightness and chroma, none dominates.

**Why it matters for this site specifically:** each content category takes one hue. The category separation stops being a layout problem and becomes the colour system — four kinds of thing, unmistakably distinct and perfectly equal in weight.

| Role | OKLCH | Assigned to |
| --- | --- | --- |
| `field` | `oklch(95% 0.006 165)` | the page — a whisper-tinted paper, the perceptual average of the four |
| `ink` | `oklch(21% 0.012 165)` | all body copy · ~14:1 ✓ |
| `muted` | `oklch(45% 0.010 165)` | secondary copy · ~5.1:1 ✓ |
| `rule` | `oklch(84% 0.008 165)` | hairlines |
| `clay` | `oklch(58% 0.05 30)` | **products** — marks only, ~3.0:1 |
| `moss` | `oklch(58% 0.05 120)` | **competitions** — marks only |
| `slate` | `oklch(58% 0.05 210)` | **employment** — marks only |
| `mauve` | `oklch(58% 0.05 300)` | **what I offer** — marks only |

Darkened text-safe variants when a category label must be read as type, all ~4.6:1:

| | OKLCH |
| --- | --- |
| `clay-text` | `oklch(38% 0.07 30)` |
| `moss-text` | `oklch(38% 0.07 120)` |
| `slate-text` | `oklch(38% 0.07 210)` |
| `mauve-text` | `oklch(38% 0.07 300)` |

---

## Explicitly ruled out

Confirmed saturated or clichéd, do not propose these again:

- Dark ground + neon / luminescent accent — dominates dev tools, crypto and AI products; high-saturation trends age badly
- Warm cream / bone / paper + serif display + terracotta — 2026's largest trend and the top AI-generated-design tell
- Charcoal, deep navy or warm off-black dark mode — now the default, not a choice
- Muted neutral + one confident colour pop — the single most common 2026 formula
- Purple-to-blue gradient hero

All five are the same recipe: **neutral ground, saturated accent, high light–dark contrast.** Every palette above breaks that recipe in a different specific way — A removes the neutral, B removes the lightness contrast, C removes the accent.

---

## Sources

- https://design.google/library/color-theory-ruxandra-duru — hue/intensity/lightness; the false dichotomy; balance → relate → complete; "recreating light"
- https://www.sketch.com/blog/color-combination-guide/ — standard harmony schemes
- https://atmos.style/color-wheel — harmony schemes, OKLCH support
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl — why OKLCH over RGB/HSL

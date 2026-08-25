# Likelyfad — v2

The Likelyfad landing page, rebuilt on Next 16. Same page, same copy, same
layout as v1 (likelyfad-pi.vercel.app) down to the margins. The difference is
where the styling lives.

## The one rule of this codebase

**`app/globals.css` is the only stylesheet, and it stays small.** Everything a
Tailwind utility can express is written as a utility on the element. What is
left there is what a utility cannot be:

1. the `@theme` tokens — which is what makes `bg-paper`, `text-pink-deep`,
   `font-display` and the `lap:` / `tab:` / `phone:` breakpoints *exist* as
   utilities in the first place;
2. the two marquee keyframes both walls run on;
3. `--grad`, `--grad-ink`, `--fade-stops` and the three shadows as variables, so
   `bg-[image:var(--grad)]` reads one definition instead of thirty copies of a
   colour triple;
4. `.aura`, `::selection` and `:focus-visible` — three rules, because there is
   no utility for any of them.

Before adding a rule there, check it is not just a utility you have not looked
up yet. v1's stylesheet was 1,402 lines; this one is under 160, and every
number in it came from that file.

## Breakpoints

v1's three real media queries, as named variants. They are min-widths, so a
bare utility is what everything below gets.

| Variant | Width | What changes |
|---|---|---|
| `lap:` | 961px | hero splits beside the wall, wall goes vertical, pricing card becomes two columns, page cap opens to 1800px |
| `tab:` | 761px | nav links return, FAQ splits into head + list |
| `phone:` | 561px | why-us grid goes 2-up, footer CTA goes side by side |

Tailwind's own `sm`/`md`/`lg` are still there but unused — mixing the two sets
is how a layout ends up changing shape four times instead of three.

## Stack

Next 16 · React 19 · TypeScript · Tailwind v4. No animation library — the
marquees are CSS keyframes, the reveals are one `IntersectionObserver` apiece,
and the FAQ is a native `<details>`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## The page

| # | Section | File |
|---|---|---|
| 1 | Nav | `components/sections/Nav.tsx` |
| 2 | Hero + reel wall (the split) | `Hero.tsx` · `ReelWall.tsx`, laid out in `app/page.tsx` |
| 3 | Why us | `WhyUs.tsx` |
| 4 | The work (volume wall) | `Work.tsx` |
| 5 | Pricing | `Pricing.tsx` |
| 6 | Testimonials | `Testimonials.tsx` |
| 7 | FAQ | `Faq.tsx` |
| 8 | Footer | `Footer.tsx` |

`lib/ui.ts` holds the three class strings every section agrees on — the page
gutter and measure, the section rhythm, and the fixed-nav anchor offset.

Copy is in `lib/content.ts` — one source of truth, house rules at the top. Wrap
a phrase in `*asterisks*` to paint it with the brand ramp.

## The reel walls

Two of them, and neither is 3D: every card faces the viewer square on. The only
depth cue on the hero wall is that the outer lanes rest at `scale(0.94)` against
the middle lane's `0.97`.

- **Hero wall** — three lanes, vertical on `lap:` and horizontal below it, from
  ONE set of markup: the lane's flex direction and its animation flip at the
  breakpoint. Edge fades are painted gradients rather than a mask (a mask
  re-composites every moving layer under it each frame).
- **Work wall** — three full-bleed rows on the dark band, alternating direction,
  masked at 7% and 93%.

Each lane renders its clips twice and slides by exactly half its own length, so
the loop is seamless with no JS driving it. That doubling is the one place this
build carries more than v1: 132 `<video>` nodes against v1's 66. The posters are
the same URLs on both copies, so nothing extra is fetched — it is DOM weight
only.

Both walls have a pause control (WCAG 2.2.2) and open a clip in a shared
lightbox on click.

`lib/reels.generated.ts` is carried over from v1 and holds absolute Vercel Blob
URLs, so no video lands in this repo. `lib/reelOrder.ts` groups clips that came
from the same shoot and spreads them across the whole list, so three
near-identical doctor spots never end up in one lane.

Each tile is `preload="none"` with a poster still and plays only while on screen
(`lib/useInViewPlay.ts`) — the ceiling on these walls is concurrent video
decoding, not bytes.

## Headings are word boxes, not text

`RevealText` is not decoration you can swap for a plain `<h1>` — it decides how
a headline lays out. Every word becomes its own `inline-flex` clipping box with
a `0.16em` descender allowance, and on a gradient run **each word carries its own
`background-clip`**, so the ramp restarts per word instead of stretching across
the phrase. Set the same string as ordinary inline text and both the rhythm and
the colour come out different.

Two consequences worth knowing before editing:

- The `SectionHeading` `<h2>` **is** the RevealText root, so it is
  `display: inline`. Its `mt-3` is inert (margin-top does nothing on a
  non-replaced inline element) — the gap under a section kicker is line-box
  height. v1 is the same; the class is kept for parity.
- Where a heading needs a `max-width` (the why-us claim, the footer close), it
  must be a **direct flex child** so it blockifies. Wrap it in a `Reveal` div
  and the div becomes the flex item, the `<p>` stays inline, and the measure is
  silently dropped.

The hero has no wrapper divs at all for the same reason: its four supporting
lines carry their own fade classes so they stay the flex items.

## Three v1 rules that were dead, and still are

- `.hero-aura` — the CSS rule is alive but **the element is commented out of
  v1's markup**, so the live site renders no wash. It is commented out here too;
  uncomment the block in `Hero.tsx` to switch it on.
- `.pricing .section-head { margin-bottom: 24px }`
- `.faq-head .section-head { --title-size: … }`

The last two target a class `SectionHeading` never emitted, so neither ever
applied. This build matches what the site actually renders (default title size,
4px margin) rather than what those rules intended. If they were meant to apply,
pass `titleSize` / a margin class to `SectionHeading` in those two sections.

## Still placeholder

| Item | Where |
|---|---|
| OG image | add `public/og.png`; referenced in `app/layout.tsx` |
| Domain | `SITE_URL` in `lib/site.ts` |
| Instagram / email / legal links | not present yet; footer carries X only |

The only real outbound link is the CTA, which opens the X profile in
`lib/site.ts`.

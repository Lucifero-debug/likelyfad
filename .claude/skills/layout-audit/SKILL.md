---
name: layout-audit
description: Measure a live website's spacing, margins, padding, font sizes, line heights, tracking, and tap targets against a fixed rule set, and report only defects that survive verification. Use whenever someone asks whether a site's spacing or typography is right, wants a spacing/margin/padding check, asks about line-height or font-size relationships, says a layout "feels off" or "cramped" or "too loose", asks if their site is "perfect", or wants a design QA pass on a URL. Also use for follow-up rounds on a site already reviewed. This is the measurement pass — for a broader critique covering hierarchy, trust, and conversion, use web-design-review instead, or run both.
---

# Layout Audit

Measure, verify, then report. The failure mode is not missing a defect — it is confidently reporting five that turn out to be measurement artifacts. Every one of the traps below has produced a false finding in practice.

## The rules being checked

### Spacing

One rule generates most of the others: **the gap between two things must be larger than the padding inside either of them.** A 24px gap around cards padded 32px groups each card's content with its neighbour as readily as with its own.

Gaps expand as relatedness decreases:

| Relationship | Target |
|---|---|
| Inside a component (title → body) | 8–16 |
| Between components (card → card) | 24–32 |
| Heading block → its content | 40–64 |
| Section → section | 96–128 |

Each level roughly doubles. Two different relationships sharing a number means one is wrong.

**Proximity:** related items sit at least 2× closer than unrelated ones. Quote→attribution 16 against card→card 32.

**Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Values off the scale are suspects — but see the clamp trap before calling them defects.

### Type size

Six sizes, each ≥1.25× the one below: display 48–72, section heading 32–40, sub-head 24, body 16–18, small 14, micro 12. Two sizes within 15% are not a hierarchy step.

### Line height — the inverse rule

| Size | Ratio |
|---|---|
| 48px+ | 1.0–1.1 |
| 24–40px | 1.2–1.3 |
| 16–20px | 1.4–1.5 |
| 12–14px | 1.5–1.6 |

Headings are never 1.5. Body is never 1.1. Both errors appear on the same page more often than you'd expect — a card title at 1.03 next to an FAQ question at 1.6.

### Tracking — same inverse rule

Display −0.02em, body 0, uppercase +0.05 to +0.1em. Capitals have no ascenders or descenders to separate them.

### Other floors

Measure 45–75 characters per line. Tap targets 44×44 both dimensions. Body ≥16px, nothing meaningful below 12px. Contrast 4.5:1, or 3:1 above 24px.

### Typography structure

Two families, three roles (display / text / optional mono). Three weights maximum — a weight used by one element is a font file for one element. Hierarchy from size first, weight second, colour third.

## How to measure

`scripts/audit.js` runs all of the above and returns a single object. Paste it into DevTools or run it through a browser tool. It is read-only.

If no browser is available, **say so and stop**. Do not audit spacing from a screenshot — see the first trap. Ask for browser access or offer the script for the user to run and paste back.

## The five traps

Every finding must survive all five before it goes in the report.

**1. Zoom.** Check `devicePixelRatio` first. At 1.375 zoom, every screenshot pixel is 1.375× the real CSS value, and a 32px gap reads as 44. Screenshots are usable for *seeing* a layout, never for measuring it. The script reports this in `meta`.

**2. Scroll-reveal transforms.** Entry animations apply `translateY` and `opacity: 0` before firing. An element sitting 26px below its resting position turns a correct 64px gap into a measured 38px. The script excludes anything mid-animation and lists it under `unstable` — if an element you care about is in that list, scroll it into view, wait for the animation, then re-measure.

**3. Fluid values.** `clamp(32px, 4.5vw, 64px)` resolves differently at every viewport. A "63px padding, off-scale" finding at one window width is a clean 64 at another. Before calling any value hand-tuned, check whether it's fluid — measure at two widths, or read the source. A well-built clamp system will look like scale drift and is the opposite of a defect.

**4. Breakpoints.** A container inset that appears at 1389px may vanish at 1528px because a `lg:`/`xl:` variant kicks in. Report the width you measured at. If a finding only exists in one window range, say so — that's different from a flat defect.

**5. Selector drift.** A selector like `width > 700` grabs different elements at different viewports — the inner card at one width, the outer wrapper at another — and the comparison silently becomes meaningless. Log the element's class name alongside its measurement so the comparison is verifiable.

## Verify against source before reporting

**Read the component before writing the finding up.** The DOM shows what a value *is*; the source shows whether it was chosen. This routinely dissolves findings:

- The gap you measured at 38 is `mb-[clamp(32px,4.5vw,64px)]` = 64, minus a 26px reveal offset.
- The "dead space" in a short card is `justify-center` doing its job.
- The "three inconsistent heading leadings" are one documented decision plus a separate display tier.
- The codebase may already contain a comment explaining the exact tradeoff you're about to flag.

If a repo isn't reachable, say the finding is unverified against source and give the reader the measurement rather than a verdict.

## Report

```
# Layout audit: [site]

Measured at [viewport], DPR [n]. [What was excluded and why.]

## Passes
[Only what genuinely holds up. Name the value, not just the category.]

## Defects
[Things that are wrong by the rules above and verified against source.
 Each: what it is → the measured number → the fix.]

## Tuning
[Real but minor — a 15.7px body, a 4th font weight.]

## Judgement calls
[Where the rules and the design disagree and the design may be right.
 Say so plainly; don't smuggle taste in as a defect.]

## Fixes, ordered
[Numbered, one line each.]
```

## Calibration

**A well-built system produces a short report.** If a page has a documented spacing scale and a fluid type ramp, three findings is a complete audit. Padding it out with restatements of things that pass is how a review loses credibility.

**Separate defect from taste.** "Card title leads at 1.03 and will collide when it wraps" is a defect. "Montserrat is a common choice" is taste. Both can be worth saying; conflating them is not.

**Retract cleanly.** If a later measurement contradicts an earlier finding, say which one was wrong and why, in a sentence. Don't quietly drop it and don't bury the correction.

**Answer "is it perfect?" honestly.** A sound spacing system is one layer. Missing alt text, an unreachable contact path, a wrong canonical, and no price anchor are not spacing problems — but they are why the answer is still no. Name the layer that's solved, then the layer that isn't.
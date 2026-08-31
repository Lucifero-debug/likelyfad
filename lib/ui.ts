/* The class strings every section agrees on. They live here rather than in
   globals.css on purpose: the point of this rebuild is that the page is styled
   by utilities, so the shared bits are shared AS utilities, not as a `.wrap`
   rule that would then need its own overrides. The numbers are v1's, exactly.
*/

/* Page gutter and measure.

   THE CEILING IS THE HERO'S STAGE, AND THAT IS THE WHOLE REASON FOR THE
   NUMBER. HeroV6 lays its copy and the reel wall out inside
   `max-w-[1520px] px-[clamp(24px,5vw,64px)]`, so 1520 here is not a taste
   value — it is the one figure that puts every section's first column on the
   same x as the hero's headline and the wall's left edge. At the 1800 this
   used to carry, a 1920 monitor started the hero copy at 264px and every
   section under it at 124px: 140px of drift that reads as the page coming
   apart below the fold, which is exactly what it looked like. If the hero's
   stage ever moves, this moves with it — they are one measurement written in
   two places, and the gutter clamp is deliberately identical for the same
   reason.

   1800 was keyed to the OLD split hero, whose headline clamp topped out at a
   1798px viewport. That hero is parked; the number outlived it.

   The 1180 base is inert and kept only as the floor of the pair: `lap:` is
   961px, so below it the viewport is always narrower than 1180 and the cap
   never binds. Every width that can see a cap sees this one. */
export const WRAP =
  "mx-auto w-full max-w-[1180px] px-[clamp(24px,5vw,64px)] lap:max-w-[1520px]";

/* THE SPACING SCALE. Every gap on this page is one of the four constants
   below, and they are ORDERED: a section break is the largest number on the
   page, a heading's break is the next, and the space inside a component is the
   smallest. The rule they encode — the one the page kept breaking before they
   existed — is that THE GAP BETWEEN TWO THINGS IS NEVER SMALLER THAN THE
   PADDING INSIDE EITHER OF THEM. A 22px grid gap around cards padded 32px
   groups each card's text with its NEIGHBOUR as readily as with its own, and a
   38px seam under a box with 48px of internal padding leaves the background
   colour doing the separating that spacing should be doing.

   Keyed to viewport WIDTH rather than height: how much air a band needs is a
   function of how wide its measure is, and a vh-based version squeezed the
   whole page in a short window. Applied top and bottom, so adjacent sections
   are separated by 80px on a phone and 128px on a desktop — larger than any
   padding inside them, which is what makes a boundary read as a boundary.

   THE SCALE ITSELF, which every authored number on this page is drawn from:
   4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160. BOTH ENDS of a clamp
   have to land on it; what the clamp resolves to between them does not, and
   cannot — that is the part that makes it fluid. This ceiling was 72, and the
   desktop seam it built was 144: neither is a rung. */
export const SECTION = "py-[clamp(40px,6.5vw,64px)]";

/* Heading block → the content it introduces. Tops out at 64.

   THIS NUMBER ONLY HAS TO BEAT ONE OTHER. It sits under SectionHeading's own
   16px, so in a section with a sub-headline the heading-to-sub gap is that 16
   plus the sub's own 24 — 40 — and this is the gap below the sub. 64 against 40
   is the ordering the header block lives or dies on: kicker, then heading, then
   sub, then content, each gap larger than the last. Inverted, the sub sits
   nearer the cards than the headline it belongs to and proximity hands it to
   the cards, which is what a 48 ceiling was still close to doing.

   A section with no sub-headline spends both numbers on one gap and gets 80. */
export const HEAD_GAP = "mb-[clamp(32px,4.5vw,64px)]";

/* Card grid gap — one step ABOVE the clamp both card grids use for their own
   padding, never equal to it. gap == padding satisfies the letter of the rule
   above and not its point: at 32 against a 32 pad, a card's text sits exactly
   as far from its own edge as the seam between two cards is wide, and the
   border and the white ground are left doing the separating on their own. 48
   is the next value on the scale that separates them on spacing alone. */
export const CARD_GAP = "gap-[clamp(32px,3.5vw,48px)]";

/* THERE IS NO PANEL INSET ANY MORE. Why us's claim and the pricing card used
   to share a 720 / 1080 cap, on the reasoning that two components at the same
   inset read as a pattern where one alone reads as a drift. Both now run to the
   page gutter instead, so EVERY container on the page starts at the same x and
   there is no second alignment to learn. If the pricing card reads too wide
   without it, the fix is to bring the cap back to both — not to one. */

/* ============================================================================
   THE TYPE SCALE. Eight steps, and every piece of text on this page is on one
   of them. Same argument as the spacing scale above: the rule is that the steps
   are ORDERED and stay ordered at every width, and the only way to hold that is
   to have the steps exist as steps rather than as seventeen clamps authored one
   section at a time.

   What that replaced: six roles — a card title, an FAQ question, three section
   sublines and a pull-quote — all landing between 17.7px and 22.1px at a
   desktop width. A card TITLE set at 20.5px next to a section SUBLINE at 22.1px
   is not a hierarchy with a small gap in it, it is two tiers that have swapped
   places. Two of them were fixed rem values as well, so which one came out on
   top depended on the window: the pillar title outranked the Why-us lead on a
   phone and was outranked by it on a desktop.

   THE RULE THE STEPS ENCODE: a heading runs two to three times the text it
   introduces. H1 over the hero subline, H2 over a section lead, STATEMENT over
   its own sub — all three sit in that band across the range. It is a band and
   not a number because the display steps are STRONGLY fluid (H1 swings 44→75px,
   1.7×) and reading steps are deliberately not (LEAD swings 18→24px, 1.3×) —
   which is the correct behaviour for both and means their ratio has to travel.
   It runs 2.1–2.9 through the widths people actually use, opening past 3 only
   where the display type has hit its ceiling and the deck has not.

   TITLE — card titles and FAQ questions — is the one tier that does not reach
   2×, running 1.6–1.9× its own body copy. It is a component label rather than a
   section heading, and at 2× a pillar card's title would be 30px on a phone and
   the six of them would read as six competing headlines. Raise TITLE's floor if
   you want them louder; the step above it, STATEMENT, has the room.

   TWO STEPS CARRY THE HERO'S BREAKPOINT — see the note in SectionHeading. The
   hero halves its own size at `lap:` because it moves into a column beside the
   reel wall, and anything that has to stay under it has to make the same move.

   The clamps are spelled out per step and not derived from each other: Tailwind
   scans source TEXT, so a class assembled from a variable is never emitted at
   all — the same constraint written up at the foot of this file. */

/* Mono captions, kickers, footnotes, attributions. The floor of the page. */
export const TEXT_META = "text-[clamp(0.78rem,0.75rem+0.1vw,0.85rem)]";

/* Card copy, FAQ answers, section kickers — the tier that reads UNDER body,
   for text that belongs to a component rather than to the page. */
export const TEXT_SMALL = "text-[clamp(0.875rem,0.85rem+0.1vw,0.95rem)]";

/* Body is set once on <body> in app/layout.tsx and inherited, so it is the one
   step with no constant here: clamp(1rem, 0.96rem + 0.2vw, 1.075rem). */

/* The deck under a heading — hero subline, section lead, pull-quote. THIS is
   the "subheading" half of the 2–3× rule, and the step every heading above is
   measured against. */
export const TEXT_LEAD = "text-[clamp(1.15rem,1rem+0.46vw,1.5rem)]";

/* Component headings: pillar card titles, FAQ questions. */
export const TEXT_TITLE = "text-[clamp(1.4rem,1.15rem+0.65vw,1.8rem)]";

/* Display type that is NOT a section heading — Why us's claim, the footer's
   closing line. Held at a constant 0.76 of H2 so a statement inside a section
   can never outrank the section's own heading; the Why-us claim used to run
   59px against a 54px heading at 1440 and won. */
export const TEXT_STATEMENT =
  "text-[clamp(1.84rem,1rem+3.01vw,3.18rem)] lap:text-[clamp(1.27rem,0.16rem+2.65vw,3.15rem)]";

/* Section headings. A custom property rather than a font-size because
   SectionHeading derives its measure from it — see the note there. */
export const TEXT_H2 =
  "[--title:clamp(2.42rem,1.32rem+3.96vw,4.18rem)] " +
  "lap:[--title:clamp(1.67rem,0.21rem+3.49vw,4.14rem)]";

/* The hero headline, and the top of the page. Everything above is derived from
   it: H2 is 0.88 of this, STATEMENT is 0.76 of H2. Move it and the ladder moves.
   The `lap:` half is tuned to break the 39-character headline over exactly two
   lines in its column — see the note in Hero.tsx before changing it. */
export const TEXT_H1 =
  "text-[clamp(2.75rem,1.5rem+4.5vw,4.75rem)] " +
  "lap:text-[clamp(1.9rem,0.24rem+3.97vw,4.7rem)]";

/* ============================================================================
   THE AUTHORED SIZES — Why us and Pricing only.

   Those two sections are off the ladder above, by request: their type was given
   as four fixed desktop values, 64 / 32 / 24 / 16. These are those four values
   made responsive. Each one LANDS EXACTLY on its desktop number at 1440px and
   holds it above, so the desktop design is the design that was asked for and
   nothing about it moved — the ramp only runs downward from there.

   THE LADDER COMPRESSES ON THE WAY DOWN, and it has to. On desktop the four
   steps are 4 : 2 : 1.5 : 1 against each other; at 390px they are 2.3 : 1.4 :
   1.2 : 1. Holding the desktop ratios would mean a 4× spread anchored on a
   bottom step that is already at its readable floor — 14px cannot be scaled
   down to make room for the top, so the top comes down to meet it instead. The
   ORDER never changes, which is the part that matters: no two steps cross at
   any width from 360 to 1920.

   Why 32px and not 36 at the bottom of the heading step: Pricing's headline
   breaks itself with a 
, and its first half ("Priced to your brief,") is 21
   characters. At 32px that fits the 358px a 390px phone leaves after the
   section's 16 padding; above it the line wraps and the hard break buys a third
   line instead of setting the two the copy intends.

   They live here rather than in the two files because the two files share them
   — four clamps copied into both would drift the first time one is nudged. */

/* Section headings in Why us and Pricing. 32px → 64px. */
export const SIZE_64 = "text-[clamp(2rem,1.26rem+3.05vw,4rem)]";

/* Section subtext, and Why us's card headings. 20px → 32px. */
export const SIZE_32 = "text-[clamp(1.25rem,0.97rem+1.143vw,2rem)]";

/* Pricing's bullets, and Why us's kicker. 17px → 24px. */
export const SIZE_24 = "text-[clamp(1.0625rem,0.9rem+0.667vw,1.5rem)]";

/* Pricing's kicker, and Why us's card body and card numbers. 14px → 16px. */
export const SIZE_16 = "text-[clamp(0.875rem,0.83rem+0.19vw,1rem)]";

/* The nav is fixed, so an anchor jump would land a section's top edge under
   it. This also covers the browser's OWN anchor navigation — a pasted #faq
   link, or a hash restored on reload. */
export const ANCHOR = "scroll-mt-[88px]";

/* NOTE ON REPEATING THE CLAMP. Two places outside this file spell SECTION's
   clamp out verbatim rather than importing it — the reel wall's bottom padding
   and the split's in page.tsx, each of which owns one whole side of a seam.
   Tailwind scans source TEXT, so a class name assembled from a variable is
   never seen by the scanner and the utility is never emitted. If the rhythm
   number changes, it changes in all three places.

   Why us used to be the one section flush against what precedes it, on the
   grounds that the wall's caption row and its kicker read as one block below
   the split. With a real scale that reads as a missing boundary instead, so
   the wall now owns that seam and every band on the page gets the same
   rhythm. */

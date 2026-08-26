/* The class strings every section agrees on. They live here rather than in
   globals.css on purpose: the point of this rebuild is that the page is styled
   by utilities, so the shared bits are shared AS utilities, not as a `.wrap`
   rule that would then need its own overrides. The numbers are v1's, exactly.
*/

/* Page gutter and measure.

   1180px below the split breakpoint, 1800px above it. Desktop drops the
   reading cap so sections match the edge-to-edge hero — but bleeding to the
   viewport with NO ceiling stretched every row 2400px wide on a 2560px
   monitor. 1800 is not arbitrary: the split hero's headline clamp reaches its
   4.7rem ceiling at a 1798px viewport, so this is the one width where the
   column and the type stop growing together. Above it the extra width goes to
   the margin rather than into the columns. */
export const WRAP =
  "mx-auto w-full max-w-[1180px] px-[clamp(24px,5vw,64px)] lap:max-w-[1800px]";

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

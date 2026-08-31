/* ============================================================================
   /v3 — the tokens every section on this page agrees on.

   Same argument as lib/ui.ts: the page is styled by utilities, so the shared
   parts are shared AS utility strings and not as classes in the stylesheet.
   Tailwind scans source TEXT, so every clamp below is spelled out in full — a
   class assembled from a variable is never seen by the scanner and the utility
   is never emitted.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   THE SPACING SCALE. Only these values appear on this page:

     4  8  12  16  24  32  48  64  96  128

   BOTH ENDS of every clamp land on the scale; what it resolves to in between
   does not and cannot, since that is the part that makes it fluid.

   The rule the numbers encode: THE GAP BETWEEN TWO ELEMENTS EXCEEDS THE
   PADDING INSIDE EITHER OF THEM. Format cards are padded 24, so nothing sits
   closer than 32 to one. The pricing card is padded 48, and the gap between
   its two columns is 48 as well, never less.
   --------------------------------------------------------------------------- */

/* Page gutter and measure. */
export const WRAP = "mx-auto w-full max-w-[1200px] px-[clamp(24px,5vw,64px)]";

/* Section rhythm, top and bottom.

   THE NUMBER IN THE BRIEF IS THE SEAM, NOT THE PADDING. Two adjacent sections
   each contribute their own padding to the space between them, so 96 on both
   would put 192 to 256 between every pair. Half of the seam on each side lands
   the actual gap on 48+48=96 at a phone and 64+64=128 at a desktop, which is
   the 96 to 128 asked for. Both ends still sit on the scale. */
export const SECTION = "py-[clamp(48px,5vw,64px)]";

/* Heading block → the content it introduces. One step under the section seam,
   so a header belongs to its own section rather than floating between two. */
export const HEAD_GAP = "mb-[clamp(48px,5vw,64px)]";

/* ---------------------------------------------------------------------------
   THE TYPE SCALE — 72 / 40 / 24 / 17 / 14 / 12.

   Given as fixed desktop sizes, made responsive here. Each step LANDS EXACTLY
   on its number by ~1150px and holds it above, so the design at desktop is the
   design that was specified; the ramp only runs downward from there.

   The ladder compresses on the way down and has to: 14 and 12 are already at
   their readable floor, so the top steps come down to meet them rather than
   the bottom being scaled below legibility. The ORDER never changes, which is
   the part that matters — no two steps cross at any width from 375 to 1920.

   ONE NOTE ON THE SPEC. The brief asks for each step to be at least 1.25x the
   one below; 17/14 is 1.21 and 14/12 is 1.17, so the two smallest steps as
   given do not clear that. The explicit sizes win over the derived rule, so
   these are the sizes as listed. The three display steps are all well clear.
   --------------------------------------------------------------------------- */

/* 40 → 72. The hero headline, the statement, and the closing line. */
export const T_72 = "text-[clamp(2.5rem,1.2rem+5.2vw,4.5rem)]";

/* 28 → 40. Section headings. */
export const T_40 = "text-[clamp(1.75rem,1.35rem+1.6vw,2.5rem)]";

/* 20 → 24. Card titles, FAQ questions, the hero subline. */
export const T_24 = "text-[clamp(1.25rem,1.14rem+0.44vw,1.5rem)]";

/* 16 → 17. Running body copy. */
export const T_17 = "text-[clamp(1rem,0.98rem+0.1vw,1.0625rem)]";

/* 14. Secondary copy: FAQ answers, card bodies, footnotes. Flat — this is the
   floor for prose and there is nowhere under it to ramp to. */
export const T_14 = "text-[0.875rem]";

/* 12. Mono only: eyebrows, tags, labels. Flat, same reason. */
export const T_12 = "text-[0.75rem]";

/* ---------------------------------------------------------------------------
   THE THREE TYPE ROLES.
   --------------------------------------------------------------------------- */

/* Display. A tight grotesque, set tight: leading just over 1 and negative
   tracking, which is what large neutral type needs to stop reading as loose.
   No width axis is pushed here — the reference site's character comes from
   what is IN its headlines rather than from the face setting them, and this
   page makes the same trade. */
export const DISPLAY = "font-wide font-semibold leading-[1.04] tracking-[-0.03em]";

/* Utility. Eyebrows, tags, labels, anything set in small caps. The one detail
   carried over from the homepage unchanged. */
export const MONO = "font-mono uppercase tracking-[0.18em]";

/* Corners. Panels are generously rounded because a dark panel on a light page
   has to read as an object laid ON the page rather than as a hole cut in it,
   and the radius is what decides which of the two you see. */
export const PANEL = "rounded-[24px] bg-panel";
export const CARD = "rounded-[16px]";
export const PILL = "rounded-full";

/* The nav floats, so an anchor jump would otherwise land a section's top edge
   underneath it. Covers the browser's own hash navigation too. */
export const ANCHOR = "scroll-mt-[112px]";

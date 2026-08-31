/* ============================================================================
   /v2 — the tokens every section on THIS page agrees on.

   Sibling file: lib/v3/theme.ts, which is the same idea for the light,
   Butter-modelled direction. The two share nothing but their names, and they
   are deliberately separate files rather than one parameterised module — the
   whole point of two directions is that a decision can differ, and a shared
   module would quietly punish every place they do.

   Same argument as lib/ui.ts for why these are strings: the page is styled by
   utilities, so the shared parts are shared AS utility strings and not as
   classes in the stylesheet. Tailwind scans source TEXT, so every clamp below
   is spelled out in full — a class assembled from a variable is never seen by
   the scanner and the utility is never emitted.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   THE SPACING SCALE. Only these values appear on this page:

     4  8  12  16  24  32  48  64  96  128

   BOTH ENDS of every clamp land on the scale; what it resolves to in between
   does not and cannot, since that is the part that makes it fluid.

   The rule the numbers encode: THE GAP BETWEEN TWO ELEMENTS EXCEEDS THE
   PADDING INSIDE EITHER OF THEM. The pricing card is padded 48, so the gap
   between its two columns is 48 and never less.
   --------------------------------------------------------------------------- */

/* Page gutter and measure. 1280 rather than the homepage's 1800: this page has
   no side-by-side hero to match, and past ~1280 a five-column work grid starts
   handing each tile more width than a 9:16 clip wants. */
export const WRAP = "mx-auto w-full max-w-[1280px] px-[clamp(24px,5vw,64px)]";

/* Section rhythm, top and bottom.

   THE NUMBER THE BRIEF GIVES IS THE SEAM, NOT THE PADDING. Two adjacent
   sections each contribute their own padding to the space between them, so 96
   top and bottom put 192 to 256 between every pair and the page read as a
   column of content separated by voids. Half of the seam on each side lands
   the actual gap on 48+48=96 at a phone and 64+64=128 at a desktop, which is
   the 96 to 128 that was asked for. Both ends still sit on the scale. */
export const SECTION = "py-[clamp(48px,5vw,64px)]";

/* Heading block → the content it introduces. One step under the section seam,
   so the header belongs to its own section rather than floating between two. */
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

/* 40 → 72. The hero headline, and the closing line. */
export const T_72 = "text-[clamp(2.5rem,1.2rem+5.2vw,4.5rem)]";

/* 28 → 40. Section headings. */
export const T_40 = "text-[clamp(1.75rem,1.35rem+1.6vw,2.5rem)]";

/* 20 → 24. Card and column titles, FAQ questions, the hero subline. */
export const T_24 = "text-[clamp(1.25rem,1.14rem+0.44vw,1.5rem)]";

/* 16 → 17. Running body copy. Set once on the page wrapper and inherited. */
export const T_17 = "text-[clamp(1rem,0.98rem+0.1vw,1.0625rem)]";

/* 14. Secondary copy: FAQ answers, tile captions, footnotes. Flat — this is
   the floor for prose and there is nowhere under it to ramp to. */
export const T_14 = "text-[0.875rem]";

/* 12. Mono only: eyebrows, chips, stat labels, tags. Flat, same reason. */
export const T_12 = "text-[0.75rem]";

/* ---------------------------------------------------------------------------
   THE THREE TYPE ROLES.
   --------------------------------------------------------------------------- */

/* Display. Archivo pushed along its own width axis to 118, which is what buys
   the expanded, poster-like proportions without a second font download. The
   tracking is negative because expanded faces at display size set loose.

   This is where /v2 and /v3 disagree most visibly: /v3 leaves the same face at
   its natural width and lets the clips embedded in its headline carry the
   personality, where this page wants the type itself to have presence because
   the wall behind it is already doing the shouting.

   font-variation-settings and not font-stretch: the axis is only reachable
   through the variable font's own settings once next/font has requested it,
   and stating the tag here keeps the value visible where it is used. */
export const DISPLAY =
  "font-wide font-bold leading-[1.02] tracking-[-0.025em] [font-variation-settings:'wdth'_118]";

/* Utility. Eyebrows, chips, tags, stat labels, anything set in small caps.
   The one detail carried over from the homepage unchanged. */
export const MONO = "font-mono uppercase tracking-[0.18em]";

/* The hairline. Every division on this page is one of these; there are no
   card borders outside pricing. */
export const HAIR = "border-rule";

/* The nav is fixed, so an anchor jump would otherwise land a section's top
   edge underneath it. Covers the browser's own hash navigation too. */
export const ANCHOR = "scroll-mt-[96px]";

/* Corners. 2px, everywhere, including the CTA — a pill button is the other
   half of the near-black-plus-one-accent default, and a squared block reads
   like a slate, which is the room this page is set in. /v3 goes the other way
   and rounds everything generously, for reasons that are its own. */
export const CORNER = "rounded-[2px]";

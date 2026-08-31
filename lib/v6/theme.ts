/* ============================================================================
   /v6 — the tokens every section on THIS page agrees on.

   Siblings: lib/v2/theme.ts (the dark screening room), lib/v3/theme.ts (the
   Butter-modelled light page), lib/v4/theme.ts (the open shop) and
   lib/v5/theme.ts (the Fuel-modelled dossier). Five separate files rather than
   one parameterised module, for the same reason as before — the whole point of
   five directions is that a decision can differ, and a shared module would
   quietly punish every place they do.

   Same argument as lib/ui.ts for why these are strings: the page is styled by
   utilities, so the shared parts are shared AS utility strings and not as
   classes in the stylesheet. Tailwind scans source TEXT, so every value below
   is spelled out in full — a class assembled from a variable is never seen by
   the scanner and the utility is never emitted.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   THE SPACING SCALE. Only these values appear on this page:

     4  8  12  16  24  32  48  64  96  128

   BOTH ENDS of every clamp land on the scale; what it resolves to in between
   does not and cannot, since that is the part that makes it fluid.

   THE RULE: THE GAP BETWEEN TWO ELEMENTS EXCEEDS THE PADDING INSIDE EITHER OF
   THEM. This page is the one where that rule bites hardest, because the bento
   grid is its centrepiece and a bento grid is nothing BUT padded cards sitting
   near each other. Cards are padded 32, so the grid gap is 48 and never less.
   At 32 and 32 the four cards stop being four cards and become one dark mass
   with some rules drawn on it, which is exactly the failure the brief names.
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

/* A section's heading block → the content it introduces. One step under the
   section seam, so a heading belongs to its own section rather than floating
   between two of them. */
export const HEAD_GAP = "mt-[clamp(32px,4vw,48px)]";

/* ---------------------------------------------------------------------------
   THE TYPE SCALE — 64 / 40 / 24 / 17 / 14 / 12.

   Given as fixed desktop sizes, made responsive here. Each step LANDS EXACTLY
   on its number by ~1100px and holds it above, so the design at desktop is the
   design that was specified; the ramp only runs downward from there.

   ONE NOTE ON THE SPEC, the same one lib/v3/theme.ts records for the same
   reason. The brief asks for each step to be at least 1.25x the one below.
   The top of the ladder clears that easily — 64/40 is 1.60, 40/24 is 1.67,
   24/17 is 1.41 — but 17/14 is 1.21 and 14/12 is 1.17, so the two smallest
   steps AS GIVEN do not. The explicit sizes win over the derived rule, because
   14 and 12 are already at their readable floor and "fixing" the ratio would
   mean pushing body copy up to 17.5 or the label down to 11. Recorded here so
   it reads as a decision rather than as arithmetic nobody checked.

   The ladder compresses on the way down and has to, but the ORDER never
   changes at any width from 375 to 1920, which is the part that matters.
   --------------------------------------------------------------------------- */

/* 64. The hero headline and the closing headline. Serif, and the only two
   places this size appears. */
export const T_64 = "text-[clamp(2.25rem,1.1rem+4.6vw,4rem)]";

/* 40. Section headlines, and the cycling line. Serif. */
export const T_40 = "text-[clamp(1.75rem,1.1rem+2.6vw,2.5rem)]";

/* 24. Bento card titles, why-us claims, FAQ questions, process step titles. */
export const T_24 = "text-[clamp(1.25rem,1.05rem+0.8vw,1.5rem)]";

/* 17. Leads and the hero sub — body copy set one step up, where a paragraph
   is doing introductory work. */
export const T_17 = "text-[1.0625rem] leading-[1.6]";

/* 14. Running body copy: card descriptions, FAQ answers, step bodies. */
export const T_14 = "text-[0.875rem] leading-[1.6]";

/* 12. Mono only — labels, tags, microcopy, the section eyebrows. */
export const T_12 = "text-[0.75rem]";

/* ---------------------------------------------------------------------------
   THE THREE TYPE ROLES.
   --------------------------------------------------------------------------- */

/* DISPLAY — and the single most valuable thing taken from the reference.

   A serif on a dark cinematic ground reads as FILM. A grotesque on the same
   ground reads as SOFTWARE, which is what every competing AI-ad site opens
   with and which is the wrong claim for a studio that sells finished ads
   rather than a tool.

   WHY CORMORANT GARAMOND AND NOT INSTRUMENT SERIF. Instrument is the obvious
   pick and that is precisely the problem: Instrument Serif over a near-black
   page has become the house style of the 2025 AI startup, so reaching for it
   would land us back inside the stock look the brief is warning about, just
   with better letterforms. Cormorant is a light classical serif — it reads
   cinematic rather than trendy-editorial, and it is literally light, which is
   what was asked for.

   WEIGHT 300 ONLY AT 64 AND 40. Light, high-contrast serifs optically THIN
   when set light-on-dark: the glow of a bright letterform against a dark
   ground eats the hairlines. At 64 and 40 there is enough mass for 300 to hold
   and the lightness is the whole effect. At 24 it goes spindly, so T_24 pairs
   with SERIF_400 instead. Two weights, one download, and the switch happens at
   the size where the eye actually notices. */
export const SERIF = "font-film font-light tracking-[-0.01em]";
export const SERIF_400 = "font-film font-normal tracking-[-0.005em]";

/* Utility. Kept from the homepage unchanged — labels, tags, eyebrows and the
   microcopy under the hero CTA. Never used for prose. */
export const MONO = "font-mono uppercase tracking-[0.14em]";

/* ---------------------------------------------------------------------------
   THE BENTO CARD.

   One string, because the whole point of a bento grid is that every card is
   the same object at different widths. Spelling this out once is what stops
   the fourth card quietly acquiring a different radius from the first.

   THE BORDER IS THE POINT AND IT IS MEANT TO BE BARELY THERE. #1B2130 against
   #101623 is about as faint as a border can be and still exist. It is not
   trying to draw a box; it is trying to stop two adjacent cards from bleeding
   into one another where their fills touch. Raise it and the grid turns into a
   wireframe.
   --------------------------------------------------------------------------- */
export const CARD = "rounded-[16px] border border-edge bg-slab p-[32px]";

/* The nav is fixed, so an anchor jump would otherwise land a section's top
   edge underneath it. */
export const ANCHOR = "scroll-mt-[96px]";

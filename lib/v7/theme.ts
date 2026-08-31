/* ============================================================================
   /v7 — the tokens every section on THIS page agrees on.

   Siblings: lib/v2/theme.ts (the screening room), lib/v3/theme.ts (the
   Butter-modelled light page), lib/v4/theme.ts (the open shop), lib/v5/theme.ts
   (the Fuel-modelled dossier) and lib/v6/theme.ts (the night screening). Six
   separate files rather than one parameterised module, for the same reason as
   before — the whole point of six directions is that a decision can differ,
   and a shared module would quietly punish every place they do.

   Same argument as lib/ui.ts for why these are strings: the page is styled by
   utilities, so the shared parts are shared AS utility strings rather than as
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
   THEM. This page is where that rule bites hardest and the brief says so: the
   whole design is padded white cards sitting near each other, and ROTATION
   MAKES EVERY EDGE AMBIGUOUS. A tilted card's corner reaches further than its
   flat width suggests, so two cards that merely clear each other when square
   read as touching once they are dealt at an angle. Cards padded 32 therefore
   sit 48 apart and never less; the tiles in the work grid are padded 8 and sit
   24 apart, which clears the same rule at the other end of the scale.
   --------------------------------------------------------------------------- */

/* Page gutter and measure. */
export const WRAP = "mx-auto w-full max-w-[1200px] px-[clamp(24px,5vw,64px)]";

/* Section rhythm, top and bottom.

   THE NUMBER IN THE BRIEF IS THE SEAM, NOT THE PADDING. Two adjacent sections
   each contribute their own padding to the space between them, so 96 on both
   would put 192 to 256 between every pair. Half of the seam on each side lands
   the actual gap on 48+48=96 at a phone and 64+64=128 at a desktop, which is
   the 96 to 128 the brief asks for. Both ends still sit on the scale. */
export const SECTION = "py-[clamp(48px,5vw,64px)]";

/* A section's heading block to the content it introduces. One step under the
   section seam, so a heading belongs to its own section rather than floating
   between two of them. */
export const HEAD_GAP = "mt-[clamp(32px,4vw,48px)]";

/* The nav is fixed, so an anchor jump would otherwise land a section's top
   edge underneath it. */
export const ANCHOR = "scroll-mt-[96px]";

/* ---------------------------------------------------------------------------
   THE TYPE SCALE — 80 / 44 / 26 / 17 / 14 / 12.

   Given as fixed desktop sizes and made responsive here. Each step LANDS
   EXACTLY on its number by ~1100px and holds it above, so the design at
   desktop is the design that was specified; the ramp only runs downward.

   ONE NOTE ON THE SPEC, the same one lib/v3/theme.ts and lib/v6/theme.ts
   record for the same reason. The brief asks for each step to be at least
   1.25x the one below. The top of the ladder clears that easily — 80/44 is
   1.82, 44/26 is 1.69, 26/17 is 1.53 — but 17/14 is 1.21 and 14/12 is 1.17, so
   the two smallest steps AS GIVEN do not. The explicit sizes win over the
   derived rule, because 14 and 12 are already at their readable floor and
   "fixing" the ratio would mean pushing body copy to 17.5 or the label to 11.
   Recorded so it reads as a decision rather than as arithmetic nobody checked.

   The ladder compresses on the way down and has to, but the ORDER never
   changes at any width from 375 to 1920, which is the part that matters.
   --------------------------------------------------------------------------- */

/* 80. The hero headline and the closing headline, and nowhere else. */
export const T_80 = "text-[clamp(2.5rem,1.2rem+5.6vw,5rem)]";

/* 44. Section headlines and the stat figures. */
export const T_44 = "text-[clamp(1.75rem,1.05rem+2.9vw,2.75rem)]";

/* 26. Card titles, why-us claims, FAQ questions, process step titles. */
export const T_26 = "text-[clamp(1.25rem,1.05rem+0.9vw,1.625rem)]";

/* 17. Leads and the studio statement — body copy one step up, where a
   paragraph is doing introductory work. */
export const T_17 = "text-[1.0625rem] leading-[1.6]";

/* 14. Running body copy: card bodies, FAQ answers, step bodies. */
export const T_14 = "text-[0.875rem] leading-[1.6]";

/* 12. Mono only — sticker labels, chips, eyebrows, microcopy. */
export const T_12 = "text-[0.75rem]";

/* ---------------------------------------------------------------------------
   THE TWO TYPE ROLES, PLUS THE MONO THAT WAS ALREADY HERE.
   --------------------------------------------------------------------------- */

/* DISPLAY — a heavy condensed grotesque, uppercase, tightly set. This carries
   the entire page, which is exactly what the brief asks of it.

   WHY ARCHIVO AT wdth 82 AND NOT ANTON. Anton is the obvious pick for "heavy
   condensed poster face" and that is the problem: it is a single-weight
   display font with one setting, so every page that reaches for it arrives at
   the same picture, and it has been the default poster face of template
   landing pages for years. Archivo carries a real WIDTH AXIS, so the
   condensing here is a decision with a number on it rather than a font that
   came pre-condensed — 82 is narrow enough to let an eight-word headline run
   at 80px inside a 14ch measure, and wide enough that the counters stay open
   at 12px in a sticker label. One variable file serves both ends.

   THE AXIS IS DRIVEN THROUGH font-stretch, NOT font-variation-settings, and
   that is a correction rather than a preference. The raw-axis form is the one
   everybody reaches for first, and as a Tailwind arbitrary property it does
   not survive: the quotes the CSS requires around an axis tag are not carried
   through, the utility is silently dropped, and the page renders at normal
   width with no error anywhere. Verified by grepping the built stylesheet.

   font-stretch is also the better answer on its own terms. next/font emits
   "font-stretch: 62% 125%" on the @font-face, which is the wdth range it
   declares to the browser, so a percentage here is the high-level property
   doing exactly what the low-level one would and degrading properly on a
   non-variable fallback. Weight stays under font-weight, which is what lets
   DISPLAY run at 800 for headlines and DISPLAY_600 at 600 for the wordmark and
   the card titles off one download.

   -0.02em AND leading 0.92. Condensed caps at 80px have far more sidebearing
   and far more line gap than they need; both numbers are the correction, and
   both only make sense because everything set in this face is UPPERCASE, where
   there are no descenders for a tight leading to collide with. */
export const DISPLAY =
  "font-poster font-extrabold uppercase tracking-[-0.02em] leading-[0.92] font-stretch-[82%]";

/* The same face at 600, for card titles and the wordmark, where 800 at 26px
   goes from emphatic to shouty. Leading opens to 1.0 because these are one or
   two lines rather than a wall. */
export const DISPLAY_600 =
  "font-poster font-semibold uppercase tracking-[-0.01em] leading-[1] font-stretch-[82%]";

/* Utility. Kept from the homepage unchanged — sticker labels, filter chips,
   eyebrows, microcopy, attributions. Never used for prose. */
export const MONO = "font-mono uppercase tracking-[0.14em]";

/* ---------------------------------------------------------------------------
   THE PINNED CARD.

   One string, because the whole point of a wall is that every card is the same
   object at a different angle. Spelling it out once is what stops the fourth
   card quietly acquiring a different radius from the first.

   A HAIRLINE AND A SHADOW, NOT ONE OR THE OTHER. On cream a white card is only
   3% lighter than the ground, so a shadow alone leaves the card edge to a blur
   that disappears entirely on a cheap panel; a hairline alone makes it a box
   drawn on paper rather than a thing lying on top of it. The pair is what
   reads as pinned. The radius is small on purpose — a 16px radius reads as a
   UI card, and these are meant to read as cut paper.
   --------------------------------------------------------------------------- */
export const CARD =
  "relative rounded-[6px] border border-hair bg-card shadow-[0_1px_2px_rgba(20,19,16,0.05),0_10px_24px_-12px_rgba(20,19,16,0.16)]";

/* The card's own padding. Named separately from CARD because the work tiles
   are the same card at 8, and the rule about gaps exceeding padding needs both
   numbers visible at the call site rather than buried in a shared string. */
export const CARD_PAD = "p-[32px]";

/* ---------------------------------------------------------------------------
   ROTATION.

   THE CEILING IS 3 DEGREES AND IT IS A LEGIBILITY BUDGET, NOT A TASTE ONE.
   Past about 4 degrees a line of text stops being read as horizontal and the
   eye starts tracking the baseline instead of the words, which on a page whose
   job is to be scanned in eight seconds is a real cost. The stickers get the
   top of the budget because they are one word each; cards carrying sentences
   stay at or under 1.5.

   NOTHING IS EVER ONLY LEGIBLE AT AN ANGLE. Every rotated element on this page
   is decorative or repeats something set flat elsewhere.

   ROTATION IS A TRANSFORM APPLIED AT REST, which the reduced-motion block in
   globals.css cannot reach and should not — a still tilt is not motion. What
   the preference does switch off is the hover lift, which is why every one of
   those is written with Tailwind's motion-safe: variant rather than as a bare
   hover.
   --------------------------------------------------------------------------- */
export const TILT = ["-rotate-[1.4deg]", "rotate-[1.1deg]", "-rotate-[0.8deg]", "rotate-[1.5deg]"];

/* The hover lift shared by every pinned card. Gated on motion-safe, so a
   visitor who asked for less motion gets a card that does not move at all. */
export const LIFT =
  "transition-transform duration-200 ease-out motion-safe:hover:-translate-y-[2px]";

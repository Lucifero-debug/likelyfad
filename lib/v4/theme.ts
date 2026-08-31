/* ============================================================================
   /v4 — the tokens every section on THIS page agrees on.

   Siblings: lib/v2/theme.ts (the dark screening room) and lib/v3/theme.ts (the
   Butter-modelled light page). Three separate files rather than one
   parameterised module, for the same reason as before — the whole point of
   three directions is that a decision can differ, and a shared module would
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

   ON THIS PAGE THE SPACING IS THE HIERARCHY. The other two directions have a
   72px headline doing the shouting and can afford a loose seam here or there.
   This one sets almost everything between 13 and 15px, so nothing is bigger
   than anything else and position, grouping and whitespace are carrying the
   entire structure on their own.

   Which makes ONE RULE non-negotiable rather than merely tidy: THE GAP BETWEEN
   TWO ELEMENTS EXCEEDS THE PADDING INSIDE EITHER OF THEM. Two paragraphs 16
   apart inside blocks padded 24 do not read as two things, they read as one
   badly-set thing, and with no size contrast to fall back on there is nothing
   else telling the reader where one idea stops.
   --------------------------------------------------------------------------- */

/* Page gutter and measure. Narrower than the other two routes: at 13 to 15px
   a 1280 measure would run 140 characters to the line, and the whole direction
   depends on the prose being comfortable rather than merely small. */
export const WRAP = "mx-auto w-full max-w-[1040px] px-[clamp(24px,5vw,48px)]";

/* Section rhythm, top and bottom.

   THE NUMBER IN THE BRIEF IS THE SEAM, NOT THE PADDING. Two adjacent sections
   each contribute their own padding to the space between them, so 96 on both
   would put 192 to 256 between every pair. Half of the seam on each side lands
   the actual gap on 48+48=96 at a phone and 64+64=128 at a desktop, which is
   the 96 to 128 asked for. Both ends still sit on the scale. */
export const SECTION = "py-[clamp(48px,5vw,64px)]";

/* ---------------------------------------------------------------------------
   THE FLAT TYPE SCALE — 24 / 15 / 13 / 12, and nothing above 24.

   Four steps where the other routes have six, and the top of the ladder is
   where their body copy sits. There are no clamps here on purpose: fluid type
   exists to keep a 72px headline from overrunning a phone, and none of these
   sizes has that problem. Fixed sizes also mean the flatness is exactly as
   flat at 375 as it is at 1920, which is the point.
   --------------------------------------------------------------------------- */

/* 24. The studio statement, and the menu overlay. The largest type on the
   page, and only 1.6x the body — small enough that it reads as a paragraph
   set slightly up rather than as a headline. Leading is loose because a 24px
   paragraph at 1.1 would read as a headline whatever its size. */
export const T_24 = "text-[1.5rem] leading-[1.35] tracking-[-0.015em]";

/* 15. Running body copy. */
export const T_15 = "text-[0.9375rem] leading-[1.55]";

/* 13. Secondary prose: descriptions, FAQ answers, footnotes. */
export const T_13 = "text-[0.8125rem] leading-[1.5]";

/* 12. Mono only. */
export const T_12 = "text-[0.75rem]";

/* ---------------------------------------------------------------------------
   THE TWO TYPE ROLES. There is no third, because there is no display type on
   this page — which is also why /app/v4/layout.tsx does not download Archivo
   the way the other two routes do.
   --------------------------------------------------------------------------- */

/* Utility, and it is doing far more here than on the other routes. Uppercase
   mono at 0.14em is what makes a flat scale read as DELIBERATE rather than as
   unstyled: it marks the left rail as a rail and the labels as labels, using
   weight, case and letterspacing where the other directions would have used
   size. Kept from the homepage unchanged. */
export const MONO = "font-mono uppercase tracking-[0.14em]";

/* The hairline. Every division on this page is one of these; nothing is a
   card, nothing has a fill, and there is not a single border radius above 2px. */
export const HAIR = "border-seam";

/* ---------------------------------------------------------------------------
   THE RAIL — the layout idea the whole page is built from.

   Every section is the same two columns: a mono label parked left, the content
   right. Repeated identically eleven times, that rail becomes the structure a
   size ramp would otherwise have provided — you know what a thing is by WHERE
   it sits, not by how big it is.

   It collapses to one column under 761px, where 160px of rail would leave 180
   for the content.
   --------------------------------------------------------------------------- */
export const RAIL = "grid gap-[24px] tab:grid-cols-[160px_minmax(0,1fr)] tab:gap-[32px]";

/* The corner furniture is fixed, so an anchor jump would otherwise land a
   section's top edge underneath it. */
export const ANCHOR = "scroll-mt-[96px]";

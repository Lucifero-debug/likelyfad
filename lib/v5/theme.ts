/* ============================================================================
   /v5 — the tokens every section on THIS page agrees on.

   Siblings: lib/v2/theme.ts (the dark screening room), lib/v3/theme.ts (the
   Butter-modelled light page) and lib/v4/theme.ts (the open shop). Four
   separate files rather than one parameterised module, for the same reason as
   before — the whole point of four directions is that a decision can differ,
   and a shared module would quietly punish every place they do.

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
   THEM. Logo boxes are padded 16 and sit 24 apart. The work tiles carry no
   padding at all and sit 24 apart. The three why-us claims are padded 32 and
   are 48 apart, which is the case the brief calls out by name: cards padded 32
   sitting 32 apart do not read as three things, they read as one grid.

   THE ONE EXCEPTION, stated so it is not mistaken for a slip: the wedge under
   the hero is a SHAPE, not a gap. It is measured in vw because it has to hold
   a constant ANGLE across every viewport, and an angle cannot be expressed on
   a pixel scale. Nothing is spaced against it.
   --------------------------------------------------------------------------- */

/* Page gutter and measure. The widest of the four routes: this page is built
   out of full-width hairline rows, and a rule that stops well short of the
   edge stops reading as a rule and starts reading as a border on a box. */
export const WRAP = "mx-auto w-full max-w-[1280px] px-[clamp(24px,5vw,64px)]";

/* Section rhythm, top and bottom.

   THE NUMBER IN THE BRIEF IS THE SEAM, NOT THE PADDING. Two adjacent sections
   each contribute their own padding to the space between them, so 96 on both
   would put 192 to 256 between every pair. Half of the seam on each side lands
   the actual gap on 48+48=96 at a phone and 64+64=128 at a desktop, which is
   the 96 to 128 asked for. Both ends still sit on the scale. */
export const SECTION = "py-[clamp(48px,5vw,64px)]";

/* Section header row → the content it introduces. One step under the section
   seam, so a header belongs to its own section rather than floating between
   two of them. */
export const HEAD_GAP = "mt-[clamp(32px,4vw,48px)]";

/* ---------------------------------------------------------------------------
   THE TYPE SCALE — 120 / 56 / 32 / 20 / 15 / 12.

   Given as fixed desktop sizes, made responsive here. Each step LANDS EXACTLY
   on its number by ~1100px and holds it above, so the design at desktop is the
   design that was specified; the ramp only runs downward from there.

   Every step clears the brief's 1.25x rule with room:
     120/56 = 2.14   56/32 = 1.75   32/20 = 1.60   20/15 = 1.33   15/12 = 1.25

   The ladder compresses on the way down and has to: 15 and 12 are already at
   their readable floor, so the top steps come down to meet them rather than
   the bottom being scaled below legibility. The ORDER never changes at any
   width from 375 to 1920, which is the part that matters.
   --------------------------------------------------------------------------- */

/* 120. THE WORDMARK, AND NOTHING ELSE ON THE PAGE.

   THE MOBILE TREATMENT, DECIDED RATHER THAN INHERITED. It does not wrap and it
   does not crop: it SHRINKS, on one line, sized off the viewport so it spans
   very nearly the full gutter-to-gutter measure at every width. 16vw is picked
   so that LIKELYFAD — about 4.8em wide once the negative tracking is taken off
   — lands just inside the text column at 375 and stays inside it all the way
   up.

   WRAPPING WAS REJECTED because LIKELY / FAD breaks the word into two things
   that are not words. CROPPING WAS REJECTED because a wordmark running off the
   edge is a bet that the reader already knows the name, and this is the first
   time they are seeing it. SHRINKING loses the least: at 375 it is still 60px
   against 15px body copy, the same 4x shout it makes at desktop.

   It caps at 120 because 120 is what the scale says. That leaves it spanning
   about 570px of a 1440 viewport rather than the full width the reference
   uses, which is a deliberate reading of the spec over the reference. */
export const T_120 = "text-[clamp(3.75rem,16vw,7.5rem)]";

/* 56. The studio statement and the closing headline. The only other display
   type on the page. */
export const T_56 = "text-[clamp(2rem,1.1rem+3.6vw,3.5rem)]";

/* 32. Section leads and the three why-us claims. */
export const T_32 = "text-[clamp(1.5rem,1.1rem+1.4vw,2rem)]";

/* 20. Sub-heads, the stat figures, the FAQ questions. */
export const T_20 = "text-[1.25rem] leading-[1.4]";

/* 15. Running body copy. */
export const T_15 = "text-[0.9375rem] leading-[1.6]";

/* 12. Mono only — every section header row, every index, every piece of corner
   furniture on the hero. Never used for prose. */
export const T_12 = "text-[0.75rem]";

/* ---------------------------------------------------------------------------
   THE THREE TYPE ROLES.
   --------------------------------------------------------------------------- */

/* Display. Archivo at its NATURAL width, set tight. /v2 pushes the same file
   to wdth 118 for poster proportions; this page leaves it alone, because the
   wordmark is already the loudest thing that will ever be on the page and
   widening it as well would tip it from confident into shouting. Asking for
   the axis in the layout is what makes the file variable on weight, which is
   where this semibold comes from. */
export const DISPLAY = "font-wide font-semibold leading-[1.02] tracking-[-0.03em]";

/* Utility, and the thing that makes the whole document framing work. Every
   section header row, every index, every corner detail on the hero. Kept from
   the homepage unchanged — the brief is explicit that the existing mono is
   what makes the page read as a document rather than as a landing page. */
export const MONO = "font-mono uppercase tracking-[0.14em]";

/* The hairline, on the two grounds it has to work on. Every division on this
   page is one of these; there is not a single drop shadow anywhere. */
export const HAIR = "border-crease";
export const HAIR_LIT = "border-crease-lit";

/* The nav is fixed, so an anchor jump would otherwise land a section's top
   edge underneath it. */
export const ANCHOR = "scroll-mt-[96px]";

/* ---------------------------------------------------------------------------
   THE WEDGE — the angled cut between the hero and the section under it.

   ONE NUMBER, USED THREE WAYS AND NEVER APART. The white section below is
   clipped so its top edge runs from 4vw down on the left to 0 on the right,
   and it is pulled up by that same 4vw so the cut eats into the hero rather
   than leaving a gap under it. Change one and the others have to move with it,
   which is why they are one constant expressed three ways rather than three
   numbers that happen to agree today.

   IT CANNOT CLIP CONTENT. The section's own top padding is the wedge PLUS the
   normal section padding, so the first line inside always clears the deepest
   point of the cut, at every viewport, with the full section seam still under
   it.

   IT CANNOT CAUSE HORIZONTAL OVERFLOW. clip-path removes paint, it never
   creates layout, and a negative margin on the block axis cannot push anything
   sideways. That is the whole reason the wedge is a clip rather than a rotated
   pseudo-element, which is the usual way this is done and which overflows at
   every narrow width unless it is separately caged.
   --------------------------------------------------------------------------- */
export const WEDGE_PULL = "-mt-[4vw]";
export const WEDGE_CLIP = "[clip-path:polygon(0_4vw,100%_0,100%_100%,0_100%)]";
export const WEDGE_PAD = "pt-[calc(4vw+clamp(48px,5vw,64px))]";

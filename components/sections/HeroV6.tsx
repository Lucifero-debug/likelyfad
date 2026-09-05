"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_H1, TEXT_LEAD, TEXT_META } from "@/lib/ui";
import { ReelWallV6, type ReelColumns } from "./ReelWallV6";

const { hero } = content;

/* ============================================================================
   THE SPLIT HERO — the homepage hero's copy, beside the drifting reel wall.

   THE COPY COLUMN IS components/sections/Hero.tsx, PORTED VERBATIM. Every
   typographic decision below — the kicker's leading rule, the 20ch/22ch
   headline cap, the four different top margins, the optical indent, the
   staggered entrance, the gradient run inside the headline — is that file's,
   and the reasoning for each is documented there rather than repeated here. If
   the two ever disagree, Hero.tsx is the one that is right.

   WHAT IS NOT PORTED IS THE FRAME. Hero.tsx is written to sit inside the SPLIT
   wrapper in app/page.tsx, which owns the grid, the page cap, the horizontal
   padding and the clearance under the fixed nav — which is why HERO there
   zeroes its own padding at `lap:`. This component owns all of that itself, so
   the section and grid below are its own and the copy column starts at the
   flex column Hero.tsx wraps its children in.

   THE GRADIENT IS BACK, and it is the one thing here that was a deliberate
   decision the other way. The earlier version of this file stripped the
   asterisks out of the headline and painted the CTA flat magenta, on the
   argument that a pink-to-purple ramp is the most recognisable AI-generated
   design tell in circulation and a strange thing to wear on a page whose pitch
   is that its output does not read as AI. Matching Hero.tsx means RevealText
   gets the asterisks and the CTA goes back to variant="grad". Worth knowing
   which decision was traded away, not worth re-litigating.

   THE WALL IS A FIXED-HEIGHT, overflow:hidden BOX. Its height is set here
   rather than derived from the clips inside it, so no amount of travel, no
   aspect ratio and no number of clips can make it grow or push the page around
   — which is what makes ReelWallV6's endless lanes survivable in a layout.
   It is also the crop for the 3D stage, whose overhang is measured against it.
   ========================================================================== */

/* Verbatim from Hero.tsx — the four supporting lines fade and lift together on
   load, staggered 90ms apart behind a 150ms delay, while the headline's own
   word reveal starts at 200ms and runs underneath them.

   The three-phase shape is what lets the server render everything AT REST, so
   the hero reads with no JS at all and the offset is applied once before the
   first paint rather than baked into the HTML. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useHeroFade() {
  const [phase, setPhase] = useState<"rest" | "armed" | "in">("rest");
  useIsoLayoutEffect(() => setPhase("armed"), []);
  useEffect(() => {
    if (phase !== "armed") return;
    const t = setTimeout(() => setPhase("in"), 16);
    return () => clearTimeout(t);
  }, [phase]);

  /* i is the element's place in the stagger, not its DOM order — the headline
     sits between #0 and #1 and is animated by RevealText instead. */
  return (i: number) => ({
    style: phase === "in" ? { transitionDelay: `${150 + i * 90}ms` } : undefined,
    className:
      phase === "armed"
        ? "translate-y-[22px] opacity-0"
        : phase === "in"
          ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          : "",
  });
}

/* OPTICAL ALIGNMENT for the wrapped headline, verbatim from Hero.tsx. Every
   line starts at the same x — the boxes are flush, the INK is not, because the
   capital A opening line 1 runs to the edge of its glyph box while the round
   lowercase a opening line 2 sits inset. The negative margin moves the whole
   block left and the indent puts the first line back, so line 1 does not move
   and every wrapped line after it shifts by the bearing difference. A taste
   knob, not a measurement; 0 switches it off. Laptop only, where the copy is
   left-aligned. */
const OPTICAL = "lap:ml-[-0.04em] lap:indent-[0.04em]";

/* The two ends of the gap scale, and the rule behind them: the four columns of
   the wall are ONE object, so the space between them (clamp(8px,1.2vw,12px),
   in ReelWallV6, which is the work wall's track gap) has to
   be clearly smaller than the space between the copy and the wall, which is the
   real division on the page.

   THE `lap:` END RAMPS WITH THE STAGE, on the same 1920-inert pattern as
   STAGE below: 3.333vw is exactly 64 at a 1920 viewport, so nothing moves at or
   under it, and it opens to 80 — the next rung up — as the stage widens. The
   ratio against the wall column gap is what actually has to survive the change,
   and 80:16 is the same 5:1 reading as 64:16. A fixed 64 beside a stage 400px
   wider would have narrowed that division exactly where there is most room for
   it. */
const SPLIT_GAP = "gap-[48px] lap:gap-[clamp(64px,3.333vw,80px)]";

/* THE STAGE — the hero's own cap and gutter, and WRAP's in lib/ui.ts are THE
   SAME MEASUREMENT. It is what puts every section's first column on the same x
   as the headline and the wall's left edge; the long note in that file is the
   argument for the number and for the ramp, and this is the second of the two
   places it is written. Move one, move both.

   Spelled out here rather than imported because Tailwind scans source TEXT — a
   class assembled from a variable is never emitted at all. Same constraint as
   the clamps at the foot of lib/ui.ts. */
const STAGE = "mx-auto w-full max-w-[clamp(1520px,79.167vw,1920px)] px-[clamp(24px,5vw,64px)]";

/* THE WALL'S FOOTPRINT — AND IT STARTS AT `tab`, NOT AT EVERY WIDTH.

   From `tab` up the wall is four vertical columns and the height is the crop:
   it is the `containerHeight` in ReelWallV6's seamlessness invariant, and what
   stops the endless lanes pushing the page around.

   BELOW `tab` THE WALL IS THREE HORIZONTAL ROWS AND ITS HEIGHT IS THE CONTENT'S.
   Pinning it there would be actively wrong: the rows are stacked, so a 400px box
   gives each row 123px, which back-solves through 9:16 to a 69px-wide clip —
   footage too small to read on the one device where the wall IS the page. Left
   to the content, each clip takes clamp(88,22vw,168) and the three rows come to
   roughly 500px on a phone. The crop that matters at that width is horizontal,
   and it is the wall's own width, which needs no declaring.

   FROM `lap:` THE WALL TAKES THE WHOLE LEFTOVER HEIGHT, AND THAT IS WHAT
   CLOSED THE GAP AT THE TOP AND BOTTOM OF THE SECTION.

   It used to be a FRACTION of the viewport — min(72svh, 680px) — inside a
   section that is min-h:100svh and centres its row. Those two do not agree on
   tall screens, and the disagreement is pure dead paper: at 2560x1440 the
   available box is 1440 - 96 - 64 = 1280, the wall and its caption came to 716,
   and the 564px left over was split by `items-center` into 282px of nothing
   above the hero and 282px below — ON TOP of the 96/64 the section already
   declares. The px ceiling made it worse the taller the display got, because it
   stopped scaling at a 944px window while the section never stops.

   Subtracting instead of scaling makes the two agree by construction. The three
   terms are the section's own box, written out rather than folded into one
   number so each stays traceable to the thing it pays for:

     96px — the section's pt, the fixed nav's clearance (91px tall at rest,
            and transparent until scrolled, so this one cannot come down)
     48px — the section's pb
     48px — the caption row under the wall: its 16 top margin plus one line of
            TEXT_META at the body's 1.6 leading, which is ~38 at the 0.85rem
            ceiling. Rounded UP to the next rung on purpose. Subtracting the
            measured 38 leaves the column 2px TALLER than the box it is being
            fitted into, and a hero that overshoots 100svh by two pixels is a
            scrollbar on a page that should not have one. 10px of slack costs
            5px of centring at each end and cannot round the wrong way.

   SO THE ONLY VERTICAL SPACE LEFT IS THE PADDING THE SECTION DECLARES. The row
   now measures exactly the available height, `items-center` has nothing to
   distribute, and the hero fills any display instead of floating in the middle
   of one. IF EITHER PADDING MOVES, THIS MOVES WITH IT — they are one
   measurement in two places, the same deal STAGE has with WRAP.

   888px IS THE SECTION'S OWN CEILING, RESTATED. The section stops at 1080
   (see the note on it), and 888 is what is left of 1080 after the same three
   terms — so the wall stops growing at exactly the height the band stops
   growing at, and neither one ends up with slack the other has to absorb. The
   two numbers move together or not at all.

   55vw WAS THE SEAMLESSNESS INVARIANT AND IS NOW SLACK, WHICH IS WORTH SAYING
   PLAINLY RATHER THAN LEAVING THE OLD CLAIM STANDING. ReelWallV6 needs
   `(sets - 1) x oneSetHeight >= containerHeight` or the loop visibly hitches
   once a cycle, and a set is four clips tall — so it scales with the wall's
   WIDTH while the two terms above scale with its HEIGHT. A narrow window on a
   tall monitor is where those come apart, which is why the cap is keyed to
   width at all.

   TWO CORRECTIONS TO WHAT THIS NOTE USED TO SAY, both found by measuring the
   running page rather than by arithmetic. First, the container the set is
   checked against is NOT this height: the wall's cells are `-inset-y-[20%]`, so
   the box a lane is clipped by is 1.4x it — 529 becomes 740, 888 becomes 1243.
   Every margin quoted here before was flattering by that factor. Second, the
   clips are the work wall's size now (see the note on the clamp in ReelWallV6),
   so a set caps at 1172 rather than 1367, and at 1920 and up that pair — 1172
   against 1243 — was the wrong way round. It is COLUMN_SETS at 3, not this cap,
   that carries the invariant today.

   MEASURED AT TWELVE VIEWPORTS AFTER THAT CHANGE, `(sets-1) x set` vs container:
   961x900 1742/740, 961x1440 1742/740, 1200 2144/924, 1440 2344/991, 1920 2344/
   1243, 2560 2344/1243. The tightest is 89% of margin, where it used to be a few
   per cent, so this cap is no longer what is holding the loop together — it is a
   design ceiling again, and the 55vw is what keeps a wide short window from
   giving the wall more height than the hero copy beside it.

   THERE USED TO BE A FOURTH TERM, 1400px, guarding the case 55vw cannot: STAGE
   stops at 1920, so past a ~2425 viewport the set stops growing at ~1776 while
   55vw keeps reading the whole display, and on a 3440x2160 panel that pair
   alone would have asked for 1892. The 888 is far below that and binds first at
   every size, so the term is gone rather than kept as decoration. It comes back
   if the section ceiling is ever raised past ~1590.

   `debug` prints the two numbers it is actually checking. */
const WALL_HEIGHT =
  "tab:h-[clamp(320px,48svh,448px)] lap:h-[min(100svh_-_96px_-_48px_-_48px,888px,55vw)]";

/* CORNER TO CORNER BELOW `tab`, AND ONLY THERE.

   The wall sits inside STAGE, which pads `clamp(24px,5vw,64px)` a side, and on
   a phone that padding is the whole difference between a wall and a strip: the
   rows run off both edges of the screen or they sit in a frame that announces
   how far they DON'T run. This cancels the padding for the wall alone — the
   caption below it stays in the column with the copy, which is where a line of
   type belongs.

   THE EXPRESSION MUST BE STAGE'S, CHARACTER FOR CHARACTER. It is one
   measurement in two places, the same deal WALL_HEIGHT has with the section's
   96 and 48: a negative margin that does not exactly cancel the padding either
   leaves a sliver of paper at each edge or pushes the wall past the viewport
   and gives the page a horizontal scrollbar. Change STAGE and change this.

   IT IS NOT A FREE 48px, AND THE COPY COUNT PAYS FOR IT NOW. Below `tab` the
   lanes run sideways and ReelWallV6's invariant is
   `(sets - 1) x oneSetWidth >= the wall's own width` — so widening the wall to
   the full viewport tightened the very margin that keeps the loop seamless.
   Four clips at the work wall's row size come to ~620px, which stops outrunning
   a full-bleed viewport at ~615px wide; the band from there to `tab` is inside
   the range this layout covers, and it is one of the two bands that took
   COLUMN_SETS from 2 to 3. Measured at 760, the worst width in the band, a lane
   now carries 1240 against a 760 container.

   SO THE ORDER OF OPERATIONS HAS CHANGED. It used to be the clip clamp that
   absorbed a wider bleed; the clamp is the work wall's now and is not free to
   move, so widening the bleed further spends copies instead — four more <video>
   per lane. Check the numbers in ReelWallV6's COLUMN_SETS note before doing it.

   `mx` RATHER THAN A NEGATIVE INSET OR A width: 100vw. The wall is a block in a
   grid cell, so symmetric negative margins let it resolve its own width against
   a box 48px wider than the cell — no positioning, no stacking context, and
   nothing that has to know how wide the viewport is. 100vw would also count the
   scrollbar, which is how full-bleed usually earns its horizontal scroll. */
const WALL_BLEED = "-mx-[clamp(24px,5vw,64px)] tab:mx-0";

export function HeroV6({
  columns,
  debug = false,
}: {
  /** Four arrays of { src, poster, alt }. Nothing about the clips is hardcoded
      in either component — the wall renders whatever it is handed, so it can be
      pointed at a different library, a curated set, or fixtures in a test. */
  columns: ReelColumns;
  /** Forwarded to the wall. Turns on the live lane/invariant readout. */
  debug?: boolean;
}) {
  const fade = useHeroFade();
  const [kicker, sub, ctas, reassure] = [fade(0), fade(1), fade(2), fade(3)];

  return (
    <section
      /* The nav's wordmark links to #top, and the hero this would replace
         carries the id. Having it here is what makes the swap a one-liner
         rather than a one-liner plus something to remember. Correct only while
         ONE hero is mounted. */
      id="top"
      /* 100svh minus the fixed nav. min-h rather than h, so a short window
         scrolls the copy instead of clipping it.

         AND IT STOPS AT 1080. A band that tracks 100svh forever does not make a
         tall display look full, it makes the COPY look lost: the wall grows
         with the viewport, the copy does not, and `items-center` turns the
         difference into empty paper above and below the headline. At 2560x1440
         that was 336px at each end — more than four times the section padding,
         and the thing that actually read as "too much gap".

         1080 is the height of a full-HD screen, so nothing at or below 1080svh
         moves at all; it only binds on displays taller than that, which are
         exactly the ones where the drift showed. The hero then ends around 80%
         of a 1440 viewport, which also puts the top of Why-us on screen and
         gives the fold something to point at.

         RAISE THIS NUMBER TO MAKE THE HERO TALLER AGAIN — it and the 888 in
         WALL_HEIGHT are one measurement (888 = 1080 - 96 - 48 - 48).

         THE 96 AND THE 48 ARE READ BY WALL_HEIGHT, which subtracts both from
         100svh so the wall fills whatever this section leaves and the row does
         not float in the middle of a tall display. Change either number here
         and change it there — the note above WALL_HEIGHT has the arithmetic.

         THE BOTTOM CAME DOWN A RUNG, 64 TO 48, AND THE TOP CANNOT FOLLOW IT.
         The 96 is not taste, it is the fixed nav's clearance, and the nav is
         91px tall at rest and TRANSPARENT until it scrolls — so 96 already
         leaves only ~10px between the nav's ink and the top of the wall. One
         rung down and the first row of clips runs underneath live nav links on
         a bare paper ground, with nothing behind them to separate the two. The
         top of this section is spent, and the seam under it is where the air
         actually was.

         THE THIRD TERM AT `lap:` IS WALL_HEIGHT'S 55vw CAP, RUN BACKWARDS, and
         it is what stops the row floating on a NARROW-BUT-TALL viewport. The
         ceiling above answers to the viewport; the wall answers to 55vw as
         well, and between `lap:` (961px) and ~1400px those two stop agreeing:
         the wall shrinks with the width while the band still claims its 1080,
         and `items-center` splits the difference into paper above and below.
         Measured, that was 264px above and 216px below on an iPad Pro held
         portrait (1024x1366) and 276/228 in Chrome's desktop-site mode
         (980x2125) — against the 101/53 the same page gets at 1920 and above.

         55vw + 96 + 48 + 48 is WALL_HEIGHT's `100svh - 96 - 48 - 48` solved for
         the height that clause wants, so the band asks for exactly what the
         wall, its caption and the two paddings need and nothing beyond it. It
         is INERT WHERE THE WALL IS NOT 55vw-BOUND: past ~1600px wide the 1080
         is the smaller term and every desktop width is untouched. The residual
         slack is ~10px at every width now, which is what 1920 always had.

         IT IS THE SAME MEASUREMENT AS WALL_HEIGHT, WRITTEN BACKWARDS — the two
         96/48/48 triples move together or the air comes back. Scoped to `lap:`
         because the 55vw cap is: below it the wall is `clamp(320px,48svh,448px)`
         and the copy stacks over it, so the content already outgrows any floor
         this would set and the base rule is the one that reads. */
      className="relative flex min-h-[min(100svh,1080px)] items-center bg-paper pt-[96px] pb-[48px] lap:min-h-[min(100svh,1080px,55vw_+_96px_+_48px_+_48px)]"
    >
      {/* 40/60 on a laptop, stacked below it. The copy is FIRST in source, so
          the stacked order is copy then wall with nothing to declare. */}
      <div
        className={`${STAGE} grid items-center ${SPLIT_GAP} lap:grid-cols-[40fr_60fr]`}
      >
        {/* ---- The copy, straight from Hero.tsx ----

            NO `gap` ON THIS COLUMN, and that is Hero.tsx's decision carried
            over: every gap here is the `mt-*` of the child below, because the
            four gaps are four different relationships and one gap cannot tell
            them apart — 8 under the kicker, which belongs to the headline; 24
            under the headline; 32 under the sub, the step out of the heading
            block and into the action; 16 under the buttons, because the
            reassurance belongs to them. A `gap` sums with each margin and
            flattens that ordering.

            Centred below the split, left-aligned at `lap:`, exactly as the
            original is. */}
        <div className="flex flex-col items-center text-center lap:items-start lap:text-left">
          <span
            style={kicker.style}
            className={`inline-flex items-center gap-[0.65em] font-mono ${TEXT_META} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[1.7rem] before:bg-current before:opacity-55 before:content-[''] ${kicker.className}`}
          >
            {hero.eyebrow}
          </span>

          {/* The asterisks in lib/content.ts mark the phrase RevealText paints
              with the brand ramp; they are passed through rather than stripped,
              which is what puts the gradient back. `ch` measures the "0" glyph
              of the element's OWN font, so this cap resizes if the heading face
              changes — re-measure if it does. */}
          <h1
            className={`mt-2 max-w-[20ch] text-balance font-display ${TEXT_H1} font-bold leading-[1.04] tracking-[-0.022em] lap:max-w-[22ch] ${OPTICAL}`}
          >
            <RevealText text={hero.headline} immediate delay={200} />
          </h1>

          <p
            style={sub.style}
            className={`mt-6 max-w-[48ch] text-pretty ${TEXT_LEAD} leading-[1.45] text-ink-soft lap:max-w-[42ch] ${sub.className}`}
          >
            {hero.subline}
          </p>

          <div
            style={ctas.style}
            className={`mt-8 flex flex-wrap justify-center gap-2 lap:justify-start ${ctas.className}`}
          >
            <Button contact variant="grad" withArrow>
              {hero.primaryCta}
            </Button>
            <Button href={hero.secondaryHref} variant="ghost" className="border border-black">
              {hero.secondaryCta}
            </Button>
          </div>

          <p
            style={reassure.style}
            className={`mt-4 font-mono ${TEXT_META} tracking-[0.03em] text-ink-faint ${reassure.className}`}
          >
            {hero.reassurance}
          </p>
        </div>

        {/* ---- The wall ---- */}
        <div className="min-w-0">
          <ReelWallV6 columns={columns} className={`${WALL_BLEED} ${WALL_HEIGHT}`} debug={debug} />

          {/* CENTRED AT EVERY WIDTH, AND `lap:text-left` IS WHAT WENT. The
              caption is a label for the wall rather than a line of the hero
              copy, so it belongs under the middle of the thing it names. Left
              aligning it above `lap` lined it up with the copy column instead —
              which put it under the wall's far edge, the one the tilt is
              already shrinking, and read as a stray line of type that had come
              loose from the paragraph on the other side.

              text-center ALONE CENTRES IT IN THE COLUMN, WHICH IS NOT THE
              WALL'S CENTRE, AND THE 5% IS WHAT CLOSES THAT. The stage inside
              the wall is inset -13% left and 4.5% right, so the box the columns
              sit in is centred 8.75% left of the column's own centre; the -22
              degree turn then magnifies the near (right) side and shrinks the
              far one, which pushes the PROJECTED content back toward the right.
              The two do not cancel — they leave the clips sitting a little left
              of centre, and a caption at the column's centre reads as hanging
              off the near edge of the wall.

              5% IS MEASURED, NOT DERIVED, because the visual centre depends on
              the projection and no expression of the two insets gives it: the
              box says 8.75% and the rendered clips say ~5%. Taken on the
              running page as (clip bounding centre - column centre) / column
              width: 961 -5.30%, 1100 -4.93%, 1200 -4.63%, 1440 -4.80%, 1700
              -4.81%, 1920 -5.49%, 2560 -6.99%. Flat at ~5% across the whole
              range a laptop or monitor actually is, drifting only past ~2200
              where STAGE's 1920 cap stops the wall growing while the column
              keeps going.

              A PERCENTAGE OF THE ELEMENT, WHICH IS THE COLUMN. The caption is a
              block, so its width IS the column's and `-translate-x-[5%]` is 5%
              of the same quantity the numbers above are a fraction of. It is a
              transform, so it moves nothing else and costs no layout.

              `tab:` BECAUSE THE ASYMMETRY IS THE 3D STAGE'S. Below that
              breakpoint there is no stage, no tilt and no insets — the wall is
              full-bleed rows and its centre IS the column's, so the correction
              would be a 5% error rather than a fix.

              VERIFIED AFTER THE FACT, same method, residual between the
              caption's centre and the clips': 390 and 700 land exactly (no
              correction applies there), 761 +7px, 900 +12px, 961 +2, 1200 -2,
              1440 -2, 1920 +4, 2560 +20. Everything from `lap` up is inside
              four pixels; the 2560 figure is the same cap drift the list above
              shows and is 2% of a wall a metre wide.

              RE-MEASURE IF THE TILT OR EITHER INSET MOVES. An offset that is
              right for -22 degrees is wrong for -15, and a stale nudge is worse
              than the misalignment it was added for. */}
          <p
            className={`mt-[16px] text-center font-mono ${TEXT_META} uppercase tracking-[0.06em] text-ink-faint tab:-translate-x-[5%]`}
          >
            {content.reels.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

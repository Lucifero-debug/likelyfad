"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_H1, TEXT_LEAD, TEXT_META } from "@/lib/ui";
import { ReelWallV6, type ReelColumns } from "./ReelWallV6";

const { hero } = content;

/* ============================================================================
   THE SPLIT HERO — the homepage hero's copy, beside the parallax reel wall.

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
   — which is what makes ReelWallV6's uncapped parallax survivable in a layout.
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
   the wall are ONE object, so the space between them (16, in ReelWallV6) has to
   be clearly smaller than the space between the copy and the wall, which is the
   real division on the page. */
const SPLIT_GAP = "gap-[48px] lap:gap-[64px]";

/* THE WALL'S FOOTPRINT — AND IT STARTS AT `tab`, NOT AT EVERY WIDTH.

   From `tab` up the wall is four vertical columns and the height is the crop:
   it is the `containerHeight` in ReelWallV6's seamlessness invariant, and what
   stops the uncapped parallax pushing the page around.

   BELOW `tab` THE WALL IS THREE HORIZONTAL ROWS AND ITS HEIGHT IS THE CONTENT'S.
   Pinning it there would be actively wrong: the rows are stacked, so a 400px box
   gives each row 123px, which back-solves through 9:16 to a 69px-wide clip —
   footage too small to read on the one device where the wall IS the page. Left
   to the content, each clip takes clamp(88,22vw,168) and the three rows come to
   roughly 500px on a phone. The crop that matters at that width is horizontal,
   and it is the wall's own width, which needs no declaring. */
const WALL_HEIGHT = "tab:h-[clamp(320px,48svh,448px)] lap:h-[min(72svh,680px)]";

export function HeroV6({
  columns,
  debug = false,
}: {
  /** Four arrays of { src, poster, alt }. Nothing about the clips is hardcoded
      in either component — the wall renders whatever it is handed, so it can be
      pointed at a different library, a curated set, or fixtures in a test. */
  columns: ReelColumns;
  /** Forwarded to the wall. Turns on the live parallax readout. */
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
      /* 100svh minus the fixed nav, which is 72px at rest. min-h rather than h,
         so a short window scrolls the copy instead of clipping it. */
      className="relative flex min-h-[100svh] items-center bg-paper pt-[96px] pb-[64px]"
    >
      {/* 40/60 on a laptop, stacked below it. The copy is FIRST in source, so
          the stacked order is copy then wall with nothing to declare. */}
      <div
        className={`mx-auto grid w-full max-w-[1520px] items-center ${SPLIT_GAP} px-[clamp(24px,5vw,64px)] lap:grid-cols-[40fr_60fr]`}
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
          <ReelWallV6 columns={columns} className={WALL_HEIGHT} debug={debug} />

          <p
            className={`mt-[16px] text-center font-mono ${TEXT_META} uppercase tracking-[0.06em] text-ink-faint lap:text-left`}
          >
            {content.reels.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

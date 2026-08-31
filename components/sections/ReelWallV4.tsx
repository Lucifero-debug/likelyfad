"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { Lightbox } from "@/components/ui/Lightbox";
import { TEXT_META } from "@/lib/ui";

/* REEL WALL — V4. "FILMSTRIP". One horizontal strip, edge to edge, under the
   masthead rather than beside it.

   WHAT SEPARATES V4 FROM V1, V2 AND V3:

     1. ONE LANE, HORIZONTAL, AT EVERY WIDTH. The other three are three or four
        VERTICAL lanes on a laptop that flip to horizontal rows on a phone. This
        is a single row that never changes direction, so the layout a reader
        sees on their phone is the layout on a monitor — just fewer frames of
        it. Nothing about it needs a breakpoint.
     2. IT IS FULL BLEED. No 1180 cap, no gutter, no rounded panel. The strip
        runs off both edges of the viewport, which is what makes it read as a
        length of film passing rather than as a component sitting on a page.
     3. THE FRAMES ARE SQUARE-CORNERED. Every other wall here rounds its cards
        16px. A frame on a strip is a rectangle, and the rounding was the one
        thing making these read as cards.
     4. THE SIGNATURE — A SPROCKET RAIL above and below. Two perforated bands,
        drawn with a repeating background rather than an image: a 6px slot every
        20px, in `--color-line`, which is the same 10% ink every hairline on
        this page uses. It is the only ornament in the whole hero, and it earns
        its place by being the material of the thing this studio makes a
        convincing fake of.
        The slots are rectangular. Real perforations are rounded rectangles, and
        at 6 × 6 the radius would be about one pixel of it — not worth a second
        gradient layer to draw.

   IT IS A SIBLING OF HeroV4, not nested — the two stack. Mounting the pair
   means replacing the SPLIT block in app/page.tsx with `<HeroV4 />` and
   `<ReelWallV4 />` one after the other, with no wrapper.

   Carried over unchanged, because it is machinery rather than styling: the
   marquee (the lane renders its clips twice and slides by exactly half its own
   length, so the loop is seamless with no JS), `useInViewPlay`, and the
   lightbox — unlike V3's ground, this strip IS a gallery and every frame opens.

   The clamps run DOWNWARD only. */

/* One lane, so the whole window goes in it. Twelve is what it takes for a
   single row to outrun a 2560px monitor without the wrap point coming into
   frame — three vertical lanes get to share that work, and one row does not. */
const PER_LANE = 12;

/* The same window of the library the other hero walls take, so the work wall
   further down still starts where this one ends and nothing appears twice.
   Hoisted out of the component because it is pure over module constants. */
const PICKS = takeReels(content.reels.videos, 0, PER_LANE);

/* THE SPROCKET RAIL. A 6px slot on a 20px pitch, centred in a 14px band.

   One background layer, no image, no extra elements: a linear-gradient with
   hard stops draws one slot and one gap, `background-size` sets the pitch, and
   `repeat-x` runs it the width of the viewport. */
const RAIL =
  "h-[14px] w-full shrink-0 " +
  "bg-[linear-gradient(90deg,var(--color-line)_0_6px,transparent_6px_20px)] " +
  "bg-[length:20px_6px] bg-[position:0_center] bg-repeat-x";

/* Transform and opacity only in the transition. box-shadow can never be in
   here: it repaints a blur every frame, around a card the marquee is
   translating and a video is decoding into. */
const FRAME =
  "relative block aspect-[9/16] w-full overflow-hidden bg-poster " +
  "transition-[transform,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:scale-[1.04] active:brightness-90";

function Frame({
  reel,
  onOpen,
  label,
}: {
  reel: Reel;
  onOpen: () => void;
  label: string;
}) {
  const video = useInViewPlay("strip");

  return (
    <div className="relative w-[clamp(104px,13vw,176px)] flex-none hover:z-[3]">
      <button type="button" onClick={onOpen} aria-label={label} className={FRAME}>
        {/* The clip in its own box: Safari has been unreliable about clipping
            video to a parent's corners, and overflow:hidden on a plain box is
            not. There is no radius here, but the box is still what keeps the
            scale transform from bleeding the video past its own edge. */}
        <span className="absolute inset-0 overflow-hidden">
          <video
            ref={video}
            src={reel.src}
            poster={reel.poster ?? undefined}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            className="size-full object-cover"
          />
        </span>
      </button>
    </div>
  );
}

export function ReelWallV4() {
  const [active, setActive] = useState<Reel | null>(null);

  return (
    <section aria-label="Our work" className="relative w-full overflow-hidden bg-paper">
      <div className={RAIL} aria-hidden="true" />

      <div
        /* `contain` scopes the marquee's per-frame layout and paint
           invalidation to the strip rather than the whole page. The dim is
           `:not(:hover)` rather than dim-all-then-undim-one: two rules writing
           opacity at equal specificity would have their winner decided by emit
           order. */
        className="relative overflow-hidden py-2 [contain:layout_paint_style] [&:hover_button:not(:hover)]:opacity-45"
      >
        <div
          /* HOVERING A FRAME STOPS THE STRIP. With one lane there is no "and
             only that lane" to qualify — the whole thing holds still, which is
             the right behaviour when the reader has reached for something.
             `:has(button:hover)` rather than a bare `:hover`: the track is wider
             than the frame it shows through, and a bare hover would also fire in
             the gaps, which reads as the strip stalling at random. */
          className="flex w-max animate-lane-x gap-2 will-change-transform [&:has(button:hover)]:[animation-play-state:paused]"
          style={{ animationDuration: "96s" }}
        >
          {[...PICKS, ...PICKS].map((clip, i) => (
            <Frame
              key={i}
              reel={clip}
              onOpen={() => setActive(clip)}
              label={`Play reel ${(i % PER_LANE) + 1} full size`}
            />
          ))}
        </div>

        {/* Edge fades, painted on top rather than masked: a mask re-composites
            every moving layer underneath it each frame, while a gradient is a
            flat paint over a known solid background and looks identical. Only
            the sides, because the rails close the strip top and bottom. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[4] w-[9%] bg-[linear-gradient(to_right,var(--fade-stops))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-[4] w-[9%] bg-[linear-gradient(to_left,var(--fade-stops))]"
        />
      </div>

      <div className={RAIL} aria-hidden="true" />

      <p
        className={`px-[clamp(24px,5vw,64px)] pb-[clamp(32px,4vw,48px)] pt-[clamp(16px,2vw,24px)] font-mono ${TEXT_META} uppercase tracking-[0.06em] text-ink-faint`}
      >
        {content.reels.caption}
      </p>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

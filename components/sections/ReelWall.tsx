"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { Lightbox } from "@/components/ui/Lightbox";
import { MotionToggle } from "@/components/ui/MotionToggle";

/* Wall of autoplaying portrait reels, sitting beside the hero on a laptop and
   below it on a phone.

     lap and up → three vertical columns:  down · up · down
     below lap  → three horizontal rows:   right · left · right

   ONE set of markup for both. The lane's flex direction and the animation flip
   at the breakpoint; nothing is rendered twice and no clip is fetched twice.

   NOTHING HERE IS 3D. Every card faces the viewer square on — no rotateY, no
   translateZ, no perspective. The only depth cue is that the outer lanes rest
   a hair smaller than the middle one (0.94 against 0.97); flatten those three
   numbers to one value if you want the columns strictly identical.

   Each lane renders its clips TWICE and slides by exactly half its own length,
   which is why the loop is seamless with no JS driving it. Alternating
   direction is one `animation-direction: reverse`, and the differing durations
   stop the three lanes locking into step. */

const LANES = 3;
/* Distinct clips per lane. Six is enough for the track to outrun the tallest
   lane at any viewport, so the wrap point never comes into frame. */
const PER_LANE = 6;

const LANE_STYLE = [
  { duration: "78s", reverse: false, rest: "lap:scale-[0.94]" },
  { duration: "96s", reverse: true, rest: "lap:scale-[0.97]" },
  { duration: "86s", reverse: false, rest: "lap:scale-[0.94]" },
];

/* Deal the wall's window of the library out across lanes. takeReels spreads
   clips from the same shoot far apart, so three near-identical doctor spots
   never land in one lane. The work wall's window starts where this one ends,
   so nothing appears twice on the page.

   Hoisted out of the component because it is pure over module constants. It
   used to run per render, so the whole union-find-and-sort in reelOrder re-ran
   on every pause toggle and every lightbox open and close. */
const PICKS = takeReels(content.reels.videos, 0, LANES * PER_LANE);
const LANES_OF_PICKS = Array.from({ length: LANES }, (_, i) =>
  PICKS.slice(i * PER_LANE, (i + 1) * PER_LANE)
);

/* Written as one string because the card carries a lot of state. `hover:scale`
   appears twice — once bare, once under `lap:` — because the resting scale at
   `lap:` lives inside a media query and would otherwise out-order a bare
   `hover:` on desktop.

   Transform and opacity only in the transition. box-shadow was in here once
   and is the one property that can never be: it repaints a 60px blur every
   frame, around a card the marquee is translating and a video is decoding
   into. The pink hover shadow is therefore a second layer cross-faded over the
   resting one (the ::after), not a second keyframe of it. */
const CARD =
  "relative block w-full aspect-[9/16] rounded-2xl border border-line bg-poster " +
  "shadow-[var(--shadow)] scale-[0.95] active:brightness-90 " +
  "transition-[transform,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:scale-[1.0957] lap:hover:scale-[1.0957] " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[15px] " +
  "after:shadow-[var(--shadow-pink)] after:opacity-0 after:content-[''] " +
  "after:transition-opacity after:duration-[280ms] hover:after:opacity-100";

function Card({
  reel,
  rest,
  lane,
  onOpen,
  label,
}: {
  reel: Reel;
  rest: string;
  lane: string;
  onOpen: () => void;
  label: string;
}) {
  const video = useInViewPlay(lane);

  return (
    /* The positioning box. Hovering raises it over its neighbours, which is
       what lets the magnified card overlap them instead of clipping flat. */
    <div className="relative w-[clamp(112px,27vw,168px)] flex-none hover:z-[3] lap:w-full">
      <button type="button" onClick={onOpen} aria-label={label} className={`${CARD} ${rest}`}>
        {/* The clip, in its own box so the card is free to paint shadows
            outside itself. A wrapper rather than border-radius straight on the
            <video>: Safari has been unreliable about clipping video to its own
            corners, and overflow:hidden on a plain box is not. Inset by the
            1px border, hence 15 rather than 16. */}
        <span className="absolute inset-0 overflow-hidden rounded-[15px]">
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
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,15,25,0.16),transparent_42%)]"
          />
        </span>
      </button>
    </div>
  );
}

export function ReelWall() {
  const [active, setActive] = useState<Reel | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Our work"
      /* Below the split, Why us follows immediately and this padding is the
         WHOLE seam to it — SECTION's clamp, spelled out, so that boundary is the
         same size as every other one on the page. It used to be zero, with Why
         us zeroing its own top padding to match, and the caption row ran
         straight into the next band with nothing between them. At `lap:` the
         wall sits BESIDE the hero instead and the seam belongs to page.tsx's
         SPLIT, which is why both ends are zeroed there. */
      className="relative flex flex-col justify-center overflow-hidden pt-[clamp(24px,4vw,48px)] pb-[clamp(40px,6.5vw,64px)] lap:py-0"
    >
      {/* The stage. Gap is zero on purpose: the lane's own inline padding is
          the entire separator, so the perceived column gap is exactly twice it
          and there is only one number to reason about. */}
      <div className="relative grid w-full gap-0 lap:h-[min(79svh,800px)] lap:grid-cols-3">
        {LANES_OF_PICKS.map((lane, li) => (
          <div
            key={li}
            /* BLOCK vs INLINE padding are deliberately different. Block padding
               is cheap — it only bounds the hover for cards at the very top and
               bottom of a lane, and those sit under the edge fade. Inline
               padding IS the column gap, so it is cut as far as the hover
               allows: a card magnified to 1.0957 overflows by 0.048 of its own
               width, and 12px covers the ~232px card the widest lane holds.
               `contain` scopes the marquee's per-frame layout and paint
               invalidation to the lane rather than the whole page.
               The dim is `:not(:hover)` rather than dim-all-then-undim-one:
               two rules writing opacity at equal specificity would have their
               winner decided by emit order. */
            className="relative min-h-0 min-w-0 overflow-hidden px-[clamp(8px,0.9vw,12px)] py-[clamp(16px,1.5vw,24px)] [contain:layout_paint_style] [&:hover_button:not(:hover)]:opacity-45"
          >
            <div
              /* HOVERING A CLIP STOPS ITS OWN LANE, and only that lane — the
                 play state sits on the track, so the other two keep running.
                 `:has(button:hover)` rather than a bare `:hover` on the lane:
                 the track is taller than the lane it shows through, and a bare
                 hover would also fire in the gaps between cards, which reads as
                 the wall stalling at random. animation-play-state cannot be
                 transitioned, so the stop is instant by definition — that is
                 the convention for a marquee and not something to paper over.

                 It composes with the MotionToggle below: that writes the same
                 property from the `paused` state, and either source pausing is
                 enough. */
              className={`flex w-max animate-lane-x gap-[clamp(4px,0.6vw,8px)] will-change-transform lap:w-auto lap:animate-lane-y lap:flex-col [&:has(button:hover)]:[animation-play-state:paused] ${
                LANE_STYLE[li].reverse ? "[animation-direction:reverse]" : ""
              } ${paused ? "[animation-play-state:paused]" : ""}`}
              style={{ animationDuration: LANE_STYLE[li].duration }}
            >
              {[...lane, ...lane].map((clip, i) => (
                <Card
                  key={`${li}-${i}`}
                  reel={clip}
                  rest={LANE_STYLE[li].rest}
                  lane={`wall-${li}`}
                  onOpen={() => setActive(clip)}
                  label={`Play reel ${li * PER_LANE + (i % PER_LANE) + 1} full size`}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Edge fades, painted on top rather than masked: a mask re-composites
            every moving layer underneath it each frame, while a gradient is a
            flat paint over a known solid background and looks identical. Wider
            than a hard crop needs, so the eased ramp has room to disappear.
            Sides on a phone, top and bottom on a laptop. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[4] w-[13%] bg-[linear-gradient(to_right,var(--fade-stops))] lap:inset-x-0 lap:inset-y-auto lap:top-0 lap:h-[18%] lap:w-auto lap:bg-[linear-gradient(to_bottom,var(--fade-stops))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-[4] w-[13%] bg-[linear-gradient(to_left,var(--fade-stops))] lap:inset-x-0 lap:inset-y-auto lap:bottom-0 lap:h-[18%] lap:w-auto lap:bg-[linear-gradient(to_top,var(--fade-stops))]"
        />
      </div>

      {/* Caption and pause control share one row under the stage, so the
          control costs the wall no vertical space of its own. */}
      <div className="mt-[clamp(16px,2vw,24px)] flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        <p className="text-center font-mono text-[0.76rem] uppercase tracking-[0.06em] text-ink-faint">
          {content.reels.caption}
        </p>
        {/* <MotionToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          label="the reel wall"
        /> */}
      </div>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

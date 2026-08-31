"use client";

import { useState, type CSSProperties } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { Lightbox } from "@/components/ui/Lightbox";
import { TEXT_META } from "@/lib/ui";

/* REEL WALL — V2. The right-hand column of the same reference HeroV2 is built
   from, and meant to be mounted with it. The desktop values:

     STAGE     630 wide · 780 tall · three lanes, centred
     LANE      208 wide · 10 padding all round · clipped
     CARD      192 wide · 10 between cards
               HEIGHTS CYCLE 384 / 320 / 256 — not one aspect ratio

   WHAT SEPARATES V2 FROM V1:

     1. THE CARDS ARE DIFFERENT HEIGHTS. V1 sets every card to `aspect-[9/16]`,
        so all three lanes are grids of identical tiles and the only thing
        breaking the rhythm is the marquee's own drift. This cycles three
        heights, and the cycle STARTS AT A DIFFERENT PLACE IN EACH LANE — lane 0
        at index 0, lane 1 at index 1, lane 2 at index 2 — so no two lanes ever
        show the same height at the same y. That offset is the whole effect; set
        all three lanes to the same start and the wall goes back to reading as a
        grid with ragged edges.
        The clips are 9:16, so a 192 × 256 card crops them. `object-cover` does
        that, and it is what the reference does with its own stills.
     2. IT IS DARK. V1 runs on the page's warm paper and its edge fades are
        painted from `--fade-stops`, whose channels track `--color-paper` — put
        those on near-black and a grey seam appears where the ramp lands. So
        this file carries its OWN stop list, the same smoothstep shape traced in
        noir. Both are needed; neither works on the other's ground.
     3. THE CARD IS BARER. No border and no resting shadow: on near-black a
        hairline reads as a scratch and a drop shadow reads as nothing at all.
        A 12 radius, the clip, and the hover glow are the whole card.
     4. NO 3D AND NO RESTING SCALE. V1 rests its outer lanes at 0.94 and its
        middle at 0.97 to give the wall a slight barrel; the reference's lanes
        are flat and identical, and with cards of differing heights a per-lane
        scale would read as an error rather than as depth.

   WHAT IS CARRIED OVER UNCHANGED, because it is machinery rather than styling:
   the marquee (each lane renders its clips twice and slides by exactly half its
   own length, so the loop is seamless with no JS), the direction alternation,
   the per-lane hover pause, `useInViewPlay`, and the lightbox.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1200 and
   holds it above; the ramp exists for everything narrower. */

const LANES = 3;
/* Distinct clips per lane. Six is enough for the track to outrun the tallest
   lane at any viewport, so the wrap point never comes into frame — and it stays
   enough here because these cards are SHORTER than V1's 9:16 tiles, not
   taller. */
const PER_LANE = 6;

const LANE_STYLE = [
  { duration: "78s", reverse: false },
  { duration: "96s", reverse: true },
  { duration: "86s", reverse: false },
];

/* THE HEIGHT CYCLE — the reference's 384 / 320 / 256, as clamps that hold those
   numbers at the top and come down proportionally.

   Applied from `lap:` ONLY. Below the split the wall turns into three
   horizontal rows, and three different heights in a row is not a rhythm, it is
   a ragged edge — so the phone layout keeps V1's single 9:16 aspect and the
   cycle only exists in the vertical arrangement the reference draws. */
const HEIGHTS = [
  "lap:h-[clamp(220px,26vw,384px)]",
  "lap:h-[clamp(190px,22vw,320px)]",
  "lap:h-[clamp(160px,18vw,256px)]",
];

/* Dark edge fades. The channels are `--color-noir` (#141217 → 20, 18, 23) and
   the stop positions are the same smoothstep `--fade-stops` traces, which is
   what makes the landing point invisible rather than a visible band. Written
   out rather than pointed at the token for the reason in note 2.

   IT IS A CUSTOM PROPERTY SET FROM `style`, NOT A CLASS. Tailwind scans source
   TEXT, so a class assembled from a variable — `bg-[linear-gradient(to_right,
   ${STOPS})]` — is never seen by the scanner and the utility is never emitted;
   the same constraint written up at the foot of lib/ui.ts. Declaring the stop
   list as a custom property on the stage and referencing `var(--fade-noir)`
   inside the arbitrary value keeps every class a literal string, so all four
   gradients are emitted and the twelve stops are still written once. */
const FADE_NOIR =
  "rgba(20,18,23,1) 0%, rgba(20,18,23,0.99) 10%, rgba(20,18,23,0.955) 20%, " +
  "rgba(20,18,23,0.89) 30%, rgba(20,18,23,0.79) 40%, rgba(20,18,23,0.655) 50%, " +
  "rgba(20,18,23,0.5) 60%, rgba(20,18,23,0.345) 70%, rgba(20,18,23,0.205) 79%, " +
  "rgba(20,18,23,0.095) 87%, rgba(20,18,23,0.03) 94%, rgba(20,18,23,0) 100%";

/* Same window of the library V1 takes, so the work wall further down the page
   still starts where this one ends and nothing appears twice. Hoisted out of
   the component because it is pure over module constants — inside, the whole
   union-find-and-sort in reelOrder would re-run on every lightbox open. */
const PICKS = takeReels(content.reels.videos, 0, LANES * PER_LANE);
const LANES_OF_PICKS = Array.from({ length: LANES }, (_, i) =>
  PICKS.slice(i * PER_LANE, (i + 1) * PER_LANE)
);

/* Transform and opacity only in the transition. box-shadow can never be in
   here: it repaints a 60px blur every frame, around a card the marquee is
   translating and a video is decoding into. The hover glow is therefore a
   second layer cross-faded over nothing (the ::after), not a second keyframe. */
const CARD =
  "relative block w-full overflow-hidden rounded-xl bg-poster " +
  "transition-[transform,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:scale-[1.06] active:brightness-90 " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-xl " +
  "after:shadow-[var(--shadow-pink)] after:opacity-0 after:content-[''] " +
  "after:transition-opacity after:duration-[280ms] hover:after:opacity-100";

function Card({
  reel,
  height,
  lane,
  onOpen,
  label,
}: {
  reel: Reel;
  height: string;
  lane: string;
  onOpen: () => void;
  label: string;
}) {
  const video = useInViewPlay(lane);

  return (
    /* The positioning box. Hovering raises it over its neighbours, which is
       what lets the magnified card overlap them instead of clipping flat. */
    <div className="relative w-[clamp(112px,27vw,192px)] flex-none hover:z-[3] lap:w-full">
      <button
        type="button"
        onClick={onOpen}
        aria-label={label}
        /* The aspect below `lap:` and the cycled height above it — see the note
           on HEIGHTS. `aspect-auto` has to be stated at the breakpoint or the
           ratio keeps fighting the height. */
        className={`${CARD} aspect-[9/16] lap:aspect-auto ${height}`}
      >
        {/* The clip, in its own box so the card is free to paint its glow
            outside itself. A wrapper rather than border-radius straight on the
            <video>: Safari has been unreliable about clipping video to its own
            corners, and overflow:hidden on a plain box is not. */}
        <span className="absolute inset-0 overflow-hidden rounded-xl">
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
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_42%)]"
          />
        </span>
      </button>
    </div>
  );
}

export function ReelWallV2() {
  const [active, setActive] = useState<Reel | null>(null);

  return (
    /* `bg-noir` on the section itself so this is correct standing alone. Mounted
       beside HeroV2 the SPLIT wrapper in app/page.tsx needs the same, or paper
       shows through its padding and gap — see the note at the top of HeroV2. */
    <section
      aria-label="Our work"
      className="relative flex flex-col justify-center overflow-hidden bg-noir pb-[clamp(40px,6.5vw,64px)] pt-[clamp(24px,4vw,48px)] lap:py-0"
    >
      {/* The stage. Gap is zero on purpose: the lane's own inline padding is the
          entire separator, so the perceived column gap is exactly twice it and
          there is only one number to reason about. The reference's 10 of lane
          padding therefore reads as a 20 column gap. */}
      <div
        style={{ "--fade-noir": FADE_NOIR } as CSSProperties}
        className="relative grid w-full gap-0 lap:h-[min(79svh,780px)] lap:grid-cols-3"
      >
        {LANES_OF_PICKS.map((lane, li) => (
          <div
            key={li}
            /* `contain` scopes the marquee's per-frame layout and paint
               invalidation to the lane rather than the whole page. The dim is
               `:not(:hover)` rather than dim-all-then-undim-one: two rules
               writing opacity at equal specificity would have their winner
               decided by emit order. */
            className="relative min-h-0 min-w-0 overflow-hidden p-2.5 [contain:layout_paint_style] [&:hover_button:not(:hover)]:opacity-45"
          >
            <div
              /* HOVERING A CLIP STOPS ITS OWN LANE, and only that lane — the
                 play state sits on the track, so the other two keep running.
                 `:has(button:hover)` rather than a bare `:hover` on the lane:
                 the track is taller than the lane it shows through, and a bare
                 hover would also fire in the gaps between cards, which reads as
                 the wall stalling at random. */
              className={`flex w-max animate-lane-x gap-2.5 will-change-transform lap:w-auto lap:animate-lane-y lap:flex-col [&:has(button:hover)]:[animation-play-state:paused] ${
                LANE_STYLE[li].reverse ? "[animation-direction:reverse]" : ""
              }`}
              style={{ animationDuration: LANE_STYLE[li].duration }}
            >
              {[...lane, ...lane].map((clip, i) => (
                <Card
                  key={`${li}-${i}`}
                  reel={clip}
                  /* THE CYCLE, OFFSET PER LANE — see note 1. Adding the lane
                     index is the entire trick: lane 0 starts on 384, lane 1 on
                     320, lane 2 on 256, so the three columns never agree. */
                  height={HEIGHTS[(i + li) % HEIGHTS.length]}
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
            flat paint over a known solid background and looks identical. Sides
            on a phone, top and bottom on a laptop. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[4] w-[13%] bg-[linear-gradient(to_right,var(--fade-noir))] lap:inset-x-0 lap:inset-y-auto lap:top-0 lap:h-[18%] lap:w-auto lap:bg-[linear-gradient(to_bottom,var(--fade-noir))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-[4] w-[13%] bg-[linear-gradient(to_left,var(--fade-noir))] lap:inset-x-0 lap:inset-y-auto lap:bottom-0 lap:h-[18%] lap:w-auto lap:bg-[linear-gradient(to_top,var(--fade-noir))]"
        />
      </div>

      <div className="mt-[clamp(16px,2vw,24px)] flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        <p className={`text-center font-mono ${TEXT_META} uppercase tracking-[0.06em] text-ink-dim`}>
          {content.reels.caption}
        </p>
      </div>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

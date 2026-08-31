"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { Lightbox } from "@/components/ui/Lightbox";
import { TEXT_META } from "@/lib/ui";

/* REEL WALL — V5. "FOUR COLUMNS". The original wall with a fourth lane and a
   parallax pass over the top.

   WHAT SEPARATES V5 FROM V1:

     1. FOUR LANES, NOT THREE.
     2. VERTICAL AT EVERY WIDTH. V1 flips to horizontal rows below `lap:` —
        one set of markup, the flex direction and the animation swapping at the
        breakpoint. This one never flips. The columns run down at 375 exactly
        as they do at 1920, so the wall a reader meets on a phone is the wall
        they would meet on a monitor.
     3. THE LANES DRIFT ON SCROLL. Each column carries its own parallax rate
        and adjacent columns pull in opposite directions, so moving down the
        page shears the four apart and lets them settle.

   HOW PARALLAX AND THE MARQUEE COEXIST, WHICH IS THE ONE THING HERE THAT HAD
   TO BE BUILT RATHER THAN COPIED. Both want to translate the same lane on the
   same axis, and a CSS animation on `transform` wins outright over an inline
   `transform` on the element it is running on — put the two on one node and
   the parallax silently does nothing. So there is an extra element per lane:

       lane (clips, overflow hidden)
         └── shifter   ← the scroll parallax, inline transform
               └── track   ← the marquee, animate-lane-y

   Two nodes, no conflict, and both stay on the compositor.

   NOTHING IS EVER REVEALED AT THE EDGES, and it is the marquee that pays for
   that. The track already renders its clips TWICE and stands roughly 3000px
   against an 800px lane, so its smallest overhang is around 700px and a 260px
   shift cannot bring an end into frame — and the top and bottom fades cover
   18% of the lane each anyway. This is why parallax is cheap on a marquee wall
   and expensive on a static one, and it is what lets the rates below be large
   enough to actually see. The full check is written out at RATE.

   THE NEUTRAL POINT IS THE MIDDLE OF THE TRAVEL, WHICH IS WHY THE MATH READS
   (p - 0.5) AND NOT p. At p = 0.5 — the wall centred on screen, which is where
   a reader actually looks at it — every lane's shift is exactly zero and the
   composition is the one that was designed. Anchoring at p = 0 would put the
   designed arrangement at the instant the wall is entirely below the fold,
   where nobody ever sees it.

   Carried over from V1 unchanged, because it is machinery rather than styling:
   the seamless loop (each lane renders its clips twice and slides by exactly
   half its own length, so no JS drives it), `useInViewPlay`, the lightbox, and
   the card itself. */

const LANES = 4;

/* Distinct clips per lane. Six is enough for the track to outrun the tallest
   lane at any viewport, so the wrap point never comes into frame. */
const PER_LANE = 6;

/* Durations are all different and deliberately not a neat ramp, so the four
   lanes never lock into step. Direction alternates. The resting scale is
   symmetric — the outer pair sit a hair back from the inner pair — which is
   the same flat depth cue V1 uses and the one that pairs best with parallax.
   NOTHING HERE IS 3D: no rotateY, no translateZ, no perspective. Flatten the
   three scale values to one if you want the columns strictly identical. */
const LANE_STYLE = [
  { duration: "78s", reverse: false, rest: "scale-[0.94]" },
  { duration: "96s", reverse: true, rest: "scale-[0.97]" },
  { duration: "86s", reverse: false, rest: "scale-[0.97]" },
  { duration: "104s", reverse: true, rest: "scale-[0.94]" },
];

/* Total vertical travel per lane, in px. The shift applied is (p - 0.5) x rate,
   so a lane moves HALF of this either side of centre — lane 0 swings 260px each
   way. Signs alternate, which is the whole effect; magnitudes are irregular on
   purpose, because a tidy 500/400/300/200 ladder reads as a mechanism being
   demonstrated where uneven numbers read as depth.

   THESE HAVE TO BEAT THE MARQUEE OR THEY ARE INVISIBLE, and that is the whole
   reason they are this large. The first pass at this section used 120/96/80/132
   — about 60px of swing spread over the ~1700px of scrolling it takes the wall
   to cross the window, which is roughly 3% of page speed. It was running
   correctly and could not be seen, because the four lanes are ALREADY shearing
   against each other continuously: the marquee runs them at four different
   durations in alternating directions, which is the same visual the parallax
   was there to produce, at far greater magnitude. A small scroll-driven shear
   layered on a large ambient one is not subtle, it is masked.

   THE ARITHMETIC THAT REPLACED THE GUESS. Lanes 0 and 1 pull apart by 520 + 380
   = 900px across the full travel, which is 53px of relative shear per 100px of
   page scroll. The marquee moves a lane about 19px/s, so in the half-second it
   takes to scroll that 100px it contributes around 10px. The parallax is now
   five times the ambient motion rather than a fifth of it, which is the
   difference between an effect and a rounding error.

   THE CEILING IS THE TRACK'S SLACK, AND 260 CLEARS IT COMFORTABLY. The track
   renders its clips twice and stands roughly 3000px against an 800px lane, so
   the smallest overhang it ever has is ~700px. The one case worth checking is a
   non-reversed lane at animation time zero, where the track's top edge starts
   flush with the lane's: on load the wall sits at p ~= 0.44, so the downward
   shift there is about 31px against a top fade 144px deep. The extremes only
   arrive at p near 0 or 1, which is precisely when the wall is at the edge of
   the viewport or outside it. Raise these much further and that stops being
   true. */
const RATE = [-520, 380, -300, 460];

/* Deal the wall's window of the library out across lanes. takeReels spreads
   clips from the same shoot far apart, so four near-identical doctor spots
   never land in one lane. Hoisted out of the component because it is pure over
   module constants — it used to run per render in V1, so the whole
   union-find-and-sort in reelOrder re-ran on every lightbox open and close. */
const PICKS = takeReels(content.reels.videos, 0, LANES * PER_LANE);
const LANES_OF_PICKS = Array.from({ length: LANES }, (_, i) =>
  PICKS.slice(i * PER_LANE, (i + 1) * PER_LANE)
);

/* HOW MANY LANES THE WIDTH CAN ACTUALLY CARRY. All four from 561px up, which
   is everywhere the wall has room for them: at 561 each lane is about 140px
   and each card about 128px, which is squarely in the range V1's own phone
   cards run at. Below 561 four columns would leave each card around 78px —
   too small to judge footage on, and judging the footage is the only reason
   this wall exists — so the two outer lanes drop out and the remaining pair
   take the full width.

   THE ORIENTATION NEVER CHANGES, which is what "vertical only" asks for. Only
   the count does. Hidden lanes keep their markup but get `display: none`, so
   they have no box, their observers never fire, and with preload="none" they
   cost no bytes.

   To force four at every width, empty these two strings and set the grid to a
   bare `grid-cols-4`. */
const LANE_VISIBILITY = ["", "", "hidden phone:block", "hidden phone:block"];

/* Written as one string because the card carries a lot of state.

   Transform and opacity only in the transition. box-shadow is the one property
   that can never be in here: it repaints a 60px blur every frame, around a
   card the marquee is translating, the parallax is offsetting, and a video is
   decoding into. The pink hover shadow is therefore a second layer cross-faded
   over the resting one (the ::after), not a second keyframe of it. */
const CARD =
  "relative block w-full aspect-[9/16] rounded-2xl border border-line bg-poster " +
  "shadow-[var(--shadow)] active:brightness-90 " +
  "transition-[transform,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:scale-[1.0957] " +
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
    <div className="relative w-full hover:z-[3]">
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

export function ReelWallV5() {
  const [active, setActive] = useState<Reel | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  /* THE PARALLAX. One listener for four lanes, writing ONE custom property
     that all four read through their own rate — so a scroll event costs one
     rect read and one style write no matter how many lanes there are.

     THE READ IS COALESCED INTO A FRAME. scroll fires far faster than the
     browser paints, and getBoundingClientRect forces layout, so calling it per
     event would be several forced reflows per frame. The rAF guard collapses
     every event between two frames into a single read at the moment the
     browser is about to paint anyway.

     IT ONLY RUNS WHILE THE WALL IS ON SCREEN. The observer flips a boolean the
     scroll handler tests first, so scrolling anywhere else on this page — and
     this page is long, with five other walls on it — costs one boolean test.

     REDUCED MOTION NEVER ATTACHES ANYTHING. It returns before the listener
     exists, so --p keeps the 0.5 the server rendered and every lane sits at
     exactly zero shift. That is the designed composition rather than a
     degraded one, which is the whole reason neutral is the middle of the
     travel. The marquee itself is already neutralised globally by the
     reduced-motion block in globals.css. Read once rather than subscribed, the
     same call ReelWallV3 makes: a reader who changes the setting mid-session
     gets it on their next navigation, and a live listener would be another
     thing to tear down for no real gain. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stage.current;
    if (!el) return;

    let frame = 0;
    let visible = false;

    const write = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      /* 0 as the top edge enters the bottom of the viewport, 1 as the bottom
         edge leaves the top. The denominator is the full distance the wall
         travels across the window, so the rate is independent of how tall the
         wall or the window happens to be. */
      const span = rect.height + window.innerHeight;
      const p = (window.innerHeight - rect.top) / span;
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = requestAnimationFrame(write);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // Settle to the true position on arrival rather than waiting for the
      // next scroll event, which may never come if the reader stops here.
      if (visible) write();
    });

    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      aria-label="Our work"
      /* Below the split, Why us follows immediately and this padding is the
         WHOLE seam to it — SECTION's clamp, spelled out, so that boundary is
         the same size as every other one on the page. At `lap:` the wall sits
         BESIDE the hero instead and the seam belongs to page.tsx's SPLIT,
         which is why both ends are zeroed there. Same contract the original
         wall runs on. */
      className="relative flex flex-col justify-center overflow-hidden pt-[clamp(24px,4vw,48px)] pb-[clamp(40px,6.5vw,64px)] lap:py-0"
    >
      {/* The stage. It carries a height at EVERY width now, not just at `lap:`
          — V1 only needed one on desktop because below the breakpoint its
          lanes turned into horizontal rows that sized themselves. A vertical
          lane has no intrinsic height, so without this the wall collapses to
          nothing on a phone.

          Gap is zero on purpose: the lane's own inline padding is the entire
          separator, so the perceived column gap is exactly twice it and there
          is only one number to reason about. */}
      <div
        ref={stage}
        style={{ "--p": 0.5 } as CSSProperties}
        className="relative grid h-[min(72svh,560px)] w-full grid-cols-2 gap-0 phone:h-[min(76svh,700px)] phone:grid-cols-4 lap:h-[min(79svh,800px)]"
      >
        {LANES_OF_PICKS.map((lane, li) => (
          <div
            key={li}
            /* BLOCK vs INLINE padding are deliberately different. Block padding
               is cheap — it only bounds the hover for cards at the very top and
               bottom of a lane, and those sit under the edge fade. Inline
               padding IS the column gap, so it is cut as far as the hover
               allows: a card magnified to 1.0957 overflows by 0.048 of its own
               width, and 12px covers the widest card a lane holds here.
               `contain` scopes the marquee's and the parallax's per-frame
               layout and paint invalidation to the lane rather than the whole
               page. The dim is `:not(:hover)` rather than
               dim-all-then-undim-one: two rules writing opacity at equal
               specificity would have their winner decided by emit order. */
            className={`relative min-h-0 min-w-0 overflow-hidden px-[clamp(6px,0.9vw,12px)] py-[clamp(16px,1.5vw,24px)] [contain:layout_paint_style] [&:hover_button:not(:hover)]:opacity-45 ${LANE_VISIBILITY[li]}`}
          >
            {/* THE SHIFTER — parallax only, and the reason it is its own
                element is at the top of this file. The transform is an inline
                style rather than a Tailwind arbitrary value: a calc() carrying
                two custom properties and a subtraction needs real spaces, and
                the underscore-escaped form Tailwind wants for that is fragile
                enough that a value it cannot parse is dropped SILENTLY — no
                error, no class, and a wall that simply never drifts.
                translate3d rather than translateY so the lane is promoted to
                its own layer and the shift never touches layout. */}
            <div
              style={
                {
                  "--rate": `${RATE[li]}px`,
                  transform: "translate3d(0, calc((var(--p) - 0.5) * var(--rate)), 0)",
                } as CSSProperties
              }
              className="h-full will-change-transform"
            >
              <div
                /* THE TRACK — the marquee, exactly as V1 runs it.

                   HOVERING A CLIP STOPS ITS OWN LANE, and only that lane: the
                   play state sits on the track, so the other three keep going.
                   `:has(button:hover)` rather than a bare `:hover` on the
                   lane — the track is taller than the lane it shows through,
                   and a bare hover would also fire in the gaps between cards,
                   which reads as the wall stalling at random.
                   animation-play-state cannot be transitioned, so the stop is
                   instant by definition; that is the convention for a marquee
                   and not something to paper over.

                   The parallax deliberately does NOT pause with it. It is
                   driven by the reader's own scrolling, and a hover that
                   froze it would mean the wall stopped responding to the page
                   moving underneath it. */
                className={`flex w-auto animate-lane-y flex-col gap-[clamp(4px,0.6vw,8px)] will-change-transform [&:has(button:hover)]:[animation-play-state:paused] ${
                  LANE_STYLE[li].reverse ? "[animation-direction:reverse]" : ""
                }`}
                style={{ animationDuration: LANE_STYLE[li].duration }}
              >
                {[...lane, ...lane].map((clip, i) => (
                  <Card
                    key={`${li}-${i}`}
                    reel={clip}
                    rest={LANE_STYLE[li].rest}
                    /* One playback budget per lane, so the four fill evenly
                       instead of the first draining the whole allowance. Must
                       be unique across every lane on the page — the registry
                       in lib/useInViewPlay.ts is global. */
                    lane={`v5-lane-${li}`}
                    onOpen={() => setActive(clip)}
                    label={`Play reel ${li * PER_LANE + (i % PER_LANE) + 1} full size`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Edge fades, painted on top rather than masked: a mask re-composites
            every moving layer underneath it each frame, while a gradient is a
            flat paint over a known solid background and looks identical. Top
            and bottom at EVERY width, because the lanes are vertical at every
            width — V1 swaps these to the sides below `lap:` and this one has
            no side to swap to. Wider than a hard crop needs, so the eased ramp
            has room to disappear, and wide enough to hide the ends of a lane
            at the extremes of its parallax travel. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-[18%] bg-[linear-gradient(to_bottom,var(--fade-stops))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[18%] bg-[linear-gradient(to_top,var(--fade-stops))]"
        />
      </div>

      <p
        className={`mt-[clamp(16px,2vw,24px)] text-center font-mono ${TEXT_META} uppercase tracking-[0.06em] text-ink-faint`}
      >
        {content.reels.caption}
      </p>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

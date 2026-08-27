"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { Lightbox } from "@/components/ui/Lightbox";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHOR, HEAD_GAP, SECTION, TEXT_META, WRAP } from "@/lib/ui";

const { work } = content;

/* THE WORK — the volume wall.

   Three full-bleed rows of clips gliding in alternating directions: right,
   left, right. Sheer count is the argument, which is why this is a wall and
   not a curated grid — you are meant to lose track of how many there are.

   Dark on purpose. It is the one band between two light sections, so the work
   reads as the exhibit rather than as more page. Everything inside therefore
   takes the BRIGHT cut of the ramp and the muted light ink; the paper-safe
   pink lands around 3.6:1 on near-black, under the bar for type this small.

   THIS WALL IS THE EXPENSIVE ONE. It carries three times the clips the hero
   wall does, so every rule the hero wall's comments lay out is load-bearing
   here rather than merely tidy: no mask over a moving layer, no box-shadow in
   a transition, and `contain` on every row. See the note at each. */

const ROWS = 3;
/* Each row renders its clips TWICE and slides by exactly half its own length,
   so ONE copy has to be wider than the viewport or the wrap point comes into
   frame. Sixteen tiles at a ~170px pitch is ~2720px, which covers a 2560
   monitor. Do not cut this to trim DOM nodes without redoing that sum. */
const PER_ROW = 16;
/* Starts past everything the hero wall shows (3 lanes x 6), so the two walls
   are never running the same clip at the same moment. */
const OFFSET = 18;

const ROW_STYLE = [
  { duration: "88s", reverse: false },
  { duration: "104s", reverse: true },
  { duration: "94s", reverse: false },
];

/* Dealt column-major, so tiles adjacent in a row are 3 apart in the spread
   order — takeReels already keeps same-shoot clips far apart, and this stops
   the three rows from being three contiguous slices of it.

   Hoisted out of the component because it is pure over module constants. It
   used to run per render, so the whole union-find-and-sort in reelOrder re-ran
   on every pause toggle and every lightbox open and close. */
const PICKS = takeReels(content.reels.videos, OFFSET, ROWS * PER_ROW);
const ROWS_OF_PICKS = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: PER_ROW }, (_, i) => PICKS[i * ROWS + row])
);

/* Tiles are smaller and squarer-cornered than the hero wall's cards: this wall
   is about count, and a smaller tile puts more of them on screen.

   THE POSTER IS AN <img>, NOT A BACKGROUND. It was a background-image, which
   paints early and needs no element — but a CSS background cannot be lazy
   loaded, so all ninety-six fetched and decoded the moment the section came
   into view: ~2.4MB over the wire and ~28MB of decoded bitmap, in one burst,
   during the scroll that brought them there. A real <img loading="lazy"> lets
   the browser defer everything off screen, so entering the section pays for
   roughly the dozen tiles per row actually visible and the rest arrive as they
   translate in. `bg-[#1a1620]` below is what shows until one lands.

   It is also the only copy of the poster, deliberately: setting it as the
   video's `poster` attribute as well made the browser hold two decoded rasters
   of the same webp per tile.

   OPACITY AND TRANSFORM ONLY. box-shadow used to be named in this transition
   too, driving a 54px-blur hover shadow, and it is the one property that can
   never be: it repaints that blur every frame, around a tile the marquee is
   translating and a video is decoding into. The bigger hover shadow is now a
   second layer cross-faded over the resting one (the ::after), which
   composites instead of repainting. Transform is safe for the opposite reason
   — the hover scale is a compositor operation on one tile at a time, and it
   costs nothing per frame while the tile sits at rest.

   The scale is 1.05 and NOT MORE, because the room for it is finite: see the
   padding on the row below, which is what stops it being clipped.

   Keep utility syntax OUT of these comments, incidentally — Tailwind scans the
   whole file, comments included, and will emit a real class for anything that
   parses as one.

   `overflow-hidden` moved off the tile and onto the span around the video, so
   the ::after is free to paint its shadow OUTSIDE the tile. The background
   image needs no clip of its own — a background is already clipped to the
   border box, radius included. */
const TILE =
  "relative aspect-[9/16] w-[clamp(112px,33vw,146px)] flex-none rounded-lg " +
  "bg-[#1a1620] shadow-[0_12px_32px_rgba(0,0,0,0.45)] " +
  "transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:scale-[1.05] active:brightness-90 " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] " +
  "after:shadow-[0_20px_54px_rgba(0,0,0,0.62)] after:opacity-0 after:content-[''] " +
  "after:transition-opacity after:duration-[280ms] hover:after:opacity-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white " +
  "tab:w-[clamp(116px,12vw,158px)] tab:rounded-xl";

/* The fade at each end, painted ON TOP rather than masked. A mask forces the
   layer beneath it — here a ~2720px-wide row holding thirty-two decoding
   videos — through an extra compositing pass on every single frame, while a
   gradient over a known solid background is a flat paint and looks identical.
   The stop colour IS the section's outer colour (#17141b), which is what the
   radial has settled to by the time it reaches these edges, and the far end
   names the same channels at alpha 0: fading to bare `transparent` would ramp
   through rgba(0, 0, 0, 0) and darken the middle of the fade. */
const FADE = "pointer-events-none absolute inset-y-0 z-[2] w-[7%]";

function Tile({
  reel,
  lane,
  onOpen,
  label,
}: {
  reel: Reel;
  lane: string;
  onOpen: () => void;
  label: string;
}) {
  const video = useInViewPlay(lane);

  return (
    <button type="button" onClick={onOpen} aria-label={label} className={TILE}>
      {/* The clip gets its own box so the tile is free to paint shadows outside
          itself. A wrapper rather than border-radius straight on the <video>:
          Safari has been unreliable about clipping video to its own corners,
          and overflow:hidden on a plain box is not. */}
      <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {reel.poster && (
          /* eslint-disable-next-line @next/next/no-img-element -- a remote blob
             URL already at the size it renders. next/image would mean a
             remotePatterns entry and a proxy hop to re-encode a 24KB webp into
             itself; the only thing wanted here is the browser's own lazy
             loading, which a plain <img> gives directly. */
          <img
            src={reel.poster}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {/* `relative` so the video is POSITIONED like the poster above it and
            paint order falls back to DOM order. Left static it would paint in
            the in-flow step, which comes before positioned descendants — and
            the poster would sit on top of the playing clip. */}
        <video
          ref={video}
          src={reel.src}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          className="relative size-full object-cover"
        />
      </span>
    </button>
  );
}

export function Work() {
  const [active, setActive] = useState<Reel | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="work"
      aria-label={work.kicker}
      className={`${SECTION} ${ANCHOR} relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_-10%,#241d2b,#17141b_72%)] text-[#f5f3f0]`}
    >
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <SectionHeading kicker={work.kicker} heading={work.heading} tone="bright" />
          <Reveal delay={100}>
            <p className={`mt-3 text-center font-mono ${TEXT_META} leading-1.2 tracking-[0.04em] text-ink-dim`}>
              {work.sub}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed: the rows run edge to edge, outside the wrap's cap. That is
          the whole effect — they run OUT of the page rather than stopping at an
          edge, which is what the fade sells. The two overlays span all three
          rows, so the effect costs two elements rather than one mask per row. */}
      <div className="relative flex flex-col gap-[clamp(8px,1.2vw,12px)]">
        {ROWS_OF_PICKS.map((row, ri) => (
          <div
            key={ri}
            /* Hovering a row dims everything except the tile under the pointer,
               so one clip can be read out of forty-eight without the rest going
               dark. `:not(:hover)` rather than dim-all-then-undim-one: two
               rules writing opacity at equal specificity would have their
               winner decided by emit order.

               `contain` scopes the marquee's per-frame layout and paint
               invalidation to the row rather than letting it walk the page.

               py-3 -my-3 IS WHAT GIVES THE HOVER SCALE SOMEWHERE TO GO. Both
               `overflow-hidden` and `contain: paint` clip at the padding box,
               and a row with no padding is exactly as tall as its tiles — so a
               tile growing 5% would have had its top and bottom sliced off. The
               12px of padding is the room, and the equal negative margin hands
               it straight back to the layout, so the visible gap between rows
               is still the container's own and nothing below moves. At the
               widest tile (158px, so 281px tall) a 1.05 scale needs 7px a side:
               inside 12, with margin to spare. Raise the scale and this has to
               rise with it.

               The rows' padding boxes now OVERLAP by that same 12px, which is
               why the hover needs a z-index as well: without it the next row
               paints over the part of the magnified tile that bleeds into the
               shared strip. Rows are flex items, so z-index applies to them
               with no positioning of their own. */
            className="py-3 -my-3 overflow-hidden [contain:layout_paint_style] hover:z-[3] [&:hover_button:not(:hover)]:opacity-45"
          >
            <div
              /* Hovering a tile stops THIS row and leaves the other two
                 running — see the same note on the hero wall's lane. */
              className={`flex w-max animate-lane-x gap-[clamp(8px,1.2vw,12px)] will-change-transform [&:has(button:hover)]:[animation-play-state:paused] ${
                ROW_STYLE[ri].reverse ? "[animation-direction:reverse]" : ""
              } ${paused ? "[animation-play-state:paused]" : ""}`}
              style={{ animationDuration: ROW_STYLE[ri].duration }}
            >
              {[...row, ...row].map((clip, i) => (
                <Tile
                  key={`${ri}-${i}`}
                  reel={clip}
                  lane={`work-${ri}`}
                  onOpen={() => setActive(clip)}
                  label={`Play reel ${ri * PER_ROW + (i % PER_ROW) + 1} full size`}
                />
              ))}
            </div>
          </div>
        ))}

        <div
          aria-hidden="true"
          className={`${FADE} left-0 bg-[linear-gradient(to_right,#17141b,rgba(23,20,27,0))]`}
        />
        <div
          aria-hidden="true"
          className={`${FADE} right-0 bg-[linear-gradient(to_left,#17141b,rgba(23,20,27,0))]`}
        />
      </div>

      <div className={`${WRAP} mt-6 flex justify-end`}>
        {/* <MotionToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          label="the work wall"
          tone="dark"
        /> */}
      </div>

      {/* Dozens of near-identical tile labels would be noise to a screen
          reader, so one sentence stands in for the lot. */}
      <p className="sr-only">{work.description}</p>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

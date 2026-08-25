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
import { ANCHOR, SECTION, WRAP } from "@/lib/ui";

const { work } = content;

/* THE WORK — the volume wall.

   Three full-bleed rows of clips gliding in alternating directions: right,
   left, right. Sheer count is the argument, which is why this is a wall and
   not a curated grid — you are meant to lose track of how many there are.

   Dark on purpose. It is the one band between two light sections, so the work
   reads as the exhibit rather than as more page. Everything inside therefore
   takes the BRIGHT cut of the ramp and the muted light ink; the paper-safe
   pink lands around 3.6:1 on near-black, under the bar for type this small. */

const ROWS = 3;
const PER_ROW = 16;
/* Starts past everything the hero wall shows (3 lanes x 6), so the two walls
   are never running the same clip at the same moment. */
const OFFSET = 18;

const ROW_STYLE = [
  { duration: "88s", reverse: false },
  { duration: "104s", reverse: true },
  { duration: "94s", reverse: false },
];

/* Tiles are smaller and squarer-cornered than the hero wall's cards: this wall
   is about count, and a smaller tile puts more of them on screen. The poster
   is a background-image, so the tile is painted before the <video> element has
   fetched a single byte. */
const TILE =
  "relative aspect-[9/16] w-[clamp(112px,33vw,146px)] flex-none overflow-hidden rounded-lg " +
  "bg-[#1a1620] bg-cover bg-center bg-no-repeat shadow-[0_12px_32px_rgba(0,0,0,0.45)] " +
  "transition-[opacity,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:shadow-[0_20px_54px_rgba(0,0,0,0.62)] active:brightness-90 " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white " +
  "tab:w-[clamp(116px,12vw,158px)] tab:rounded-xl";

function Tile({ reel, onOpen, label }: { reel: Reel; onOpen: () => void; label: string }) {
  const video = useInViewPlay();

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className={TILE}
      style={reel.poster ? { backgroundImage: `url(${reel.poster})` } : undefined}
    >
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
    </button>
  );
}

export function Work() {
  const [active, setActive] = useState<Reel | null>(null);
  const [paused, setPaused] = useState(false);

  /* Dealt column-major, so tiles adjacent in a row are 3 apart in the spread
     order — takeReels already keeps same-shoot clips far apart, and this stops
     the three rows from being three contiguous slices of it. */
  const picks = takeReels(content.reels.videos, OFFSET, ROWS * PER_ROW);
  const rows = Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: PER_ROW }, (_, i) => picks[i * ROWS + row])
  );

  return (
    <section
      id="work"
      aria-label={work.kicker}
      className={`${SECTION} ${ANCHOR} relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_-10%,#241d2b,#17141b_72%)] text-[#f5f3f0]`}
    >
      <div className={WRAP}>
        <div className="mb-[clamp(32px,3.5vw,48px)]">
          <SectionHeading kicker={work.kicker} heading={work.heading} tone="bright" />
          <Reveal delay={100}>
            <p className="mt-3 text-center font-mono text-[0.85rem] tracking-[0.04em] text-ink-dim">
              {work.sub}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed: the rows run edge to edge, outside the wrap's cap. That is
          the whole effect — they run OUT of the page rather than stopping at an
          edge, which is what the mask sells. */}
      <div className="flex flex-col gap-[clamp(8px,1.2vw,12px)]">
        {rows.map((row, ri) => (
          <div
            key={ri}
            /* Hovering a row dims everything except the tile under the pointer,
               so one clip can be read out of forty-eight without the rest going
               dark. `:not(:hover)` rather than dim-all-then-undim-one: two
               rules writing opacity at equal specificity would have their
               winner decided by emit order. */
            className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [&:hover_button:not(:hover)]:opacity-45"
          >
            <div
              className={`flex w-max animate-lane-x gap-[clamp(8px,1.2vw,12px)] will-change-transform ${
                ROW_STYLE[ri].reverse ? "[animation-direction:reverse]" : ""
              } ${paused ? "[animation-play-state:paused]" : ""}`}
              style={{ animationDuration: ROW_STYLE[ri].duration }}
            >
              {[...row, ...row].map((clip, i) => (
                <Tile
                  key={`${ri}-${i}`}
                  reel={clip}
                  onOpen={() => setActive(clip)}
                  label={`Play reel ${ri * PER_ROW + (i % PER_ROW) + 1} full size`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`${WRAP} mt-6 flex justify-end`}>
        <MotionToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          label="the work wall"
          tone="dark"
        />
      </div>

      {/* Dozens of near-identical tile labels would be noise to a screen
          reader, so one sentence stands in for the lot. */}
      <p className="sr-only">{work.description}</p>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

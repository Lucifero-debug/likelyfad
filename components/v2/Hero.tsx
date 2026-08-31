"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { reelVideos } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { HERO_TILE_COUNT } from "@/lib/v2/data";
import { DISPLAY, MONO, T_12, T_14, T_17, T_72, WRAP } from "@/lib/v2/theme";
import { useFinePointer, useReducedMotion } from "@/lib/v2/useReducedMotion";
import { CtaButton } from "./CtaButton";
import { ReelTile } from "./ReelTile";
import { SplitHeading } from "./SplitHeading";

/* ============================================================================
   THE HERO — the wall IS the argument.

   The homepage put copy in one column and the work in the other, and both
   landed at half strength. Here the work is the whole viewport, edge to edge,
   and the copy sits on it. There is no media column because there is no text
   column to sit beside.

   HOW MANY TILES. The columns are auto-filled at a 150 to 260px track, which
   holds 2 across at 375 and 9 at 2560. Two rows of 9:16 at those widths always
   overrun the viewport, which is the intent — the grid overflows and is
   clipped, so the wall reads as a fragment of something larger rather than as
   a neatly finished block. 18 covers the widest case; anything past the clip
   is never mounted and, because it never becomes visible, never fetched.

   The tracks are deliberately not smaller. Thumbnails would let more clips on
   screen and would defeat the point: the light below has to reveal a FACE, at
   a size where you can go looking for the tell.
   ========================================================================== */
const TILES = HERO_TILE_COUNT;

/* Two budget buckets, so useInViewPlay's per-lane cap of 8 allows 16 of the 18
   to run. The two that hold are the last registered, which is the bottom-right
   corner, which is under the scrim. */
const PICKS = takeReels(reelVideos, 0, TILES);

/* How wide the inspection light opens. Large enough to hold a whole tile at
   desktop track width, small enough that it reads as a lens and not as the
   overlay simply being switched off. */
const LENS_RADIUS = "240px";

export function Hero() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const lens = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const pos = useRef({ x: 0, y: 0 });

  /* The light needs a pointer to follow and a visitor who has not asked for
     less motion. Without both it never opens, and a zero radius paints the
     gradient's last stop everywhere — a flat scrim, exactly the hero you would
     have designed without any of this. */
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) lens.current?.style.setProperty("--v2-lens-r", "0px");
  }, [active]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function onMove(e: React.PointerEvent<HTMLElement>) {
    if (!active) return;
    pos.current = { x: e.clientX, y: e.clientY };
    if (raf.current) return;
    /* One write per frame. The rect is read INSIDE the callback, immediately
       before the write rather than after the previous one, so the two never
       interleave into a forced synchronous layout. */
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = lens.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--v2-lens-x", `${pos.current.x - r.left}px`);
      el.style.setProperty("--v2-lens-y", `${pos.current.y - r.top}px`);
    });
  }

  return (
    <section
      id="top"
      aria-label="Our work"
      onPointerMove={onMove}
      onPointerEnter={() => active && lens.current?.style.setProperty("--v2-lens-r", LENS_RADIUS)}
      onPointerLeave={() => lens.current?.style.setProperty("--v2-lens-r", "0px")}
      /* svh, not vh: on mobile Safari a vh hero is sized to the collapsed
         toolbar and the bottom of the copy hides under it on first paint. */
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* THE WALL. Decorative in full — the section carries one label for all
          of it, which is the honest alternative to eighteen near-identical
          tile descriptions.

          auto-rows-min, and it is load-bearing. With grid-auto-rows: auto in a
          grid that has a DEFINITE height, the browser distributes the 900px of
          container across the four implicit rows — 225px each — and an
          aspect-ratio box does not push back, so every tile painted at its full
          512 and overlapped the two beneath it by 287px. min-content makes each
          row take the height its tile actually is; the stack then overruns the
          section and is clipped, which is the intent. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(clamp(150px,22vw,260px),1fr))] content-start"
      >
        {PICKS.map((reel, i) => (
          <ReelTile key={reel.id} reel={reel} lane={`v2-hero-${i % 2}`} alt="" />
        ))}
      </div>

      {/* THE INSPECTION LIGHT. See .v2-lens in globals.css. */}
      <div
        ref={lens}
        aria-hidden="true"
        className="v2-lens pointer-events-none absolute inset-0 z-10"
      />

      {/* Legibility, and it sits ABOVE the light on purpose. The light is for
          reading the WALL; the type has to stay readable wherever the pointer
          happens to be, so the copy keeps its own ground and the effect stops
          at the edge of it.

          Taller below 761px. The copy block is four lines of subline and a
          wrapped microcopy line there, so it reaches much further up the wall
          than the two-line desktop version and would otherwise sit over a lit
          tile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[88%] bg-[linear-gradient(to_top,#131211_0%,rgba(19,18,17,0.96)_26%,rgba(19,18,17,0.78)_48%,rgba(19,18,17,0.4)_74%,rgba(19,18,17,0)_100%)] tab:h-[70%] tab:bg-[linear-gradient(to_top,#131211_0%,rgba(19,18,17,0.93)_20%,rgba(19,18,17,0.66)_45%,rgba(19,18,17,0.28)_72%,rgba(19,18,17,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[128px] bg-[linear-gradient(to_bottom,rgba(19,18,17,0.78),rgba(19,18,17,0))]"
      />

      {/* The one instruction on the page, and it doubles as the thesis. Only
          where there is a pointer to move — on a touch screen it would be a
          lie, and under reduced motion the light is not there to find. */}
      {active && (
        <div className={`${WRAP} pointer-events-none absolute inset-x-0 top-[96px] z-20`}>
          <p className={`${MONO} ${T_12} text-right text-dim`}>Look closer</p>
        </div>
      )}

      <div className={`${WRAP} relative z-20 w-full pt-[128px] pb-[clamp(48px,6vw,96px)]`}>
        <div className="flex flex-wrap items-end justify-between gap-x-[48px] gap-y-[32px]">
          <div className="max-w-[820px]">
            <p className={`${MONO} ${T_12} text-dim`}>{content.hero.eyebrow}</p>

            {/* The gradient this line used to carry is gone; the emphasis it
                marked survives as a value change. See SplitHeading. */}
            <h1 className={`${DISPLAY} ${T_72} mt-[24px] text-balance`}>
              <SplitHeading raw={content.hero.headline} />
            </h1>

            <p className={`${T_17} mt-[24px] max-w-[600px] text-dim`}>{content.hero.subline}</p>

            <div className="mt-[32px] flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
              <CtaButton />
              {/* Body face, not the mono. This is a sentence, and the utility
                  role on this page is labels — an uppercased sentence at 0.18em
                  reads as fine print, which is the opposite of reassurance. */}
              <p className={`${T_14} text-dim`}>{content.hero.reassurance}</p>
            </div>
          </div>

          {/* The services, in the corner, small — as listed. Below 561px they
              wrap under the copy rather than shrinking into it. */}
          <p className={`${MONO} ${T_12} text-dim`}>Video · UGC · Static</p>
        </div>
      </div>
    </section>
  );
}

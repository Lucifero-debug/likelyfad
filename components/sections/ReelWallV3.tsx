"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import type { Reel } from "@/lib/reels.generated";
import { Lightbox } from "@/components/ui/Lightbox";

/* REEL WALL — V3. "THE CUT". A diptych: two tall panels, each holding a clip
   and hard-cutting to the next on its own clock.

   WHY TWO PANELS AND NOT EIGHTEEN. V1, V2 and V4 answer the hero with a grid or
   a strip and put every clip at 110–190px wide, which is the size at which
   footage stops being evidence and becomes texture — a studio whose claim is
   "look closely, it holds up" has made looking closely impossible. Two panels
   at a 44% column run about 320px each on a laptop and 395 at the page's cap:
   large enough to actually judge a frame, and still two pieces of work on
   screen at once rather than one.

   THE MOTION IS THE CUT, AND THE CUTS ARE OFFSET. Each panel holds for 4.6
   seconds and then HARD CUTS — no crossfade, no slide, no easing, which is the
   grammar of a sizzle reel rather than of a carousel. The second panel's first
   cut is delayed by half a cycle, and because both then run on the same period
   that phase shift is permanent: the two never change together. One side is
   always still while the other turns over, so the composition reads as alive
   instead of as a slideshow flipping.

   NOTHING TRANSLATES. No marquee, no scroll, no transform anywhere in this
   file. That is the whole difference in motion language from the other three
   walls, and it is also why this is by far the cheapest: two decoders running
   at any moment against V1's twenty-four, and no layers for the compositor to
   move.

   THE PANELS NEVER SHOW THE SAME CLIP. Each owns its own quarter of the window
   — four clips each, eight in total — so there is no moment where the diptych
   accidentally doubles a frame.

   WHAT WAS CUT: a `03 / 06` counter on each panel, and before that a progress
   rail under a single clip. The counter earned its place when there was one
   frame and a reader needed to know the picture would change on purpose; with
   two panels turning over on opposite phases, that is already legible from the
   composition. Two counters would be the same information, twice, in the one
   place this design has no chrome at all. */

const PANELS = 2;
const PER_PANEL = 4;
/* Long enough to read a frame, short enough that a reader passing through in
   eight seconds sees at least two cuts — which is how they learn there is more
   work behind these two. */
const CUT_MS = 4600;
/* Half a cycle. The offset applies to the second panel's FIRST cut only; from
   there both run at CUT_MS, so the phase never re-converges. */
const OFFSET_MS = CUT_MS / 2;

/* The same window of the library every hero wall takes, so the work wall
   further down still starts where this one ends and nothing appears twice.
   Hoisted out of the component because it is pure over module constants. */
const PICKS = takeReels(content.reels.videos, 0, PANELS * PER_PANEL);
const PANEL_CLIPS = Array.from({ length: PANELS }, (_, p) =>
  PICKS.slice(p * PER_PANEL, (p + 1) * PER_PANEL)
);

function Panel({
  clips,
  offsetMs,
  onOpen,
  label,
}: {
  clips: Reel[];
  offsetMs: number;
  onOpen: (reel: Reel) => void;
  label: (n: number) => string;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  /* Play the one on screen, stop the rest, and pull the next one's bytes.

     ORDER MATTERS, AND IT IS WHY THIS IS NOT ONE forEach. Stopping every other
     clip happens FIRST and cannot throw; only then is the incoming one touched.
     Written the other way round — rewind, play, then pause the rest in a single
     loop — an exception on the incoming clip aborts the loop before the
     outgoing one is paused, and two clips play at once inside the same panel.
     Which is exactly what `currentTime = 0` does: seeking a video that has no
     metadata yet throws InvalidStateError, and with `preload="none"` on three
     of these four, no metadata is precisely the state they are in.

     THE PRELOAD IS IMPERATIVE, NOT A PROP. Flipping React's `preload` attribute
     from "none" to "auto" on an element whose resource selection has already
     finished is not reliably a request to go and fetch it, so the next clip
     arrives empty and the cut has nothing to cut TO. Setting the property and
     calling `load()` is unambiguous, and it happens a full cut early so the
     bytes are there before the picture needs them. */
  useEffect(() => {
    videos.current.forEach((el, n) => {
      if (el && n !== index) el.pause();
    });

    const current = videos.current[index];
    if (current) {
      try {
        current.currentTime = 0;
      } catch {
        /* Not seekable yet — it will start from 0 on its own. */
      }
      // Rejects under some autoplay policies. The poster stays up, which is
      // the correct fallback.
      void current.play().catch(() => {});
    }

    const next = videos.current[(index + 1) % clips.length];
    if (next && next.preload !== "auto") {
      next.preload = "auto";
      next.load();
    }
  }, [index, clips.length]);

  /* The clock. Read once per tick rather than subscribed to: a reader who turns
     motion off mid-session gets the setting on their next navigation, and a
     live listener here would be a second thing to tear down for no real gain.

     The offset is spent on the FIRST cut only — see the note on OFFSET_MS. */
  useEffect(() => {
    if (held) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wait = index === 0 ? CUT_MS + offsetMs : CUT_MS;
    const t = setTimeout(() => setIndex((v) => (v + 1) % clips.length), wait);
    return () => clearTimeout(t);
  }, [index, held, offsetMs, clips.length]);

  return (
    <div
      className="relative h-full min-w-0 overflow-hidden bg-poster"
      /* Holding is PER PANEL, not for the pair: a reader pointing at one frame
         wants that frame to stay, and freezing the other one too would make the
         whole stage look like it had stalled. */
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      /* Capture, so tabbing to the button inside also holds — focus does not
         bubble, focusin does, and the React capture phase is the same reach
         without a second listener. */
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      {clips.map((reel, n) => (
        <video
          key={reel.id}
          ref={(el) => {
            videos.current[n] = el;
          }}
          src={reel.src}
          poster={reel.poster ?? undefined}
          muted
          loop
          playsInline
          /* STATIC, and it stays static: the effect above promotes the next clip
             imperatively. Driving this from `index` made React rewrite the
             attribute on two elements every cut, which is both churn and — see
             the note up there — not actually a fetch. */
          preload="none"
          tabIndex={-1}
          aria-hidden={n !== index}
          /* A hard cut: no transition class anywhere near this. `invisible`
             rather than opacity alone so the idle clips are not composited every
             frame the one on screen paints. */
          className={`absolute inset-0 size-full object-cover ${
            n === index ? "opacity-100" : "invisible opacity-0"
          }`}
        />
      ))}

      {/* The whole panel is the control: clicking anywhere opens the clip on
          screen at full size. A button rather than a handler on the wrapper, so
          it is reachable by keyboard and announces itself. */}
      <button
        type="button"
        onClick={() => onOpen(clips[index])}
        aria-label={label(index)}
        className="absolute inset-0 z-[2] cursor-pointer focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-[3px] focus-visible:outline-white"
      />
    </div>
  );
}

export function ReelWallV3() {
  const [open, setOpen] = useState<Reel | null>(null);

  return (
    /* A 2px gutter, and no more: enough that the pair reads as two frames
       rather than as one image with a seam, not enough to become a layout gap.
       One panel below `phone:` — at 390px two of these are 190 each, which is
       the wallpaper size this whole design exists to avoid. */
    <div className="grid h-full w-full grid-cols-1 gap-[2px] phone:grid-cols-2">
      {PANEL_CLIPS.map((clips, p) => (
        <div key={p} className={p > 0 ? "hidden h-full phone:block" : "h-full"}>
          <Panel
            clips={clips}
            offsetMs={p * OFFSET_MS}
            onOpen={setOpen}
            label={(n) => `Play reel ${p * PER_PANEL + n + 1} of ${PANELS * PER_PANEL} full size`}
          />
        </div>
      ))}
      {open && <Lightbox reel={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

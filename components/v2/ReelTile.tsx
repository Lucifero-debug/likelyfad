"use client";

import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { useReducedMotion } from "@/lib/v2/useReducedMotion";

/* ============================================================================
   One 9:16 clip. Both walls on this page are made of these.

   NO LAYOUT SHIFT, BY CONSTRUCTION. The aspect box is on the WRAPPER, so the
   space a tile occupies is decided before anything is fetched and is identical
   whether it ends up holding a video, a poster, or neither. Nothing below a
   wall moves as it loads.

   REDUCED MOTION DOES NOT MOUNT A VIDEO. It renders the poster and stops. That
   is stronger than pausing: no decoder is created, no bytes are pulled, and no
   autoplay policy can start something behind our back. The box is the same
   either way, so the two states are pixel-identical in layout.

   PLAYBACK IS NOT OURS TO START. autoPlay is deliberately absent — the page
   would open sixty-eight streams at once and they would split the connection
   sixty-eight ways. useInViewPlay owns it instead: one shared observer, a
   per-lane cap, a dwell before a tile in transit is allowed to start, and a
   stagger so each clip gets the line to itself while it pulls. preload="none"
   is what makes an off-screen tile cost nothing at all.
   ========================================================================== */
export function ReelTile({
  reel,
  lane,
  alt,
  className = "",
}: {
  reel: Reel;
  /** Playback budget bucket. Must be unique per lane across the whole page. */
  lane: string;
  /** Describes the still. Empty marks the tile decorative, which is right for
      the hero wall — dozens of near-identical labels are noise, and the hero
      names the whole wall once instead. */
  alt: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const video = useInViewPlay(lane);

  return (
    <div className={`relative aspect-[9/16] overflow-hidden bg-riser ${className}`}>
      {reduced ? (
        reel.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel.poster}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : null
      ) : (
        <video
          ref={video}
          src={reel.src}
          poster={reel.poster ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

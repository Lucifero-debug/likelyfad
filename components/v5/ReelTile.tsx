"use client";

import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { useReducedMotion } from "@/lib/v5/useMedia";

/* ============================================================================
   One 9:16 clip. Every tile in the work grid is one of these.

   NO LAYOUT SHIFT, BY CONSTRUCTION. The aspect box is on the WRAPPER, so the
   space a clip occupies is decided before anything is fetched and is identical
   whether it ends up holding a video, a poster, or neither. Nothing on the page
   moves as the grid loads.

   REDUCED MOTION DOES NOT MOUNT A VIDEO. It renders the poster and stops. That
   is stronger than pausing: no decoder is created, no bytes are pulled, and no
   autoplay policy can start something behind our back.

   PLAYBACK IS NOT OURS TO START. autoPlay is deliberately absent — a grid of
   twenty-four would open every stream at once and they would split the
   connection between them. useInViewPlay owns it: one shared observer for the
   whole page, a per-lane cap, a dwell before a clip in transit may start, and a
   stagger so each one gets the line to itself while it pulls. preload="none" is
   what makes an off-screen clip cost nothing at all, and the same hook is what
   pauses a tile the moment it leaves the viewport.
   ========================================================================== */
export function ReelTile({
  reel,
  lane,
  alt,
}: {
  reel: Reel;
  /** Playback budget bucket. Must be unique per lane across the whole page. */
  lane: string;
  /** Describes the still. */
  alt: string;
}) {
  const reduced = useReducedMotion();
  const video = useInViewPlay(lane);

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[8px] bg-stock">
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
          /* Decorative to assistive tech: the caption on the section describes
             the whole grid in one sentence, and the tag under each tile names
             what this one is. Dozens of near-identical tile labels would be
             noise. */
          aria-hidden="true"
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

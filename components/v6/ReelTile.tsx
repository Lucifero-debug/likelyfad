"use client";

import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { useReducedMotion } from "@/lib/v6/useMedia";

/* ============================================================================
   One 9:16 clip. The bento cards, the tilted cluster and the work grid are all
   made of these.

   NO LAYOUT SHIFT, BY CONSTRUCTION. The aspect box is on the WRAPPER, so the
   space a clip occupies is decided before anything is fetched and is identical
   whether it ends up holding a video, a poster, or neither. Nothing on the
   page moves as the media loads.

   REDUCED MOTION DOES NOT MOUNT A VIDEO. It renders the poster and stops. That
   is stronger than pausing: no decoder is created, no bytes are pulled, and no
   autoplay policy can start something behind our back.

   PLAYBACK IS NOT OURS TO START. autoPlay is deliberately absent — a page with
   this many tiles would open every stream at once and they would split the
   connection between them. useInViewPlay owns it: one shared observer for the
   whole page, a per-lane cap, a dwell before a clip in transit may start, and
   a stagger so each one gets the line to itself while it pulls. preload="none"
   is what makes an off-screen clip cost nothing at all, and the same hook is
   what pauses a tile the moment it leaves the viewport.
   ========================================================================== */
export function ReelTile({
  reel,
  lane,
  alt,
  className = "",
  still = false,
}: {
  reel: Reel;
  /** Playback budget bucket. Must be unique per lane across the whole page. */
  lane: string;
  /** Describes the still. Empty marks the clip decorative, which is right
      wherever the surrounding component already names it once. */
  alt: string;
  className?: string;
  /** Render the poster frame and never mount a video, regardless of the motion
      preference. Used by the Static bento card, where a moving clip would
      contradict the word printed above it. */
  still?: boolean;
}) {
  const reduced = useReducedMotion();
  const video = useInViewPlay(lane);

  return (
    <div className={`relative aspect-[9/16] overflow-hidden bg-night ${className}`}>
      {reduced || still ? (
        reel.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel.poster}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
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
          draggable={false}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

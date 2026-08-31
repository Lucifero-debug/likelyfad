"use client";

import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { useReducedMotion } from "@/lib/v4/useMedia";

/* ============================================================================
   One 9:16 clip. The playground and the work strip are both made of these.

   NO LAYOUT SHIFT, BY CONSTRUCTION. The aspect box is on the WRAPPER, so the
   space a clip occupies is decided before anything is fetched and is identical
   whether it ends up holding a video, a poster, or neither. Nothing moves as
   the page loads, which matters more here than on the other two routes: this
   one has no headline anchoring the layout, so a shift is the whole page
   moving rather than one block.

   REDUCED MOTION DOES NOT MOUNT A VIDEO. It renders the poster and stops. That
   is stronger than pausing: no decoder is created, no bytes are pulled, and no
   autoplay policy can start something behind our back.

   PLAYBACK IS NOT OURS TO START. autoPlay is deliberately absent — the page
   would open every stream at once and they would split the connection between
   them. useInViewPlay owns it: one shared observer, a per-lane cap, a dwell
   before a clip in transit may start, and a stagger so each one gets the line
   to itself while it pulls. preload="none" is what makes an off-screen clip
   cost nothing at all.
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
  /** Describes the still. Empty marks the clip decorative, which is right
      wherever the surrounding component already names it once. */
  alt: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const video = useInViewPlay(lane);

  return (
    <div className={`relative aspect-[9/16] overflow-hidden bg-carbon/5 ${className}`}>
      {reduced ? (
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
          /* The browser's native image/video drag would fight the playground's
             own pointer handling and drop a ghost preview mid-gesture. */
          draggable={false}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

"use client";

import type { Reel } from "@/lib/reels.generated";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { useReducedMotion } from "@/lib/v3/useReducedMotion";

/* ============================================================================
   One 9:16 clip. Every piece of video on this page is one of these — the hero,
   the clips sitting inline in the statement sentence, and the work rail.

   NO LAYOUT SHIFT, BY CONSTRUCTION. The aspect box is on the WRAPPER, so the
   space a tile occupies is decided before anything is fetched and is identical
   whether it ends up holding a video, a poster, or neither. Nothing below a
   clip moves as it loads.

   REDUCED MOTION DOES NOT MOUNT A VIDEO. It renders the poster and stops. That
   is stronger than pausing: no decoder is created, no bytes are pulled, and no
   autoplay policy can start something behind our back. The box is the same
   either way, so the two states are identical in layout. On a page this heavy
   with autoplay, that is the difference between honouring the preference and
   claiming to.

   PLAYBACK IS NOT OURS TO START. `autoPlay` is deliberately absent — the page
   would open every stream at once and they would split the connection between
   them. useInViewPlay owns it instead: one shared observer, a per-lane cap, a
   dwell before a clip in transit is allowed to start, and a stagger so each
   one gets the line to itself while it pulls. `preload="none"` is what makes an
   off-screen clip cost nothing at all.
   ========================================================================== */
export function ReelTile({
  reel,
  lane,
  alt,
  className = "",
  rounded = "rounded-[16px]",
  as: Tag = "div",
}: {
  reel: Reel;
  /** Playback budget bucket. Must be unique per lane across the whole page. */
  lane: string;
  /** Describes the still. Empty marks the clip decorative, which is right
      wherever a section already names the whole group once. */
  alt: string;
  className?: string;
  rounded?: string;
  /** `span` where the clip sits inside a paragraph.

      THIS IS NOT COSMETIC. The statement section drops clips into the middle
      of a <p>, and a <div> is flow content: the HTML parser closes the open
      paragraph the moment it meets one, so the browser builds a different tree
      from the one the server rendered and hydration fails outright. A span is
      phrasing content and nests legally, and inline-block on it keeps the
      aspect box behaving exactly as it does anywhere else. */
  as?: "div" | "span";
}) {
  const reduced = useReducedMotion();
  const video = useInViewPlay(lane);

  return (
    <Tag
      className={`relative aspect-[9/16] overflow-hidden bg-panel-2 ${
        Tag === "span" ? "inline-block" : ""
      } ${rounded} ${className}`}
    >
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
    </Tag>
  );
}

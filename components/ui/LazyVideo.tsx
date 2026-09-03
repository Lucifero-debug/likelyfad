"use client";

import { useEffect, type ReactEventHandler } from "react";
import { useInViewPlay } from "@/lib/useInViewPlay";

/* ============================================================================
   THE ONE VIDEO TILE. Every autoplaying clip on the page is this component, so
   the loading policy is written once instead of three times with three
   different answers.

   IT IS A WRAPPER OVER lib/useInViewPlay, NOT A REPLACEMENT FOR IT. That file
   already owns the hard part — ONE IntersectionObserver for every tile on the
   page rather than one each, a per-lane cap on how many play at once, a dwell
   so tiles you scroll PAST never fetch at all, a pause for the length of a
   scroll gesture, and a stagger between starts so twenty streams do not split
   the connection twenty ways. All of that is load-bearing and profiled; the
   notes there have the measurements. This component supplies the markup and
   the second half of the policy — WHEN THE BYTES ARE ALLOWED TO BE ASKED FOR —
   and hands playback to the registry.

   WHAT IT REPLACED. The three video sections had three policies. The hero wall
   was on the registry with preload="none" and behaved correctly: 10 of its 32
   tiles playing at rest. The work wall had opted out entirely — `autoPlay`,
   preload="auto", one play() on mount and no observer — so all 96 of its tiles
   were playing and fully buffered while sitting below the fold. Measured on a
   1920x1080 load with nothing scrolled, that was 60 distinct clips and 18MB of
   video before the visitor had moved. Testimonials was already correct, because
   it creates no media element until a card is hovered or opened.

   TWO GATES, AND THEY ARE NOT THE SAME GATE.

     ATTACH — this file. `src` is withheld from the element until it comes
     within ATTACH_MARGIN of the viewport. preload="none" alone already stops
     the fetch, so this is belt to that braces: it also stops the element being
     a media resource at all, and it makes the intent legible in the DOM rather
     than resting on a preload value being honoured.

     PLAY — useInViewPlay. Threshold, dwell, lane budget, stagger. Fires later
     and more conservatively than attach, which is the whole point of the
     200px: the bytes are on their way by the time a tile is eligible to start,
     so play() is a resume rather than a cold fetch.

   THE ATTACH OBSERVER IS SHARED, for the same reason the registry's is. One
   observer watching N targets is one callback; N observers watching one target
   each is N callbacks, all of them firing inside a continuously animating
   transform. The walls mount 128 elements between them.
   ========================================================================== */

/* How early the source is attached. Comfortably ahead of the play threshold so
   a tile is never waiting on the network at the moment it is allowed to start,
   and comfortably short of "everything below the fold". */
const ATTACH_MARGIN = "200px";

/* The source each observed element is waiting for. A WeakMap rather than a data
   attribute: the URL never belongs in the DOM, and an entry here cannot outlive
   the element it keys. */
const pendingSrc = new WeakMap<HTMLVideoElement, string>();

let attachIO: IntersectionObserver | null = null;

function attachObserver(): IntersectionObserver {
  if (attachIO) return attachIO;
  attachIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLVideoElement;
        const src = pendingSrc.get(el);
        /* ONE SHOT. Once a tile has its source it never needs watching again —
           a marquee carries every tile in and out of view continuously, and
           re-attaching the same URL would reset the element's media state and
           drop whatever it had buffered. */
        attachIO?.unobserve(el);
        pendingSrc.delete(el);
        if (src && el.getAttribute("src") !== src) el.setAttribute("src", src);
      }
    },
    { rootMargin: ATTACH_MARGIN }
  );
  return attachIO;
}

type Props = {
  /** The tile cut — small and silent. Never the HQ one; that is the lightbox's. */
  src: string;
  /** Null is tolerated but should not happen: every reel in the manifest has one. */
  poster?: string | null;
  /** The budget bucket, and it must be UNIQUE PER LANE ACROSS THE WHOLE PAGE —
      the hero wall's column 0 and the work wall's row 0 are different queues.
      Ignored when `immediate` is set, which registers nothing. */
  lane: string;
  /** Goes on the <video>. Each section keeps its own. */
  className?: string;
  /** WHERE THE POSTER LIVES, and the two modes are not interchangeable.

      "attribute" puts it on the element, which is one raster and no extra node.
      It is what the hero wall wants, where every tile is inside the crop.

      "element" renders a real <img loading="lazy"> behind the video instead,
      and is what the work wall wants: 96 tiles of which a dozen are on screen,
      where the browser's own lazy loading is the only thing that stops all 48
      distinct posters being fetched at once. A `poster` attribute is NEVER
      lazy. Setting BOTH makes the browser hold two decoded rasters of the same
      webp per tile, which is why this is a choice and not a pair. */
  posterMode?: "attribute" | "element";
  /** Painted behind the video when there is no poster at all, so the frame is
      never empty. Absolutely positioned, so it cannot shift anything. */
  placeholderClassName?: string;
  /** Skip both gates: attach on mount and play at once, no observer, no lane,
      no dwell, no queue. For a clip that is MOUNTED BY AN INTENT — the hover
      preview on a testimonial card, which exists only because someone is
      already pointing at it. Putting that through the queue would answer a
      hover 200-500ms late, which is the one place the stagger is wrong. */
  immediate?: boolean;
  /** "none" everywhere the observer decides, "auto" only where `immediate`
      means the visitor has already asked. */
  preload?: "none" | "metadata" | "auto";
  /** False holds the tile on its poster and registers nothing — see the same
      flag on useInViewPlay. */
  enabled?: boolean;
  ariaHidden?: boolean;
  onPlaying?: ReactEventHandler<HTMLVideoElement>;
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>;
};

export function LazyVideo({
  src,
  poster,
  lane,
  className = "",
  posterMode = "attribute",
  placeholderClassName = "bg-poster",
  immediate = false,
  preload = "none",
  enabled = true,
  ariaHidden = true,
  onPlaying,
  onTimeUpdate,
}: Props) {
  /* The registry's ref IS this component's ref — there is only one element and
     both effects want it. `immediate` and `enabled: false` both register
     nothing, and the hook still hands back a usable ref either way. */
  const video = useInViewPlay(lane, enabled && !immediate);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    if (immediate) {
      el.setAttribute("src", src);
      /* play() before the element has decodable data REJECTS rather than
         queueing, so the first attempt is often the losing one on a slow line.
         Retrying on the first showable frame is what fills the tile in as bytes
         arrive instead of leaving it on its poster for good. A no-op once it is
         already running. */
      const start = () => void el.play().catch(() => {});
      start();
      el.addEventListener("canplay", start);
      return () => el.removeEventListener("canplay", start);
    }

    if (!enabled) return;

    pendingSrc.set(el, src);
    const io = attachObserver();
    io.observe(el);
    /* UNOBSERVE, NOT DISCONNECT. The observer is shared by every tile on the
       page — disconnecting it here would blind all of them. This is the same
       trade useInViewPlay makes with its own registry, and the reason neither
       is torn down: their life is the life of the page. */
    return () => {
      io.unobserve(el);
      pendingSrc.delete(el);
    };
  }, [src, immediate, enabled, video]);

  return (
    <>
      {posterMode === "element" && poster && (
        /* eslint-disable-next-line @next/next/no-img-element -- a remote blob
           URL already at the size it renders. next/image would mean a
           remotePatterns entry and a proxy hop to re-encode a 24KB webp into
           itself; the only thing wanted here is the browser's own lazy
           loading, which a plain <img> gives directly. */
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {!poster && (
        <span aria-hidden="true" className={`absolute inset-0 ${placeholderClassName}`} />
      )}

      <video
        ref={video}
        /* NO `src` HERE, DELIBERATELY — the effect above attaches it. A src in
           the JSX is a src in the first paint, and the point of this component
           is that a tile below the fold has never named a file. */
        poster={(posterMode === "attribute" ? poster : null) ?? undefined}
        muted
        loop
        playsInline
        preload={preload}
        /* The wrapping button is the control; the video inside it is never a
           tab stop of its own and carries no label, or a screen reader would
           announce the same clip twice. */
        tabIndex={-1}
        aria-hidden={ariaHidden || undefined}
        className={className}
        onPlaying={onPlaying}
        onTimeUpdate={onTimeUpdate}
      />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";

/* Play a clip only while it is on screen AND its lane has a free slot.

   WHAT ACTUALLY COSTS FRAMES
   Not bytes, and not raw decode: the tile cuts are 288x512 at 30fps, so thirty
   of them together are a couple of 1080p streams' worth of pixels. The cost is
   INSTANCE count. Every playing <video> is its own decoder, uploading a fresh
   texture to the GPU and compositing as its own layer, thirty times a second.
   The work wall puts ~12 tiles per row on a 1920 viewport; three rows of that
   is 36 live layers turning over continuously, and that is where the frames
   went.

   ONE OBSERVER, NOT ONE PER TILE
   The two walls mount 132 <video> elements between them. Each used to build
   its own IntersectionObserver — 132 of them, all watching targets inside a
   continuously animating transform. They now share one, created lazily on
   first use and living as long as the walls do, which is the life of the page.

   WHY A FIFO QUEUE IS THE RIGHT ONE
   Slots go to whoever has been visible LONGEST. On a marquee that lands
   exactly where you want it without measuring anything: a tile enters at the
   feeding edge, waits, and starts playing once a tile ahead of it exits at the
   far edge. So the clips being held still are always the ones bunched at the
   edge the lane feeds in from — which is the edge sitting under the fade. No
   rects are read, no timer runs, and the ordering falls out of Set insertion
   order for free. */

/* Clips allowed to play at once PER LANE. Budgeted per lane rather than per
   page so one row cannot starve the two under it — all three fill evenly no
   matter which order they scrolled into view.

   THIS IS THE KNOB. Raise it if the held-still band at a lane's feeding edge
   reads as broken; lower it if the walls still stutter on a weak GPU. */
const PER_LANE = 8;

/* A tile counts as on screen at a fifth visible, which is roughly the point it
   clears the fade. */
const THRESHOLD = 0.2;

type Lane = {
  /* Both are insertion-ordered — a Set iterates in the order things went into
     it, which IS the queue. Nothing else maintains it. */
  visible: Set<HTMLVideoElement>;
  playing: Set<HTMLVideoElement>;
};

type Registry = {
  io: IntersectionObserver;
  lanes: Map<string, Lane>;
  laneOf: WeakMap<HTMLVideoElement, Lane>;
};

let registry: Registry | null = null;

function reconcile(lane: Lane) {
  /* Release BEFORE filling, so a slot freed by a tile leaving is handed out in
     the same pass rather than sitting idle until the next callback. */
  for (const el of lane.playing) {
    if (!lane.visible.has(el)) {
      el.pause();
      lane.playing.delete(el);
    }
  }
  for (const el of lane.visible) {
    if (lane.playing.size >= PER_LANE) break;
    if (lane.playing.has(el)) continue;
    lane.playing.add(el);
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void el.play().catch(() => {});
  }
}

function getRegistry(): Registry {
  if (registry) return registry;

  const lanes = new Map<string, Lane>();
  const laneOf = new WeakMap<HTMLVideoElement, Lane>();
  const io = new IntersectionObserver(
    (entries) => {
      /* Reconcile each touched lane ONCE at the end. A batch of entries from
         one lane would otherwise re-run the whole queue per entry. */
      const touched = new Set<Lane>();
      for (const entry of entries) {
        const el = entry.target as HTMLVideoElement;
        const lane = laneOf.get(el);
        if (!lane) continue;
        /* add() on something already present does not move it — an element
           only goes to the back of the queue by genuinely leaving first. */
        if (entry.isIntersecting) lane.visible.add(el);
        else lane.visible.delete(el);
        touched.add(lane);
      }
      touched.forEach(reconcile);
    },
    { threshold: THRESHOLD }
  );

  registry = { io, lanes, laneOf };
  return registry;
}

/* `lane` is the budget bucket, and must be unique per lane ACROSS both walls —
   the hero wall's lane 0 and the work wall's row 0 are different queues. */
export function useInViewPlay(lane: string) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const r = getRegistry();
    let bucket = r.lanes.get(lane);
    if (!bucket) {
      bucket = { visible: new Set(), playing: new Set() };
      r.lanes.set(lane, bucket);
    }
    r.laneOf.set(el, bucket);
    r.io.observe(el);

    const queue = bucket;
    return () => {
      r.io.unobserve(el);
      queue.visible.delete(el);
      if (queue.playing.delete(el)) el.pause();
      // Unmounting frees a slot; hand it to whoever is next in line.
      reconcile(queue);
    };
  }, [lane]);

  return ref;
}

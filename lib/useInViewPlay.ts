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

/* How long a tile has to STAY on screen before it is allowed to start.

   Every clip ships `preload="none"`, so play() is not a cheap resume — it is a
   fresh network fetch plus a decoder spin-up. Scrolling the work wall past the
   viewport crosses ninety-six tiles through the threshold, and starting each
   one as it passed fired a burst of dozens of requests and decoder inits into
   the middle of the scroll, which is exactly where there is no budget for it.

   A tile in transit during a normal scroll is on screen for well under this,
   so it now costs nothing at all: the timer is cancelled on the way out and no
   fetch is ever made. Only tiles you actually stop on load. The cost is that
   settling on a wall shows posters for this long before the clips pick up,
   which is far cheaper than the scroll it buys. */
const DWELL_MS = 220;

/* How long after the last scroll event the clips are allowed back.

   THE DWELL ABOVE ONLY STOPS TILES STARTING. Everything already running keeps
   running straight through a scroll — up to twenty-four decoders, each pushing
   a fresh 288x512 texture to the GPU thirty times a second and compositing as
   its own layer, landing on precisely the frames the browser needs for the
   scroll itself. That is the load you feel while moving through the walls, and
   nothing before this touched it.

   So the whole page stops decoding for the length of the gesture. It is not
   visible: a paused clip holds its last frame, and a held frame on a tile
   sliding past under your thumb is indistinguishable from a playing one.

   Only the video stops. The marquee keeps running, deliberately — it is six
   layers against twenty-four, and a wall that freezes mid-scroll reads as the
   page having hung, which is the opposite of what this is for. */
const SCROLL_IDLE_MS = 160;

/* Gap between one clip starting and the next.

   THE MEASUREMENT THAT PUT THIS HERE. Filling the work wall's slots all at once
   opens twenty-four streams in the same instant, and they split the pipe
   twenty-four ways. Profiled against the deployed blob store: on a 4Mbps 4G
   line, seventeen of the twenty-four sat in `playing` with readyState below 3 —
   running, with nothing buffered to run on — and fired 45 `waiting` events in
   eight seconds. Even unthrottled it was 37. That stutter IS the lag; the
   decoders were never the problem, and capping how many play never addressed it
   because the contention is at the start, not in the steady state.

   Started one at a time, each clip has the whole line to itself for the ~1s it
   takes to pull 230KB, and a clip that has finished downloading loops out of
   cache forever after — costing nothing. Twelve staggered starts drain in about
   three seconds and every one of them plays clean. */
const START_STAGGER_MS = 260;

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
  /* Tiles on screen but still serving their dwell. A plain Map, not a Weak
     one: an entry here owns a live timer that has to be findable to cancel. */
  waiting: Map<HTMLVideoElement, ReturnType<typeof setTimeout>>;
  /* True for the length of a scroll gesture. `playing` still means "holds a
     slot" while this is set — the sets are left alone and only the elements
     are stopped, so the queue survives the gesture and the same tiles resume. */
  scrolling: boolean;
};

let registry: Registry | null = null;

/* Clips waiting their turn to start, and the timer walking the queue. One
   global line, not one per lane: the thing being rationed is the connection,
   and there is only one of those. */
const startQueue: HTMLVideoElement[] = [];
let pump: ReturnType<typeof setInterval> | undefined;

function queueStart(el: HTMLVideoElement) {
  startQueue.push(el);
  if (pump) return;
  pump = setInterval(() => {
    /* Mid-gesture nothing starts — hold the line rather than draining it, so
       the queue is still intact when the scroll ends. */
    if (registry?.scrolling) return;

    const next = startQueue.shift();
    if (!next) {
      clearInterval(pump);
      pump = undefined;
      return;
    }
    /* It may have scrolled away, or lost its slot to something ahead of it,
       between joining this queue and reaching the front. */
    const lane = registry?.laneOf.get(next);
    if (!lane?.playing.has(next)) return;
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void next.play().catch(() => {});
  }, START_STAGGER_MS);
}

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
    /* Takes the slot immediately, starts when the queue reaches it. Holding the
       slot from here is what stops the next reconcile handing it to someone
       else while this one is still waiting its turn. */
    lane.playing.add(el);
    queueStart(el);
  }
}

/* Every element currently holding a slot, across every lane. */
function eachPlaying(r: Registry, fn: (el: HTMLVideoElement) => void) {
  for (const lane of r.lanes.values()) for (const el of lane.playing) fn(el);
}

/* One listener for the document, attached with the registry rather than per
   tile. Passive: this never calls preventDefault, and saying so keeps the
   handler off the browser's critical path for the gesture. */
function watchScrolling(r: Registry) {
  let idle: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener(
    "scroll",
    () => {
      /* Stop on the FIRST event of a gesture, not on every one — scroll fires
         far faster than frames, and pausing an already-paused element each
         time would be its own cost. */
      if (!r.scrolling) {
        r.scrolling = true;
        eachPlaying(r, (el) => el.pause());
      }
      clearTimeout(idle);
      idle = setTimeout(() => {
        r.scrolling = false;
        /* Only what was ALREADY running before the gesture. Anything still in
           the start queue stays there and keeps its turn — resuming the whole
           set here would open every stream at once and undo the stagger. Those
           are free to resume together: a clip that has played has its bytes. */
        eachPlaying(r, (el) => {
          if (!startQueue.includes(el)) void el.play().catch(() => {});
        });
      }, SCROLL_IDLE_MS);
    },
    { passive: true }
  );
}

function getRegistry(): Registry {
  if (registry) return registry;

  const lanes = new Map<string, Lane>();
  const laneOf = new WeakMap<HTMLVideoElement, Lane>();
  const waiting = new Map<HTMLVideoElement, ReturnType<typeof setTimeout>>();

  const io = new IntersectionObserver(
    (entries) => {
      /* Reconcile each touched lane ONCE at the end. A batch of entries from
         one lane would otherwise re-run the whole queue per entry. */
      const touched = new Set<Lane>();

      for (const entry of entries) {
        const el = entry.target as HTMLVideoElement;
        const lane = laneOf.get(el);
        if (!lane) continue;

        if (entry.isIntersecting) {
          /* Already queued or already counted — leave the arrival time it
             has. Re-adding would only shuffle it down its own lane's queue. */
          if (lane.visible.has(el) || waiting.has(el)) continue;
          waiting.set(
            el,
            setTimeout(() => {
              waiting.delete(el);
              /* Joining the queue HERE, at the end of the dwell, is what makes
                 the FIFO order arrival order rather than threshold order. */
              lane.visible.add(el);
              reconcile(lane);
            }, DWELL_MS)
          );
          continue;
        }

        /* Leaving is immediate — a tile off screen should stop paying for
           itself this frame, not after a delay. */
        const pending = waiting.get(el);
        if (pending !== undefined) {
          clearTimeout(pending);
          waiting.delete(el);
        }
        if (lane.visible.delete(el)) touched.add(lane);
      }

      touched.forEach(reconcile);
    },
    { threshold: THRESHOLD }
  );

  registry = { io, lanes, laneOf, waiting, scrolling: false };
  watchScrolling(registry);
  return registry;
}

/* `lane` is the budget bucket, and must be unique per lane ACROSS both walls —
   the hero wall's lane 0 and the work wall's row 0 are different queues.

   `enabled` false never registers the tile at all, so it holds its poster and
   costs nothing — no observer entry, no slot, no fetch. It exists for the v8
   wall, which treats autoplaying video as motion and switches it off under
   prefers-reduced-motion; the two older walls never pass it and keep the
   behaviour they had. It is a DEPENDENCY of the effect, so flipping it back
   registers the tile normally rather than needing a remount. */
export function useInViewPlay(lane: string, enabled = true) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

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
      // A dwell timer outliving its element would resurrect it into the queue.
      const pending = r.waiting.get(el);
      if (pending !== undefined) {
        clearTimeout(pending);
        r.waiting.delete(el);
      }
      queue.visible.delete(el);
      if (queue.playing.delete(el)) el.pause();
      // Unmounting frees a slot; hand it to whoever is next in line.
      reconcile(queue);
    };
  }, [lane, enabled]);

  return ref;
}

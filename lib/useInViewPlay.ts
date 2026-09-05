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
   page so one row cannot starve the two under it — all lanes fill evenly no
   matter which order they scrolled into view.

   THIS IS THE KNOB. Raise it if the held-still band at a lane's feeding edge
   reads as broken; lower it if the walls still stutter on a weak GPU.

   IT APPLIES TO THE WORK WALL AGAIN, and that wall is what set this value.
   Work's rows register as `work-row-0/1/2` — see the note above its Tile. For
   a while they did not: the wall had opted out of this budget entirely and
   played all 96 tiles unconditionally, which measured at 18MB of video fetched
   before the visitor had scrolled. That is the history this number exists for,
   not a description of what it does now.

   8 WAS ONE SHORT OF THE ROW, AND SO WAS 10. At 1920 a Work tile is 158px wide
   on a ~170px pitch, and the count that matters is not how many tiles overlap
   the viewport but how many clear THRESHOLD — measured with a real observer at
   0.2 against the same elements the registry watches, that is ELEVEN to TWELVE
   per row. Against 8, three lost. Against 10, one still did, and it was not a
   sliver at the edge: it was a tile at full intersectionRatio sitting ~200px
   in from the lane's feeding edge, held for as long as you looked at the
   section. A still frame among moving ones reads as broken rather than as
   pending, which is the whole reason this number is tuned at all.

   11 IS THE CEILING NOW, RAISED BY EXACTLY ONE AND NO FURTHER. What that buys
   is the eligible band on the widths this page is actually used at; what it
   still refuses is the twelfth and thirteenth tile, which is where the cost
   curve was profiled. The figure behind that ceiling is unchanged and is the
   reason there is one: 12+ concurrent tiles across three rows was the most
   expensive arrangement on this page — 36 live decoders, each uploading a
   fresh 288x512 texture thirty times a second, every one its own compositing
   layer. 11 puts the worst case at 33 rather than 36, and it is deliberately
   the last step available here. If the feeding-edge band still reads as broken
   after this, THE FIX IS THE FADE OVER IT, NOT THIS NUMBER — see FADE in
   Work.tsx, which is sized to cover the tile this budget cannot reach. */
const PER_LANE = 6;

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

   So the whole page stops advancing video for the length of the gesture. It is
   not visible: a held clip shows its last frame, and a still frame on a tile
   sliding past under your thumb is indistinguishable from a playing one.

   Only the video stops. The marquee keeps running, deliberately — it is six
   layers against twenty-four, and a wall that freezes mid-scroll reads as the
   page having hung, which is the opposite of what this is for.

   WHAT STOPS THEM IS playbackRate = 0 AND NOT pause(), AND THAT ONE LINE IS
   THE DIFFERENCE BETWEEN THIS BEING FREE AND THIS BEING THE WORST STALL ON THE
   PAGE. See the hold/release pair in watchScrolling below for the measurement:
   pause() hands the decoders back, and taking them back afterwards froze the
   page for a fifth of a second EVERY TIME THE READER STOPPED SCROLLING. */
const SCROLL_IDLE_MS = 160;

/* How long a gesture has to keep going before the hold above turns into a real
   pause().

   THE TWO GESTURES ARE NOT THE SAME GESTURE, and one number could not serve
   both. A reader nudging the page a line at a time is stopping every few
   hundred milliseconds, so what they pay is the RELEASE, over and over; someone
   travelling from the hero to the footer pays it once, and what they pay for
   the whole way down is the HOLD.

   Measured on the production build at 1440x900, three full-page scrolls per
   variant. Rate 0 alone: 4, 3, 2 hitches — a held clip is not advancing, but it
   is still a video layer the compositor carries through every frame of the
   scroll, and thirty of those cost about what the audit was reporting.
   pause() alone: 0, 0, 0 on the same passes — and a 200ms stall at the end of
   every one of the reader's small ones.

   So the cheap stop is taken FIRST and the expensive one only once the gesture
   has proved it is a journey. 300ms is past the length of a nudge and well
   inside a travelling scroll; short of it nothing is ever paused, so the stall
   this file exists to remove cannot come back on the gesture that produced it.
   The one that does pay a decoder init is the long scroll, which pays it once,
   at the end, having saved the whole way down. */
const DEEP_HOLD_MS = 300;

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
   three seconds and every one of them plays clean.

   260 WAS TUNED AGAINST A QUEUE THAT NO LONGER EXISTS AT THAT SIZE. The figure
   above is the work wall's twenty-four slots seen as ONE burst, because at the
   time the alternative was all twenty-four opening in the same instant. What
   actually made that safe was the stagger existing at all, not its width: a
   clip needs the line to itself for about a second, and 260ms hands the next
   one a line the previous is still using regardless. The pacing is doing its
   job in either case; past that, the interval is only deciding HOW LONG THE
   WALL LOOKS UNFINISHED.

   AND THAT COST GREW WHEN THE WORK WALL CAME BACK ONTO THIS QUEUE. There is
   ONE line, shared — the thing being rationed is the connection, and there is
   only one of those — so Work's thirty slots now drain behind whatever the hero
   wall still has outstanding. At 260 a full section took past six seconds to
   finish filling, which is long enough that the last tiles arrive after the
   visitor has read the heading and moved on, and it reads as tiles that are
   broken rather than tiles that are coming.

   120 HALVES THAT WITHOUT TOUCHING WHAT THE STAGGER IS FOR. Starts are still
   serialised, still one at a time, still paused for the length of a scroll
   gesture — the burst this exists to prevent is just as impossible at 120 as at
   260. What changes is only how quickly the queue drains behind it. Lower this
   further and the starts begin to overlap inside one clip's fetch, which is the
   contention the measurement above describes; that is the floor, not 0. */
const START_STAGGER_MS = 120;

/* ============================================================================
   THE FIVE NUMBERS ABOVE ARE A POLICY, AND NOT EVERY LANE WANTS THE SAME ONE.

   Everything above is tuned for a wall you SCROLL PAST: hold the start until a
   tile proves it is staying, stop everything for the length of a gesture, and
   feed the queue slowly enough that no two clips fight for the line. On the
   hero wall that is right — it is four short lanes above the fold, and the
   visitor is reading the headline next to it rather than watching it.

   THE WORK WALL IS THE OPPOSITE CASE. It is the exhibit: you arrive AT it, you
   stop, and the argument it makes is that there is a lot of this and it is all
   alive. Measured on the production build at 1440x900, parked in #work, the
   conservative policy put 0 of 28 visible tiles in motion at one second, 9 at
   two, 17 at three and 27 at eight — and every scroll gesture took all of them
   back to zero. A wall of still posters that fills over eight seconds is not
   the same object as a wall of moving footage, whatever it is made of.

   SO THE POLICY IS PER LANE, and the numbers above are its conservative half.
   Nothing here weakens the thing the machinery is actually for: a tile off
   screen still plays nothing, still fetches nothing, and the ceiling is still a
   ceiling. What changes is only how fast a lane fills and whether it empties
   while you move.
   ========================================================================== */
export type PlayPolicy = {
  /** Ceiling on concurrently playing tiles in one lane. */
  cap: number;
  /** How long a tile must stay on screen before it may start. 0 joins the
      queue on the same callback that reported it visible. */
  dwell: number;
  /** Gap between one clip in this lane starting and the next. */
  stagger: number;
  /** Whether the clips ALREADY RUNNING in this lane stop for the length of a
      scroll gesture. It does not govern new starts: nothing in any lane starts
      mid-gesture, for the reason in drain(). */
  pauseOnScroll: boolean;
  /** How far OUTSIDE the viewport a tile counts as on screen. Lanes with
      different margins get different observers — one rect per margin, not one
      per tile, so this stays two observers for the page rather than 132.

      MUST NOT EXCEED LazyVideo's ATTACH_MARGIN, which is 200px. A tile becomes
      eligible to play here, but its `src` is attached there — go wider than the
      attach gate and the queue would reach a tile that has no file yet, spend
      its turn on a play() that rejects, and leave it on its poster. */
  margin: string;
};

/* THE DEFAULT, and it is exactly the five constants above. Every lane that does
   not ask for anything else gets this. */
const STANDARD: PlayPolicy = {
  cap: PER_LANE,
  dwell: DWELL_MS,
  stagger: START_STAGGER_MS,
  pauseOnScroll: true,
  margin: "0px",
};

/* WHAT A WALL ASKS FOR WHEN IT IS THE THING BEING LOOKED AT.

   NO DWELL. The dwell is there so a tile crossing the viewport during a scroll
   never pays for a fetch it will not use. A lane that does not stop for scrolls
   has no such crossing to protect against — its tiles are eligible the moment
   they are within the margin and stay eligible.

   NO SCROLL PAUSE, WHICH IS ABOUT CLIPS ALREADY RUNNING AND NOTHING ELSE. The
   wall keeps moving while you move through it. New starts still wait for the
   gesture to end in every lane including this one — see drain(), which has the
   measurement for why those two were worth separating. This is the expensive
   half of the change and the one to put back first if a trace goes bad: flip
   this to true and the lane behaves like every other one under scroll while
   keeping the fill rate and the lead margin.

   THE STAGGER IS UNCHANGED, AND IT WAS THE ONE NUMBER THAT LOOKED FREE. Cutting
   it to 40ms does fill the wall in ~1.1s instead of ~3.4s on a fast line, and
   on a 4Mbps one it reproduces the exact pathology the stagger exists to
   prevent: measured parked here at 4Mbps, 115 `waiting` events in twelve
   seconds, with up to 19 clips at once RUNNING and starved — readyState below
   3, playing nothing. Twenty-eight stuttering tiles is not a livelier wall than
   ten clean ones and eighteen posters filling in behind them.

   SO FILL SPEED IS BOUGHT FROM THE DWELL AND THE MARGIN INSTEAD, which cost
   bytes nothing. The bottleneck on a cold load is the line, and no interval
   here can widen it; what the two above remove is the time this wall spent NOT
   using it.

   150px OF LEAD, WHICH IS THE ONE THAT ANSWERS "IT ONLY PLAYS WHEN IN VIEW".
   Without it a tile is eligible at 20% visible, so on a marquee you WATCH each
   one start as it clears the feeding edge. At 150px it has been running for
   about five seconds by the time it arrives — the lane translates ~31px a
   second — so tiles slide in already in motion. Inside the 200px attach margin
   by 50px, which is the constraint above.

   14, NOT PER_LANE'S 11, AND NOT UNBOUNDED. The cap has to clear what a
   viewport can actually hold or it is the thing making tiles sit still: with
   the lead margin a 1440 row shows ~10 and a 1920 row ~13, so 14 does not bind
   at any width this site is used at. It binds from ~2200 up, where the tiles it
   holds back are the ones bunched at the feeding edge — under the fade, which
   is where the note on PER_LANE says this pressure belongs. Three rows at 14 is
   a 42-decoder ceiling against the old 33. */
export const HOT: PlayPolicy = {
  cap: 14,
  dwell: 0,
  stagger: START_STAGGER_MS,
  pauseOnScroll: false,
  margin: "150px",
};

type Lane = {
  /* Both are insertion-ordered — a Set iterates in the order things went into
     it, which IS the queue. Nothing else maintains it. */
  visible: Set<HTMLVideoElement>;
  playing: Set<HTMLVideoElement>;
  /* Fixed when the lane is created. A lane is one row of one wall, so this is
     a property of the wall rather than of any tile in it. */
  policy: PlayPolicy;
};

type Registry = {
  /* ONE OBSERVER PER ROOT MARGIN, not one per tile and not one per lane. Two
     lanes that watch the same rect share a callback; a lane that wants a
     different rect is the only thing that can force a second observer, because
     rootMargin is a property of the observer and not of the target. */
  observers: Map<string, IntersectionObserver>;
  handle: IntersectionObserverCallback;
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
/* The interval the running pump was created at. An interval cannot be retimed,
   so a lane that wants a shorter one has to replace it — this is what says
   whether it needs to. */
let pumpMs = 0;

/* One turn of the line: start the first entry that is still live and still
   allowed to move. */
function drain() {
  /* WALKED BY INDEX RATHER THAN SHIFTED, because entries are now skipped for
     two different reasons and only one of them is fatal. A stale entry is
     dropped; an entry whose lane is sitting out a scroll gesture KEEPS ITS
     PLACE and is stepped over, so the queue survives the gesture in order the
     way it always did. */
  for (let i = 0; i < startQueue.length; ) {
    const el = startQueue[i];
    const lane = registry?.laneOf.get(el);

    /* A STALE ENTRY DOES NOT COST A TURN. An element may have scrolled away, or
       lost its slot to something ahead of it, between joining this queue and
       reaching the front. Walk past the dead ones in the same tick and start
       the first live one. */
    if (!lane?.playing.has(el)) {
      startQueue.splice(i, 1);
      continue;
    }

    /* MID-GESTURE NOTHING STARTS, IN ANY LANE, INCLUDING THE ONES THAT DO NOT
       STOP — and the two are not the same rule even though the old code could
       treat them as one.

       Keeping a clip RUNNING through a gesture costs a decoder that is already
       spun up and a texture it was already uploading. STARTING one costs a
       cold fetch and a decoder init, on precisely the frames the browser needs
       for the scroll itself, and that is the expensive half. Measured across
       four rounds at 1440x900, letting hot lanes start mid-gesture took the
       scroll from 23.5% of frames over budget to 37.8% and put 225ms of long
       tasks into a gesture that had none.

       So the queue holds its place and drains when the gesture ends, exactly as
       it always did. What the hot lanes changed is only that the tiles ALREADY
       running are still running when it does — which is the thing you can see.
       The lead margin is what makes the wait invisible: a tile enters the queue
       150px before it reaches the edge, so a normal gesture ends long before it
       had anything to show. */
    if (registry?.scrolling) {
      i++;
      continue;
    }

    startQueue.splice(i, 1);
    /* EVERY START SITE RESTORES THE RATE, not just the release below. A tile
       held at 0 by a gesture can leave the viewport before the release runs —
       reconcile() pauses it there and drops it from the lane, so the release
       never sees it — and it comes back through this line. Without this it
       comes back playing at rate 0, which is a tile that is frozen for good and
       looks exactly like a broken clip. */
    el.playbackRate = 1;
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void el.play().catch(() => {});
    return;
  }

  /* Only when there is nothing left AT ALL. A queue held entirely by a scroll
     gesture is not an empty one, and stopping the pump there would leave it
     with no one to restart it. */
  if (!startQueue.length) {
    clearInterval(pump);
    pump = undefined;
    pumpMs = 0;
  }
}

function queueStart(el: HTMLVideoElement, stagger: number) {
  /* NEVER TWICE IN THE LINE. A tile that leaves the viewport and comes back —
     which is every tile on a marquee, repeatedly — is released and re-queued,
     and without this it would hold two places. The second one costs a full turn
     to discover it has nothing to do, and the tiles behind it wait that long
     for nothing. The list is tens of entries, so a scan is cheaper than the
     Set it would take to avoid one. */
  if (startQueue.includes(el)) return;
  startQueue.push(el);

  /* THE FASTEST LANE IN THE QUEUE SETS THE PACE, and the queue is shared
     because the thing being rationed is the connection. A hot lane joining a
     line running at 120ms would otherwise wait the slow interval for its own
     turns; re-timing the pump is what lets it drain at its own rate. The line
     stays at the faster rate until it empties, which hands the standard lanes
     the tail of a hot drain slightly quicker than they asked for — the stagger
     is a floor on contention, not a promise about total time, so arriving
     early costs nothing. */
  if (pump && pumpMs <= stagger) return;
  if (pump) clearInterval(pump);
  pumpMs = stagger;
  pump = setInterval(drain, stagger);
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
    if (lane.playing.size >= lane.policy.cap) break;
    if (lane.playing.has(el)) continue;
    /* Takes the slot immediately, starts when the queue reaches it. Holding the
       slot from here is what stops the next reconcile handing it to someone
       else while this one is still waiting its turn. */
    lane.playing.add(el);
    queueStart(el, lane.policy.stagger);
  }
}

/* Every element currently holding a slot, in every lane that stops for scroll
   gestures. The lanes that do not are simply never visited — there is nothing
   to pause and nothing to resume, so they never appear in either half of the
   handler below. */
function eachPausing(r: Registry, fn: (el: HTMLVideoElement) => void) {
  for (const lane of r.lanes.values()) {
    if (!lane.policy.pauseOnScroll) continue;
    for (const el of lane.playing) fn(el);
  }
}

/* One listener for the document, attached with the registry rather than per
   tile. Passive: this never calls preventDefault, and saying so keeps the
   handler off the browser's critical path for the gesture. */
function watchScrolling(r: Registry) {
  let idle: ReturnType<typeof setTimeout> | undefined;
  /* Set when a gesture starts, cleared when it ends. It only ever fires for a
     gesture that outlives DEEP_HOLD_MS. */
  let deep: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener(
    "scroll",
    () => {
      /* Stop on the FIRST event of a gesture, not on every one — scroll fires
         far faster than frames, and holding an already-held element each time
         would be its own cost. */
      if (!r.scrolling) {
        r.scrolling = true;
        /* HELD AT RATE 0 RATHER THAN PAUSED, and the two are not the same
           instruction to the browser even though they look the same on screen.

           A paused <video> is a decoder Chrome is free to tear down, and with a
           dozen of them paused together it does. Starting them again is then
           not a resume at all — it is a cold decoder init per clip, and they
           land in a heap on whatever frame the release runs on.

           Rate 0 stops the clip advancing without ever leaving "playing". No
           new frames are decoded and none are uploaded, which is the entire
           saving the hold was ever after; what it does not do is hand back the
           pipeline that produced them. The release is then a number going back
           to 1. */
        eachPausing(r, (el) => { el.playbackRate = 0; });

        /* AND THE SECOND STOP, IF THIS TURNS OUT TO BE A JOURNEY. Handing the
           decoders back is what makes a release expensive, so it is worth doing
           only when the saving runs for seconds rather than for one nudge. */
        deep = setTimeout(() => {
          eachPausing(r, (el) => el.pause());
        }, DEEP_HOLD_MS);
      }
      clearTimeout(idle);
      idle = setTimeout(() => {
        clearTimeout(deep);
        r.scrolling = false;
        /* Only what was ALREADY running before the gesture. Anything still in
           the start queue stays there and keeps its turn — starting the whole
           set here would open every stream at once and undo the stagger.

           MEASURED, BECAUSE THIS LINE USED TO BE THE SLOWEST THING ON THE PAGE.
           Production build, 1440x900, parked at the top with the hero wall
           filled, doing what a reader does — one small scroll, then stillness,
           six times over. With pause()/play() every single gesture end stalled:
           83, 243, 174, 160, 201, 236ms, against a control that never scrolled
           and never left 14ms, and eleven play() calls sitting inside each of
           those windows. A fifth of a second of frozen page every time the
           reader stops moving, which is the shape the complaint actually had —
           the scrolling itself was measuring clean the whole time.

           Held at rate 0 the same six gestures come back 14, 35, 28, 28, 28 and
           125ms: one stall left in six, and the median is a frame. Nothing here
           is staggered and nothing needs to be — a rate going back to 1 is not
           a decoder init, so twelve of them on one frame cost what one does.
           SPREADING THEM WAS TRIED FIRST, at 40ms apart, and it only made the
           stalls smaller (125ms median, still one in every gesture) because it
           was rationing the wrong thing. */
        eachPausing(r, (el) => {
          el.playbackRate = 1;
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

  const handle: IntersectionObserverCallback = (entries) => {
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

          /* NO DWELL IS NOT A ZERO-LENGTH DWELL. A 0ms timer still defers the
             join to a later task, so the tile would miss the reconcile this
             very callback is about to run and wait for the next one. Joining
             here puts it in `touched` with everything else that moved in this
             batch, which is the whole reason a lane with no dwell fills on the
             frame it becomes visible rather than the one after. */
          if (!lane.policy.dwell) {
            lane.visible.add(el);
            touched.add(lane);
            continue;
          }

          waiting.set(
            el,
            setTimeout(() => {
              waiting.delete(el);
              /* Joining the queue HERE, at the end of the dwell, is what makes
                 the FIFO order arrival order rather than threshold order. */
              lane.visible.add(el);
              reconcile(lane);
            }, lane.policy.dwell)
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
  };

  registry = {
    observers: new Map(),
    handle,
    lanes,
    laneOf,
    waiting,
    scrolling: false,
  };
  watchScrolling(registry);
  return registry;
}

/* The observer watching one rect, built on first use and kept for the life of
   the page like everything else here. Two policies means two observers; a third
   with the same margin as an existing one means none. */
function observerFor(r: Registry, margin: string): IntersectionObserver {
  let io = r.observers.get(margin);
  if (!io) {
    io = new IntersectionObserver(r.handle, { threshold: THRESHOLD, rootMargin: margin });
    r.observers.set(margin, io);
  }
  return io;
}

/* `lane` is the budget bucket, and must be unique per lane ACROSS both walls —
   the hero wall's lane 0 and the work wall's row 0 are different queues.

   `enabled` false never registers the tile at all, so it holds its poster and
   costs nothing — no observer entry, no slot, no fetch. It exists because
   AUTOPLAYING VIDEO IS MOTION: every wall that passes it switches its clips
   off under prefers-reduced-motion, where a tile shows its poster frame and
   nothing else. ReelWallV6 and the v8 wall have always passed it; the work
   wall does now — it was the one section where the preference stopped the
   marquees and left 27 clips playing behind them. It is a DEPENDENCY of the
   effect, so flipping it back registers the tile normally rather than needing
   a remount.

   `policy` IS THE LANE'S, NOT THE TILE'S, and the first tile to mount decides
   it. Every tile in a row passes the same object — they are rendered by one
   map over one array — so there is nothing to reconcile between them, and a
   lane is created once and lives as long as the page. Passing two different
   policies for one lane name would silently keep the first; the fix for that
   is to not do it, since the thing being described is the row. */
export function useInViewPlay(lane: string, enabled = true, policy: PlayPolicy = STANDARD) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const r = getRegistry();
    let bucket = r.lanes.get(lane);
    if (!bucket) {
      bucket = { visible: new Set(), playing: new Set(), policy };
      r.lanes.set(lane, bucket);
    }
    r.laneOf.set(el, bucket);
    /* Observed against the LANE's margin rather than the argument's, so a tile
       is always watched by the observer whose rect its lane was built for. */
    const io = observerFor(r, bucket.policy.margin);
    io.observe(el);

    const queue = bucket;
    return () => {
      io.unobserve(el);
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
  }, [lane, enabled, policy]);

  return ref;
}

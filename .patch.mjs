import { readFileSync, writeFileSync } from "node:fs";
const p = "lib/useInViewPlay.ts";
let s = readFileSync(p, "utf8");
const must = (a, b) => { if (!s.includes(a)) { console.error("MISS:\n" + a); process.exit(1); } s = s.replace(a, b); };

/* 1. The new constant, directly under SCROLL_IDLE_MS. */
must(
`const SCROLL_IDLE_MS = 160;`,
`const SCROLL_IDLE_MS = 160;

/* Gap between one held clip coming back and the next, once the gesture ends.

   THE RESUME WAS THE STALL, AND IT WAS THE WHOLE OF IT. The line above stops
   the page decoding for the length of a gesture, which is right and measures
   clean. What it did NOT account for is what coming back costs: every held clip
   was handed play() in the same tick, and a paused decoder does not resume for
   free — it re-primes and re-uploads its texture, and ten or twelve of those
   land on one frame.

   MEASURED ON THE PRODUCTION BUILD AT 1440x900, parked at the top with the hero
   wall filled, doing what a reader does — one small scroll, then stillness,
   eight times over. Every gesture end produced a stall: 118, 125, 111, 146,
   194, 146, 181, 146ms, against a control that never scrolled and never left
   14ms. Ten to twelve play() calls in each of those windows. That is a sixth of
   a second of frozen page EVERY TIME THE READER STOPS MOVING, which is the
   shape of the complaint — the scrolling itself was never the slow part.

   40ms IS TWO FRAMES AT 60Hz AND SIX AT 144, and the arithmetic is the point:
   the cost per clip is ~13ms, so one per turn fits inside a frame's budget on
   any display this runs on instead of stacking twelve of them into one. Twelve
   clips take ~480ms to all come back, and none of that is visible — a clip
   holding its last frame is indistinguishable from a playing one, which is the
   same fact the pause above already rests on.

   IT IS NOT THE START STAGGER AND MUST NOT BE FOLDED INTO IT. That number
   rations the CONNECTION and is a floor on contention between cold fetches;
   this one rations DECODER WORK between clips whose bytes are already in hand.
   They are different resources, they are measured in different ways, and a clip
   resuming has nothing to download. */
const RESUME_STAGGER_MS = 40;`);

/* 2. The queue, next to the start queue it must not be confused with. */
must(
`/* One turn of the line: start the first entry that is still live and still
   allowed to move. */
function drain() {`,
`/* Clips a gesture took away, waiting their turn to come back. A SECOND line,
   deliberately, and not the one above: an entry here has its bytes and wants a
   decoder, an entry there wants the network. Merging them would ration the
   cheap thing at the expensive thing's rate and make the wall fill slower to
   fix a stall that has nothing to do with it. */
const resumeQueue: HTMLVideoElement[] = [];
let resumePump: ReturnType<typeof setInterval> | undefined;

function stopResuming() {
  resumeQueue.length = 0;
  clearInterval(resumePump);
  resumePump = undefined;
}

/* One turn of the resume line. */
function drainResume() {
  /* A GESTURE THAT STARTS MID-DRAIN WINS. Everything still waiting here was
     just paused again by the handler below, and the end of that gesture re-adds
     the whole set in one pass — so there is nothing to preserve and holding
     places would only risk resuming a clip the next gesture had stopped. */
  if (registry?.scrolling) {
    stopResuming();
    return;
  }

  for (;;) {
    const el = resumeQueue.shift();
    if (!el) {
      stopResuming();
      return;
    }

    /* Skipped rather than counted, for the two ways an entry goes stale while
       it waits: the tile lost its slot (it scrolled out, or its lane handed the
       slot to something nearer the front), or it never started in the first
       place and is still in the START line, where its turn is already
       accounted for. Neither costs a turn — the next live one goes now. */
    const lane = registry?.laneOf.get(el);
    if (!lane?.playing.has(el) || startQueue.includes(el)) continue;

    void el.play().catch(() => {});
    return;
  }
}

/* One turn of the line: start the first entry that is still live and still
   allowed to move. */
function drain() {`);

/* 3. The handler: enqueue instead of resuming the set in one tick. */
must(
`      if (!r.scrolling) {
        r.scrolling = true;
        eachPausing(r, (el) => el.pause());
      }
      clearTimeout(idle);
      idle = setTimeout(() => {
        r.scrolling = false;
        /* Only what was ALREADY running before the gesture. Anything still in
           the start queue stays there and keeps its turn — resuming the whole
           set here would open every stream at once and undo the stagger. Those
           are free to resume together: a clip that has played has its bytes. */
        eachPausing(r, (el) => {
          if (!startQueue.includes(el)) void el.play().catch(() => {});
        });
      }, SCROLL_IDLE_MS);`,
`      if (!r.scrolling) {
        r.scrolling = true;
        /* Anything still waiting to come back from the LAST gesture is about to
           be paused again by the line below, so its place is worth nothing. */
        stopResuming();
        eachPausing(r, (el) => el.pause());
      }
      clearTimeout(idle);
      idle = setTimeout(() => {
        r.scrolling = false;
        /* Only what was ALREADY running before the gesture. Anything still in
           the start queue stays there and keeps its turn — resuming the whole
           set here would open every stream at once and undo the stagger.

           AND THEY DO NOT COME BACK TOGETHER EITHER, which is what this queue
           is for: "a clip that has played has its bytes" is true and was never
           the expensive part. See RESUME_STAGGER_MS for the twelve decoders
           that were landing on one frame. */
        eachPausing(r, (el) => {
          if (!startQueue.includes(el) && !resumeQueue.includes(el)) resumeQueue.push(el);
        });

        if (resumeQueue.length && !resumePump) {
          /* Pump first, then the first turn immediately: one clip resuming fits
             in a frame, and taking it now is what keeps the wall from reading
             as dead for a stagger's length after the reader stops. Draining the
             queue empty on that first turn stops the pump it just started. */
          resumePump = setInterval(drainResume, RESUME_STAGGER_MS);
          drainResume();
        }
      }, SCROLL_IDLE_MS);`);

writeFileSync(p, s);
console.log("patched");

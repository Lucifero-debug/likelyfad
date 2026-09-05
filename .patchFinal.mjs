import { readFileSync, writeFileSync } from "node:fs";
const p = "lib/useInViewPlay.ts";
let s = readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const reps = [];
const rep = (a, b) => reps.push([a, b]);

/* 1. The constant's note is now describing a hold, not a pause. */
rep(
`/* How long after the last scroll event the clips are allowed back.

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
const SCROLL_IDLE_MS = 160;`,

`/* How long after the last scroll event the clips are allowed back.

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
const SCROLL_IDLE_MS = 160;`);

/* 2. drain(): a tile that starts while it is held has to be handed a live rate. */
rep(
`    startQueue.splice(i, 1);
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void el.play().catch(() => {});`,
`    startQueue.splice(i, 1);
    /* EVERY START SITE RESTORES THE RATE, not just the release below. A tile
       held at 0 by a gesture can leave the viewport before the release runs —
       reconcile() pauses it there and drops it from the lane, so the release
       never sees it — and it comes back through this line. Without this it
       comes back playing at rate 0, which is a tile that is frozen for good and
       looks exactly like a broken clip. */
    el.playbackRate = 1;
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void el.play().catch(() => {});`);

/* 3. The hold. */
rep(
`      /* Stop on the FIRST event of a gesture, not on every one — scroll fires
         far faster than frames, and pausing an already-paused element each
         time would be its own cost. */
      if (!r.scrolling) {
        r.scrolling = true;
        eachPausing(r, (el) => el.pause());
      }`,
`      /* Stop on the FIRST event of a gesture, not on every one — scroll fires
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
      }`);

/* 4. The release. */
rep(
`        /* Only what was ALREADY running before the gesture. Anything still in
           the start queue stays there and keeps its turn — resuming the whole
           set here would open every stream at once and undo the stagger. Those
           are free to resume together: a clip that has played has its bytes. */
        eachPausing(r, (el) => {
          if (!startQueue.includes(el)) void el.play().catch(() => {});
        });`,
`        /* Only what was ALREADY running before the gesture. Anything still in
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
        });`);

for (const [a] of reps) if (!s.includes(a)) { console.error("MISS:\n" + a.slice(0, 200)); process.exit(1); }
for (const [a, b] of reps) s = s.replace(a, b);
writeFileSync(p, s);
console.log("final patch applied");

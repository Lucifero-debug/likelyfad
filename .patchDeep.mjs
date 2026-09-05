import { readFileSync, writeFileSync } from "node:fs";
const p = "lib/useInViewPlay.ts";
let s = readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const reps = [];
const rep = (a, b) => reps.push([a, b]);

rep(
`const SCROLL_IDLE_MS = 160;`,
`const SCROLL_IDLE_MS = 160;

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
const DEEP_HOLD_MS = 300;`);

rep(
`function watchScrolling(r: Registry) {
  let idle: ReturnType<typeof setTimeout> | undefined;`,
`function watchScrolling(r: Registry) {
  let idle: ReturnType<typeof setTimeout> | undefined;
  /* Set when a gesture starts, cleared when it ends. It only ever fires for a
     gesture that outlives DEEP_HOLD_MS. */
  let deep: ReturnType<typeof setTimeout> | undefined;`);

rep(
`        eachPausing(r, (el) => { el.playbackRate = 0; });
      }`,
`        eachPausing(r, (el) => { el.playbackRate = 0; });

        /* AND THE SECOND STOP, IF THIS TURNS OUT TO BE A JOURNEY. Handing the
           decoders back is what makes a release expensive, so it is worth doing
           only when the saving runs for seconds rather than for one nudge. */
        deep = setTimeout(() => {
          eachPausing(r, (el) => el.pause());
        }, DEEP_HOLD_MS);
      }`);

rep(
`      clearTimeout(idle);
      idle = setTimeout(() => {
        r.scrolling = false;`,
`      clearTimeout(idle);
      idle = setTimeout(() => {
        clearTimeout(deep);
        r.scrolling = false;`);

for (const [a] of reps) if (!s.includes(a)) { console.error("MISS:\n" + a.slice(0, 160)); process.exit(1); }
for (const [a, b] of reps) s = s.replace(a, b);
writeFileSync(p, s);
console.log("deep-hold patch applied");

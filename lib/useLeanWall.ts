"use client";

import { useCallback, useSyncExternalStore } from "react";

/* HOW MANY TILES A MARQUEE LANE NEEDS, WHEN THE MACHINE CANNOT AFFORD THE ONES
   IT IS BEING GIVEN.

   THE PROBLEM IS A CLIFF, NOT A SLOPE, and that is the whole reason the answer
   is a device test rather than a few percent shaved off everywhere.

   Measured on the production build, parked in #work with nothing touched, at a
   6x CPU throttle: the SAME page on the SAME machine came back either at ~58fps
   with 13-17% of frames over budget, or at ~11fps with 97% over — run to run,
   with nothing changed between them. The bad runs are not uniformly slower.
   They carry 130 RasterTasks against 57, and 85ms of GPU time against 22. That
   is the compositor RE-RASTERISING the wall every frame instead of translating
   tiles it already holds, which is what starts happening once the page's total
   layer area passes the tile memory budget and eviction begins. Under the
   budget the marquee is nearly free; over it, every frame repaints.

   So the page does not degrade gradually as a machine gets weaker. It is fine
   until the budget is crossed and then it is unusable — and a device with less
   GPU memory crosses it on every load rather than on some of them. That is
   exactly the shape of "it lags on SOME devices", and it is why the fix is to
   hand the compositor less area on those devices rather than to make the
   existing area marginally cheaper.

   WHAT THE TRIM COSTS VISUALLY: NOTHING, AND THAT IS BY CONSTRUCTION. A lane
   holds far more tiles than a viewport can show — sixteen per set is sized so
   one set outruns a 2560 monitor, which is the invariant that keeps the wrap
   point off screen. On a 390px phone that same set is roughly five viewports
   wide. Cutting it to what the viewport ACTUALLY spans leaves the wall looking
   identical: the same tiles at the same size moving at the same speed, still
   seamless, still never showing its seam. The only difference is that the lane
   comes back round to its first clip sooner. Fewer distinct clips, not a
   smaller or emptier wall.
   ========================================================================== */

/* THE SMALLEST A TILE PLUS ITS GAP CAN EVER BE, and it is deliberately the
   floor of the clamps rather than their typical value.

   Work's tile is `clamp(112px,33vw,146px)` below `tab` and
   `clamp(116px,12vw,158px)` above it; the row gap is `clamp(8px,1.2vw,12px)`.
   112 + 8 is therefore a true lower bound on the pitch at every width the wall
   renders at. Dividing by a floor OVERSTATES how many tiles it takes to span a
   viewport, which is the direction the error has to point: one tile too many
   is invisible, one too few puts the wrap point on screen.

   KEEP THIS IN STEP WITH THE TILE CLAMP. Lower either floor in Work.tsx and
   this has to come down with it, or the count stops being an upper bound and
   the guarantee above quietly stops holding. */
const MIN_PITCH = 120;

/* One extra tile beyond the span, so the count is never exactly the viewport —
   a set the same width as the window puts its seam on the edge of the screen at
   every wrap, and a partial tile at the far edge is what the fade is over. */
const MARGIN_TILES = 1;

/* IS THIS ONE OF THE MACHINES THAT FALLS OFF THE CLIFF?

   WHAT IT DELIBERATELY DOES NOT TEST. Not `pointer: coarse` — that is every
   phone, including ones with more GPU memory than the average laptop, and they
   carry the full wall without trouble. Not viewport width either: a narrow
   window on a workstation is not a weak machine. The three signals below are
   the ones that speak about the HARDWARE.

   ALL THREE ARE ADVISORY AND TWO ARE CHROME-ONLY. `deviceMemory` and
   `saveData` do not exist in Safari or Firefox, and `hardwareConcurrency`
   over-reports on a machine that is thermally limited rather than core
   limited. AN ABSENT SIGNAL READS AS "NOT LEAN", so everywhere the browser
   declines to answer the visitor gets the full wall — which is what every
   visitor gets today. This can only ever take work away from a machine that has
   said something about itself, never add any. */
function detectLean(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  /* Data Saver is the visitor asking directly, and the one signal here that is
     a stated preference rather than a measurement. */
  if (nav.connection?.saveData === true) return true;

  /* Capped at 8 by the spec whatever the machine really holds, so "4 and under"
     is the bottom half of what the API can express rather than a line picked
     out of the air. */
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;

  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true;

  return false;
}

/* FULL ON THE SERVER AND FULL ON THE FIRST CLIENT RENDER, WHICH IS NOT A
   COMPROMISE — it is what keeps the markup hydratable.

   How many tiles a lane renders IS markup, so deciding it from a client-only
   signal inside a useState initialiser would have the server emit one number of
   children and the first client render emit another. That is a hydration
   mismatch, not a saving. The count has to be the full one while the tree
   hydrates and the trimmed one immediately after, and that split is what
   useSyncExternalStore declares rather than improvises: getServerSnapshot is
   what the server renders and what the hydrating client renders, and React
   re-reads the live snapshot the moment hydration is done.

   THE HAND-ROLLED VERSION IS NOT AVAILABLE HERE, and not merely inelegant.
   useState plus an effect that calls setCount is a setState in an effect body,
   which `react-hooks/set-state-in-effect` reports as an ERROR in this config —
   putting it behind an early return does not change that, because the call is
   still synchronous in the effect on the machines that reach it. lib/v3/
   useReducedMotion.ts makes the same argument about the same rule for the same
   reason; this is that file's shape applied to a capability read instead of a
   media query.

   AND THE TRIM COSTS NOTHING WHERE IT LANDS. The wall is below the fold, behind
   `content-visibility: auto`, and every tile withholds its source until an
   observer says otherwise — so the tiles removed here had not fetched a byte,
   decoded a frame, or been composited. React drops the nodes before any of that
   was going to happen.

   READ ONCE, NOT SUBSCRIBED, which is the call every other capability read in
   this repo makes — see the prefers-reduced-motion reads in Work and
   ReelWallV6. None of these three signals changes mid-session in a way worth
   re-rendering a wall for, and a resize does not change the hardware. So the
   store never notifies: subscribe hands back its unsubscribe and does nothing
   else, which is a legal store with exactly one value.
   ========================================================================== */

/* A store that never changes cannot notify, so this exists only to satisfy the
   signature. It has to be defined ONCE at module scope: a fresh closure per
   render is a fresh subscription per render, for a store with nothing to say. */
const never = () => () => {};

/* Resolved once, lazily, and never on the server. getSnapshot runs on EVERY
   render and React compares what it returns to what it returned last —
   `innerWidth` read there would make the answer move when a window is dragged,
   with nothing subscribed to settle it. Reading both signals once and caching
   the number is what keeps the snapshot the constant React requires.

   Infinity carries "this machine keeps the full wall", so the one cached value
   goes through the same Math.min below as a real span does. */
let span: number | null = null;
const rowSpan = () =>
  (span ??= detectLean() ? Math.ceil(window.innerWidth / MIN_PITCH) + MARGIN_TILES : Infinity);

/** How many tiles one set of a marquee lane should render on THIS machine.

    @param full How many tiles one set holds when nothing is trimmed. Returned
                unchanged on every machine that does not report itself weak, and
                used as the CEILING on the ones that do: a wide screen on a weak
                machine still needs the full count to span it, and this never
                hands back more tiles than the caller has clips for. */
export function useLeanRowLength(full: number): number {
  const get = useCallback(() => Math.min(full, rowSpan()), [full]);
  const onServer = useCallback(() => full, [full]);

  return useSyncExternalStore(never, get, onServer);
}

"use client";

import { useSyncExternalStore } from "react";

/* ============================================================================
   The studio clock.

   A TICKING CLOCK IS AN EXTERNAL STORE, which is worth saying plainly because
   the obvious implementation is not. useState plus a setInterval in an effect
   works, but it has to seed itself with a setState in the effect body on every
   mount — a cascading render React now warns about — and it leaves the
   server/client split to be handled by hand at the call site.

   Modelled as a store instead, all of that falls out for free:

     subscribe        starts the interval and returns its teardown, so React
                      owns the lifetime and a clock can never outlive its panel
     getSnapshot      the current epoch SECOND, not a Date. A number changes
                      value once per second and compares by Object.is, so React
                      re-renders exactly once per tick. Returning a Date would
                      hand back a new object every time it asked and re-render
                      forever.
     getServerSnapshot  null. The server has no idea what time it is where the
                      reader is standing, and rendering a real clock there
                      guarantees a hydration mismatch on the first paint of
                      every visit. Null is the honest answer, and the caller
                      renders a same-width placeholder until the browser
                      answers.
   ========================================================================== */
const clock = {
  subscribe(onTick: () => void) {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
  },
  get: () => Math.floor(Date.now() / 1000),
};

const onServer = () => null;

/** The current epoch second, or null before the browser has answered. */
export function useSecond(): number | null {
  return useSyncExternalStore(clock.subscribe, clock.get, onServer);
}

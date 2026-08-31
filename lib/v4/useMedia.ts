"use client";

import { useSyncExternalStore } from "react";

/* ============================================================================
   The two media queries this page has to read in JavaScript rather than CSS.

   WHY REDUCED MOTION NEEDS A HOOK WHEN globals.css ALREADY HAS A BLOCK FOR IT.
   That block neutralises animations and transitions. It cannot touch a playing
   video, and it cannot decide whether the playground starts on — both of which
   are exactly what this page has to get right. A clip is not an animation, so
   a page built out of autoplaying video honours the preference in name only
   unless something reads it in JS.

   WHY THE WIDTH QUERY. The playground is off by default on a phone and falls
   back to a static grid, which is a DOM decision rather than a paint one, so
   CSS cannot make it.

   WHY useSyncExternalStore AND NOT useState PLUS useEffect. A media query IS
   an external store, and this is the hook built to read one. Doing it by hand
   means a setState in an effect body on every mount, which is a cascading
   render React now warns about, and it means owning the server/client split by
   hand. Here the split is declared: getServerSnapshot returns false, so the
   server and the hydrating client agree and nothing tears, and React re-reads
   the live value the moment hydration is done.

   FALSE IS THE RIGHT SERVER ANSWER FOR BOTH. It means the prerendered page is
   the one with motion allowed and a wide viewport assumed — but the playground
   still starts OFF regardless (see Playground.tsx), so the only thing these
   values ever do is decide whether it is allowed to turn itself on after
   hydration. Being briefly wrong in that direction costs nothing at all.
   ========================================================================== */
function mediaStore(query: string) {
  /* Resolved once, lazily, and never on the server. getSnapshot is called on
     every render, so building a fresh MediaQueryList each time would be a
     needless allocation on a hot path. */
  let mql: MediaQueryList | null = null;
  const list = () => (mql ??= window.matchMedia(query));

  return {
    subscribe(onChange: () => void) {
      const m = list();
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    /* Booleans, so React's Object.is comparison settles immediately and a
       snapshot that has not changed never schedules a render. */
    get: () => list().matches,
  };
}

const reducedMotion = mediaStore("(prefers-reduced-motion: reduce)");
/* Matches the phone breakpoint in globals.css from the other side, so the one
   place that branches in JS branches at the same width the rest of the page
   branches in CSS. */
const narrow = mediaStore("(max-width: 760px)");

const onServer = () => false;

/** Has this visitor asked the OS for less motion? Live: the preference can
    change mid-session from the settings pane, and the subscription follows it. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, onServer);
}

/** Below the tab breakpoint, where the playground stays off and the clips fall
    back to a static grid. A free canvas on a 375px screen is a pile of clips
    with nowhere to drag them. */
export function useNarrow(): boolean {
  return useSyncExternalStore(narrow.subscribe, narrow.get, onServer);
}

/* ============================================================================
   Has the browser taken over yet?

   The playground has to be OFF in the prerendered HTML on every device, then
   allowed to turn itself on once the real viewport and the real motion
   preference are known. Both media hooks answer false on the server, and false
   for narrow plus false for reduced would mean "wide desktop, motion fine" —
   i.e. the server would render the canvas on, and a phone would paint a
   scattered pile for one frame before correcting itself.

   So the playground is gated on this as well, and it is the same store trick:
   getServerSnapshot says false, getSnapshot says true, and subscribe never
   fires because the answer only changes once and React re-reads it on the
   pass that hydration schedules anyway.
   ========================================================================== */
const noSubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

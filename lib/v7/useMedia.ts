"use client";

import { useSyncExternalStore } from "react";

/* ============================================================================
   The media queries this page has to read in JavaScript rather than in CSS.

   WHY THIS EXISTS WHEN globals.css ALREADY HAS A REDUCED-MOTION BLOCK. That
   block neutralises animations and transitions. It cannot do the two things
   this page actually has to get right:

     1. IT CANNOT TOUCH A PLAYING <video>. A clip is not an animation, so a
        page whose hero IS a full-viewport autoplaying ad honours the
        preference in name only unless something reads it in JS. The brief asks
        for video that does not autoplay under the preference, and this is the
        only way to deliver that.
     2. IT CANNOT DECIDE WHETHER THE STICKERS ARE ABSOLUTELY POSITIONED. That
        is a layout branch, not a transition.

   THE COMPONENTS USING THIS DO NOT PAUSE THE CLIPS, THEY NEVER MOUNT THEM. A
   tile under reduced motion renders its poster frame and nothing else. That is
   stronger than pausing — no decoder, no bytes, and no chance of an autoplay
   policy starting one behind our back — and it is why every tile keeps its
   aspect box on the WRAPPER rather than on the video, so the layout is
   identical either way and nothing shifts.

   WHY A COPY RATHER THAN AN IMPORT FROM lib/v6/useMedia.ts. Everything this
   page borrows from another route is a FACT — the clip tagging, the process
   copy, where the studio is. This is behaviour, and behaviour a sibling route
   is free to change: /v6's `useNarrow` exists to decide whether its card
   cluster fans, at a breakpoint chosen for that cluster. Reaching into it
   would mean a tuning change made for /v6's hero silently moving where /v7's
   stickers stop overlapping the headline.

   WHY useSyncExternalStore AND NOT useState PLUS useEffect. A media query IS
   an external store and this is the hook built to read one. By hand it means a
   setState in an effect body on every mount, which is a cascading render React
   now warns about, and it means owning the server/client split yourself. Here
   the split is declared: getServerSnapshot returns false, so the server and
   the hydrating client agree and nothing tears, and React re-reads the live
   value the moment hydration is done.

   FALSE IS THE RIGHT SERVER ANSWER. It costs nothing to be briefly wrong in
   this direction: every clip below the fold ships preload="none" and
   useInViewPlay holds a tile for 220ms before it may start, so the real value
   has arrived and removed them well before a byte was going to be fetched. The
   hero is the one clip that would start immediately, which is why Hero.tsx
   gates its <video> on this rather than merely pausing it.
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
    /* A boolean, so React's Object.is comparison settles immediately and a
       snapshot that has not changed never schedules a render. */
    get: () => list().matches,
  };
}

const reducedMotion = mediaStore("(prefers-reduced-motion: reduce)");

/* Matches the `tab` breakpoint in globals.css from the other side, so the one
   place that branches in JS branches at the same width the rest of the page
   branches in CSS. */
const narrow = mediaStore("(max-width: 760px)");

const onServer = () => false;

/** Has this visitor asked the OS for less motion? Live: the preference can
    change mid-session from the settings pane, and the subscription follows. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, onServer);
}

/** Below the tab breakpoint, where the hero stickers stop overlapping the
    headline and fall back to a wrapped row underneath it. See Hero.tsx. */
export function useNarrow(): boolean {
  return useSyncExternalStore(narrow.subscribe, narrow.get, onServer);
}

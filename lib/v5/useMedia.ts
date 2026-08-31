"use client";

import { useSyncExternalStore } from "react";

/* ============================================================================
   The media query this page has to read in JavaScript rather than in CSS.

   WHY REDUCED MOTION NEEDS A HOOK WHEN globals.css ALREADY HAS A BLOCK FOR IT.
   That block neutralises animations and transitions, which covers the logo
   marquee. It cannot touch a playing <video>: a clip is not an animation, so a
   page whose hero IS a full-viewport autoplaying video honours the preference
   in name only unless something reads it in JS. This page is emphatically that
   page, so it reads it.

   THE COMPONENTS USING THIS DO NOT PAUSE THE CLIPS, THEY NEVER MOUNT THEM. A
   tile under reduced motion renders its poster frame and nothing else. That is
   stronger than pausing — no decoder, no bytes, and no chance of an autoplay
   policy starting one behind our back — and it is why every tile keeps its
   aspect box on the WRAPPER rather than on the video, so the layout is
   identical either way and nothing shifts.

   WHY useSyncExternalStore AND NOT useState PLUS useEffect. A media query IS
   an external store, and this is the hook built to read one. Doing it by hand
   means a setState in an effect body on every mount, which is a cascading
   render React now warns about, and it means owning the server/client split by
   hand. Here the split is declared: getServerSnapshot returns false, so the
   server and the hydrating client agree and nothing tears, and React re-reads
   the live value the moment hydration is done.

   FALSE IS THE RIGHT SERVER ANSWER. It costs nothing to be briefly wrong in
   this direction: every clip below the fold ships preload="none" and
   useInViewPlay holds a tile for 220ms before it may start, so the real value
   has arrived and removed them well before a single byte was going to be
   fetched. The hero is the one clip that would start immediately, which is why
   Hero.tsx gates its <video> on this rather than merely pausing it.
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

const onServer = () => false;

/** Has this visitor asked the OS for less motion? Live: the preference can
    change mid-session from the settings pane, and the subscription follows it. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, onServer);
}

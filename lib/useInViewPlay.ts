"use client";

import { useEffect, useRef } from "react";

/* Play a clip only while it is actually on screen.

   The bottleneck on both walls is concurrent video DECODING, not bytes. Every
   tile ships `preload="none"` and a poster still, so a cold load paints the
   whole wall from a few KB and downloads nothing else; this then starts a clip
   when it arrives and pauses it when it leaves. Without it, six lanes of
   autoplaying video would keep every decoder alive for the life of the page,
   including for the work wall sitting a thousand pixels below the fold.

   No `autoPlay` attribute anywhere, deliberately — play() is called from here,
   so the browser never starts a clip this has not chosen. */
export function useInViewPlay() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejects under some autoplay policies. The poster stays up in that
          // case, which is the correct fallback.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Reel } from "@/lib/reels.generated";

/* One reel, large, everything behind it blurred. Both walls open this.

   The entrance is a state flip rather than a keyframe: mount at rest, then one
   frame later switch the classes on, and the transition does the rest. That
   keeps two more @keyframes out of globals.css for an animation that plays for
   under a second. */
export function Lightbox({ reel, onClose }: { reel: Reel; onClose: () => void }) {
  const [shown, setShown] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // The page behind must not scroll while this owns the screen.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reel preview"
      onClick={onClose}
      /* z-210: above the nav (120) and the skip link (200). */
      className={`fixed inset-0 z-[210] grid place-items-center p-[clamp(16px,4vw,48px)] bg-[color-mix(in_srgb,var(--color-noir)_52%,transparent)] backdrop-blur-[24px] backdrop-saturate-[115%] transition-opacity duration-300 ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        ref={closeBtn}
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-[clamp(12px,2.5vw,32px)] right-[clamp(12px,2.5vw,32px)] grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl leading-none text-white transition-[background-color,border-color] duration-150 hover:border-white/45 hover:bg-white/20 active:bg-white/30"
      >
        <span aria-hidden="true">×</span>
      </button>

      {/* Portrait, height-led so it fills the screen without ever overflowing
          it. Click stops here so only the backdrop closes. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative h-[min(84svh,900px)] aspect-[9/16] max-w-[min(92vw,520px)] overflow-hidden rounded-3xl bg-black shadow-[var(--shadow-pink)] transition-[opacity,transform] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-3.5 scale-[0.92] opacity-0"
        }`}
      >
        {/* The HQ tier: larger cut, fetched only now that someone has asked to
            look closely. Falls back to the tile cut when the Drive sync ran
            without ffmpeg. */}
        <video
          src={reel.hq ?? reel.src}
          poster={reel.poster ?? undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="size-full object-cover"
        />
      </div>
    </div>,
    document.body
  );
}

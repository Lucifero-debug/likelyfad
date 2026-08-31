"use client";

import { useEffect, useRef, useState } from "react";
import { contactUrl } from "@/lib/site";
import { HERO_REEL, WIDGET } from "@/lib/v6/data";
import { MONO, SERIF_400, T_12, T_14 } from "@/lib/v6/theme";

/* ============================================================================
   THE FLOATING WIDGET — small, bottom-right, persistent, dismissible.

   THE REFERENCE PUTS A DISCOUNT CODE IN THIS SLOT ("V2 Launch 30% OFF", code
   30OFF). We have no discount, no code and no launch, and inventing one would
   be the cheapest-looking thing on the page — a fake urgency device on a site
   whose entire argument is that its output is not fake. The slot is still
   worth keeping, because a small persistent card in the corner is genuinely
   useful on a long page. What goes in it is our strongest single line, which
   is the clock.

   IT DOES NOT APPEAR UNTIL THE HERO HAS GONE. Two reasons, and the second is
   the one that matters. First, a promo card that slides in over an untouched
   hero is the pattern everyone has learned to dismiss without reading. Second
   and decisive: the hero's own CTA sits centred near the bottom of the
   viewport on a phone, which is exactly where a fixed bottom-right card lands.
   The brief requires this never to overlap the primary CTA on mobile, and
   gating it on the hero being off screen is a stronger guarantee than any
   z-index or offset — while the CTA is visible, the widget does not exist.

   AN INTERSECTION OBSERVER, NOT A SCROLL HANDLER, for the same reason as the
   nav: this fires twice in the life of the page rather than on every frame of
   every gesture.

   DISMISSAL IS PERMANENT FOR THE SESSION AND IS NEVER UNDONE BY SCROLLING.
   `dismissed` is checked before `visible`, so scrolling back to the hero and
   down again does not resurrect it. Someone who closed it said no once and
   should not have to say it again.

   IT IS A REAL DIALOG-FREE REGION, NOT A MODAL. No focus trap, no aria-modal,
   no inerting of the page behind it: it interrupts nothing, so trapping focus
   in it would be a bug rather than a feature. It is an <aside> with a label,
   the link is a link, and the close is a <button> with a real accessible name
   — which is what makes it keyboard reachable in the normal tab order, as
   required, rather than something only a pointer can reach or dismiss.

   THE POSTER, NOT A VIDEO. The card is 56px of thumbnail. Mounting an eleventh
   decoder, permanently, for something this size would be a real cost for no
   gain, and it is why this component never touches useInViewPlay.
   ========================================================================== */
export function FloatingWidget({ heroId }: { heroId: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  if (dismissed || !visible) return null;

  return (
    <aside
      aria-label="Turnaround"
      /* Sits above the page but below the nav, which is z-50: a fixed card that
         can cover the navigation is a card that can trap someone on a section.
         The inset is 16 on a phone and 24 from tab up, both on the scale. */
      className="fixed right-[16px] bottom-[16px] z-40 w-[min(320px,calc(100vw-32px))] rounded-[16px] border border-edge bg-slab p-[16px] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)] tab:right-[24px] tab:bottom-[24px]"
    >
      <div className="flex items-start gap-[16px]">
        {HERO_REEL.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_REEL.poster}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="size-[56px] shrink-0 rounded-[8px] object-cover"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <p className={`${SERIF_400} text-[1rem] leading-[1.3] text-beam`}>{WIDGET.title}</p>
          <p className={`${T_14} mt-[4px] text-haze`}>{WIDGET.body}</p>

          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MONO} ${T_12} mt-[12px] inline-block text-beam underline underline-offset-4 decoration-edge transition-colors duration-200 hover:decoration-beam`}
          >
            {WIDGET.cta}
          </a>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={() => setDismissed(true)}
          /* A named button, not a bare glyph. "Close" alone would be read out
             of context by a screen reader listing controls; this says what it
             closes. */
          aria-label="Dismiss the turnaround note"
          className={`${MONO} ${T_12} -mt-[4px] -mr-[4px] shrink-0 rounded-[8px] p-[8px] text-haze transition-colors duration-200 hover:text-beam`}
        >
          <span aria-hidden="true">&#215;</span>
        </button>
      </div>
    </aside>
  );
}

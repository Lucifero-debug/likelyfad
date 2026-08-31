"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { MONO, T_12, WRAP } from "@/lib/v2/theme";
import { CtaButton } from "./CtaButton";

/* ============================================================================
   The bar. Fixed, because the one action this page wants is worth keeping
   within reach through nine sections of scrolling.

   IT HAS NO BACKGROUND OVER THE HERO. The hero is a full-bleed wall and a
   solid bar laid across the top of it would put a lid on the one thing the
   page is built to show. Over the wall the bar is transparent and its type
   rides the scrim; past the wall it takes the stage colour and a hairline,
   because from there down the page is light type on near-black and a
   transparent bar would let section content slide under it unreadably.

   The listener is passive and flips one boolean at a single threshold, so it
   does no work per frame and the class change is a paint, not a layout.

   NO HAMBURGER BELOW 761px. The four links are anchors into a page you are
   already scrolling, and a drawer to reach them is a menu that exists to hold
   a menu. The wordmark and the button stay, which are the two things that
   actually have to be there.
   ========================================================================== */
export function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    /* Just under one viewport: the bar changes state as the wall leaves, not
       at some arbitrary scroll distance into it. */
    const onScroll = () => setLifted(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        lifted ? "border-rule bg-stage/92 backdrop-blur-[6px]" : "border-transparent bg-transparent"
      }`}
    >
      <div className={`${WRAP} flex h-[64px] items-center justify-between gap-[24px]`}>
        <a href="#top" className="flex items-center" aria-label={`${content.brand}, back to top`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
              mark at its native pixels; the optimiser has nothing to do. */}
          <img
            src="/ls-icon.png"
            alt={content.brand}
            className="h-[26px] w-[85px] object-contain"
          />
        </a>

        {/* Hidden below 761px, where the bar is down to the two things that
            have to be on it. Hidden and not a drawer — see the note above. */}
        <nav aria-label="Sections" className="hidden tab:block">
          <ul className={`${MONO} ${T_12} flex items-center gap-[32px]`}>
            {content.nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-dim transition-colors duration-200 hover:text-lit"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <CtaButton size="sm" />
      </div>
    </header>
  );
}

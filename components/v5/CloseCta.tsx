"use client";

import { content } from "@/lib/content";
import { PARENT_COMPANY, X_HANDLE, contactUrl } from "@/lib/site";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { CLOSE_FOCUS, CLOSE_REEL, HERO, YEAR } from "@/lib/v5/data";
import { DISPLAY, MONO, SECTION, T_12, T_15, T_56, WRAP } from "@/lib/v5/theme";
import { useReducedMotion } from "@/lib/v5/useMedia";

/* ============================================================================
   THE CLOSING BAND — full bleed again, echoing the hero, and the footer with
   it.

   ECHOING IS NOT REPEATING. The hero and this band are the page's only two
   dark sections and they bracket everything between them, which is what stops
   a page this image-heavy reading as a slideshow. But the composition is
   inverted: the hero pins everything to its corners and leaves the middle to
   the work, this one puts the headline in the middle and the details under it.
   Same material, opposite arrangement, so the page ends somewhere rather than
   looping.

   A DIFFERENT CLIP FROM THE HERO, picked by id in lib/v5/data.ts and filtered
   so it can never be the hero reel even if that id stops existing. Replaying
   the opening clip here would make a nine-hundred-pixel page feel like it had
   two slides.

   THE SAME 60% SCRIM AS THE HERO, for the same reason and with the same
   arithmetic: the contrast floor has to hold on every frame the clip can show,
   not on the ones that happened to be up when it was checked.

   THE HEADLINE DROPS ITS ASTERISKS. lib/content.ts marks a phrase with *…* for
   the homepage to run as a gradient. There is no gradient in type on this page
   outside the hero wordmark, so the markers are stripped and the line is set
   plain.

   NO EMAIL ADDRESS IS RENDERED, and that is deliberate rather than an
   oversight. lib/site.ts is explicit that the X profile is the only real
   outbound link on this site. The reference fills this corner with an address;
   ours would have to invent one, and a fake mailto on a live page is a worse
   defect than a missing row.
   ========================================================================== */
export function CloseCta() {
  const reduced = useReducedMotion();
  const video = useInViewPlay("v5-close");

  return (
    <footer
      id="contact"
      data-dark
      aria-labelledby="v5-close-title"
      className="relative isolate overflow-hidden bg-press scroll-mt-[96px]"
    >
      {reduced ? (
        CLOSE_REEL.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={CLOSE_REEL.poster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 -z-10 size-full object-cover ${CLOSE_FOCUS}`}
          />
        ) : null
      ) : (
        <video
          ref={video}
          src={CLOSE_REEL.src}
          poster={CLOSE_REEL.poster ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          className={`absolute inset-0 -z-10 size-full object-cover ${CLOSE_FOCUS}`}
        />
      )}

      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-press/60" />

      <div className={`${WRAP} ${SECTION}`}>
        <div className="py-[64px]">
          <h2 id="v5-close-title" className={`${DISPLAY} ${T_56} max-w-[20ch] text-white`}>
            {content.close.heading.replace(/\*/g, "")}
          </h2>

          <p className={`${T_15} mt-[24px] max-w-[46ch] text-white/80`}>{content.close.sub}</p>

          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MONO} ${T_12} mt-[48px] inline-block bg-cue px-[24px] py-[16px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
          >
            {content.close.cta}
          </a>
        </div>

        {/* The colophon. Same three-part shape as the section header rows, so
            the document closes in the language it was written in. */}
        <div
          className={`${MONO} ${T_12} flex flex-col gap-[24px] border-t border-crease-lit pt-[24px] text-white/70 tab:flex-row tab:items-start tab:justify-between`}
        >
          <div className="flex flex-col gap-[8px]">
            <p className="text-white">{content.brand}</p>
            <p>{HERO.services}</p>
          </div>

          <div className="flex flex-col gap-[8px] tab:text-right">
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-opacity duration-200 hover:opacity-70"
            >
              X / @{X_HANDLE}
            </a>
            <p>
              &copy; {YEAR} {content.brand} &middot; {PARENT_COMPANY}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { content } from "@/lib/content";
import { PARENT_COMPANY, X_HANDLE, contactUrl } from "@/lib/site";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { CLOSE_FOCUS, CLOSE_REEL, bleedSrc } from "@/lib/v6/data";
import { MONO, SERIF, T_12, T_17, T_64, WRAP } from "@/lib/v6/theme";
import { useReducedMotion } from "@/lib/v6/useMedia";

/* ============================================================================
   THE CLOSING BAND — full bleed again, echoing the hero, with the footer under
   it.

   ECHOING IS NOT REPEATING. These are the page's only two full-bleed video
   bands and they bracket everything between them, which is what stops a page
   carrying this much video from reading as a slideshow. The composition is the
   same shape as the hero on purpose — centred serif, one CTA — because the
   last thing a visitor sees should be the first thing they saw, resolved.

   A DIFFERENT CLIP FROM THE HERO, picked by id in lib/v6/data.ts and filtered
   so it can never be the hero reel even if that id stops existing. Replaying
   the opening clip here would make the page feel like it had two slides.

   THE SAME SCRIM AS THE HERO, for the same reason and with the same
   arithmetic: the contrast floor has to hold on every frame the clip can show,
   not on the ones that happened to be up when it was checked.

   THE HEADLINE DROPS ITS ASTERISKS. lib/content.ts marks a phrase with *…* for
   the homepage to run as a gradient. This page has no gradient in type at all
   — killing it is one of the brief's explicit instructions — so the markers
   are stripped and the line is set plain in the serif.

   NO EMAIL ADDRESS IS RENDERED, and that is deliberate rather than an
   oversight. lib/site.ts is explicit that the X profile is the only real
   outbound link on this site. Inventing a mailto to fill the footer corner
   would be a worse defect than a missing row.
   ========================================================================== */
export function CloseCta() {
  const reduced = useReducedMotion();
  const video = useInViewPlay("v6-close");

  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-night scroll-mt-[96px]">
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
          src={bleedSrc(CLOSE_REEL)}
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

      <div aria-hidden="true" className="v6-scrim absolute inset-0 -z-10" />

      <div className={WRAP}>
        <div className="py-[96px] text-center">
          <h2 className={`${SERIF} ${T_64} mx-auto max-w-[18ch] text-balance text-beam`}>
            {content.close.heading.replace(/\*/g, "")}
          </h2>

          <p className={`${T_17} mx-auto mt-[32px] max-w-[46ch] text-balance text-haze`}>
            {content.close.sub}
          </p>

          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MONO} ${T_12} mt-[48px] inline-block rounded-[999px] bg-cue px-[32px] py-[16px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
          >
            {content.close.cta}
          </a>
        </div>

        <div
          className={`${MONO} ${T_12} flex flex-col gap-[24px] border-t border-edge py-[32px] text-haze tab:flex-row tab:items-center tab:justify-between`}
        >
          <p className="text-beam">{content.brand}</p>

          <div className="flex flex-col gap-[8px] tab:flex-row tab:items-center tab:gap-[24px]">
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-beam transition-opacity duration-200 hover:opacity-70"
            >
              X / @{X_HANDLE}
            </a>
            <p>
              &copy; 2026 {content.brand} &middot; {PARENT_COMPANY}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { useInViewPlay } from "@/lib/useInViewPlay";
import {
  FOUNDER,
  HERO,
  HERO_FOCUS,
  HERO_REEL,
  HERO_SECTION_ID,
  YEAR,
  heroSrc,
} from "@/lib/v5/data";
import { DISPLAY, MONO, T_12, T_15, T_120 } from "@/lib/v5/theme";
import { useReducedMotion } from "@/lib/v5/useMedia";

/* ============================================================================
   THE HERO — one ad, full bleed, with LIKELYFAD set enormous across the lower
   portion and everything else pushed to the corners.

   THE WORDMARK IS THE PAGE'S ONE MEMORABLE OBJECT. It is filled with a white
   gradient clipped to the letterforms, so the ad playing behind it reads
   THROUGH the word. That is the one gradient allowed anywhere on this site,
   and it is allowed because it is a mask rather than decoration: on a page
   whose entire argument is that you cannot tell the work is AI, you read the
   brand name through the work. The rule and the contrast maths live with
   .v5-wordmark in globals.css.

   THE CONTRAST FLOOR IS AN OVERLAY, NOT LUCK. A full-bleed video shows a
   different frame every 33ms and some of them are blown-out white. #0C0C0C at
   60% puts the brightest frame the clip can ever produce at roughly #6D6D6D,
   which holds white type at about 5.7:1 and the wordmark's palest stop at
   about 3.6:1, on EVERY frame rather than on the ones we happened to look at.
   That is also why the scrim is a flat wash and not a bottom-up gradient: a
   gradient would leave the founder card in the top corner unprotected.

   NOTHING IS CENTRED OVER THE MIDDLE. The clips are 9:16 and this band is
   landscape, so object-cover crops hard and shows about a third of the frame's
   height. HERO_FOCUS pulls that visible band upward to hold the subject's face
   — see lib/v5/data.ts for why the face specifically is the part that has to
   survive the crop. Every piece of furniture here is then pinned to a corner,
   which is the reference's composition anyway and is also the only place text
   can go without sitting on somebody's face.

   REDUCED MOTION GETS THE POSTER AND NO VIDEO ELEMENT AT ALL. Not a paused
   video — no decoder, no bytes, and no autoplay policy that can start one
   behind our back. The hero is the one clip on the page a visitor cannot
   scroll away from, so honouring the preference here is not a detail.
   ========================================================================== */
export function Hero() {
  const reduced = useReducedMotion();
  /* Its own lane, so the hero never competes for a playback slot with the work
     grid below it. This also buys offscreen pausing for free: scrolled past,
     the hero stops decoding like every other clip on the page. */
  const video = useInViewPlay("v5-hero");

  return (
    <section
      id={HERO_SECTION_ID}
      data-dark
      aria-labelledby="v5-hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-press"
    >
      {/* ---- The bed ---- */}
      {reduced ? (
        HERO_REEL.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_REEL.poster}
            alt=""
            /* Decorative: the section is titled by the wordmark below and the
               clip is described by the utility line in the corner. */
            aria-hidden="true"
            className={`absolute inset-0 -z-10 size-full object-cover ${HERO_FOCUS}`}
          />
        ) : null
      ) : (
        <video
          ref={video}
          src={heroSrc(HERO_REEL)}
          poster={HERO_REEL.poster ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          className={`absolute inset-0 -z-10 size-full object-cover ${HERO_FOCUS}`}
        />
      )}

      {/* The guaranteed floor. See the note above for the arithmetic. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-press/60" />

      {/* ---- The furniture ----
          Top padding clears the nav at both of its heights: two rows on a
          phone, one from tab up. */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-[clamp(24px,5vw,64px)] pt-[128px] pb-[32px] tab:pt-[96px] tab:pb-[48px]">
        {/* TOP RIGHT — the founder card. It puts a human face on the studio
            before the visitor has scrolled at all, which on a page selling AI
            output is the single most useful thing the hero can do. */}
        <div className="flex justify-end">
          <FounderCard />
        </div>

        {/* LEFT — the pitch and the one link out of the hero. Sits in the
            slack between the card and the wordmark, so it moves with the
            viewport rather than being pinned to a number. */}
        <div className="flex flex-1 items-center py-[48px]">
          <div className="max-w-[36ch]">
            <p className={`${T_15} text-white`}>{HERO.pitch}</p>
            <a
              href={HERO.link.href}
              className={`${MONO} ${T_12} mt-[24px] inline-block text-white underline underline-offset-[6px] decoration-white/40 transition-colors duration-200 hover:decoration-white`}
            >
              {HERO.link.label}
            </a>
          </div>
        </div>

        {/* LOWER — the wordmark, then the bottom corners under it. */}
        <div>
          {/* THE ONE h1 ON THE PAGE. It is the brand name, which is the honest
              thing for it to be: this hero makes no headline claim, it shows
              one ad and says who made it. The tagline is appended for the
              document outline and for a screen reader, and hidden visually so
              the composition stays the single word the design is built on. */}
          <h1 id="v5-hero-title" className={`${DISPLAY} ${T_120} v5-wordmark`}>
            {content.brand.toUpperCase()}
            <span className="sr-only"> — {content.reels.caption}</span>
          </h1>

          <div
            className={`${MONO} ${T_12} mt-[32px] flex flex-col gap-[24px] border-t border-crease-lit pt-[16px] text-white/70 tab:flex-row tab:items-end tab:justify-between`}
          >
            {/* BOTTOM LEFT — the services list, then the colophon under it. */}
            <div className="flex flex-col gap-[8px]">
              <p className="text-white">{HERO.services}</p>
              <p>
                &copy; {YEAR} &middot; {HERO.utility}
              </p>
            </div>

            {/* BOTTOM RIGHT — the tick gauge. Purely a measuring mark, which
                is why it is aria-hidden and carries no number: it is the
                printer's rule in the margin of the document, and inventing a
                scale for it would make it claim something. */}
            <Gauge />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   THE FOUNDER CARD.

   TODO — NO PORTRAIT EXISTS IN THIS REPO. The tile renders a monogram until
   one is dropped in and FOUNDER.portrait in lib/v5/data.ts is pointed at it.
   The reasoning for not filling it with a stock or generated face, which on
   this page of all pages would be self-defeating, is written out in that file.

   IT IS A LINK, not a decorative card. The reference's version goes to its
   contact page and so does ours: a visitor who has just been told a human
   checks every frame should be one click from that human.
   --------------------------------------------------------------------------- */
function FounderCard() {
  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-[12px] rounded-[12px] border border-crease-lit bg-press/40 p-[12px] backdrop-blur-sm transition-colors duration-200 hover:bg-press/60"
    >
      <span className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white/12">
        {FOUNDER.portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={FOUNDER.portrait}
            alt={`${FOUNDER.name}, ${FOUNDER.role}`}
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden="true" className={`${DISPLAY} text-[1.25rem] text-white`}>
            {FOUNDER.monogram}
          </span>
        )}
      </span>

      <span className={`${MONO} ${T_12} flex flex-col gap-[4px]`}>
        <span className="text-white/70">Meet the founder</span>
        <span className="text-white">
          {FOUNDER.name} &middot; {FOUNDER.role}
        </span>
      </span>
    </a>
  );
}

/* Sixteen ticks, every fourth one long. Two divs and a modulo rather than an
   SVG or an image: it is a texture, and the cheapest honest way to draw it is
   the one that adds no request and no library. */
function Gauge() {
  return (
    <div aria-hidden="true" className="flex items-end gap-[4px]">
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className={`w-px bg-white/50 ${i % 4 === 0 ? "h-[16px]" : "h-[8px]"}`}
        />
      ))}
    </div>
  );
}

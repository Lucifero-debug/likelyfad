"use client";

import { CTA, content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { HERO_FOCUS, HERO_REEL, bleedSrc } from "@/lib/v6/data";
import { MONO, SERIF, T_12, T_17, T_64 } from "@/lib/v6/theme";
import { useReducedMotion } from "@/lib/v6/useMedia";

/* ============================================================================
   THE HERO — one ad full bleed, a serif headline centred over it, revealing a
   word at a time.

   THE SERIF IS THE WHOLE IDENTITY OF THIS PAGE. A grotesque here would make it
   the same dark AI-product hero every competitor opens with; the serif makes
   it read as film. See SERIF in lib/v6/theme.ts for why Cormorant rather than
   the more obvious Instrument.

   THE CONTRAST FLOOR IS AN OVERLAY, NOT LUCK, and it is two layers rather than
   one because this headline is CENTRED. A flat wash darkens the corners as
   much as the middle, leaving the busiest part of the frame directly under the
   type; .v6-scrim in globals.css adds a centre-weighted radial on top of the
   flat 66%, which is where the text is and where a 9:16 clip cropped to
   landscape keeps its subject. The arithmetic is written out there.

   THE REVEAL IS SKIPPED, NOT SPED UP, UNDER REDUCED MOTION. The global CSS
   block zeroes animation DURATION but not DELAY, so leaning on it would leave
   each word parked in its blurred start state for the length of its own delay
   and the preference would make the headline strictly worse. Under the
   preference this renders one plain span with no animation class at all.

   ONE REVEAL, ON ONE ELEMENT, ONCE. The sub, the CTA and the microcopy do not
   animate. A reveal that happens to everything is not a reveal.
   ========================================================================== */
export function Hero({ id }: { id: string }) {
  const reduced = useReducedMotion();
  /* Its own lane, so the hero never competes for a playback slot with the
     bento cards or the work grid. This also buys offscreen pausing for free:
     scrolled past, the hero stops decoding like every other clip. */
  const video = useInViewPlay("v6-hero");

  const headline = content.hero.headline.replace(/\*/g, "");

  return (
    <section
      id={id}
      aria-labelledby="v6-hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-night"
    >
      {/* ---- The bed ---- */}
      {reduced ? (
        HERO_REEL.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO_REEL.poster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 -z-10 size-full object-cover ${HERO_FOCUS}`}
          />
        ) : null
      ) : (
        <video
          ref={video}
          src={bleedSrc(HERO_REEL)}
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

      {/* The guaranteed floor. See globals.css for the arithmetic. */}
      <div aria-hidden="true" className="v6-scrim absolute inset-0 -z-10" />

      {/* The seam into the flat page below, so a video band never meets the
          ground on a hard horizontal line. */}
      <div
        aria-hidden="true"
        className="v6-foot-fade pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[160px]"
      />

      {/* Top padding clears the nav at both its heights: two rows on a phone,
          one from tab up. */}
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,5vw,64px)] pt-[128px] pb-[96px] text-center tab:pt-[96px]">
        <h1
          id="v6-hero-title"
          className={`${SERIF} ${T_64} mx-auto max-w-[18ch] text-balance text-beam`}
        >
          {reduced ? (
            headline
          ) : (
            /* Split on spaces, one span per word. The space is rendered
               OUTSIDE the animated span and as a real character, so the line
               still breaks and still reads as words to a copy-paste and to a
               screen reader — an inline-block per word with the spaces eaten
               would run the headline together as one string. */
            headline.split(" ").map((word, i) => (
              <span key={`${word}-${i}`}>
                <span
                  className="v6-word"
                  /* Data, not style: this word's place in the line. 90ms is
                     slow enough to read as one-at-a-time and fast enough that
                     a nine-word headline is fully resolved inside a second. */
                  style={{ "--v6-delay": `${i * 90}ms` } as React.CSSProperties}
                >
                  {word}
                </span>
                {i < headline.split(" ").length - 1 ? " " : null}
              </span>
            ))
          )}
        </h1>

        <p className={`${T_17} mx-auto mt-[32px] max-w-[58ch] text-balance text-haze`}>
          {content.hero.subline}
        </p>

        <div className="mt-[48px] flex flex-col items-center gap-[24px]">
          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MONO} ${T_12} rounded-[999px] bg-cue px-[32px] py-[16px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
          >
            {CTA}
          </a>

          <p className={`${MONO} ${T_12} text-haze`}>{content.hero.reassurance}</p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { content } from "@/lib/content";
import {
  CASE_LABEL,
  CASE_STACK,
  HERO_FOCUS,
  HERO_REEL,
  STATUS,
  STICKERS,
  bleedSrc,
} from "@/lib/v7/data";
import { DISPLAY, DISPLAY_600, MONO, T_12, T_80, WRAP } from "@/lib/v7/theme";
import { useReducedMotion } from "@/lib/v7/useMedia";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { FoldedCorner } from "./Marks";
import { Sticker } from "./Sticker";

/* ============================================================================
   THE HERO — one of our ads full bleed, an enormous condensed headline over
   it, and four format stickers taped across the type.

   THE STICKERS ARE THE ONE LOUD THING ON THIS PAGE. Everything below is
   deliberately quiet, because a studio pitching for ad budget cannot spend its
   credibility on decoration, and because a page where everything is a
   flourish has no flourish. This is where the reference's signature earns its
   place: the four words a brand marketer is scanning for, delivered as pinned
   tags in the same glance as the headline instead of as a bullet list under
   the fold.

   THE HEADLINE IS SENTENCE CASE IN THE MARKUP AND UPPERCASE IN CSS. It comes
   straight out of lib/content.ts, so there is one copy of this line in the
   repo rather than an uppercase duplicate that drifts from it, and a screen
   reader gets "Ads so real" rather than a string some engines spell out letter
   by letter. text-transform is doing the shouting.

   THE CONTRAST FLOOR IS AN OVERLAY, NOT LUCK, and it is two layers rather than
   one because this headline is CENTRED. A flat wash darkens the corners as
   much as the middle, leaving the busiest part of the frame directly under the
   type; .v7-scrim in globals.css adds a centre-weighted radial over a flat
   62%, which is where the text is and where a 9:16 clip cropped to landscape
   keeps its subject. The arithmetic is written out there: white lands at
   5.17:1 against the brightest frame the clip can physically show, so the
   floor holds on every frame rather than on the ones we happened to look at.

   THREE PIECES OF CORNER FURNITURE, AND EACH ONE DROPS AT THE WIDTH WHERE IT
   RUNS OUT OF ROOM RATHER THAN BEING SHRUNK INTO ILLEGIBILITY.
     - The status pill sits top-left from tab up and moves into the flow above
       the headline below it, where a floating card would sit under the nav.
     - The microcopy sits bottom-left from tab up and under the stickers below
       it.
     - The case stack only appears from lap up. At tab it would either cross
       the headline box or be cropped to a sliver, and it is the one piece of
       the three that costs nothing to lose: it is aria-hidden decoration and
       every clip in it reappears, tagged and filterable, in the work grid.
   ========================================================================== */
export function Hero({ id }: { id: string }) {
  const reduced = useReducedMotion();
  /* Its own lane, so the hero never competes for a playback slot with the work
     grid. This also buys offscreen pausing for free: scrolled past, the hero
     stops decoding like every other clip on the page. */
  const video = useInViewPlay("v7-hero");

  const headline = content.hero.headline.replace(/\*/g, "");

  return (
    <section
      id={id}
      aria-labelledby="v7-hero-title"
      data-dark
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-mark"
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
      <div aria-hidden="true" className="v7-scrim absolute inset-0 -z-10" />

      {/* The seam into the board below, so a video band never meets the cream
          on a hard horizontal line. */}
      <div
        aria-hidden="true"
        className="v7-foot-fade pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[160px]"
      />

      {/* Top padding clears the fixed bar at both its heights. */}
      <div className={`${WRAP} py-[128px] tab:py-[96px]`}>
        <div className="tab:hidden">
          <StatusPill />
        </div>

        {/* The headline box. relative, because the sticker cluster is
            positioned against THIS rather than against the section: anchored
            to the section the four would drift away from the type as the
            headline reflowed from three lines to two. */}
        <div className="relative mx-auto mt-[48px] max-w-[14ch] tab:mt-0">
          <h1 id="v7-hero-title" className={`${DISPLAY} ${T_80} text-center text-white`}>
            {headline}
          </h1>

          {/* Below tab this is a wrapped row in normal flow, 24 apart because
              the stickers are padded 16 and the gap has to clear it. From tab
              up it becomes an overlay and the four take the positions in
              STICKERS. -inset-x-24 lets them hang past the headline measure
              without reaching the page gutter, which is 38 at this breakpoint
              and 48 above it.

              pointer-events-none from tab up so the headline underneath stays
              selectable. The stickers are not interactive at any width. */}
          <div className="mt-[32px] flex flex-wrap justify-center gap-[24px] tab:pointer-events-none tab:absolute tab:inset-y-0 tab:-inset-x-[24px] tab:mt-0 tab:block">
            {STICKERS.map((s) => (
              <Sticker key={s.label} label={s.label} className={`${s.at} ${s.spin} tab:absolute`} />
            ))}
          </div>
        </div>

        <p className={`${MONO} ${T_12} mt-[48px] text-center text-white/85 tab:hidden`}>
          {content.hero.reassurance}
        </p>
      </div>

      {/* ---- Corner furniture, from tab up ---- */}
      <div className="absolute top-[96px] left-[clamp(24px,5vw,64px)] hidden tab:block">
        <StatusPill />
      </div>

      <p
        className={`${MONO} ${T_12} absolute bottom-[32px] left-[clamp(24px,5vw,64px)] hidden max-w-[34ch] text-white/85 tab:block`}
      >
        {content.hero.reassurance}
      </p>

      <CaseStack />
    </section>
  );
}

/* ---------------------------------------------------------------------------
   THE STUDIO STATUS PILL.

   THE REFERENCE'S VERSION SIGNALS A FREELANCER BETWEEN JOBS — a photograph, a
   name, a role, and "Available for work". Ours has to signal the opposite,
   because the doubt a brand actually has about a small studio is not whether
   it needs the money but whether anyone will pick up the brief. "Taking
   briefs" answers that in two words and in the language of the transaction.

   THE AVATAR IS THE STUDIO MARK, NOT A FACE, and that is not a shortcut. There
   is no founder photograph in this repo, and a stock portrait at the top of a
   page arguing that our output is indistinguishable from a real shoot would be
   the worst possible image to open with. The mark is the honest object, and at
   28px inside a white tile it reads as a logo rather than as the gradient
   headline treatment this page is otherwise built to avoid.

   THE DOT IS ONE OF THREE PLACES THE ACCENT APPEARS. It does not pulse. A
   pulsing dot is motion in service of nothing, and it would be the only thing
   on the page that moves outside the video.
   --------------------------------------------------------------------------- */
function StatusPill() {
  return (
    <div className="inline-flex items-center gap-[12px] rounded-[999px] border border-hair bg-card py-[8px] pr-[24px] pl-[8px] shadow-[0_1px_2px_rgba(20,19,16,0.06),0_10px_28px_-12px_rgba(20,19,16,0.4)]">
      <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[999px] bg-board">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
            mark at a fraction of its native pixels; the optimiser has nothing
            to do, and this is the one raster asset on the page. */}
        <img src="/ls-icon.png" alt="" aria-hidden="true" className="w-[28px] object-contain" />
      </span>

      <span className="flex flex-col gap-[4px]">
        <span className={`${MONO} ${T_12} flex items-center gap-[8px] text-mark`}>
          <span aria-hidden="true" className="size-[7px] rounded-[999px] bg-cue" />
          {STATUS.state}
        </span>
        <span className={`${MONO} ${T_12} text-note`}>{STATUS.who}</span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   THE CASE STACK — a deck of case cards sitting at the edge of the screen.

   IT SHOWS THE VERTICAL AND THE FORMAT, AND IT SHOWS NO CLIENT NAME AND NO
   YEAR. The reasoning is written out at CASE_STACK in lib/v7/data.ts; the
   short version is that every client identity in this repo is private by
   request and not one filename in the library carries a year, so both fields
   would have to be invented, on the one card whose entire job is to look like
   a real case study.

   IT IS TEXT, NOT THUMBNAILS. A 9:16 clip in a card this size is either 460px
   tall or cropped to a letterbox that shows nobody's face, and both are worse
   than the index card the reference is actually drawing. The work grid is
   where clips get looked at.

   aria-hidden AND pointer-events-none. It is a picture of a deck of cards: not
   a link, not focusable, and everything in it reappears in the grid below.
   --------------------------------------------------------------------------- */
function CaseStack() {
  const front = CASE_STACK[CASE_STACK.length - 1];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-[32px] -bottom-[40px] hidden h-[196px] w-[248px] lap:block"
    >
      {CASE_STACK.map((item, i) => {
        const isFront = i === CASE_STACK.length - 1;
        return (
          <div
            key={item.reel.id}
            /* Each card sits a little lower and a little further right than
               the one in front of it, so what shows of the two behind is an
               edge rather than a shape. */
            style={{ transform: `translate(${i * 10}px, ${i * 12}px) rotate(${2 - i * 1.6}deg)` }}
            className="absolute inset-0 rounded-[6px] border border-hair bg-card shadow-[0_1px_2px_rgba(20,19,16,0.05),0_14px_32px_-16px_rgba(20,19,16,0.45)]"
          >
            {isFront && (
              <div className="flex h-full flex-col p-[24px]">
                <span className={`${DISPLAY_600} text-[1.25rem] text-mark`}>{front.vertical}</span>

                <span className={`${MONO} ${T_12} mt-[12px] text-note`}>{front.format}</span>

                <span
                  className={`${MONO} ${T_12} mt-auto border-t border-hair pt-[16px] text-mark`}
                >
                  {CASE_LABEL}
                </span>

                <FoldedCorner className="size-[20px] rounded-br-[5px]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

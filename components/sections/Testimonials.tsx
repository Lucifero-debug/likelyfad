"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { reelVideos, type Reel } from "@/lib/reels.generated";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import {
  CARD_GAP,
  HEAD_GAP,
  SECTION,
  SIZE_16,
  SIZE_24,
  SIZE_64,
  TEXT_META,
  WRAP,
} from "@/lib/ui";

const { testimonials } = content;

/* TESTIMONIALS — the video card grid.

   Built to the shape of shadcn.io's `testimonials-video` block: a grid of
   16:9 thumbnails, each with an overlay play button, a badge in the corner, a
   scale on hover and the attribution set beneath the card, arriving staggered.

   IT IS A REBUILD, NOT A PORT, and there are two reasons rather than one. The
   block's source is behind a token (its registry URL answers 401), so there was
   nothing to copy; and it ships on shadcn/ui plus motion/react, neither of which
   is in this project — the dependencies here are next, react and react-dom, and
   the three jobs that block hands to libraries are already done locally by
   Reveal (staggered entrance), Lightbox (the player) and lib/ui.ts (the type
   ramp and the box). Adding two dependency trees to reproduce a layout would
   cost more than the layout is worth.

   WHAT THE CARD CLAIMS, WHICH IS THE ONE THING NOT TO GET WRONG HERE. A play
   button over a face with a quote under it reads as "this video is the client
   speaking". These clients are unnamed, asked to stay that way, and none of them
   is on camera — so the thumbnail is THE AD THE REACTION WAS ABOUT, and the
   card says so in as many words above the quote. The line is not decoration:
   without it this section invents three video testimonials that do not exist.

   THE THUMBNAILS ARE 9:16 FOOTAGE IN A 16:9 FRAME. Every reel in the library is
   vertical, so the frame crops hard — `object-[center_28%]` biases the crop up
   into the top third, where a talking-head UGC ad keeps its face, rather than
   centring on a torso. The alternative was a vertical card, which is what the
   two walls already are; the reference block's whole shape is the horizontal
   one, and it is what makes this section read differently from the work wall
   sitting above it.

   NO <video> IN THE GRID, DELIBERATELY. The page already mounts 128 media
   elements between the hero wall and the work wall, which is past the number of
   media players a browser will keep alive at once — three more here would come
   out of that budget and buy nothing, since a poster and a play button say
   "video" perfectly well while at rest. The clip is fetched when someone asks
   for it, by the Lightbox, which is also the only place the audio cut is worth
   loading.

   THE BOX IS THE PAGE'S, THE TYPE IS THIS SECTION'S OWN — unchanged from the
   version this replaces, and the reason the section still lines up with Why us
   and Pricing. SECTION, WRAP, HEAD_GAP and CARD_GAP give the gutter, the
   ceiling and the two seams; the SIZE_* ramps give 64 for the heading and 16
   for the small type. HEAD_GAP over CARD_GAP is the ordering that keeps the
   header block from reading as a fourth peer of the three cards. */

/* THE FRAME — the clipped 16:9 box the poster scales inside.

   THE SCALE IS ON THE IMAGE, NOT THE CARD. Growing the whole card would push
   its own quote around and slice the magnified corners against the grid gap;
   growing the image inside a frame that is `overflow-hidden` is a compositor
   operation on one layer, and the card does not move at all. `group` is on the
   button so the badge and the play disc can answer the same hover. */
const FRAME =
  "group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-poster " +
  "transition-[box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-transparent hover:shadow-[var(--shadow)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-pink-deep";

/* The play disc. A real ~56px target rather than a decorative mark: the whole
   frame is the button, but this is what a pointer aims at, and it has to read
   as pressable at a glance from across the grid.

   THE SCRIM UNDER IT IS PART OF THE CONTROL, not a mood layer. A white disc on
   an unknown frame of video has no guaranteed contrast — a bright kitchen shot
   would swallow it — so the gradient darkens the middle of the thumbnail enough
   to hold it, and deepens on hover to say the card is live. */
const PLAY =
  "pointer-events-none absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center " +
  "rounded-full bg-white/95 text-ink shadow-[0_8px_28px_rgba(0,0,0,0.35)] " +
  "transition-transform duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "group-hover:scale-110 group-active:scale-95";

/* Where the reference block puts a duration. See the note in lib/content.ts on
   why this names the format instead. */
const BADGE =
  "pointer-events-none absolute bottom-3 right-3 rounded-md bg-ink/75 px-2 py-1 " +
  `font-mono ${TEXT_META} uppercase leading-none tracking-[0.08em] text-paper backdrop-blur-[2px]`;

/* Resolve a content id against the generated library. The ids are stable across
   a sync and the URLs are not, which is why content.ts stores the id — see the
   note there. A miss returns undefined and the card renders without its
   thumbnail rather than with an empty frame. */
function reelById(id: string): Reel | undefined {
  return reelVideos.find((r) => r.id === id);
}

export function Testimonials() {
  const [active, setActive] = useState<Reel | null>(null);

  return (
    /* SECTION OUTSIDE, WRAP INSIDE, like every other band. Without the ceiling
       these cards ran to the viewport, so on a wide monitor a one-line quote was
       set across ~600px while the hero's own copy above it was capped at 42ch —
       the quotes read as a different page rather than as a section of this one. */
    <section className={SECTION} aria-label={testimonials.kicker}>
      <div className={WRAP}>
        {/* 832px is 13 × the 64px the title reaches on a desktop — the same
            13-title-em measure SectionHeading gives its other four. It is in px
            rather than em because it sits on this DIV, where an em would resolve
            against the body size and not against the title. */}
        <div className={`${HEAD_GAP} mx-auto max-w-[832px] text-center`}>
          {/* Roboto, not the mono the other kickers use — "rest use roboto"
              covers this. The rule stays in em so it tracks the type. */}
          <Reveal>
            <span
              className={`inline-flex items-center gap-[0.62em] font-sans ${SIZE_16} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-['']`}
            >
              {testimonials.kicker}
            </span>
          </Reveal>
          {/* mt-3 is inert on a non-replaced inline element and this h2 is one —
              kept because SectionHeading carries it and this is otherwise its
              markup. The gap under the kicker is line-box height, not margin. */}
          <RevealText
            as="h2"
            text={testimonials.heading}
            className={`mt-3 text-balance font-display ${SIZE_64} font-bold leading-[1.1] tracking-[-0.022em]`}
          />
        </div>

        {/* THREE STRAIGHT TO ONE, NO TWO-COLUMN STEP. Three cards in two columns
            orphans the third, and the orphan is always the shortest quote, so
            the row reads as a mistake rather than as a wrap. */}
        <div className={`grid items-start ${CARD_GAP} lap:grid-cols-3`}>
          {testimonials.items.map((t, i) => {
            const reel = reelById(t.reel);

            return (
              <Reveal key={t.quote} delay={i * 70}>
                <figure>
                  {reel && (
                    <button
                      type="button"
                      onClick={() => setActive(reel)}
                      /* The label says what OPENING it does, not what the card
                         is. A screen reader gets the quote and the attribution
                         from the figure below either way; what it cannot get
                         from a poster is that this control plays an ad. */
                      aria-label={`Play the ad this reaction was about — ${t.label}`}
                      className={FRAME}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- a
                          remote blob URL already at the size it renders.
                          next/image would mean a remotePatterns entry and a
                          proxy hop to re-encode a 24KB webp into itself; the
                          only thing wanted here is the browser's own lazy
                          loading, which a plain <img> gives directly. */}
                      <img
                        src={reel.poster ?? undefined}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        /* aspect-video on the IMAGE rather than the frame, so
                           the box is sized before the file lands and the grid
                           never reflows as the three posters arrive. */
                        className="aspect-video w-full object-cover object-[center_28%] transition-transform duration-[420ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] group-hover:scale-[1.05]"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,8,12,0.55),rgba(10,8,12,0.05)_45%,rgba(10,8,12,0.2))] transition-opacity duration-[280ms] group-hover:opacity-80"
                      />
                      <span className={PLAY} aria-hidden="true">
                        {/* The same triangle MotionToggle draws, at the same
                            ratio — one glyph, inline, rather than an icon set
                            imported for a single shape. The 1px nudge is
                            optical: a triangle centred on its bounding box
                            reads as sitting left of centre in a circle. */}
                        <svg
                          viewBox="0 0 10 12"
                          width="14"
                          height="17"
                          fill="currentColor"
                          className="translate-x-px"
                        >
                          <path d="M0 0l10 6-10 6z" />
                        </svg>
                      </span>
                      <span className={BADGE}>{t.label}</span>
                    </button>
                  )}

                  {/* THE LINE THAT KEEPS THIS HONEST — see the note at the top.
                      It sits between the thumbnail and the quote because that is
                      the order the eye takes them in: the frame is the claim, so
                      the correction has to arrive before the quote, not after
                      it. */}
                  {reel && (
                    <p
                      className={`mt-4 font-mono ${TEXT_META} uppercase tracking-[0.1em] text-ink-faint`}
                    >
                      The ad this reaction was about
                    </p>
                  )}

                  <blockquote
                    className={`${reel ? "mt-2" : ""} text-pretty font-sans ${SIZE_24} leading-[1.45] tracking-[-0.01em]`}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* A short gradient rule instead of a photo: it marks where the
                      quote ends and the attribution begins without pretending to
                      identify anyone. These clients asked to stay unnamed. */}
                  <figcaption
                    className={`mt-3 flex items-center gap-[0.65em] font-sans ${SIZE_16} uppercase tracking-[0.07em] text-ink-faint before:h-0.5 before:w-5 before:flex-none before:rounded-sm before:bg-[image:var(--grad-ink)] before:content-['']`}
                  >
                    {t.who}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* The overlay the two walls already use: it portals to the body, plays
          the HQ cut with audio, traps focus on the close button, closes on
          Escape or a backdrop click and locks the page behind it. */}
      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { ReelWallV3 } from "@/components/sections/ReelWallV3";
import { TEXT_META } from "@/lib/ui";

const { hero, reels } = content;

/* HERO — V3. "THE CUT".

   THE THESIS, and the correction this version makes. The three other heroes all
   answer "where do the reels go" with an arrangement — three lanes beside the
   copy, a strip beneath it, a grid the copy sits inside. Every one of those
   shrinks the footage to somewhere between 110 and 190 pixels wide, which is
   the size at which a clip stops being evidence and becomes wallpaper. This
   page's whole argument is that the work survives being looked at. So it shows
   ONE clip, at a size you can judge, and it cuts to the next every few seconds.

   THE COMPOSITION is a poster, not a split.

     ┌────────────────────┬─────────┬─────────┐
     │                    │         │         │
     │                    │  clip   │  clip   │
     │  Ads so real,      │  cuts   │  cuts   │
     │  nobody asks       │  every  │  on the │
     │  if they're AI.    │  4.6s   │  offbeat│
     │  [sub]             │         │         │
     │  [DM us] [Why us]  │  full bleed off   │
     └────────────────────┴──── the edge ─────┘

   The copy is anchored to the BOTTOM of the band with the air above it, rather
   than centred in it — which is what makes it read as type set on a shelf under
   an open field instead of as the left half of a two-up. V1 and V2 both centre
   their columns against the wall beside them; nothing here is centred against
   anything.

   THE CLIPS RUN OFF THE RIGHT EDGE. No card, no radius, no border, no shadow —
   the viewport crops them. That single decision is most of why this reads
   differently from the other three: a bounded rectangle floating in a layout is
   a component, and an image cropped by the edge of the page is a window.

   THE STAGE COLUMN IS 44%, not the 38 it started at. Two panels in 38% of 1440
   are 270px each, which is close enough to the size this design exists to get
   away from; 44 puts them at ~320 on a laptop and ~395 at the page's 1800 cap.
   Widening further starts eating the headline's measure — 17ch of Montserrat at
   64px needs the left column to hold about 800.

   WHAT WAS CUT: a caption under the clip naming what it is. `reels.caption`
   says "Real client work. Every frame is AI." — true, useful, and it was
   competing with the headline two inches away for the same job. It moves to the
   left column as the line under the buttons, where V1 keeps its reassurance,
   and the frame is left to speak.

   TYPE.
     Display  Montserrat 700, mixed case, 64px at the ceiling, leading 1.0 and
              -0.03em. Between V4's 100px masthead and the 40px caption the old
              V3 used — big enough to hold the left half of the page on its own,
              small enough that it never crowds the frame beside it.
     Utility  JetBrains Mono for the two small lines and the clip's counter.
     Body     Roboto 17px, capped at 40 characters. A short measure, because it
              sits directly under a 64px headline and a long one would drag the
              eye off the composition.

   PALETTE. The page's own paper and ink, no new values, and one accent: the
   marked run in `hero.headline` on `--grad-ink`, the darkened cut, because this
   is text on warm paper. The clip is the colour in this design; adding more
   would be competing with it.

   NO PAGE-LOAD STAGGER. V1 and V2 fade four elements in on a 90ms stagger. Here
   the headline's word reveal is the entrance and the clip is already cutting —
   a third piece of motion underneath those would be fidgeting. This is also why
   the file needs no client boundary: it is a server component, and the only
   client code is the stage.

   ARCHITECTURE. HeroV3 owns the layout and the copy; ReelWallV3 is the stage
   and is rendered inside it. Mounting means replacing the whole SPLIT block in
   app/page.tsx with `<HeroV3 />` — there is no second component to place.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1400 and
   holds it above; the ramp exists for everything narrower. */

/* 64px at the top, 36px on a 390 phone. */
const HEADLINE = "text-[clamp(2.25rem,1.25rem+4.4vw,4rem)]";

export function HeroV3() {
  return (
    <header id="top" className="relative bg-paper">
      {/* THE BAND. Capped at 1800 to match the page's own `lap:` ceiling, so
          the clip's "edge of the page" is the same edge every other section
          measures from. Below `lap:` this is one column and the grid collapses
          to source order: copy, then clip. */}
      <div className="mx-auto w-full max-w-[1800px] lap:grid lap:min-h-[min(78svh,760px)] lap:grid-cols-[minmax(0,1fr)_minmax(0,44%)]">
        {/* THE COPY — bottom-anchored, with the air above it. `justify-end` is
            the composition; see the note above before changing it to centre. */}
        <div className="flex flex-col justify-end px-[clamp(24px,5vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(112px,13vh,168px)] lap:pr-[clamp(40px,4vw,72px)]">
          {/* The eyebrow, on the page's own kicker convention: mono caps behind
              a short rule. It is the one thing here carried over from V1
              unchanged — the rest of the composition is different enough that
              the section still needs a familiar way to say what it is. */}
          <span
            className={`inline-flex items-center gap-[0.65em] font-mono ${TEXT_META} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[1.7rem] before:bg-current before:opacity-55 before:content-['']`}
          >
            {hero.eyebrow}
          </span>

          {/* `max-w` in `ch` ON THE H1, where it resolves against this element's
              own size rather than the body's. 17ch of Montserrat at 64px turns
              this headline over three lines, which is the shape that balances
              the tall frame beside it — two lines leaves the column short and
              the composition lopsided.

              RevealText lays each word out as its own box and stitches the
              gradient back across them, so this cannot be swapped for a plain
              <h1> without changing both the rhythm and the colour. */}
          <h1
            className={`mt-5 max-w-[17ch] text-balance font-display ${HEADLINE} font-bold leading-[1.0] tracking-[-0.03em]`}
          >
            <RevealText text={hero.headline} immediate delay={180} />
          </h1>

          <p className="mt-6 max-w-[40ch] text-pretty font-sans text-[1.0625rem] leading-[1.5] text-ink-soft">
            {hero.subline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* The real Button, both variants, no local fork — on paper `grad`
                and `light` both work as drawn. */}
            <Button contact variant="grad" withArrow>
              {hero.primaryCta}
            </Button>
            <Button href={hero.secondaryHref} variant="light">
              {hero.secondaryCta}
            </Button>
          </div>

          {/* Both small lines share one row, separated by a hairline rather than
              stacked: they answer two different questions — what the work is,
              and what happens if you send a DM — and at this size stacking them
              reads as one long disclaimer. The divider is a border on the second
              cell, so it disappears on its own when the row wraps. */}
          <div
            className={`mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono ${TEXT_META} tracking-[0.03em] text-ink-faint`}
          >
            <span>{reels.caption}</span>
            <span className="border-l border-line pl-4">{hero.reassurance}</span>
          </div>
        </div>

        {/* THE STAGE. Below `lap:` it is a full-bleed band under the copy at a
            capped height — a 9:16 clip at phone width would otherwise run 690px
            tall and push everything else off the screen. From `lap:` it fills
            the grid cell, which reaches the right edge of the band.

            BOTH CAPS ARE DELIBERATELY SHORT. The panels are 9:16 footage in a
            box far taller than that, so every pixel of extra height is a pixel
            `object-cover` takes off the SIDES of the frame — height here does
            not show more of the clip, it shows less of it. 760 is about where a
            395-wide panel stops cropping hard, and the phone band is shorter
            again so the copy above it still shares the first screen. */}
        <div className="h-[46svh] w-full lap:h-auto">
          <ReelWallV3 />
        </div>
      </div>
    </header>
  );
}

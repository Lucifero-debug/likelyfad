"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SIZE_16 } from "@/lib/ui";

const { testimonials } = content;

/* TESTIMONIALS — V2. The carousel reference's box, this page's palette and the
   real quotes. The desktop values, which every clamp below reaches and holds:

     SECTION   1128 cap · 24 gutter · 96 top and bottom · 40 between blocks
     HEADER    640 measure · CENTRED · 12 between the pill and the heading
     PILL      16 × 8, fully rounded, 14px label beside an 8px dot
     HEADING   48px, centred, leading 40 (0.83), tracking +0.02em
     TRACK     320 × 240 cards · 12 gap · horizontal, snapped
     CARD      24 padding · 40 radius · 0.8 hairline · TOP-AND-BOTTOM split
               20px quote on 24 leading, pinned to the top
               a 1px rule, 16 above the footer row
               16px attribution over a 14px context line, 4 apart
               a 14px counter, right-aligned on the same row
     CONTROLS  two 40px discs, 16 apart, centred, 24 under the track

   WHAT THIS IS THAT THE EXISTING Testimonials.tsx IS NOT:

     1. IT IS A TRACK, NOT A GRID. V1 lays three quotes out as three columns
        that all end at the same baseline; this one is a horizontal row that
        scrolls, and the card is a fixed 320 × 240 rather than a column that
        takes the height of the longest quote.
     2. THE CARD IS SPLIT TOP AND BOTTOM. `justify-between` on a fixed height,
        so the quote hangs from the top edge and the attribution sits on the
        bottom one no matter how short the quote is. "Insane realism." is three
        words and still fills its card, because the card's shape is not derived
        from its content.
     3. THE ATTRIBUTION IS TWO LINES, not one. The reference splits a name from
        a role; these clients asked to stay unnamed, so there is no name to
        print — what it splits instead is the `·` already in the copy, which
        separates who they are from the context they said it in. A quote with no
        `·` simply renders one line.
     4. THERE IS A COUNTER. `1/3` on the footer row, derived from the array —
        the reference's `1/4` with the real number in it.

   THE REFERENCE'S TRACK IS AN AUTOPLAYING MARQUEE — its cards are duplicated
   three times over and offset by -1450px, which is a marquee mid-loop. This one
   scrolls on the arrows and on drag instead, for two reasons. There are three
   quotes and they FIT at the 1128 cap (3 × 320 plus 2 × 12 is 984), so there
   would be nothing for an autoplay to move; and this page already runs two
   autoplaying walls, each with a motion toggle, which is as much self-moving
   content as one page should ask for. The arrows disable themselves when there
   is nothing to scroll, so on a desktop they read as inert and below `lap:`,
   where the cards overflow, they come alive.

   Native overflow scrolling rather than a transform: it keeps the keyboard, the
   trackpad, touch drag and the scrollbar all working for free, and scroll-snap
   does the alignment the reference draws with fixed offsets.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at 1128 and up, 32px on a 390 phone — the same pair the Why-us variants
   at this size use, so the two bands agree if they ever sit near each other. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* 20px quotes, down to 18. */
const QUOTE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* The gap between cards, in px because the scroll step below is arithmetic and
   has to agree with it. 12 is the reference's. */
const GAP = 12;

/* THE CARD. A fixed 320 × 240 that does not flex: `shrink-0` is what makes the
   row overflow rather than squeezing six cards into the viewport, and the fixed
   height is what note 2 above depends on. */
const CARD =
  "flex h-60 w-80 shrink-0 snap-start flex-col justify-between overflow-hidden " +
  "rounded-[40px] border-[0.8px] border-line bg-white p-6 " +
  "transition-[box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink/15 hover:shadow-[var(--shadow-sm)]";

/* The two discs. White on paper rather than the reference's white on near
   black, so they take the page's hairline to have an edge at all; the hover
   inverts to ink, which is the only state change either of them has.
   `disabled:` is not cosmetic — see the note about autoplay above. */
const DISC =
  "grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white " +
  "text-ink transition-[background-color,color,border-color,opacity] duration-[280ms] " +
  "ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink hover:bg-ink hover:text-paper " +
  "disabled:pointer-events-none disabled:opacity-35";

/* The reference's heading is two-tone — full strength for the first clause,
   muted for the rest. RevealText draws that from *asterisks* in the text, and
   the asterisks are added HERE rather than in lib/content.ts because the same
   string feeds the existing Testimonials.tsx and marking it there would change
   that section too. If the copy is rewritten, the replace finds nothing and the
   heading renders in one tone, which is the correct way for this to fail. */
const HEADING_TEXT = testimonials.heading.replace("as sent.", "*as sent.*");

export function TestimonialsV2() {
  const track = useRef<HTMLDivElement>(null);
  /* Two booleans rather than a scroll offset: the only thing the UI needs to
     know is whether each arrow has anywhere to go, and storing the offset would
     re-render on every frame of a smooth scroll to answer the same question. */
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    /* A 1px tolerance: a fractional layout width leaves scrollLeft a hair short
       of max at the end of a scroll, and without it the right arrow never
       re-enables. */
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft >= max - 1 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    /* The row's overflow depends on the viewport, so both arrows can go from
       inert to live on a resize with no scrolling involved. */
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    /* One card plus one gap, measured off the live card rather than hard-coded:
       the card is a fixed 320 today, and this keeps working if it stops being
       one. Falls back to a viewport's worth if the row is somehow empty. */
    const card = el.firstElementChild;
    const width = card ? card.getBoundingClientRect().width + GAP : el.clientWidth;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  return (
    <section
      className="mx-auto flex w-full max-w-[1128px] flex-col items-center gap-[clamp(32px,3.5vw,40px)] px-6 py-[clamp(64px,8vw,96px)]"
      aria-label={testimonials.kicker}
    >
      {/* HEADER — 640 measure, centred, 12 between its two lines. Wider than the
          Why-us variants' 600 because this heading is one line of five words and
          the reference gives it the room to stay one. */}
      <div className="flex w-full max-w-[640px] flex-col items-center gap-3">
        {/* The pill, in place of the rule-and-caps kicker the rest of the page
            uses. Its ground is a 4% ink tint rather than the reference's
            white/5 — that one is a lift off a dark card and would be invisible
            on paper, so the same idea is inverted to a wash. The dot carries the
            bright ramp because it is a filled shape, not text. */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/4 px-4 py-2 font-sans text-sm leading-5 text-ink-faint">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-[image:var(--grad)]" />
            {testimonials.kicker}
          </span>
        </Reveal>

        <RevealText
          as="h2"
          text={HEADING_TEXT}
          className={`text-balance text-center font-display ${HEADING} font-bold leading-[1.05] tracking-[0.02em]`}
        />
      </div>

      {/* THE TRACK. `w-fit max-w-full` is what centres it when the cards fit and
          lets it scroll when they do not: fit-content shrinks the box to the
          three cards so `mx-auto` has something to centre, and the max-width
          caps it at the section's measure the moment the row is wider.

          `px-0.5` is the reference's 2px, and it earns its keep here: without
          it a card's 0.8px hairline sits exactly on the scroll container's edge
          and gets clipped on the first and last card.

          The scrollbar is left alone rather than hidden. It is the honest
          affordance on a trackpad, and it only appears when the row actually
          overflows — which is the same condition that lights the arrows. */}
      <Reveal className="w-full">
        <div
          ref={track}
          className="mx-auto flex w-fit max-w-full snap-x snap-mandatory scroll-px-0.5 gap-3 overflow-x-auto px-0.5 scroll-smooth"
          role="region"
          aria-label={`${testimonials.kicker}, scrollable`}
          tabIndex={0}
        >
          {testimonials.items.map((t, i) => {
            /* The copy separates who they are from the context they said it in
               with a `·`. Split on the first one only: a `who` with no
               separator becomes a single line and `context` is undefined, which
               is what the third quote does. */
            const [attribution, context] = t.who.split(/\s*·\s*/, 2);
            return (
              <figure key={t.quote} className={CARD}>
                <blockquote
                  className={`text-pretty font-sans ${QUOTE} leading-6 text-ink`}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* THE FOOTER — a rule, 16, then the row. Pinned to the bottom
                    edge by the card's `justify-between`, so it lands in the same
                    place on all three cards regardless of quote length. */}
                <figcaption className="flex flex-col gap-4">
                  <span aria-hidden className="h-px w-full bg-line" />
                  <span className="flex items-center gap-4">
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className={`font-sans ${SIZE_16} font-medium leading-5 text-ink`}>
                        {attribution}
                      </span>
                      {context && (
                        <span className="font-sans text-sm leading-5 text-ink-faint">
                          {context}
                        </span>
                      )}
                    </span>
                    {/* Hidden from a screen reader: it is a position indicator
                        for a visual row, and read aloud it prefixes every quote
                        with a fraction that the list order already carries. */}
                    <span
                      aria-hidden
                      className="shrink-0 text-right font-sans text-sm leading-5 text-ink-faint"
                    >
                      {i + 1}/{testimonials.items.length}
                    </span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Reveal>

      {/* Two discs, 16 apart, centred. They sit in the section's own 40 gap
          rather than the reference's absolute 24 below the track — the track's
          height is content-driven here, so there is nothing fixed to position
          against.

          Both stay MOUNTED when the row fits and are disabled instead of
          removed: a control that vanishes on resize is worse than one that is
          visibly unavailable, and the row goes from fitting to overflowing on
          nothing more than a window drag. */}
      <Reveal delay={100}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            className={DISC}
            aria-label="Previous quote"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            className={DISC}
            aria-label="Next quote"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </Reveal>
    </section>
  );
}

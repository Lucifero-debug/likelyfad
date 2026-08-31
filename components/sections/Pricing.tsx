import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import {
  ANCHOR,
  HEAD_GAP,
  SECTION,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_64,
  TEXT_META,
  WRAP,
} from "@/lib/ui";

const { pricing } = content;

/* THE BOX IS THE PAGE'S, THE TYPE IS THIS SECTION'S OWN — the same split Why
   us makes, and the same reasoning. The type stays authored at 64 / 32 / 24 /
   16 through the SIZE_* ramps; the box goes back to SECTION, WRAP and
   HEAD_GAP, so this section's gutter, ceiling and vertical rhythm are the
   page's and its left edge is the hero's. Sixteen pixels of gutter under a
   hero that sets clamp(24,5vw,64) is not a tighter version of the same
   alignment, it is a different one.

   THE SEAM UNDER THE HEADING IS HEAD_GAP AGAIN (32→64) rather than the flat 32
   that ran every gap in here. There are only two things in this section, so a
   single gap looked defensible — but a 32 under the heading is the same 32
   this section is separated from Testimonials by once SECTION's padding is
   halved between them, and a header that far from its own card starts reading
   as a header for the page.

   THE HEADING IS SPELLED OUT HERE rather than coming from SectionHeading. That
   component sets one size for all five headings, which is the point of it —
   giving this one a 64px title and a Roboto kicker through it would have moved
   the other four as well. */

/* On a laptop the card splits: the pitch and its CTA on the left, the checklist
   on the right behind a hairline. Left whole, it read as an enormous white slab
   with a thin ribbon of content down the middle — 46ch of copy and a 340px list
   centred in 1800px. Two changes fix that without touching a word: cap the card
   (a quote panel has no reason to be 2000px wide) and split it, so the list
   stops being a footnote under the paragraph and becomes the second half of the
   argument.

   THE CAP IS WRAP'S, 1520 FROM `lap:` UP, and it is back on. That is the
   hero's stage width, so the card's edges land on the same x as the hero
   headline and the reel wall above it rather than 140px outboard of them.

   Placement is by explicit grid coordinates rather than a wrapper element, so
   the source order (body → list → CTA) still drives the stacked layout below
   the breakpoint.

   BOTH COLUMNS TOP-ALIGN AND THE GUTTER IS SYMMETRIC, which took two fixes.
   The paragraph used to sit at the BOTTOM of row 1 and the list was optically
   centred across both rows, so no two things in the card shared a starting
   line and the offset between them read as an accident. And the paragraph
   carried a 34ch cap inside a ~460px column, which left the hairline stranded
   ~180px from the copy on its left while glued ~60px to the ticks on its
   right: the divider belonged to the checklist rather than to the split. The
   cap is gone — the column IS the measure now, and it lands within a few
   characters of the 46ch the stacked layout uses — and the grid's gap-x and
   the list's left padding are ONE NUMBER, 64 each, so the rule sits in the
   middle of its own 128 gutter at every width from `lap:` up. THOSE TWO MOVE
   TOGETHER OR NOT AT ALL: change gap-x alone and the hairline slides off centre
   by exactly the difference, which is how it ended up 183px from the copy and
   62px from the ticks the first time.

   PADDING IS 32→48, THE PANEL STEP. 12/16 held at every width before this,
   which put a 24px title 12px from the card's edge and left the 64px gutter
   between its two columns running at more than five times its outer inset —
   the card read as two columns that had been pushed apart inside a box too
   small for them. At 48 the gutter is a shade over the padding, which is the
   right way round: the split inside a panel should be the widest gap in it,
   but not by a factor of five. It is the same step the Why-us claim panel
   takes, and both are one rung above the card grids on either side. */
const CARD =
  "relative overflow-hidden rounded-3xl border border-line bg-white " +
  "p-[clamp(32px,3.5vw,48px)] shadow-[var(--shadow)] " +
  "before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-[''] " +
  "before:bg-[image:var(--grad)] " +
  "lap:grid lap:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lap:content-center " +
  "lap:gap-x-16 lap:gap-y-[clamp(24px,2.2vw,32px)] " +
  "lap:text-left";

export function Pricing() {
  return (
    /* SECTION ON THE OUTSIDE, WRAP ON THE INSIDE — the page's two-element
       split. The section contributes vertical rhythm and the text alignment
       both blocks inherit; the div contributes the gutter and the 1520 ceiling
       that makes this band line up with the hero. Neither does the other's
       job, which is what keeps a background (this one has none, others do)
       free to run edge to edge while the content does not. */
    <section
      id="pricing"
      aria-label={pricing.kicker}
      className={`${SECTION} ${ANCHOR} text-center`}
    >
      <div className={WRAP}>
        {/* The cap is 1024px — 16 × the 64px title, the same 16-title-em measure
            this heading asked SectionHeading for when the size was fluid. It is
            written in px rather than em because it sits on this DIV, where an em
            would resolve against the body size and not against the title. */}
        <div className={`${HEAD_GAP} mx-auto max-w-[1024px] text-center`}>
          {/* Roboto, not the mono the other four kickers use — "for rest use
              roboto" covers this. The rule stays in em so it tracks the 16px. */}
          <Reveal>
            <span className={`inline-flex items-center gap-[0.62em] font-sans ${SIZE_16} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-['']`}>
              {pricing.kicker}
            </span>
          </Reveal>
          {/* mt-3 is inert on a non-replaced inline element and this h2 is one —
              kept because SectionHeading carries it and this is otherwise its
              markup. The gap under the kicker is line-box height, not margin.

              text-pretty, NOT text-balance: this heading sets its own break with
              a \n, and balance would go looking for a second break to even out
              the short line the copy just made. */}
          <RevealText
            as="h2"
            text={pricing.heading}
            className={`mt-3 text-pretty font-display ${SIZE_64} font-bold leading-[1.1] tracking-[-0.022em]`}
          />
        </div>

        <Reveal delay={120}>
          <div className={CARD}>
            <p className={`mx-auto max-w-[46ch] text-pretty font-sans ${SIZE_32} leading-[1.45] text-ink-soft lap:col-start-1 lap:row-start-1 lap:mx-0 lap:self-start`}>
              {pricing.body}
            </p>

            {/* Spans both rows on a laptop so the divider runs the full height
                of the card. A hairline, not a filled panel: the card already
                sits on a border and a shadow, and a second surface inside it
                would be one box too many. */}
            <ul className={`mx-auto mt-4 grid max-w-[340px] gap-3 text-left font-sans ${SIZE_24} lap:col-start-2 lap:row-span-2 lap:row-start-1 lap:m-0 lap:max-w-none lap:content-start lap:gap-[clamp(12px,1.1vw,16px)] lap:border-l lap:border-line lap:pl-16`}>
              {pricing.includes.map((it) => (
                <li key={it} className="flex items-center gap-3 lap:items-start lap:leading-[1.45]">
                  {/* Optically centred against the first line of a wrapping
                      item once the list goes top-aligned.

                      LEFT AT A FIXED 22px against 24px text. Sizing it in em is
                      the obvious move and it does not work: `size` in em resolves
                      against the element's OWN font-size, which this span sets to
                      a fraction of its parent's — so the two ems compound and the
                      disc collapses. 22px still encloses the ~17px cap height of
                      24px Roboto; if it ever needs to track the text, the ratio
                      has to be worked out against the span's own size, not the
                      li's. */}
                  <span
                    aria-hidden="true"
                    className="grid size-[22px] flex-none place-items-center rounded-full bg-[image:var(--grad)] text-[0.68rem] text-white lap:mt-[0.12em]"
                  >
                    ✓
                  </span>
                  {it}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-center gap-3 lap:col-start-1 lap:row-start-2 lap:mt-0 lap:items-start lap:self-start">
              <Button contact variant="grad" withArrow>
                {pricing.cta}
              </Button>
              <p className={`font-sans ${TEXT_META} text-ink-faint`}>{pricing.foot}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

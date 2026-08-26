import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHOR, HEAD_GAP, SECTION, WRAP } from "@/lib/ui";

const { pricing } = content;

/* On a laptop the card splits: the pitch and its CTA on the left, the checklist
   on the right behind a hairline. Left whole, it read as an enormous white slab
   with a thin ribbon of content down the middle — 46ch of copy and a 340px list
   centred in 1800px. Two changes fix that without touching a word: cap the card
   (a quote panel has no reason to be 2000px wide) and split it, so the list
   stops being a footnote under the paragraph and becomes the second half of the
   argument.

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

   Padding is a flat 64 from `lap:` too. It was a clamp topping out at 64, which
   meant the card only actually hit 64 above ~1425px and sat on off-grid values
   like 63 everywhere below that. The mobile tier below `lap:` stays fluid — 64
   of padding on a 390px card would leave 262px of content. */
const CARD =
  "relative overflow-hidden rounded-3xl border border-line bg-white " +
  "p-[clamp(32px,3.5vw,48px)] shadow-[var(--shadow)] " +
  "before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-[''] " +
  "before:bg-[image:var(--grad)] " +
  "lap:grid lap:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lap:content-center " +
  "lap:gap-x-16 lap:gap-y-[clamp(24px,2.2vw,32px)] " +
  "lap:p-16 lap:text-left";

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-label={pricing.kicker}
      className={`${SECTION} ${ANCHOR} text-center`}
    >
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <SectionHeading kicker={pricing.kicker} heading={pricing.heading} measure="16" />
        </div>

        <Reveal delay={120}>
          <div className={CARD}>
            <p className="mx-auto max-w-[46ch] text-pretty text-[clamp(1.05rem,1rem+0.5vw,1.25rem)] leading-[1.2] text-ink-soft lap:col-start-1 lap:row-start-1 lap:mx-0 lap:self-start">
              {pricing.body}
            </p>

            {/* Spans both rows on a laptop so the divider runs the full height
                of the card. A hairline, not a filled panel: the card already
                sits on a border and a shadow, and a second surface inside it
                would be one box too many. */}
            <ul className="mx-auto mt-4 grid max-w-[340px] gap-3 text-left lap:col-start-2 lap:row-span-2 lap:row-start-1 lap:m-0 lap:max-w-none lap:content-start lap:gap-[clamp(12px,1.1vw,16px)] lap:border-l lap:border-line lap:pl-16">
              {pricing.includes.map((it) => (
                <li
                  key={it}
                  className="flex items-center gap-3 lap:items-start lap:leading-[1.2]"
                >
                  {/* Optically centred against the first line of a wrapping
                      item once the list goes top-aligned. */}
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
              <p className="font-mono text-[0.74rem] text-ink-faint leading-[1.2]">{pricing.foot}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

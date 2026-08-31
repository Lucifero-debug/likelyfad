import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16, TEXT_SMALL } from "@/lib/ui";

const { faq } = content;

/* FAQ — V3. The split head-and-list reference, in the same language as
   WhyUsV3 and TestimonialsV3: left aligned, square cornered, a mono kicker with
   a square dot, and a 36px regular heading. The desktop values:

     SECTION   1128 cap · 24 gutter · 96 top and bottom
     SPLIT     two equal columns · 40 between them · both top aligned
     HEAD      520 · 12 between the kicker and the heading
     KICKER    14px mono, uppercase, semibold · 6px SQUARE dot · 6 gap · no pill
     HEADING   36px, left, leading 40 (1.11), REGULAR WEIGHT
     LIST      12 between rows
     ROW       520 × 48 · 16 padding · NO RADIUS · 0.8 hairline
               16px MEDIUM question · 12 gap · a 16px marker

   WHAT SEPARATES V3 FROM FaqV2:

     1. IT IS A SPLIT, NOT A STACK. V2 centres a header over two columns of
        rows; this puts the header in one column and the whole list in the
        other, 50/50. So the questions read as ONE list rather than two, which
        is the thing V2 gives up to get its rows shorter.
     2. SQUARE CORNERS. V2's row is a 24-radius pill; this one has no radius at
        all, and the 0.8 hairline is the only thing that bounds it.
     3. THE ROW GAP IS 12, NOT 16. Tighter, and it can be: with hard corners and
        a full border the rows do not need as much air between them to stop
        reading as one block.
     4. THE KICKER IS MONO AND BARE — a 6px square and 14px uppercase, where V2
        uses a filled pill. Same distinction WhyUsV3 draws against WhyUsV2.
     5. THE HEADING IS 36px REGULAR, not 48px bold.

   AND WHAT SEPARATES IT FROM THE EXISTING Faq.tsx, which is also a split: that
   one runs 0.45 / 0.55 with a STICKY head and separates its questions with
   hairlines on a shared column, at TEXT_TITLE in the display face. This is a
   flat 50/50, the head does not stick, every question is its own bordered box,
   and the question type is body-size in the UI face. Adding
   `lap:sticky lap:top-24` to the head column brings V1's behaviour back — the
   reference does not have it, so it is not here.

   NO ACCENT RULE ON THE ROWS. WhyUsV3 and TestimonialsV3 close each card with a
   1.6px gradient rule along the bottom; this reference does not, and adding one
   to eight stacked rows would put eight bright lines down the column. The brand
   colour appears once in this section, in the kicker's square.

   STILL NATIVE <details>. No state, no client boundary, and the accordion still
   opens if a script fails — the same reasoning as V1 and V2.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 28px on a 390 phone — the same pair WhyUsV3 and
   TestimonialsV3 use, which is what makes the three headings one heading. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* THE ROW. `overflow-hidden` keeps the answer inside the box when the row opens
   — it matters less here than in V2, where there is a radius to escape, but the
   border is drawn on this element and the paragraph should stay inside it.

   Nothing moves on hover: eight rows sitting 12 apart in one column, and a lift
   on any of them would shunt the alignment of everything below. Border and
   shadow only, and the open state holds the same treatment so a reader can see
   which row they left open. */
const ROW =
  "group overflow-hidden border-[0.8px] border-line bg-white " +
  "transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink/15 hover:shadow-[var(--shadow-sm)] " +
  "open:border-ink/15 open:shadow-[var(--shadow-sm)]";

/* THE SUMMARY. `min-h-12` rather than `h-12`: 48 is the reference's collapsed
   height and it is right for a one-line question, but these questions turn at a
   narrow column and a hard height would clip them. The 16 padding is the
   reference's either way. */
const QUESTION =
  "flex min-h-12 cursor-pointer list-none items-center gap-3 p-4 text-left " +
  `font-sans ${SIZE_16} font-medium leading-5 ` +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep active:opacity-60 [&::-webkit-details-marker]:hidden";

/* The reference's 16px marker slot. A bare plus, and its bars are SQUARE-ended
   rather than rounded — in a section with no radius anywhere, a rounded cap on
   a 1.5px bar is the one soft edge on the page. It turns 45° into an × on
   open. */
const MARKER =
  "relative size-4 flex-none text-ink-faint " +
  "transition-[transform,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-open:rotate-45 group-open:text-pink-deep";

export function FaqV3() {
  return (
    <section
      id="faq"
      className={`${ANCHOR} mx-auto w-full max-w-[1128px] px-6 py-[clamp(64px,8vw,96px)]`}
      aria-label="Frequently asked questions"
    >
      {/* THE SPLIT — 50/50 and top aligned, 40 apart. `items-start` so the head
          column keeps its own height instead of stretching to the list's; below
          `tab:` the two stack and the head simply sits above the questions,
          which is the same order it is read in. */}
      <div className="flex flex-col gap-10 tab:flex-row tab:items-start">
        <div className="flex flex-1 flex-col items-start gap-3">
          {/* Mono, uppercase, semibold, 14px, with a 6px SQUARE mark and no
              added tracking — the page's own kicker convention at the
              reference's numbers. The square rhymes with the row corners;
              `--grad` and not `--grad-ink` because it is a filled shape, not
              text, so the bright cut is the correct one. */}
          <Reveal>
            <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold uppercase leading-5 text-pink-deep">
              <span aria-hidden className="size-1.5 shrink-0 bg-[image:var(--grad)]" />
              {faq.kicker}
            </span>
          </Reveal>

          {/* REGULAR WEIGHT. `leading-[1.11]` is the reference's 40-on-36 kept
              as a ratio so it travels down the clamp.

              No `text-balance`: the copy carries a hard \n at the gradient
              boundary, which RevealText turns into a <br>, so the break is
              already decided in lib/content.ts and balancing would fight it. */}
          <RevealText
            as="h2"
            text={faq.heading}
            className={`font-display ${HEADING} font-normal leading-[1.11] tracking-[-0.01em]`}
          />

          {/* The reference ends the head column at the heading. This copy has a
              CTA, and unlike V2 — which has no head column to put it in and so
              closes the section with it — there is room for it right here,
              which is also where the existing Faq.tsx keeps it. It doubles as
              the answer to the left column being much shorter than the right.

              `mt-3` rather than a gap on the wrapper: the 12 above belongs
              between the kicker and the heading, and a gap would apply it three
              times. */}
          <Reveal delay={100} className="mt-3">
            <Button contact variant="light" withArrow>
              {faq.cta}
            </Button>
          </Reveal>
        </div>

        {/* THE LIST — 12 between rows, one column, in copy order. */}
        <div className="flex flex-1 flex-col gap-3">
          {faq.items.map((item, i) => (
            /* Stagger caps at four steps: at 8 × 60ms the last row would still
               be arriving well after a reader reached it. */
            <Reveal key={item.q} delay={Math.min(i, 3) * 60}>
              <details className={ROW}>
                <summary className={QUESTION}>
                  <span className="flex-1">{item.q}</span>
                  <span className={MARKER} aria-hidden="true">
                    <i className="absolute inset-0 m-auto h-[1.5px] w-4 bg-current" />
                    <i className="absolute inset-0 m-auto h-4 w-[1.5px] bg-current" />
                  </span>
                </summary>
                {/* The answer keeps the summary's 16 on three sides and takes
                    none on top: the summary's own bottom padding is already
                    there, and a `pt-4` here would open the row with 32 of air
                    between a question and its answer. */}
                <p
                  className={`max-w-[62ch] text-pretty px-4 pb-4 font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}
                >
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

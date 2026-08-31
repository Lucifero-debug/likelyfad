import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16, TEXT_SMALL } from "@/lib/ui";

const { faq } = content;

/* FAQ — V2. The two-column pill-row reference, this page's palette and copy.

   The third section built in this reference's language, after WhyUsV2 and
   TestimonialsV2 — same 1128 panel, same 40 between blocks, same pill kicker,
   same 48px centred heading. The desktop values:

     SECTION   1128 cap · 24 gutter · 96 top and bottom · 40 between blocks
     HEADER    640 measure · CENTRED · 12 between the pill and the heading
     PILL      16 × 8, fully rounded, 14px label beside an 8px dot
     HEADING   48px, centred, leading 40 (0.83), tracking +0.02em
     COLUMNS   2 · 16 between them · 16 between the rows in each
     ROW       48 tall collapsed · 16 padding · 24 radius · 0.8 hairline
               16px MEDIUM question · 12 gap · a 16px marker

   WHAT SEPARATES V2 FROM THE EXISTING Faq.tsx:

     1. IT IS TWO COLUMNS, NOT ONE LIST. And they are two INDEPENDENT stacks,
        not a two-column grid: opening a question in the left column pushes only
        the questions under it. A grid would put items 1 and 2 in one row and
        stretch both when either opened, and the reading order would go across
        rather than down.
     2. THE ROW IS A PILL, NOT A RULE. V1 separates questions with hairlines on
        a shared column; here every question is its own closed 48px shape with a
        24 radius, and there is no rule anywhere in the section.
     3. THE QUESTION IS 16px MEDIUM — body size, in the UI face. V1 sets its
        questions at TEXT_TITLE in the display face, which is 1.4–1.8rem. This
        reference deliberately makes a question look like a row in a list rather
        than like a small heading, and that is what lets sixteen of them sit in
        one 192px-tall block.
     4. THE HEAD DOES NOT STICK. V1's left column is sticky and holds the CTA
        beside a scrolling list; this is a centred header over a two-column
        block that is shorter than a viewport, so there is nothing to stick to.

   STILL NATIVE <details>. No state, no client boundary, and the accordion still
   opens if a script fails — the same reasoning as V1, and the only work is
   hiding the two default markers (Safari ships its own) and drawing ours.

   THE HEADING'S EMPHASIS SITS IN A DIFFERENT PLACE than the reference's. That
   one runs muted / full / muted, so the middle clause is the lit one; this
   copy marks its CLOSING clause, with the *asterisks* already in
   lib/content.ts. Moving the emphasis would mean rewriting the string there,
   which the existing Faq.tsx also renders — so the mark stays where the copy
   puts it and only the size and alignment come from the reference.

   FONT WEIGHT IS BOLD, NOT THE REFERENCE'S REGULAR — the same call WhyUsV2 and
   TestimonialsV2 make, for the same reason. The reference sets 48px in
   Instrument Serif, a serif whose regular weight already carries the presence
   of a heavier sans; Montserrat at regular and 48px reads thin over a field of
   bordered rows and stops holding the top of the section.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at 1128 and up, 32px on a 390 phone — the pair every 48px variant in
   this set uses. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* THE ROW. `overflow-hidden` is what keeps the answer inside the 24 radius when
   the row opens — without it the paragraph's box runs square out of a rounded
   shell at the bottom two corners.

   The hover moves nothing: these rows sit 16 apart in two columns and a lift on
   one would break the alignment of the row beside it. Border and shadow only. */
const ROW =
  "group overflow-hidden rounded-3xl border-[0.8px] border-line bg-white " +
  "transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink/15 hover:shadow-[var(--shadow-sm)] " +
  "open:border-ink/15 open:shadow-[var(--shadow-sm)]";

/* THE SUMMARY. `min-h-12` rather than `h-12`: 48 is the reference's collapsed
   height and it is correct for a one-line question, but three of these
   questions are long enough to turn at a narrow column and a hard height would
   clip them. The 16 padding is the reference's either way. */
const QUESTION =
  "flex min-h-12 cursor-pointer list-none items-center gap-3 p-4 text-left " +
  `font-sans ${SIZE_16} font-medium leading-5 ` +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep active:opacity-60 [&::-webkit-details-marker]:hidden";

/* The reference's 16px marker slot. A bare plus rather than V1's 30px ringed
   one — at 16 a ring would leave about 11px of interior for the glyph, which is
   not enough to read as anything. It turns 45° into an × on open. */
const MARKER =
  "relative size-4 flex-none text-ink-faint " +
  "transition-[transform,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-open:rotate-45 group-open:text-pink-deep";

export function FaqV2() {
  /* TWO INDEPENDENT STACKS, split down the middle — see note 1. Column-major,
     so the left column holds the first half in order and the right holds the
     second, which is what the reference does and what keeps the reading order
     sane when the two columns stack into one below `tab:`. */
  const half = Math.ceil(faq.items.length / 2);
  const columns = [faq.items.slice(0, half), faq.items.slice(half)];

  return (
    <section
      id="faq"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1128px] flex-col items-center gap-[clamp(32px,3.5vw,40px)] px-6 py-[clamp(64px,8vw,96px)]`}
      aria-label="Frequently asked questions"
    >
      {/* HEADER — 640 measure, centred, 12 between its two lines. */}
      <div className="flex w-full max-w-[640px] flex-col items-center gap-3">
        {/* The pill, in place of the rule-and-caps kicker the rest of the page
            uses. Its ground is a 4% ink tint rather than the reference's
            white/5 — that one is a lift off a dark card and would be invisible
            on paper, so the same idea is inverted to a wash. The dot carries the
            bright ramp because it is a filled shape, not text. */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/4 px-4 py-2 font-sans text-sm leading-5 text-ink-faint">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-[image:var(--grad)]" />
            {faq.kicker}
          </span>
        </Reveal>

        {/* The copy carries a hard \n at the gradient boundary — RevealText
            turns it into a <br>, so the plain half sits on line one and the
            marked half on line two rather than wherever the measure puts the
            turn. That is why there is no `text-balance` here: the break is
            already decided in lib/content.ts and balancing would fight it. */}
        <RevealText
          as="h2"
          text={faq.heading}
          className={`text-center font-display ${HEADING} font-bold leading-[1.05] tracking-[0.02em]`}
        />
      </div>

      {/* 16 between the columns and 16 between the rows in each — the
          reference's one number, used twice. Below `tab:` the two columns become
          one, and the 16 row gap carries straight through the join. */}
      <div className="flex w-full flex-col gap-4 tab:flex-row tab:items-start">
        {columns.map((column, c) => (
          <div key={c} className="flex flex-1 flex-col gap-4">
            {column.map((item, i) => (
              /* Stagger runs down each column independently and resets at the
                 top of the second, so no row waits longer than three steps. */
              <Reveal key={item.q} delay={i * 60}>
                <details className={ROW}>
                  <summary className={QUESTION}>
                    <span className="flex-1">{item.q}</span>
                    <span className={MARKER} aria-hidden="true">
                      <i className="absolute inset-0 m-auto h-[1.5px] w-4 rounded-full bg-current" />
                      <i className="absolute inset-0 m-auto h-4 w-[1.5px] rounded-full bg-current" />
                    </span>
                  </summary>
                  {/* The answer keeps the summary's 16 on three sides and takes
                      none on top: the summary's own bottom padding is already
                      there, so a `pt-4` here would open the row with 32 of air
                      between the question and its answer. */}
                  <p
                    className={`max-w-[52ch] text-pretty px-4 pb-4 font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}
                  >
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        ))}
      </div>

      {/* The reference has no CTA — it ends on the last row. This copy has one
          (`faq.cta`), and V1 puts it under the sticky head beside the list.
          There is no sticky head here, so it closes the section instead, which
          is where a "still not sure, ask us" button belongs anyway. It sits in
          the section's own 40 rhythm rather than getting a gap of its own. */}
      <Reveal delay={100}>
        <Button contact variant="light" withArrow>
          {faq.cta}
        </Button>
      </Reveal>
    </section>
  );
}

import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16, TEXT_SMALL } from "@/lib/ui";

const { faq } = content;

/* FAQ — V5. The matted-frame reference, in the same language as
   TestimonialsV5: a double-framed row, and WhyUsV5's header — a 36px regular
   serif-weight heading on a 1.44 leading, centred, with no kicker over it.
   The desktop values:

     SECTION   728 cap · 160 top and bottom · CENTRED · 56 header → list
     HEADER    580 measure · CENTRED
     HEADING   36px, leading 52 (1.44), REGULAR WEIGHT
     LIST      728 · 16 between rows
     ROW       A DOUBLE FRAME:
               outer  4 padding · 24 radius · NO FILL · 3.2 inset outline
               inner 28 padding · 24 radius · white · 3.2 inset outline
               16px MEDIUM question · a 16px marker, pushed to the right edge
     MARKER    a 1.8px round-capped cross, in the accent

   WHAT SEPARATES V5 FROM THE OTHER THREE FAQ VARIANTS:

     1. THE ROW IS A FRAME AROUND A FRAME. V2's row is a single pill, V3's a
        single square box, V4's a pair of hairlines; this one is two nested
        outlined boxes with 4px of the page showing between them.
     2. THE OUTER FRAME HAS NO FILL. TestimonialsV5's mat is filled with the
        panel's own tint so the gap reads as part of the frame; here nothing is
        painted at all and the page ground shows through the 4px channel. That
        is what makes this frame read as a bracket around the row rather than as
        a border on it.
     3. THE TWO RADIUSES ARE THE SAME — 24 and 24. TestimonialsV5's are
        CONCENTRIC (inner 12 plus the mat's 8 of padding is the mat's 20), and
        this one deliberately is not: strictly concentric would want the inner
        at 20. At 4px of padding the deviation is 4px of radius across a 24px
        corner, which does not read, and the reference sets both to 24. Worth
        knowing before "fixing" it to 20.
     4. IT IS THE NARROWEST AND THE DEEPEST BAND OF THE SET — a 728 measure
        against V2's and V3's 1128 and V4's 1280, and 160 of top and bottom
        against V4's 64. A single narrow column with a great deal of air, which
        is the whole posture of this reference.
     5. THE MARKER IS A STROKE, NOT A GLYPH OR A PAIR OF BARS. 1.8px, round
        capped, and it is the only ACCENT-COLOURED thing in the section — V2 and
        V3 keep their markers in muted ink until the row opens, and V4's is a
        typographic "+" in full ink. Here the mark is orange from the start.

   STILL NATIVE <details>. No state, no client boundary, and the accordion still
   opens if a script fails — the same reasoning as V1 through V4.

   NO KICKER, which is the reference's. `faq.kicker` is therefore not rendered
   in this variant — V2 puts it in a pill, V3 beside a square, V4 centred in
   mono, and this one drops it the way WhyUsV5 and TestimonialsV5 do. It still
   names the section for a screen reader, on the <section>'s label.

   THE REFERENCE ALSO CARRIES A SUB-HEADLINE under its heading, and
   `content.faq` has no such line — it has a kicker, a heading, a CTA and the
   items. Writing one is a copy decision rather than a layout one, so the header
   is the heading alone and the 24 that would sit under it is not spent. If a
   sub is written it goes in this file's header block in
   `SIZE_16 leading-6 text-ink-soft` with `gap-6` on the wrapper.

   The reference's #EB6F00 maps to `--color-rose`, this page's flame stop and
   the warm end of its ramp.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~728 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 28px on a 390 phone — the same pair WhyUsV5 and
   TestimonialsV5 use, which is what makes the three headings one heading. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* THE OUTER FRAME — the bracket. No fill, see note 2. `outline` rather than
   `border` because at 3.2px a border would push the inner frame in by 3.2 on
   every side and swallow the 4px channel that is the whole point of it. */
const MAT =
  "rounded-3xl p-1 outline outline-[3.2px] -outline-offset-[3.2px] outline-line " +
  "transition-[outline-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "has-[details[open]]:outline-rose/40 hover:outline-ink/15";

/* THE INNER FRAME — the row itself, and the <details>. Same 24 radius as the
   mat, see note 3. White rather than the reference's neutral-50: that is a
   faint lift off pure white, and the equivalent lift off this page's warm paper
   IS white. */
const PRINT =
  "group rounded-3xl bg-white p-7 " +
  "outline outline-[3.2px] -outline-offset-[3.2px] outline-ink/15 " +
  "transition-[outline-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "open:outline-rose/30";

const QUESTION =
  "flex w-full cursor-pointer list-none items-center justify-between gap-6 text-left " +
  `font-sans ${SIZE_16} font-medium leading-5 ` +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep active:opacity-60 [&::-webkit-details-marker]:hidden";

/* The 16px cross. Round-capped 1.8px bars — thicker than V2's and V3's 1.5 and
   softer at the ends, which is what the reference's `stroke-linecap="round"`
   asks for. It is `text-rose` from the start rather than turning accent on
   open; see note 5. */
const MARKER =
  "relative size-4 flex-none text-rose " +
  "transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-open:rotate-45";

export function FaqV5() {
  return (
    /* `px-6` is the page gutter, which the reference has no need of — its 728
       frame is a crop. Without it the rows would touch the edge of a phone. */
    <section
      id="faq"
      className={`${ANCHOR} px-6`}
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto flex w-full max-w-[728px] flex-col items-center gap-14 py-[clamp(80px,12vw,160px)]">
        {/* HEADER — a 580 measure, centred, and NO KICKER. */}
        <div className="flex w-full max-w-[580px] flex-col items-center">
          {/* Regular weight on a 1.44 leading — airy and editorial rather than
              tight and display.

              `text-balance` because this heading IS centred, and a centred
              heading with a ragged turn reads as a mistake rather than a
              choice. It does not fight the hard \n in the copy: RevealText
              turns that into a <br>, and balancing only redistributes what is
              left on each side of it. */}
          <RevealText
            as="h2"
            text={faq.heading}
            className={`text-balance text-center font-display ${HEADING} font-normal leading-[1.44] tracking-[-0.01em]`}
          />
        </div>

        {/* 16 between rows — the one gap in the list, and it is smaller than the
            row's own 28 of inner padding on purpose. The mat is what separates
            two rows here, not the space between them. */}
        <div className="flex w-full flex-col gap-4">
          {faq.items.map((item, i) => (
            /* Stagger caps at four steps: at 8 × 60ms the last row would still
               be arriving well after a reader reached it. */
            <Reveal key={item.q} delay={Math.min(i, 3) * 60}>
              <div className={MAT}>
                <details className={PRINT}>
                  <summary className={QUESTION}>
                    <span className="flex-1">{item.q}</span>
                    <span className={MARKER} aria-hidden="true">
                      <i className="absolute inset-0 m-auto h-[1.8px] w-4 rounded-full bg-current" />
                      <i className="absolute inset-0 m-auto h-4 w-[1.8px] rounded-full bg-current" />
                    </span>
                  </summary>
                  {/* 16 under the question. The row's own 28 closes the box
                      below it, so this is the only spacing the answer needs. */}
                  <p
                    className={`max-w-[62ch] text-pretty pt-4 font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}
                  >
                    {item.a}
                  </p>
                </details>
              </div>
            </Reveal>
          ))}
        </div>

        {/* The reference ends on the last row. This copy has a CTA, and with a
            centred header there is no side column to put it in — so it closes
            the section, on the same 56 the list opened with. */}
        <Reveal delay={100}>
          <Button contact variant="light" withArrow>
            {faq.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

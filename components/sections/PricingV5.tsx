import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16, TEXT_META, TEXT_SMALL } from "@/lib/ui";

const { pricing } = content;

/* PRICING — V5. The matted-frame reference, in the same language as
   TestimonialsV5 and FaqV5: a double-framed panel, and WhyUsV5's header — a
   36px regular heading on a 1.44 leading, centred, with no kicker over it.
   The desktop values:

     SECTION   728 cap · 160 top and bottom · CENTRED · 56 header → panel
     HEADER    580 measure · CENTRED · 24 between the heading and the body
     HEADING   36px, leading 52 (1.44), REGULAR WEIGHT
     PANEL     728 · A DOUBLE FRAME:
               outer  4 padding · 24 radius · NO FILL · 3.2 inset outline
               inner 28 padding · 24 radius · white · 3.2 inset outline
     ROW       16 top and bottom · hairline between, none above the first
               16px MEDIUM text · a 16px marker at the right edge
     MARKER    a 1.8px round-capped check, in the accent
     CLOSE     32 under the panel · CTA and footnote centred

   WHAT SEPARATES V5 FROM THE OTHER THREE PRICING VARIANTS:

     1. THE PANEL IS A FRAME AROUND A FRAME. V2's inclusion is a single card,
        V3's panel a single square box, V4's rows a pair of hairlines; this one
        is two nested outlined boxes with 4px of the page showing between them.
     2. THE OUTER FRAME HAS NO FILL. TestimonialsV5's mat is filled with the
        panel's own tint so the gap reads as part of the frame; here nothing is
        painted at all and the page ground shows through the 4px channel. That
        is what makes this frame read as a bracket around the quote rather than
        as a border on it.
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
     5. THE MARKER IS A STROKE, AND IT IS ACCENT-COLOURED FROM THE START.
        V2's and V3's checks are drawn in the deep pink but read as ink at 1.5px;
        V4's is a typographic glyph in a bordered squircle. Here it is 1.8px,
        round capped, and `text-rose` — the flame stop, and the only warm thing
        in the section.
     6. THERE IS NO KICKER. V2 puts it in a pill, V3 beside a square, V4
        centred in mono, and this one drops it the way WhyUsV5, TestimonialsV5
        and FaqV5 do. It still names the section for a screen reader, on the
        <section>'s label.

   THE HEADING'S HARD BREAK IS DOING MORE WORK HERE THAN ANYWHERE ELSE.
   `pricing.heading` carries a \n at the comma, and on a 580 measure at 36px the
   two halves land close to the same length — so the centred break reads as
   deliberate rather than as a wrap. That is the whole header: at this size,
   with no kicker above it and 160 of air around it, the two lines have to carry
   the band on their own.

   NO PRICE, and in this variant that is the least awkward it gets. A single
   framed panel presented as a quote card does not promise a figure the way
   V4's ruled table does — see the longer note there. `pricing.foot` still
   carries the clock under the CTA.

   The reference's #EB6F00 maps to `--color-rose`, this page's flame stop and
   the warm end of its ramp.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~728 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 28px on a 390 phone — the same pair WhyUsV5,
   TestimonialsV5 and FaqV5 use, which is what makes the four headings one
   heading. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* THE OUTER FRAME — the bracket. No fill, see note 2. `outline` rather than
   `border` because at 3.2px a border would push the inner frame in by 3.2 on
   every side and swallow the 4px channel that is the whole point of it. */
const MAT =
  "rounded-3xl p-1 outline outline-[3.2px] -outline-offset-[3.2px] outline-line " +
  "transition-[outline-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:outline-ink/15";

/* THE INNER FRAME — the panel itself. Same 24 radius as the mat, see note 3.
   White rather than the reference's neutral-50: that is a faint lift off pure
   white, and the equivalent lift off this page's warm paper IS white. */
const PRINT =
  "rounded-3xl bg-white p-7 " +
  "outline outline-[3.2px] -outline-offset-[3.2px] outline-ink/15";

/* THE CHECK — a 16px slot holding an L turned -45deg, which is a tick.

   THE TWO ARMS ARE DELIBERATELY UNEQUAL: 6px up-left and 11px up-right. Turned
   counter-clockwise, the bar that pointed up becomes the SHORT arm and the bar
   that pointed right becomes the LONG one, which is what distinguishes a tick
   from a V. Turning it the other way (+45) puts both arms on the right of the
   corner and draws a chevron instead.

   Round-capped 1.8px bars — thicker than V2's and V3's 1.5 and softer at the
   ends, which is what the reference's `stroke-linecap="round"` asks for. Two
   bars and a rotation rather than an inline SVG, the same way FaqV5 draws its
   cross. It is `text-rose` from the start; see note 5. */
const CHECK = "relative size-4 flex-none -rotate-45 text-rose";

export function PricingV5() {
  return (
    <section
      id="pricing"
      className={`${ANCHOR} mx-auto flex w-full max-w-[728px] flex-col items-center px-6 py-[clamp(80px,12vw,160px)]`}
      aria-label={pricing.kicker}
    >
      {/* HEADER — 580, centred, no kicker. */}
      <div className="flex w-full max-w-[580px] flex-col items-center">
        {/* REGULAR WEIGHT on a 1.44 leading, which is the loosest heading
            leading on the page and the reason this reads as a statement rather
            than as a title. No `text-balance`: the copy carries a hard \n and
            balancing would fight a break that is already decided. */}
        <RevealText
          as="h2"
          text={pricing.heading}
          className={`text-center font-display ${HEADING} font-normal leading-[1.44] tracking-[-0.01em]`}
        />

        <Reveal delay={80}>
          <p
            className={`mt-6 text-pretty text-center font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}
          >
            {pricing.body}
          </p>
        </Reveal>
      </div>

      {/* THE PANEL — 56 under the header, the reference's. */}
      <Reveal delay={120} className="mt-14 w-full">
        <div className={MAT}>
          <div className={PRINT}>
            <ul>
              {pricing.includes.map((item, i) => (
                /* The divider is set from the INDEX rather than from `first:`,
                   so the rule falls between rows and never above the first —
                   which would double up with the inner frame's own outline. */
                <li
                  key={item}
                  className={`flex items-center justify-between gap-6 py-4 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className={`font-sans ${SIZE_16} font-medium leading-5`}>{item}</span>
                  <span className={CHECK} aria-hidden="true">
                    <i className="absolute bottom-[4px] left-[3px] h-[6px] w-[1.8px] rounded-full bg-current" />
                    <i className="absolute bottom-[4px] left-[3px] h-[1.8px] w-[11px] rounded-full bg-current" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* THE CLOSE — 32 under the panel, centred. Tighter than the 56 above the
          panel on purpose: the CTA belongs to the quote it follows, and a
          matching 56 would leave it floating between the panel and whatever
          section comes next. */}
      <Reveal delay={160} className="mt-8 flex flex-col items-center gap-3">
        <Button contact variant="grad" withArrow>
          {pricing.cta}
        </Button>
        <p className={`font-sans ${TEXT_META} text-ink-faint`}>{pricing.foot}</p>
      </Reveal>
    </section>
  );
}

import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, CARD_GAP, SIZE_16, TEXT_META, TEXT_SMALL } from "@/lib/ui";

const { pricing } = content;

/* PRICING — V2. The two-column pill-row reference, this page's palette and
   copy. The fourth section built in this reference's language, after WhyUsV2,
   TestimonialsV2 and FaqV2 — same 1128 panel, same 40 between blocks, same pill
   kicker, same 48px centred heading. The desktop values:

     SECTION   1128 cap · 24 gutter · 96 top and bottom · 40 between blocks
     HEADER    640 measure · CENTRED · 12 between the pill and the heading
               · 24 between the heading and the body
     PILL      16 × 8, fully rounded, 14px label beside an 8px dot
     HEADING   48px, centred, leading 40 (0.83), tracking +0.02em
     GRID      4 cards · 2-up from `phone:` · 4-up from `lap:` · 32→48 between
     CARD      24 radius · 0.8 hairline · 20→28 padding · white
               16px MEDIUM title · 12 gap · a 16px round-capped check
     CLOSE     the CTA and its footnote, centred, in the section's own 40

   WHAT SEPARATES V2 FROM THE EXISTING Pricing.tsx:

     1. THE FOUR INCLUDES BECOME FOUR OBJECTS, NOT A CHECKLIST. V1 sets them as
        a ticked list down the right half of one big quote panel. Here each one
        is its own bordered card in a row of four, which is the move this
        reference makes everywhere else on the page — WhyUsV2's pillars and
        FaqV2's questions are the same shape at different sizes. It also fixes
        the thing V1's own comment complains about at length: there is no
        "enormous white slab" to split, because there is no slab.
     2. THERE IS NO CARD AROUND THE WHOLE SECTION. V1's entire content sits
        inside one bordered, shadowed, gradient-topped panel. This band has no
        outer container at all; the four small cards are the only boxes.
     3. THE HEADING IS 48px, NOT 64. V1 is one of two sections deliberately off
        the page's type ladder, on SIZE_64. This variant rejoins the reference's
        scale, which is the same 48 WhyUsV2, TestimonialsV2 and FaqV2 use — so
        the four bands read as one page rather than as three plus an outlier.
     4. THE KICKER IS A PILL, NOT A RULED CAPS LINE. V1 sets its kicker in
        Roboto at SIZE_16 behind a 2.2em hairline; this is the reference's
        filled pill with an 8px dot, identical to FaqV2's.

   THE GAP EXCEEDS THE PADDING, which took choosing numbers V1 and WhyUsV2 do
   not use. WhyUsV2's cards are padded 20→28 and sit 12 apart, which is the one
   place that page breaks its own rule; with only four cards here there is room
   to honour it, so the padding is 20→28 and the gap is CARD_GAP's 32→48. That
   is also why these read as four separate inclusions rather than as one banded
   strip, which matters more here than on a six-card grid: each of these is a
   distinct promise and grouping them visually would blur what is being bought.

   NO PRICE APPEARS, in this variant or any other. lib/content.ts's house rules
   forbid dollar amounts anywhere on this site and the copy's whole position is
   "priced to your brief, not a package" — so the section sells the terms and
   the turnaround, and `pricing.foot` carries the clock. See the note in
   PricingV4, which is the variant where the absence is most visible.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at 1128 and up, 32px on a 390 phone — the pair every 48px variant in
   this set uses. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* THE CARD. Same shape as FaqV2's row at a larger padding: 24 radius, the 0.8
   hairline, white on paper.

   The lift is 4px rather than WhyUsV2's, and it can be: these four sit 32→48
   apart, so a rise on one comes nowhere near the card beside it. `h-full` is
   what keeps the four the same height when one title turns to two lines. */
const CARD =
  "flex h-full items-start gap-3 rounded-3xl border-[0.8px] border-line bg-white " +
  "p-[clamp(20px,2vw,28px)] " +
  "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow)]";

/* THE CHECK — a 16px slot holding an L turned -45deg, which is a tick.

   THE TWO ARMS ARE DELIBERATELY UNEQUAL: 6px up-left and 11px up-right. Turned
   counter-clockwise, the bar that pointed up becomes the SHORT arm and the bar
   that pointed right becomes the LONG one, which is what distinguishes a tick
   from a V. Turning it the other way (+45) puts both arms on the right of the
   corner and draws a chevron instead.

   Two bars and a rotation rather than an icon import or an inline SVG, the same
   way FaqV2 draws its plus. The caps are ROUND here, matching FaqV2's rounded
   bars; V3's are square, for the reason its own file gives. The colour is the
   deep pink rather than the bright ramp: this is a stroke, not a filled shape,
   and `--grad`'s flame stop drops to about 2.4:1 as ink on paper. */
const CHECK = "relative size-4 flex-none -rotate-45 text-pink-deep";

export function PricingV2() {
  return (
    <section
      id="pricing"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1128px] flex-col items-center gap-[clamp(32px,3.5vw,40px)] px-6 py-[clamp(64px,8vw,96px)]`}
      aria-label={pricing.kicker}
    >
      {/* HEADER — 640 measure, centred. 12 under the pill, 24 under the
          heading: the two gaps are deliberately different sizes so the pill
          binds to the heading and the body reads as the block under both. */}
      <div className="flex w-full max-w-[640px] flex-col items-center gap-3">
        {/* The pill. Its ground is a 4% ink tint rather than the reference's
            white/5 — that one is a lift off a dark card and would be invisible
            on paper, so the same idea is inverted to a wash. The dot carries
            the bright ramp because it is a filled shape, not text. */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/4 px-4 py-2 font-sans text-sm leading-5 text-ink-faint">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-[image:var(--grad)]" />
            {pricing.kicker}
          </span>
        </Reveal>

        {/* The copy carries a hard \n at the comma — RevealText turns it into a
            <br>, so "Priced to your brief," sits on line one and the marked
            half on line two rather than wherever the measure puts the turn.
            That is why there is no `text-balance`: the break is already decided
            in lib/content.ts and balancing would fight it. */}
        <RevealText
          as="h2"
          text={pricing.heading}
          className={`text-center font-display ${HEADING} font-bold leading-[1.05] tracking-[0.02em]`}
        />

        <Reveal delay={80} className="mt-3">
          <p className={`text-pretty text-center font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}>
            {pricing.body}
          </p>
        </Reveal>
      </div>

      {/* THE FOUR INCLUDES. 2-up from `phone:` and 4-up from `lap:` — never
          three, because four items in a three-column grid leaves one stranded
          on its own row. Below `phone:` they stack, and the same 32→48 carries
          through the join. */}
      <ul className={`grid w-full grid-cols-1 ${CARD_GAP} phone:grid-cols-2 lap:grid-cols-4`}>
        {pricing.includes.map((item, i) => (
          <li key={item} className="h-full">
            <Reveal delay={i * 60} className="h-full">
              <div className={CARD}>
                <span className={CHECK} aria-hidden="true">
                  <i className="absolute bottom-[4px] left-[3px] h-[6px] w-[1.5px] rounded-full bg-current" />
                  <i className="absolute bottom-[4px] left-[3px] h-[1.5px] w-[11px] rounded-full bg-current" />
                </span>
                <span className={`font-sans ${SIZE_16} font-medium leading-5`}>{item}</span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* THE CLOSE. The CTA and its footnote sit in the section's own 40 rather
          than getting a gap of their own, the same way FaqV2 closes. */}
      <Reveal delay={100} className="flex flex-col items-center gap-3">
        <Button contact variant="grad" withArrow>
          {pricing.cta}
        </Button>
        <p className={`font-sans ${TEXT_META} text-ink-faint`}>{pricing.foot}</p>
      </Reveal>
    </section>
  );
}

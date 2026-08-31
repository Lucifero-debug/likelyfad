import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16, TEXT_META, TEXT_SMALL } from "@/lib/ui";

const { pricing } = content;

/* PRICING — V3. The split head-and-list reference, in the same language as
   WhyUsV3, TestimonialsV3 and FaqV3: left aligned, square cornered, a mono
   kicker with a square dot, and a 36px regular heading. The desktop values:

     SECTION   1128 cap · 24 gutter · 96 top and bottom
     SPLIT     two equal columns · 40 between them · both top aligned
     HEAD      520 · 12 between the kicker and the heading · 24 → body
               · 12 → CTA · 12 → footnote
     KICKER    14px mono, uppercase, semibold · 6px SQUARE dot · 6 gap · no pill
     HEADING   36px, left, leading 40 (1.11), REGULAR WEIGHT
     PANEL     520 · 16→20 padding · NO RADIUS · 0.8 hairline · white
               closed by a 1.6px gradient rule along the bottom
     ROW       16 top and bottom · hairline between, none above the first
               16px MEDIUM text · 12 gap · a 16px SQUARE-capped check

   WHAT SEPARATES V3 FROM PricingV2:

     1. IT IS A SPLIT, NOT A STACK. V2 centres a header over a row of four
        cards; this puts the whole argument in one column and the whole
        inclusion list in the other, 50/50. So the four includes read as ONE
        list — a spec sheet for the quote described on the left — rather than as
        four separate objects, which is the thing V2 gives up to make them
        cards.
     2. SQUARE CORNERS. V2's cards carry a 24 radius; there is no radius
        anywhere in this section, and the 0.8 hairline is the only thing that
        bounds the panel.
     3. THE FOUR ARE ROWS INSIDE ONE PANEL, NOT FOUR PANELS. Which is why they
        need no gap between them: a hairline divides each from the next and the
        panel's own border closes the set. V2 needs 32→48 of air between its
        cards for exactly the reason this needs none.
     4. THE KICKER IS MONO AND BARE — a 6px square and 14px uppercase, where V2
        uses a filled pill. Same distinction WhyUsV3 draws against WhyUsV2.
     5. THE HEADING IS 36px REGULAR, not 48px bold.
     6. THE CTA IS IN THE HEAD COLUMN, not under the whole band. It is the last
        thing in the argument rather than a closing move, which is what having
        a head column buys — and it is also where the existing Pricing.tsx puts
        it, under the body copy rather than after the list.

   THE ACCENT RULE IS ON THE PANEL, NOT ON EVERY ROW. WhyUsV3 and
   TestimonialsV3 close each of their cards with a 1.6px gradient rule; FaqV3
   drops it entirely because eight stacked rows would put eight bright lines
   down one column. There is one panel here, so it takes exactly one rule —
   which keeps the reference's signature without the pile-up FaqV3 avoids.

   THE HEADING IS LEFT ALIGNED AND SO IS THE HARD BREAK. `pricing.heading`
   carries a \n at the comma, which RevealText turns into a <br>. In V2 that
   break is centred and reads as a balanced two-line title; here both lines
   start at the same x, which is what makes it read as a statement rather than
   as a title. Same string, different posture, no copy change.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 28px on a 390 phone — the same pair WhyUsV3,
   TestimonialsV3 and FaqV3 use, which is what makes the four headings one
   heading. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* THE PANEL. Square, hairlined, and closed at the bottom by the gradient rule.

   `pb-[calc(...)]` is not decoration: the rule is an absolutely positioned
   child, so it sits OVER the padding box rather than adding to it, and without
   the extra 1.6 at the bottom the last row's underline would touch it. */
const PANEL =
  "group relative overflow-hidden border-[0.8px] border-line bg-white " +
  "p-[clamp(16px,1.6vw,20px)] pb-[calc(clamp(16px,1.6vw,20px)+1.6px)] " +
  "transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink/15 hover:shadow-[var(--shadow-sm)]";

/* The accent rule. Its own element rather than a border so it can carry the
   brand ramp, which a border-color cannot. */
const RULE =
  "pointer-events-none absolute inset-x-0 bottom-0 h-[1.6px] bg-[image:var(--grad)] " +
  "transition-[height] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "group-hover:h-[2.4px]";

/* THE CHECK — a 16px slot holding an L turned -45deg, which is a tick.

   THE TWO ARMS ARE DELIBERATELY UNEQUAL: 6px up-left and 11px up-right. Turned
   counter-clockwise, the bar that pointed up becomes the SHORT arm and the bar
   that pointed right becomes the LONG one, which is what distinguishes a tick
   from a V. Turning it the other way (+45) puts both arms on the right of the
   corner and draws a chevron instead.

   Its bars are SQUARE-ended rather than rounded: in a section with no radius
   anywhere, a rounded cap on a 1.5px bar is the one soft edge on the band. The
   same call FaqV3 makes against FaqV2. */
const CHECK = "relative size-4 flex-none -rotate-45 text-pink-deep";

export function PricingV3() {
  return (
    <section
      id="pricing"
      className={`${ANCHOR} mx-auto w-full max-w-[1128px] px-6 py-[clamp(64px,8vw,96px)]`}
      aria-label={pricing.kicker}
    >
      {/* THE SPLIT — 50/50 and top aligned, 40 apart. `items-start` so the head
          column keeps its own height instead of stretching to the panel's;
          below `tab:` the two stack and the head simply sits above the list,
          which is the same order it is read in. */}
      <div className="flex flex-col gap-10 tab:flex-row tab:items-start">
        <div className="flex flex-1 flex-col items-start gap-3">
          {/* Mono, uppercase, semibold, 14px, with a 6px SQUARE mark and no
              added tracking. The square rhymes with the panel's corners;
              `--grad` and not `--grad-ink` because it is a filled shape, not
              text, so the bright cut is the correct one. */}
          <Reveal>
            <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold uppercase leading-5 text-pink-deep">
              <span aria-hidden className="size-1.5 shrink-0 bg-[image:var(--grad)]" />
              {pricing.kicker}
            </span>
          </Reveal>

          {/* REGULAR WEIGHT. `leading-[1.11]` is the reference's 40-on-36 kept
              as a ratio so it travels down the clamp. No `text-balance`: the
              copy carries a hard \n and balancing would fight it. */}
          <RevealText
            as="h2"
            text={pricing.heading}
            className={`font-display ${HEADING} font-normal leading-[1.11] tracking-[-0.01em]`}
          />

          {/* `mt-3` rather than a larger gap on the wrapper: the 12 above
              belongs between the kicker and the heading, and raising the gap
              would apply it to all three seams. */}
          <Reveal delay={80} className="mt-3">
            <p className={`max-w-[52ch] text-pretty font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}>
              {pricing.body}
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-3 flex flex-col items-start gap-3">
            <Button contact variant="grad" withArrow>
              {pricing.cta}
            </Button>
            <p className={`font-sans ${TEXT_META} text-ink-faint`}>{pricing.foot}</p>
          </Reveal>
        </div>

        {/* THE PANEL — one box, four rows, in copy order. */}
        <div className="flex-1">
          <Reveal delay={100}>
            <div className={PANEL}>
              <ul>
                {pricing.includes.map((item, i) => (
                  /* The divider is set from the INDEX rather than from
                     `first:`, so the rule falls between rows and never above
                     the first one — which would double up with the panel's own
                     top border. */
                  <li
                    key={item}
                    className={`flex items-start gap-3 py-4 ${i > 0 ? "border-t border-line" : ""}`}
                  >
                    <span className={CHECK} aria-hidden="true">
                      <i className="absolute bottom-[4px] left-[3px] h-[6px] w-[1.5px] bg-current" />
                      <i className="absolute bottom-[4px] left-[3px] h-[1.5px] w-[11px] bg-current" />
                    </span>
                    <span className={`font-sans ${SIZE_16} font-medium leading-5`}>{item}</span>
                  </li>
                ))}
              </ul>
              <span aria-hidden="true" className={RULE} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

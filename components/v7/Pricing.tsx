import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import {
  ANCHOR,
  DISPLAY,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_14,
  T_17,
  T_44,
  WRAP,
} from "@/lib/v7/theme";
import { PinnedCard } from "./PinnedCard";

/* ============================================================================
   PRICING — the existing structure, kept exactly as it is.

   THE BRIEF SAYS KEEP IT AND THE BRIEF IS RIGHT. lib/content.ts already
   answers this the way a service business has to: every brand's scope differs,
   so the page promises a fixed quote rather than publishing a number. That is
   also a house rule at the top of that file — no dollar amounts anywhere on
   this site — and it is the rule that stops a page like this writing a cheque
   its scoping call then has to cash. Nothing is invented here: the heading,
   the body, the four inclusions, the CTA and the closing line are all the
   copy that exists.

   IT IS ONE CARD, NOT THREE. Three tiers is the shape a page reaches for when
   it has three prices, and this one does not have any. A single sheet is also
   the correct object on a wall full of cards: a quote is one document, and
   splitting it into a row of three would imply a choice the visitor does not
   actually get to make on this page.

   IT IS NOT TILTED AND IT IS NOT PINNED. Every other card on the wall is one
   of several; this is the only object in its section, so a pin would be
   decoration with nothing to hold and an angle on a card this large reads as a
   rendering fault rather than as a hand placing it.

   THE HARD BREAK IN THE HEADING IS DATA, NOT LAYOUT. content.pricing.heading
   carries a \n at the comma because the turn is the point the line makes, so
   it is set there rather than left to whatever the measure happens to do at a
   given width. whitespace-pre-line is what honours it.
   ========================================================================== */
export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="v7-pricing-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>{content.pricing.kicker}</p>

        <h2
          id="v7-pricing-title"
          className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] whitespace-pre-line text-mark`}
        >
          {content.pricing.heading.replace(/\*/g, "")}
        </h2>

        <PinnedCard className="mt-[48px]">
          <div className="grid gap-[48px] lap:grid-cols-[1fr_1fr]">
            <div>
              <p className={`${T_17} max-w-[52ch] text-note`}>{content.pricing.body}</p>

              <div className="mt-[32px] flex flex-wrap items-center gap-[24px]">
                <a
                  href={contactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${MONO} ${T_12} inline-block rounded-[999px] bg-cue px-[32px] py-[16px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
                >
                  {content.pricing.cta}
                </a>

                <p className={`${MONO} ${T_12} text-note`}>{content.pricing.foot}</p>
              </div>
            </div>

            {/* No tick glyphs. A column of check marks would be the only
                iconography in this section, and the hairline rows already say
                "list" in the language every other part of the page speaks. */}
            <ul className={`${T_14} border-t border-hair`}>
              {content.pricing.includes.map((line) => (
                <li key={line} className="border-b border-hair py-[16px] text-mark">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </PinnedCard>
      </div>
    </section>
  );
}

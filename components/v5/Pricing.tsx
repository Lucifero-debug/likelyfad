import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { SECTIONS } from "@/lib/v5/data";
import { ANCHOR, DISPLAY, HEAD_GAP, MONO, SECTION, T_12, T_15, T_32, WRAP } from "@/lib/v5/theme";
import { SectionHead } from "./SectionHead";

/* ============================================================================
   PRICING — the existing structure, in the reference's framing.

   THE ONE PLACE THE BRIEF ASKS FOR SOMETHING THE REPO CANNOT HONESTLY GIVE, so
   this is written out rather than quietly resolved. The brief says to keep the
   existing structure AND to present it as productized tiers rather than custom
   quotes. Those pull apart: lib/content.ts says in as many words "Priced to
   your brief, not a package", and the house rules at the top of that file
   forbid dollar amounts anywhere on this site. A Starter / Professional /
   Elite ladder is three invented names over three invented numbers, which is
   the kind of thing a landing page can fake and a service business cannot.

   WHAT IS TAKEN FROM THE REFERENCE IS THE FRAMING, WHICH IS THE PART THAT
   ACTUALLY SUITS US. Fuel's pitch is pick a plan, submit a job request, work
   kicks off within 24 hours — a defined thing you buy and a clock that starts.
   That survives without a price ladder: the section is set out as an order
   form, the deliverables are listed as what the order includes, and the clock
   is stated. The existing copy carries all of it unchanged.

   TO PUT REAL TIERS HERE, add them to lib/content.ts with real numbers and a
   real scope each, and this section becomes a three-column grid of the same
   include-lists. The structure below does not have to change to allow it.

   THE INCLUDES LIST HAS NO TICKS. A column of check glyphs would be the only
   iconography on the page, and the hairline rows already say "list" in the
   language every other section on this page speaks.
   ========================================================================== */
export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="v5-head-pricing"
      className={`${SECTION} ${ANCHOR} bg-white`}
    >
      <div className={WRAP}>
        <SectionHead
          index={SECTIONS.pricing.index}
          name={SECTIONS.pricing.name}
          id="v5-head-pricing"
        />

        {/* The panel is the one raised surface on the page, and it earns it:
            this is the section a visitor scrolls back up to find. Padded 32 on
            a phone and 48 from tab up, with the two columns 48 apart, so the
            gap between them is never under the padding inside either. */}
        <div
          className={`${HEAD_GAP} grid gap-[48px] rounded-[12px] bg-stock p-[32px] tab:grid-cols-2 tab:p-[48px]`}
        >
          <div>
            {/* The heading in lib/content.ts carries a hard \n at the comma and
                asterisks around the half the homepage runs as a gradient. This
                page has no gradient in its type outside the hero wordmark, so
                both markers are stripped and the line is set plain. */}
            <h3 className={`${DISPLAY} ${T_32} max-w-[18ch] text-press`}>
              {content.pricing.heading.replace(/\n/g, " ").replace(/\*/g, "")}
            </h3>

            <p className={`${T_15} mt-[24px] max-w-[46ch] text-lead`}>{content.pricing.body}</p>

            <div className="mt-[32px]">
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${MONO} ${T_12} inline-block bg-cue px-[16px] py-[12px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
              >
                {content.pricing.cta}
              </a>
              <p className={`${MONO} ${T_12} mt-[16px] text-lead`}>{content.pricing.foot}</p>
            </div>
          </div>

          <div>
            <h4 className={`${MONO} ${T_12} text-lead`}>What&rsquo;s included</h4>

            <ul className={`${T_15} mt-[16px] border-t border-crease`}>
              {content.pricing.includes.map((line) => (
                <li key={line} className="border-b border-crease py-[16px] text-press">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

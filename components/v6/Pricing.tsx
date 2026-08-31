import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { PRICING_FOOT, TIERS } from "@/lib/v6/data";
import { ANCHOR, CARD, HEAD_GAP, MONO, SECTION, SERIF, SERIF_400, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v6/theme";

/* ============================================================================
   PRICING — productized tiers, and the one place this brief and this repo pull
   against each other. The resolution is written out in lib/v6/data.ts rather
   than quietly applied; the short version is that a tier is a defined SCOPE
   with a defined CLOCK, and neither of those requires a price to exist.

   WHAT IS REFUSED is the invented part: three made-up monthly figures under
   three made-up names. The house rules at the top of lib/content.ts forbid
   dollar amounts anywhere on this site, and a service business that publishes
   a number it has not decided is writing a cheque its scoping call has to
   cash. Every scope in TIERS is sourced from copy that already exists — the
   refund from the FAQ, the 20-to-40 variants from the why-us pillars, the
   retainer from content.pricing.body, 48 hours from everywhere.

   THE TURNAROUND IS THE ROW THE PRICE WOULD HAVE BEEN, and it is deliberately
   in that position: at the top of the card, set apart, where a visitor
   scanning three tiers expects to find the number. It is the thing that
   actually differs between these tiers and it is the thing we can state
   without inventing anything.

   ONE TIER IS FEATURED. Three tiers with nothing chosen makes the reader do
   the work; the middle one carries a quiet marker because it is the one most
   brands land on, which content.pricing.body already says in as many words.
   The marker is a border and a label, not a colour — the accent is spent.
   ========================================================================== */
export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="v6-pricing-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-haze`}>Pricing</p>

        <h2
          id="v6-pricing-title"
          className={`${SERIF} ${T_40} ${HEAD_GAP} max-w-[20ch] text-beam`}
        >
          Pick the scope. The clock starts the same day.
        </h2>

        <p className={`${T_14} mt-[24px] max-w-[58ch] text-haze`}>{content.pricing.body}</p>

        {/* 48 between cards padded 32, same as the bento grid — the two
            sections agree about how far apart boxed things sit. */}
        <ul className="mt-[64px] grid gap-[48px] lap:grid-cols-3">
          {TIERS.map((tier) => (
            <li
              key={tier.name}
              className={`${CARD} flex flex-col ${tier.featured ? "border-haze" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-[16px]">
                <h3 className={`${SERIF_400} ${T_24} text-beam`}>{tier.name}</h3>
                {tier.featured && (
                  <span className={`${MONO} ${T_12} shrink-0 text-haze`}>Most brands</span>
                )}
              </div>

              {/* Where the price would be. See the note above. */}
              <p className={`${MONO} ${T_12} mt-[16px] border-t border-edge pt-[16px] text-beam`}>
                {tier.turnaround}
              </p>

              <p className={`${T_14} mt-[24px] text-haze`}>{tier.scope}</p>

              {/* No tick glyphs. A column of check marks would be the only
                  iconography on the page, and the hairline rows already say
                  "list" in the language every other section speaks. */}
              <ul className={`${T_14} mt-[32px] border-t border-edge`}>
                {tier.includes.map((line) => (
                  <li key={line} className="border-b border-edge py-[12px] text-beam">
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-[32px]">
                <a
                  href={contactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${MONO} ${T_12} inline-block rounded-[999px] border border-edge px-[24px] py-[12px] text-beam transition-colors duration-200 hover:border-haze`}
                  /* Three identical CTAs on one screen need distinguishing for
                     anyone tabbing or listing links, or they all read as
                     "Start". The visible label stays short. */
                  aria-label={`${content.pricing.cta} for the ${tier.name} scope`}
                >
                  {content.pricing.cta}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p className={`${MONO} ${T_12} mt-[48px] text-haze`}>{PRICING_FOOT}</p>
      </div>
    </section>
  );
}

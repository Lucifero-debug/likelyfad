import { content } from "@/lib/content";
import { ANCHOR, DISPLAY, MONO, SECTION, T_12, T_14, T_17, T_40, WRAP } from "@/lib/v3/theme";
import { CtaButton } from "./CtaButton";

/* ============================================================================
   PRICING — the structure the current site already uses, unchanged: no tiers,
   no comparison table, one quote against one brief. Inventing a package ladder
   here would be a design decision pretending to be a business one, and it
   would be the second thing on this page claiming we are a SaaS product.

   THE INCLUDES LIST HAS NO TICKS. A column of check glyphs is the default
   furniture of a pricing card, and the page already has a language for "these
   are separate items": the hairline. Four rules cost nothing and do not import
   an icon set to say `and`.

   PADDED 48, GAPPED 48. The two columns inside this card never sit closer to
   each other than the card's own padding, which is the one place on the page
   where that rule has to be stated rather than inherited from the grid.
   ========================================================================== */
export function Pricing() {
  return (
    <section id="pricing" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <div className="rounded-[24px] bg-raised p-[32px] phone:p-[48px] lap:grid lap:grid-cols-2 lap:gap-[48px]">
          <div>
            <p className={`${MONO} ${T_12} text-stone`}>{content.pricing.kicker}</p>
            <h2 className={`${DISPLAY} ${T_40} mt-[16px] text-balance text-graphite`}>
              Priced to your brief, not a package.
            </h2>
            <p className={`${T_17} mt-[24px] max-w-[46ch] text-stone`}>{content.pricing.body}</p>
          </div>

          <div className="mt-[48px] lap:mt-0">
            <ul className={`${T_17} border-t border-graphite/10`}>
              {content.pricing.includes.map((line) => (
                <li key={line} className="border-b border-graphite/10 py-[16px] text-graphite">
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-[32px] flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
              <CtaButton label={content.pricing.cta} />
              <p className={`${T_14} text-stone`}>{content.pricing.foot}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

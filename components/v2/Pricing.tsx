import { content } from "@/lib/content";
import {
  ANCHOR,
  CORNER,
  DISPLAY,
  MONO,
  SECTION,
  T_12,
  T_14,
  T_17,
  T_40,
  WRAP,
} from "@/lib/v2/theme";
import { CtaButton } from "./CtaButton";
import { SplitHeading } from "./SplitHeading";

/* ============================================================================
   PRICING — the structure the current site already uses, unchanged: no tiers,
   no table, one quote against one brief. Inventing a package ladder here would
   have been a design decision pretending to be a business one, and it would be
   the third thing on this page claiming to be a SaaS product.

   THE ONE RAISED SURFACE ON THE PAGE. #1C1A19 appears here and nowhere else,
   which is what makes it read as raised rather than as a second background
   colour. Every other section sits directly on the stage and is divided by
   hairlines.

   THE INCLUDES LIST HAS NO TICKS. A column of check glyphs is the default
   furniture of a pricing card, and this page already has a language for
   "these are separate items": the hairline. Four rules cost nothing, repeat a
   device the reader has met four sections running, and do not import an icon
   set to say "and".
   ========================================================================== */
export function Pricing() {
  return (
    <section id="pricing" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <div
          className={`${CORNER} border border-rule bg-riser p-[32px] phone:p-[48px] lap:grid lap:grid-cols-2 lap:gap-[48px]`}
        >
          <div>
            <p className={`${MONO} ${T_12} text-dim`}>{content.pricing.kicker}</p>
            <h2 className={`${DISPLAY} ${T_40} mt-[16px] text-balance`}>
              <SplitHeading raw={content.pricing.heading} />
            </h2>
            <p className={`${T_17} mt-[24px] max-w-[46ch] text-dim`}>{content.pricing.body}</p>
          </div>

          {/* 48 from the column beside it at lap, 48 below it before that. The
              card's own padding is 48, and this is the one place on the page
              where two blocks share a padded container, so the gap matches it
              rather than undercutting it. */}
          <div className="mt-[48px] lap:mt-0">
            <ul className={`${T_17} border-t border-rule`}>
              {content.pricing.includes.map((line) => (
                <li key={line} className="border-b border-rule py-[16px] text-lit">
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-[32px] flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
              <CtaButton label={content.pricing.cta} />
              <p className={`${T_14} text-dim`}>{content.pricing.foot}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

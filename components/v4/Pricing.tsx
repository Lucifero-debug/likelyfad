import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, T_15, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   PRICING — the structure the current site already uses, restyled to the flat
   scale: no tiers, no comparison table, one quote against one brief. Inventing
   a package ladder would be a design decision pretending to be a business one,
   and it would be the second thing on this page implying we are a SaaS product.

   NO CARD. The other two directions put this on a raised surface, because they
   have a size ramp and a card is just one more level of it. Here a filled
   panel would be the only fill on the whole page and pricing would become the
   loudest section on it, which is the wrong thing to shout on a page whose
   argument is the work.

   THE INCLUDES LIST HAS NO TICKS, for the same reason it has no card: a column
   of check glyphs would be the only iconography in view. Four hairlines say
   the same thing in the same language as the services list and the process.

   THE CTA HERE IS NOT THE ACCENT. The persistent magenta button in the corner
   is one of exactly two accents on this page, and a second magenta button in
   the middle of the document would make it three and dilute all of them. This
   one is a plain underlined link, which is also the honest shape: it goes to
   the same DM as everything else.
   ========================================================================== */
export function Pricing() {
  return (
    <section id="pricing" className={`${SECTION} ${ANCHOR} border-t border-seam`}>
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 className={`${MONO} ${T_12} text-ash`}>Pricing</h2>

          <div className="max-w-[62ch]">
            <p className={`${T_15} text-carbon`}>Priced to your brief, not a package.</p>
            <p className={`${T_13} mt-[12px] text-ash`}>{content.pricing.body}</p>

            {/* 48 from the paragraph above, which is four times the 12 inside
                the paragraph block. The list is a different kind of thing and
                the spacing has to say so without a size change to help. */}
            <ul className={`${T_13} mt-[48px] border-t border-seam`}>
              {content.pricing.includes.map((line) => (
                <li key={line} className="border-b border-seam py-[12px] text-carbon">
                  {line}
                </li>
              ))}
            </ul>

            <p className={`${T_13} mt-[24px] text-ash`}>
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-carbon underline underline-offset-4 decoration-seam transition-colors duration-200 hover:decoration-carbon"
              >
                {content.pricing.cta}
              </a>{" "}
              · {content.pricing.foot}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

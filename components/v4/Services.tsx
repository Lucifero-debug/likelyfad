import { SERVICES } from "@/lib/v4/data";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, T_15, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   SERVICES — a plain list. No cards, no icons.

   THAT IS NOT A STYLISTIC PREFERENCE ON THIS PAGE. With a flat type scale
   there is nothing bigger than anything else, so the first filled shape to
   appear becomes the loudest thing in view by default. Four cards here would
   out-shout the studio statement, the work and the CTA all at once, and a
   service list is not what this page is arguing. Four hairlines cost nothing
   and say the same thing.

   The name is set in the ink and the line under it in the secondary, which is
   the whole hierarchy: two values, one rule, repeated four times.
   ========================================================================== */
export function Services() {
  return (
    <section id="services" className={`${SECTION} ${ANCHOR} border-t border-seam`}>
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 className={`${MONO} ${T_12} text-ash`}>Services</h2>

          <ul className="border-t border-seam">
            {SERVICES.map((service) => (
              <li
                key={service.name}
                className="flex flex-col gap-[4px] border-b border-seam py-[16px] phone:flex-row phone:gap-[24px]"
              >
                <h3 className={`${T_15} text-carbon phone:w-[120px] phone:shrink-0`}>
                  {service.name}
                </h3>
                <p className={`${T_13} text-ash`}>{service.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

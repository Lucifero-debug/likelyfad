import { content } from "@/lib/content";
import { OBJECTIONS } from "@/lib/v4/data";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, T_15, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   WHY US — three claims as running text, and deliberately NOT numbered.

   These are independent reasons. A reader who takes them in a different order
   has lost nothing, so 01 / 02 / 03 would be decoration wearing the costume of
   information, and it would assert something false: that there is a sequence
   here. Process, directly below, IS numbered, for exactly the opposite reason.

   BUT SOMETHING HAS TO HOLD THEM, and on this page that pressure is sharper
   than on the other two directions. Elsewhere a claim gets a 24px title and
   the size does the separating. Here every word is the same size, so three
   untitled paragraphs would read as one long one. The device is the QUESTION
   each claim answers, set in the mono that marks every label on this page —
   which encodes something true, that each of these exists because a buyer
   raises it, without implying an order that is not there.

   THREE, NOT SIX. lib/content.ts carries six pillars and the homepage shows
   all of them. Three is the brief's call and the better one: the fourth
   through sixth are real, but they are the reasons you keep reading, not the
   reasons you get in touch.
   ========================================================================== */
export function WhyUs() {
  const pillars = content.why.pillars.slice(0, 3);

  return (
    <section aria-labelledby="why-heading" className={`${SECTION} ${ANCHOR} border-t border-seam`}>
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 id="why-heading" className={`${MONO} ${T_12} text-ash`}>
            Why us
          </h2>

          {/* 48 between the claims, and each claim's own internal steps are 8
              and 12. The gap is four times the largest space inside a block,
              which is what makes three same-sized paragraphs read as three
              things — there is no size contrast here to do it instead. */}
          <ul className="flex flex-col gap-[48px]">
            {pillars.map((pillar, i) => (
              <li key={pillar.title} className="max-w-[62ch]">
                <p className={`${MONO} ${T_12} text-ash`}>{OBJECTIONS[i]}</p>
                <h3 className={`${T_15} mt-[12px] text-carbon`}>{pillar.title}</h3>
                <p className={`${T_13} mt-[8px] text-ash`}>{pillar.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { content } from "@/lib/content";
import { OBJECTIONS } from "@/lib/v3/data";
import { ANCHOR, DISPLAY, HEAD_GAP, MONO, SECTION, T_12, T_17, T_24, T_40, WRAP } from "@/lib/v3/theme";

/* ============================================================================
   WHY US — three claims, and deliberately NOT numbered.

   These are independent reasons. A reader who takes them in a different order
   has lost nothing, so 01 / 02 / 03 would be decoration wearing the costume of
   information, and it would assert something false: that there is a sequence
   here. Process is numbered for the exact opposite reason.

   BUT SOMETHING HAS TO HOLD THEM. Strip the numbering and three claims read as
   a run of loose paragraphs. The device that replaces it is the QUESTION each
   claim answers, which encodes something true — every one of these exists
   because a buyer raises it — without implying an order that is not there.

   THREE, NOT SIX. lib/content.ts carries six pillars and the homepage shows
   all of them. Three is the brief's call and the better one: the fourth
   through sixth are real, but they are the reasons you keep reading, not the
   reasons you get in touch.
   ========================================================================== */
export function WhyUs() {
  const pillars = content.why.pillars.slice(0, 3);

  return (
    <section id="why" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <p className={`${MONO} ${T_12} text-stone`}>{content.why.kicker}</p>
          <h2 className={`${DISPLAY} ${T_40} mt-[16px] max-w-[18ch] text-balance text-graphite`}>
            The reason brands actually keep us.
          </h2>
          <p className={`${T_17} mt-[24px] max-w-[58ch] text-stone`}>{content.why.lead}</p>
        </div>

        <ul className="grid gap-x-[48px] gap-y-[48px] tab:grid-cols-3">
          {pillars.map((pillar, i) => (
            <li key={pillar.title}>
              <p className={`${MONO} ${T_12} text-stone`}>{OBJECTIONS[i]}</p>
              <h3 className={`${DISPLAY} ${T_24} mt-[24px] text-balance text-graphite`}>
                {pillar.title}
              </h3>
              <p className={`${T_17} mt-[16px] text-stone`}>{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

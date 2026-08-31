import { content } from "@/lib/content";
import { OBJECTIONS } from "@/lib/v2/data";
import {
  ANCHOR,
  DISPLAY,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_17,
  T_24,
  T_40,
  WRAP,
} from "@/lib/v2/theme";
import { SplitHeading } from "./SplitHeading";

/* ============================================================================
   WHY US — three claims, and deliberately NOT numbered.

   These are independent reasons. A reader who takes them in a different order
   has lost nothing, so 01 / 02 / 03 would be decoration wearing the costume of
   information, and it would say something false: that there is a sequence
   here. Compare Process directly below, which is numbered, because there the
   order is real and you cannot revise a brief you have not sent.

   BUT SOMETHING HAS TO HOLD THEM. Strip the numbering and three claims read as
   a run of loose paragraphs. The device that replaces it is the QUESTION each
   claim answers, which encodes something true — every one of these exists
   because a buyer raises it — without implying an order that is not there.
   The rules are three separate segments for the same reason: independent
   claims, independent hairlines. Process gets one continuous rule.

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
          <p className={`${MONO} ${T_12} text-dim`}>{content.why.kicker}</p>
          <h2 className={`${DISPLAY} ${T_40} mt-[16px] max-w-[16ch] text-balance`}>
            <SplitHeading raw={content.why.heading} />
          </h2>
          <p className={`${T_17} mt-[24px] max-w-[58ch] text-dim`}>{content.why.lead}</p>
        </div>

        <ul className="grid grid-cols-1 gap-x-[48px] gap-y-[64px] tab:grid-cols-3">
          {pillars.map((pillar, i) => (
            <li key={pillar.title} className="border-t border-rule pt-[24px]">
              <p className={`${MONO} ${T_12} text-dim`}>{OBJECTIONS[i]}</p>
              <h3 className={`${DISPLAY} ${T_24} mt-[24px] text-balance text-lit`}>
                {pillar.title}
              </h3>
              <p className={`${T_17} mt-[16px] text-dim`}>{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

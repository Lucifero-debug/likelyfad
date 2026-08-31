import { ANCHOR, CARD, DISPLAY, HEAD_GAP, MONO, PANEL, SECTION, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v3/theme";

/* ============================================================================
   FORMATS — the reference site's blocks library, doing our job instead.

   Butter shows a panel of the blocks you can drop into an edit, because Butter
   is a tool you operate. We are not a tool, so the same panel shows what you
   can ask us for. Same treatment, different noun: the section is a dark inset
   panel floating on the light page, holding a grid of cards.

   NOTHING HERE IS A NEW PROMISE. Every line restates something lib/content.ts
   already says — hook-first and sized for every placement in the pillars, the
   four deliverables in the FAQ, hooks staying yours in the ownership answer.
   ========================================================================== */
const FORMATS = [
  {
    name: "Video",
    body: "Spokesperson, podcast and story-led spots. Hook first, cut for the feed.",
  },
  {
    name: "UGC",
    body: "Creator-style ads that look filmed on a phone, without booking a creator.",
  },
  {
    name: "Static",
    body: "Single-frame ads, sized for every placement you actually run.",
  },
  {
    name: "Hooks",
    body: "Fresh openings on an ad that already works, so the body keeps earning.",
  },
] as const;

export function Formats() {
  return (
    <section id="formats" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <p className={`${MONO} ${T_12} text-stone`}>What you can ask for</p>
          <h2 className={`${DISPLAY} ${T_40} mt-[16px] max-w-[18ch] text-balance text-graphite`}>
            There&rsquo;s a format for that.
          </h2>
        </div>

        {/* Padded 32, so the cards inside are gapped 32 and never less — below
            that two cards on adjacent near-black surfaces merge into one. */}
        <div className={`${PANEL} grid gap-[32px] p-[32px] phone:grid-cols-2 lap:grid-cols-4`}>
          {FORMATS.map((format) => (
            <div key={format.name} className={`${CARD} bg-panel-2 p-[24px]`}>
              <h3 className={`${DISPLAY} ${T_24} text-page`}>{format.name}</h3>
              <p className={`${T_14} mt-[16px] text-mist`}>{format.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

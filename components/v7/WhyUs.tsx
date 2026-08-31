import { content } from "@/lib/content";
import { OBJECTIONS } from "@/lib/v7/data";
import {
  ANCHOR,
  DISPLAY,
  DISPLAY_600,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_14,
  T_17,
  T_26,
  T_44,
  WRAP,
} from "@/lib/v7/theme";
import { PinnedCard } from "./PinnedCard";

/* ============================================================================
   WHY US — three claims, and NO 01 / 02 / 03.

   THE BRIEF IS EXPLICIT AND IT IS RIGHT. These are independent reasons, not a
   sequence: nothing about "it looks real" comes before "days, not weeks", and
   numbering them would assert an order that does not exist and that a reader
   would then waste a beat looking for. Process, four sections down, is the one
   place on this page a number appears, because there the order IS the
   information.

   SOMETHING STILL HAS TO STRUCTURE THREE PARAGRAPHS or they read as a run of
   prose, and the honest device is the QUESTION each one answers. OBJECTIONS in
   lib/v4/data.ts exists for exactly this and pairs one to one with the first
   three pillars in lib/content.ts. A question groups without ordering, which
   is what a number could not do here.

   THE CARDS ARE PINNED AND NOT TILTED. These three are read side by side and
   compared — the same argument the work grid makes — and each carries three
   lines of body copy rather than one word. The pin keeps them on the wall; the
   angle would cost more than it buys.

   ONLY THE FIRST THREE PILLARS. lib/content.ts carries six and the brief names
   three. The other three are real and they are not lost: two of them are said
   again in Pricing and in the FAQ, which is where a visitor who has got that
   far is looking for them.
   ========================================================================== */
export function WhyUs() {
  const pillars = content.why.pillars.slice(0, 3);

  return (
    <section id="why" aria-labelledby="v7-why-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>{content.why.kicker}</p>

        <h2 id="v7-why-title" className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] text-mark`}>
          {content.why.heading.replace(/\*/g, "")}
        </h2>

        <p className={`${T_17} mt-[24px] max-w-[56ch] text-note`}>{content.why.lead}</p>

        {/* 48 between cards padded 32. */}
        <ul className="mt-[64px] grid gap-[48px] lap:grid-cols-3">
          {pillars.map((pillar, i) => (
            <PinnedCard key={pillar.title} as="li" pin>
              {/* The question, not an index. See the note above. */}
              <p className={`${MONO} ${T_12} mt-[8px] text-note`}>{OBJECTIONS[i]}</p>

              <h3 className={`${DISPLAY_600} ${T_26} mt-[16px] text-mark`}>{pillar.title}</h3>

              <p className={`${T_14} mt-[16px] text-note`}>{pillar.body}</p>
            </PinnedCard>
          ))}
        </ul>
      </div>
    </section>
  );
}

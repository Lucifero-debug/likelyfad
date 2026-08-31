import { STATS } from "@/lib/v7/data";
import { ANCHOR, DISPLAY, MONO, SECTION, T_12, T_14, T_44, TILT, WRAP } from "@/lib/v7/theme";
import { Tick } from "./Marks";
import { PinnedCard } from "./PinnedCard";

/* ============================================================================
   THE STATS — three cards pinned to the board.

   WHERE THE FIGURES COME FROM, AND WHAT IS DELIBERATELY MISSING. The brief
   asks for ads delivered, average turnaround and brands served. Two of those
   three are numbers nobody in this repo knows, and lib/content.ts opens with a
   house rule that no number is ever invented. A plausible-looking count of ads
   delivered is also the single easiest claim on a page like this for a
   prospect to test and find hollow. So these three are the three this repo can
   actually source, each traceable to copy that already exists, and the note at
   STATS in lib/v7/data.ts says exactly what to add and where when the real
   counts are known. The component renders whatever length it finds.

   THE THIRD FIGURE IS A WORD. "Every" is a claim about coverage rather than a
   count, and setting it in the same slot as the two numbers is the honest way
   to say so: it is not a statistic dressed up, and it is not padded out to
   "100%" to look like one.

   THEY ARE STAGGERED AND TILTED. THEY DO NOT OVERLAP, AND THAT IS A REFUSAL.
   The reference overlaps its stat cards, and the brief asks for slight overlap
   — but the same brief sets a hard rule that the gap between two elements
   exceeds the padding inside either of them, and says it matters more here
   than usual precisely because rotation already makes edges ambiguous. Those
   two instructions cannot both hold: overlapping cards padded 32 have a
   negative gap. Overlap also puts one card's pushpin on top of its neighbour,
   which reads as a mistake rather than as a deck. The vertical stagger plus
   the tilt buys the same dealt-on-a-wall look and keeps the 48.
   ========================================================================== */

/* The stagger. Literal strings rather than a computed offset, because Tailwind
   scans source TEXT and a class assembled at runtime is never emitted. Only
   from lap up: below it the cards are in one or two columns and a vertical
   offset would just look like a broken grid. */
const DROP = ["lap:mt-0", "lap:mt-[32px]", "lap:mt-[12px]"];

export function Stats() {
  return (
    <section aria-labelledby="v7-stats-title" className={`${SECTION} ${ANCHOR} relative`}>
      <div className={`${WRAP} relative`}>
        {/* The third and last marginal mark on the page. Approved, which is
            what the tick means on a wall, and it sits in the right gutter
            where no line of type reaches. */}
        <Tick className="absolute top-[8px] right-0 hidden h-[20px] w-[24px] text-doodle phone:block" />

        <h2 id="v7-stats-title" className={`${MONO} ${T_12} text-note`}>
          In practice
        </h2>

        {/* 48 between cards padded 32. See the rule in lib/v7/theme.ts — this
            is the section it was written for. */}
        <ul className="mt-[48px] grid gap-[48px] phone:grid-cols-2 lap:grid-cols-3">
          {STATS.map((stat, i) => (
            <PinnedCard
              key={stat.figure}
              as="li"
              pin
              fold
              tilt={TILT[i % TILT.length]}
              className={DROP[i % DROP.length]}
            >
              {/* mt-8 clears the pin head, which overhangs the top edge by
                  10px and would otherwise sit on the figure's cap line. */}
              <p className={`${DISPLAY} ${T_44} mt-[8px] text-mark`}>{stat.figure}</p>
              <p className={`${T_14} mt-[16px] text-note`}>{stat.label}</p>
            </PinnedCard>
          ))}
        </ul>
      </div>
    </section>
  );
}

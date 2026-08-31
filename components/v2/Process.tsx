import { PROCESS } from "@/lib/v2/data";
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

/* ============================================================================
   PROCESS — the one section on this page that is numbered.

   Here the order carries information the reader actually needs: nothing is
   revised before it is briefed, and nothing ships before it is signed off. The
   number is not a bullet dressed up, it is the answer to "what happens next".

   ONE RULE, NOT FOUR. Why us gives each claim its own hairline segment because
   the claims are independent. This row runs a single continuous rule across
   all four steps, with the numbers hanging beneath it, so the structure reads
   left to right as one line of time. That difference is the whole distinction
   between the two sections, and it is why neither needed a decorative arrow.

   NOTHING NEW IS PROMISED. Every claim in PROCESS is already made in
   lib/content.ts — 48 hours in the hero, revisions until sign-off and every
   ratio in pricing, full commercial rights in the FAQ.
   ========================================================================== */
export function Process() {
  return (
    <section aria-labelledby="process-heading" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <p className={`${MONO} ${T_12} text-dim`}>Process</p>
          <h2 id="process-heading" className={`${DISPLAY} ${T_40} mt-[16px] text-lit`}>
            How it runs.
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-x-[48px] gap-y-[48px] border-t border-rule pt-[32px] phone:grid-cols-2 lap:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title}>
              {/* Zero-padded and tabular so all four numbers occupy the same
                  width and the row scans as a sequence rather than as four
                  headings that happen to start with a digit. */}
              <p className={`${MONO} ${T_12} text-lit tabular-nums`}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={`${DISPLAY} ${T_24} mt-[24px] text-balance text-lit`}>{step.title}</h3>
              <p className={`${T_17} mt-[16px] text-dim`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

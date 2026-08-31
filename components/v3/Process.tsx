import { PROCESS } from "@/lib/v3/data";
import { CARD, DISPLAY, HEAD_GAP, MONO, SECTION, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v3/theme";

/* ============================================================================
   PROCESS — the one section on this page that is numbered.

   Here the order carries information the reader actually needs: nothing is
   revised before it is briefed, and nothing ships before it is signed off. The
   number is not a bullet dressed up, it is the answer to "what happens next".
   Compare Why us, which refuses numbering for exactly the same reason — three
   independent claims read in any order lose nothing, so numbering them would
   assert a sequence that is not there.

   THE SUPPORTING VISUAL IS THE NUMBER. Every step could have carried a clip,
   and four more autoplaying tiles here would have competed with the statement
   above and the work rail below for the one thing the page can only spend
   once. So the visual each step gets is its own number, set large in a dark
   panel — which is also the section's whole argument rendered as an image.

   NOTHING NEW IS PROMISED. Every line in PROCESS is already made somewhere in
   lib/content.ts: 48 hours in the hero, revisions until sign-off and every
   ratio in pricing, full commercial rights in the FAQ.
   ========================================================================== */
export function Process() {
  return (
    <section aria-labelledby="process-heading" className={SECTION}>
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <p className={`${MONO} ${T_12} text-stone`}>How it runs</p>
          <h2
            id="process-heading"
            className={`${DISPLAY} ${T_40} mt-[16px] max-w-[18ch] text-balance text-graphite`}
          >
            Brief on Monday, cuts by Wednesday.
          </h2>
        </div>

        <ol className="grid gap-[32px] phone:grid-cols-2 lap:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title}>
              {/* Zero-padded and tabular so all four numbers occupy the same
                  width and the row scans as a sequence rather than as four
                  panels that happen to open with a digit. */}
              <div className={`${CARD} flex aspect-[4/3] items-end bg-panel p-[24px]`}>
                <span className={`${DISPLAY} text-[3rem] tabular-nums text-page`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className={`${DISPLAY} ${T_24} mt-[24px] text-balance text-graphite`}>
                {step.title}
              </h3>
              <p className={`${T_14} mt-[12px] text-stone`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

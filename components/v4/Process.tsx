import { PROCESS } from "@/lib/v4/data";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, T_15, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   PROCESS — the one section on this page that is numbered.

   Here the order carries information the reader actually needs: nothing is
   revised before it is briefed, and nothing ships before it is signed off. The
   number is not a bullet dressed up, it is the answer to "what happens next".
   Why us, directly above, refuses numbering for the same reason.

   THE NUMBER SITS IN THE LEFT RAIL, where every other section puts its label.
   That is the point: on this page the rail is where you look to find out what
   a thing IS, so a number appearing in it reads as the step's identity rather
   than as an ornament in front of a title. It is also why the number needs no
   size of its own — position is doing the work a 48px numeral would do
   elsewhere.

   Tabular figures so all four occupy the same width and the column of titles
   beside them is genuinely a column.

   NOTHING NEW IS PROMISED. Every line restates something lib/content.ts
   already says: 48 hours in the hero, revisions until sign-off and every ratio
   in pricing, full commercial rights in the FAQ.
   ========================================================================== */
export function Process() {
  return (
    <section
      aria-labelledby="process-heading"
      className={`${SECTION} ${ANCHOR} border-t border-seam`}
    >
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 id="process-heading" className={`${MONO} ${T_12} text-ash`}>
            Process
          </h2>

          <ol className="border-t border-seam">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-[8px] border-b border-seam py-[16px] phone:flex-row phone:gap-[24px]"
              >
                <span
                  className={`${MONO} ${T_12} text-ash tabular-nums phone:w-[32px] phone:shrink-0`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${T_15} text-carbon phone:w-[120px] phone:shrink-0`}>
                  {step.title}
                </h3>
                <p className={`${T_13} text-ash`}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

import { STATS } from "@/lib/v5/data";
import { DISPLAY, MONO, T_12, T_32, T_15, WRAP } from "@/lib/v5/theme";

/* ============================================================================
   THE STATS — three hairline rows. Label left, figure right.

   NOT A THREE-UP CARD GRID, which is what every agency page does with this and
   which is the wrong shape for three numbers: a card grid asks you to compare
   them, and these three are not comparable — a count, a duration and a count
   of a different thing. Stacked rows with a rule between each ask you to read
   them, one at a time, which is all they are for.

   IT CARRIES NO SECTION HEADER ROW, on purpose. The header rows number the six
   arguments the page makes; these numbers are evidence for the statement
   directly above them, not a seventh argument. So the strip sits inside the
   statement's own rhythm, separated by a rule rather than by a section seam,
   and the run of indices stays honest.

   NO COUNT-UP ANIMATION. The stock move here, and it costs the reader the one
   thing the strip is for: the figure is unreadable for the whole first second,
   and a marketer scanning the page is already gone.

   EVERY NOTE IS RENDERED, INCLUDING THE ONE THAT SAYS PLACEHOLDER. Brands
   served is the single figure nobody in this repo knows, and lib/v5/data.ts
   writes it as an obvious stand-in on purpose. Printing the flag ON THE PAGE
   is what stops an invented number shipping quietly.
   ========================================================================== */
export function Stats() {
  return (
    <section aria-label="Studio in numbers" className="bg-white pb-[clamp(48px,5vw,64px)]">
      <div className={WRAP}>
        {/* Plain rows, not a <dl>. A description list has to run dt before dd,
            and here the label and the figure sit on one line at opposite ends;
            reordering with CSS would leave a screen reader hearing the strip
            inside out, which is a worse trade than giving up a list role the
            section label already covers. */}
        <ul className="border-t border-crease">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex items-baseline justify-between gap-[24px] border-b border-crease py-[24px]"
            >
              <span>
                <span className={`${T_15} block text-press`}>{stat.label}</span>
                <span className={`${MONO} ${T_12} mt-[4px] block text-lead`}>{stat.note}</span>
              </span>

              <span className={`${DISPLAY} ${T_32} shrink-0 text-press tabular-nums`}>
                {stat.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

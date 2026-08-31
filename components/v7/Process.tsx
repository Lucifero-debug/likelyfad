import { PROCESS } from "@/lib/v7/data";
import {
  ANCHOR,
  DISPLAY,
  DISPLAY_600,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_14,
  T_26,
  T_44,
  WRAP,
} from "@/lib/v7/theme";

/* ============================================================================
   PROCESS — four steps, and THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing
   ships before it is signed off. The number IS the information, which is
   exactly why Why us two sections up does not get one, and why Services does
   not either.

   AN ORDERED LIST, ACTUALLY. <ol> rather than <ul> with numbers typed into it,
   so the sequence survives a screen reader, a reader-mode view and a
   stylesheet that never loads. The rendered index is aria-hidden precisely
   BECAUSE the ol already carries it — printing it twice would have a screen
   reader say "one, zero one, Brief".

   THIS SECTION IS NOT PINNED, AND THAT IS THE POINT OF IT. Everything else on
   the wall is a discrete card you could take down and move; a sequence is not,
   and drawing these four as four pinned cards would say they are
   interchangeable. Four hairline-ruled columns are the quietest thing on the
   page and this is the section that should be quiet — it is read once, by
   someone who has already decided they are interested.

   THE CONNECTOR IS NOT DRAWN. Brief to Concept to Revise to Deliver wants an
   arrow, and every arrow at this width is either a line that breaks in the
   wrong place on a phone or an SVG that has to be redrawn per breakpoint. The
   index and the reading order carry the sequence on their own.
   ========================================================================== */
export function Process() {
  return (
    <section id="process" aria-labelledby="v7-process-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>Process</p>

        <h2
          id="v7-process-title"
          className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] text-mark`}
        >
          Brief in, finished ads back.
        </h2>

        <ol className="mt-[64px] grid gap-[48px] phone:grid-cols-2 lap:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="border-t border-hair pt-[24px]">
              {/* The note grey, not the accent. The accent on this page is
                  spent on the pushpins, the status dot and the CTA, and four
                  magenta step numbers would make it a fourth thing and dilute
                  all of them. The index is structure, not emphasis. */}
              <span aria-hidden="true" className={`${MONO} ${T_12} block text-note`}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className={`${DISPLAY_600} ${T_26} mt-[16px] text-mark`}>{step.title}</h3>

              <p className={`${T_14} mt-[12px] text-note`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

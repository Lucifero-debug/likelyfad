import { PROCESS, SECTIONS } from "@/lib/v5/data";
import { ANCHOR, HEAD_GAP, MONO, SECTION, T_12, T_15, T_20, WRAP } from "@/lib/v5/theme";
import { SectionHead } from "./SectionHead";

/* ============================================================================
   PROCESS — four steps, and THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing ships
   before it is signed off. The number IS the information, which is exactly why
   Why us above does not get one. Two sections that look alike and differ in
   this one respect is the clearest way to say that the numbering on this page
   means something.

   AN ORDERED LIST, ACTUALLY. <ol> rather than <ul> with numbers typed into it,
   so the sequence survives a screen reader, a reader-mode view and a stylesheet
   that never loads. The rendered index is aria-hidden precisely because the ol
   already carries it — printing it twice would have a screen reader say "one,
   zero one, Brief".

   THE ARROW BETWEEN STEPS IS NOT DRAWN. Brief → Concept → Revise → Deliver
   wants a connector, and every connector at this width is either a line that
   breaks at the wrong place on a phone or an SVG that has to be re-drawn per
   breakpoint. The index and the reading order carry the sequence on their own,
   and the rule over each step is already the page's language for a divided
   list.
   ========================================================================== */
export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="v5-head-process"
      className={`${SECTION} ${ANCHOR} bg-white`}
    >
      <div className={WRAP}>
        <SectionHead
          index={SECTIONS.process.index}
          name={SECTIONS.process.name}
          id="v5-head-process"
        />

        <ol className={`${HEAD_GAP} grid gap-[48px] phone:grid-cols-2 lap:grid-cols-4`}>
          {PROCESS.map((step, i) => (
            <li key={step.title} className="border-t border-crease pt-[32px]">
              <span aria-hidden="true" className={`${MONO} ${T_12} block text-lead`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`${T_20} mt-[16px] text-press`}>{step.title}</h3>
              <p className={`${T_15} mt-[12px] text-lead`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { PROCESS } from "@/lib/v6/data";
import { ANCHOR, HEAD_GAP, MONO, SECTION, SERIF, SERIF_400, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v6/theme";

/* ============================================================================
   PROCESS — four steps, and THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing
   ships before it is signed off. The number IS the information, which is
   exactly why Why us directly above does not get one.

   AN ORDERED LIST, ACTUALLY. <ol> rather than <ul> with numbers typed into it,
   so the sequence survives a screen reader, a reader-mode view and a
   stylesheet that never loads. The rendered index is aria-hidden precisely
   BECAUSE the ol already carries it — printing it twice would have a screen
   reader say "one, zero one, Brief".

   THE CONNECTOR IS NOT DRAWN. Brief to Concept to Revise to Deliver wants an
   arrow, and every arrow at this width is either a line that breaks in the
   wrong place on a phone or an SVG that has to be redrawn per breakpoint. The
   index and the reading order carry the sequence on their own, and the rule
   over each step is already this page's language for a divided list.
   ========================================================================== */
export function Process() {
  return (
    <section id="process" aria-labelledby="v6-process-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-haze`}>Process</p>

        <h2
          id="v6-process-title"
          className={`${SERIF} ${T_40} ${HEAD_GAP} max-w-[20ch] text-beam`}
        >
          Brief in, finished ads back.
        </h2>

        <ol className="mt-[64px] grid gap-[48px] phone:grid-cols-2 lap:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="border-t border-edge pt-[32px]">
              {/* Haze, not the accent. The accent on this page is spent
                  entirely on the CTA and the cycling word, and four magenta
                  step numbers would make it three things and dilute all of
                  them. The index is structure, not emphasis. */}
              <span aria-hidden="true" className={`${MONO} ${T_12} block text-haze`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`${SERIF_400} ${T_24} mt-[16px] text-beam`}>{step.title}</h3>
              <p className={`${T_14} mt-[12px] text-haze`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

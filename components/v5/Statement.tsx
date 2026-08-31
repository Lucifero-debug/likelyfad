import { SECTIONS, STATEMENT } from "@/lib/v5/data";
import {
  ANCHOR,
  DISPLAY,
  HEAD_GAP,
  T_56,
  WEDGE_CLIP,
  WEDGE_PAD,
  WEDGE_PULL,
  WRAP,
} from "@/lib/v5/theme";
import { SectionHead } from "./SectionHead";

/* ============================================================================
   THE STUDIO STATEMENT — one giant sentence, and the angled cut into it.

   NO HEADLINE AND NO PARAGRAPH UNDER IT. This is the reference's move and it
   is the right one here: an about section built as a 32px heading over a
   15px paragraph says "we are an agency" before a word of it is read. One
   sentence at 56px, running four or five lines, set tight, says the thing and
   IS the thing. There is nothing else in this section.

   THE SENTENCE IS A <p>, NOT A HEADING. It is a sentence. The section's
   heading is the word (Studio) in the hairline row above it, which is a real
   h2, and dressing the statement as a second heading would put two headings in
   a section that has one idea.

   THE WEDGE LIVES HERE RATHER THAN ON THE HERO, and that is deliberate: the
   clip has to be applied to the element that owns the colour being cut INTO,
   or the diagonal shows as a gap with the page background behind it instead of
   as an edge. The three constants always move together — see the note in
   lib/v5/theme.ts for why they are one number written three ways, and for why
   this cannot clip content or overflow sideways at any width.

   `relative` IS LOAD-BEARING. The negative margin pulls this section up over
   the hero, and without a positioned box it would paint underneath it.
   ========================================================================== */
export function Statement() {
  return (
    <section
      id="studio"
      aria-labelledby="v5-head-studio"
      className={`${ANCHOR} ${WEDGE_PULL} ${WEDGE_CLIP} ${WEDGE_PAD} relative z-10 bg-white pb-[clamp(48px,5vw,64px)]`}
    >
      <div className={WRAP}>
        <SectionHead
          index={SECTIONS.studio.index}
          name={SECTIONS.studio.name}
          id="v5-head-studio"
        />

        {/* 34ch is short on purpose. The whole effect depends on the sentence
            running several lines rather than one or two, so the measure is set
            well under the 62ch a paragraph would want — at this size the line
            count IS the composition. */}
        <p className={`${DISPLAY} ${T_56} ${HEAD_GAP} max-w-[34ch] text-press`}>
          {STATEMENT}
        </p>
      </div>
    </section>
  );
}

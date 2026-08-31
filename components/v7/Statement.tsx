import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { STATEMENT_CTA, STATEMENT_HEADING } from "@/lib/v7/data";
import { ANCHOR, DISPLAY, MONO, SECTION, T_12, T_17, T_44, WRAP } from "@/lib/v7/theme";
import { Arrow, CropMark, Pushpin } from "./Marks";

/* ============================================================================
   THE STUDIO STATEMENT — what we do, in two sentences, on the board.

   THIS IS WHERE THE PAGE COMES OUT OF THE VIDEO AND ONTO THE WALL, so it is
   also where the graph rule and the marginal marks first read. Both are
   deliberately almost invisible: the rule is 1.06:1 against the board, and the
   marks are in the gutters where nothing has to be read past them.

   THREE MARKS ON THE WHOLE PAGE AND TWO OF THEM ARE HERE. The reference
   scatters about a dozen doodles and that is the most template-looking thing
   on it. The crop mark sits in the top-left gutter and the arrow points at the
   CTA, which is the only thing on this section anybody has to find. Neither
   crosses a line of type, at any width. The third is a tick in the stats band.

   THEY ARE HIDDEN BELOW 561px, which is not a compromise. At 375 the gutter is
   24px and there is no margin to put a mark IN — a mark that has to sit over
   the text to fit is a mark that has stopped being marginal, and the honest
   response is to not draw it.

   THE CTA IS PINNED. A pushpin through the top of the pill is the page's own
   vocabulary applied to the one element that matters most, and it costs one
   22px svg. It is also the second of the three places the accent appears.
   ========================================================================== */
export function Statement() {
  return (
    <section
      id="studio"
      aria-labelledby="v7-statement-title"
      className={`${SECTION} ${ANCHOR} relative`}
    >
      <div className={`${WRAP} relative`}>
        <CropMark className="absolute top-0 left-0 hidden size-[26px] text-doodle phone:block" />

        <div className="mx-auto max-w-[46ch] text-center">
          <p className={`${MONO} ${T_12} text-note`}>The studio</p>

          <h2
            id="v7-statement-title"
            className={`${DISPLAY} ${T_44} mt-[24px] text-balance text-mark`}
          >
            {STATEMENT_HEADING}
          </h2>

          <p className={`${T_17} mx-auto mt-[32px] max-w-[58ch] text-balance text-note`}>
            {content.hero.subline}
          </p>

          <div className="relative mt-[48px] inline-block">
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${MONO} ${T_12} relative inline-block rounded-[999px] bg-cue px-[32px] py-[16px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
            >
              {STATEMENT_CTA}
            </a>

            {/* Outside the anchor, so the pin is never part of the link's
                hit area or its accessible name. */}
            <Pushpin className="pointer-events-none absolute -top-[9px] left-1/2 size-[22px] -translate-x-1/2" />

            {/* Sits in the gutter to the right of a pill that is at most
                200px wide inside a 46ch measure, so it never reaches the type
                and never reaches the page edge. */}
            <Arrow className="absolute top-[6px] -right-[76px] hidden h-[40px] w-[56px] -scale-x-100 text-doodle phone:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

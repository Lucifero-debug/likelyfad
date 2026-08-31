"use client";

import { useState } from "react";
import { content } from "@/lib/content";
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
   FAQ — the existing questions, in the existing order, in an accordion.

   ONE OPEN AT A TIME. Eight answers expanded at once is the whole section as a
   wall of body copy, which is the least readable thing this page could
   produce and the least likely to be read at the point a visitor has reached
   it.

   WHY NOT <details>. It would be free and it would be accessible, and it
   cannot animate its own open state without ::details-content, which is too
   new to lean on here. A button with aria-expanded plus aria-controls is the
   same contract written out, and it lets the panel animate on a property that
   does not force layout on every frame of the transition.

   inert IS DOING REAL WORK. A panel collapsed with grid-template-rows: 0fr is
   invisible but still in the accessibility tree, so a screen reader would read
   all eight answers straight through and none of the questions would mean
   anything. `hidden` would fix that and kill the animation with it. `inert`
   removes the subtree from the tree and from the tab order while leaving it
   laid out, which is exactly the state a collapsed panel is in.

   THE INDICATOR IS A PLUS THAT LOSES ITS STEM. Two 1px spans and a scale
   transform, in the same hairline language as every rule on the page. An icon
   set imported for one glyph would bring its own stroke weight into a page
   where every drawn thing shares one.

   ROWS, NOT CARDS. This is the only section other than Process that is not
   built out of pinned cards, and for the same reason: eight cards stacked
   vertically is not a wall, it is a list wearing costumes, and the section
   after this one is the ask. The hairline rows keep it quiet.
   ========================================================================== */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="v7-faq-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>{content.faq.kicker}</p>

        <h2 id="v7-faq-title" className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] text-mark`}>
          {content.faq.heading.replace(/\*/g, "").replace(/\n/g, " ")}
        </h2>

        <ul className="mt-[48px] border-t border-hair">
          {content.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-hair">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`v7-faq-panel-${i}`}
                    id={`v7-faq-button-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`${DISPLAY_600} ${T_26} flex w-full items-start justify-between gap-[24px] py-[24px] text-left text-mark`}
                  >
                    <span>{item.q}</span>

                    <span
                      aria-hidden="true"
                      className="relative mt-[10px] block size-[12px] shrink-0"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-note" />
                      <span
                        className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-note transition-transform duration-200 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`v7-faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`v7-faq-button-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className={`${T_14} max-w-[62ch] pr-[32px] pb-[24px] text-note`}>{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

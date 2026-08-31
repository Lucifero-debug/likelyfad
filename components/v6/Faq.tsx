"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { ANCHOR, HEAD_GAP, MONO, SECTION, SERIF, SERIF_400, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v6/theme";

/* ============================================================================
   FAQ — the existing questions, in the existing order, in an accordion.

   ONE OPEN AT A TIME. Eight answers expanded at once is the whole section as a
   wall of body copy on a dark ground, which is the least readable thing this
   page could produce.

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

   THE INDICATOR IS A PLUS THAT LOSES ITS STEM. On a page with no icons at all,
   importing an icon set for one glyph would be the only illustration in view.
   Two 1px spans and a scale transform cost nothing and stay in the same
   language as every hairline on the page.
   ========================================================================== */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="v6-faq-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-haze`}>Questions</p>

        <h2 id="v6-faq-title" className={`${SERIF} ${T_40} ${HEAD_GAP} max-w-[20ch] text-beam`}>
          The stuff founders ask before they reach out.
        </h2>

        <ul className="mt-[48px] border-t border-edge">
          {content.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-edge">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`v6-faq-panel-${i}`}
                    id={`v6-faq-button-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`${SERIF_400} ${T_24} flex w-full items-start justify-between gap-[24px] py-[24px] text-left text-beam`}
                  >
                    <span>{item.q}</span>

                    <span
                      aria-hidden="true"
                      className="relative mt-[12px] block size-[12px] shrink-0"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-haze" />
                      <span
                        className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-haze transition-transform duration-200 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`v6-faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`v6-faq-button-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className={`${T_14} max-w-[62ch] pr-[32px] pb-[24px] text-haze`}>
                      {item.a}
                    </p>
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

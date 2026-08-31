"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, T_15, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   FAQ — the existing questions, in the existing order, in an accordion.

   ONE OPEN AT A TIME. Eight answers expanded at once is the whole section as a
   wall of 13px body copy, which on a page with no size ramp is the single
   worst thing that could appear on it.

   WHY NOT <details>. It would be free and it would be accessible, and it
   cannot animate its own open state without ::details-content, which is too
   new to lean on here. A button with aria-expanded plus aria-controls is the
   same contract written out, and it lets the panel animate on a property that
   does not force layout on every frame of the transition.

   inert IS DOING REAL WORK. A panel collapsed with grid-template-rows: 0fr is
   invisible but still in the accessibility tree, so a screen reader would read
   all eight answers straight through and none of the questions would mean
   anything. hidden would fix that and kill the animation with it. inert
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
    <section id="faq" className={`${SECTION} ${ANCHOR} border-t border-seam`}>
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 className={`${MONO} ${T_12} text-ash`}>FAQ</h2>

          <ul className="border-t border-seam">
            {content.faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-b border-seam">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`v4-faq-panel-${i}`}
                      id={`v4-faq-button-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={`${T_15} flex w-full items-start justify-between gap-[24px] py-[16px] text-left text-carbon`}
                    >
                      <span>{item.q}</span>

                      <span
                        aria-hidden="true"
                        className="relative mt-[6px] block size-[10px] shrink-0"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-ash" />
                        <span
                          className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-ash transition-transform duration-200 ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`v4-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`v4-faq-button-${i}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className={`${T_13} max-w-[62ch] pr-[32px] pb-[16px] text-ash`}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

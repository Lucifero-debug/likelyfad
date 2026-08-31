"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { ANCHOR, DISPLAY, MONO, SECTION, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v3/theme";

/* ============================================================================
   FAQ — the existing questions, in the existing order, in an accordion.

   ONE OPEN AT A TIME. Eight answers expanded at once is the whole section as a
   wall of body copy, which is the thing an accordion exists to prevent.

   WHY NOT <details>. It would be free and it would be accessible, and it
   cannot animate its own open state without ::details-content, which is too
   new to lean on here. A button with aria-expanded plus aria-controls is the
   same contract written out, and it lets the panel animate on a property that
   does not force layout on every frame of the transition.

   `inert` IS DOING REAL WORK. A panel collapsed with grid-template-rows: 0fr
   is invisible but still in the accessibility tree, so a screen reader would
   read all eight answers straight through and none of the questions would mean
   anything. `hidden` would fix that and kill the animation with it. `inert`
   removes the subtree from the tree and from the tab order while leaving it
   laid out, which is exactly the state a collapsed panel is in.
   ========================================================================== */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className={`${SECTION} ${ANCHOR}`}>
      <div
        className={`${WRAP} tab:grid tab:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] tab:gap-[64px]`}
      >
        <div>
          <p className={`${MONO} ${T_12} text-stone`}>{content.faq.kicker}</p>
          <h2 className={`${DISPLAY} ${T_40} mt-[16px] max-w-[14ch] text-balance text-graphite`}>
            The stuff founders ask before they reach out.
          </h2>
        </div>

        <ul className="mt-[48px] border-t border-graphite/10 tab:mt-0">
          {content.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-graphite/10">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-[24px] py-[24px] text-left"
                  >
                    <span className={`${DISPLAY} ${T_24} text-graphite`}>{item.q}</span>

                    {/* A plus that loses its stem. Cheaper than an icon set,
                        and it animates a transform rather than rotating a
                        glyph through its own bounding box. */}
                    <span
                      aria-hidden="true"
                      className="relative mt-[8px] block size-[12px] shrink-0"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-stone" />
                      <span
                        className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-stone transition-transform duration-200 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className={`${T_14} max-w-[62ch] pr-[32px] pb-[24px] text-stone`}>
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

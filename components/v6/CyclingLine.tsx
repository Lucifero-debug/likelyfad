"use client";

import { useEffect, useState } from "react";
import { CYCLE, CYCLE_MS } from "@/lib/v6/data";
import { SERIF, T_40 } from "@/lib/v6/theme";
import { useReducedMotion } from "@/lib/v6/useMedia";

/* ============================================================================
   THE CYCLING LINE — "Make it ______", where the blank loops through the
   verticals we actually work in. The signature element of this page.

   IT IS DELIBERATELY NOT INPUT-SHAPED, AND THAT IS THE MOST IMPORTANT
   DECISION IN THIS FILE. The reference's version looks like a prompt box —
   rounded, field-coloured, with the affordances of something you type into —
   because Dream Motion's visitors DO type into it. An input shape is a
   promise: it says there is a box here, you will fill it, and a machine will
   answer. We have no box. A brand sends us a brief and we send back finished
   ads. Borrowing the shape would be borrowing a self-serve promise we cannot
   keep, and the visitor would find out on the next click.

   So it keeps the rounded pill and drops every input signal: no caret, no
   placeholder grey, no trailing send button, no focus-field styling, and it is
   not focusable, because it is not a control. It reads as a line being spoken
   about the work rather than a field waiting on the visitor.

   WE CYCLE VERTICALS, NOT STYLES. The reference cycles visual styles because
   choosing a style is what its users do. A brand marketer landing here is
   asking one question first, and it is whether we have worked in their
   category. Same mechanic, aimed at the question our visitor is actually
   asking, and every word that appears is answerable by the tagged grid below.

   NO LAYOUT SHIFT, BY CONSTRUCTION AND NOT BY MEASUREMENT. Every word is
   rendered, all of them stacked in the SAME grid cell, with the inactive ones
   at opacity 0. The cell is therefore always as wide as the longest word
   ("Supplements") no matter which one is showing, so nothing reflows as they
   swap and the pill never twitches. The obvious alternative — measuring the
   widest word in JS and setting a min-width — needs fonts to have loaded,
   fails on the server, and reflows once on hydration.

   WHAT A SCREEN READER GETS. The cycler is aria-hidden, because a live region
   announcing a new word every 2.2 seconds forever is not information, it is a
   fault. One static sentence naming all four verticals sits behind it, which
   is the same claim without the noise.

   REDUCED MOTION STOPS ON ONE WORD. The interval is never created — not
   created and then cleared, never created — so there is no timer running in
   the background of a page whose visitor asked for less motion.
   ========================================================================== */
export function CyclingLine() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % CYCLE.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reduced]);

  /* Under the preference the line holds the first vertical and never moves. */
  const active = reduced ? 0 : i;

  return (
    <section aria-label="Categories we work in" className="pb-[clamp(48px,5vw,64px)]">
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,5vw,64px)]">
        <div className="flex justify-center">
          <p
            aria-hidden="true"
            className={`${SERIF} ${T_40} inline-flex items-baseline gap-[12px] rounded-[999px] border border-edge bg-slab px-[32px] py-[16px] text-beam`}
          >
            <span>Make it</span>

            {/* One grid cell, every word in it. See the note above. */}
            <span className="grid">
              {CYCLE.map((word, n) => (
                <span
                  key={word}
                  className={`col-start-1 row-start-1 whitespace-nowrap text-cue transition-[opacity,filter,transform] duration-500 ease-out ${
                    n === active
                      ? "opacity-100 blur-0 translate-y-0"
                      : "pointer-events-none opacity-0 blur-[6px] -translate-y-[0.12em]"
                  }`}
                >
                  {word}
                </span>
              ))}
            </span>
          </p>

          {/* The same claim, once, for assistive tech. */}
          <p className="sr-only">
            We make ads for {CYCLE.slice(0, -1).join(", ")} and {CYCLE[CYCLE.length - 1]} brands.
          </p>
        </div>
      </div>
    </section>
  );
}

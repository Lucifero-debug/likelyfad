"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";

const { hero } = content;

/* The four supporting lines fade and lift together on load, staggered 90ms
   apart behind a 150ms delay — the headline's own word reveal starts at 200ms
   and runs underneath them.

   Same three-phase shape as RevealText, and for the same reason: the server
   renders everything AT REST, so the hero reads with no JS at all, and the
   offset is applied once before the first paint rather than baked into the
   HTML. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useHeroFade() {
  const [phase, setPhase] = useState<"rest" | "armed" | "in">("rest");
  useIsoLayoutEffect(() => setPhase("armed"), []);
  useEffect(() => {
    if (phase !== "armed") return;
    const t = setTimeout(() => setPhase("in"), 16);
    return () => clearTimeout(t);
  }, [phase]);

  /* i is the element's place in the stagger, not its DOM order — the headline
     sits between #0 and #1 and is animated by RevealText instead. */
  return (i: number) => ({
    style: phase === "in" ? { transitionDelay: `${150 + i * 90}ms` } : undefined,
    className:
      phase === "armed"
        ? "translate-y-[22px] opacity-0"
        : phase === "in"
          ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          : "",
  });
}

/* Below the split this is the full-width hero: centred, clearing the fixed nav
   with room at the floor. Beside the wall it should be exactly as tall as its
   own text, so the padding goes and the split owns the top clearance instead.

   NO min-height, and this is the one place this build deviates from v1 on
   purpose. v1 sets `min-height: 90svh` here, which on a phone is the entire gap
   between the hero and the reel wall: the content runs ~325px, so centring it
   inside a 760px box parks ~157px of dead air under the reassurance line before
   the 24px of padding even starts. Without it the hero is content height and
   the seam to the wall is just 24px + the wall's own 24px, which also lets the
   reels peek into the first screen. Add `min-h-[70svh]` back here if you want
   some of that height returned — every px of it lands under the copy. */
const HERO =
  "relative flex items-center overflow-hidden pt-[clamp(96px,10vh,128px)] pb-3 text-center " +
  "lap:py-0 lap:text-left";

/* OPTICAL ALIGNMENT for the split hero's wrapped headline line.

   Every line of the headline starts at the same x — the boxes are flush. The
   INK is not, because letters carry different left side bearings: the capital A
   that opens line 1 is a triangle whose stroke runs to the edge of its glyph
   box, while the lowercase a that opens line 2 is round and sits inset. So line
   2 reads as indented even though nothing is indenting it.

   The negative margin moves the WHOLE block left; the text-indent puts the
   FIRST line back. Net effect: line 1 does not move at all, so the headline
   still lines up with the kicker and the subline, and every wrapped line after
   it shifts left by the bearing difference. If the headline ever sets on one
   line the two cancel exactly, so there is nothing to undo at other widths.

   A TASTE knob, not a measurement — nudge it until the two lines look flush at
   your window width, and set it to 0 to switch the correction off. Laptop only:
   below the split the hero is centred, where none of it applies. */
const OPTICAL = "lap:ml-[-0.04em] lap:indent-[0.04em]";

export function Hero() {
  const fade = useHeroFade();
  const [kicker, sub, ctas, reassure] = [fade(0), fade(1), fade(2), fade(3)];

  return (
    <header className={HERO} id="top">
      {/* THE WASH IS OFF, exactly as it is on the live site — v1 keeps this
          element commented out and only its `.aura` rule alive in the
          stylesheet. Uncomment to switch it back on; it is weighted off the
          LEFT edge of the hero column on a laptop so it bleeds out of frame
          rather than crowding the reel wall on the right.

      <div
        aria-hidden="true"
        className="aura pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(660px,72vh)] w-[min(1040px,96vw)] -translate-x-[72%] -translate-y-1/2 lap:left-[-30%] lap:w-[min(820px,62vw)] lap:translate-x-0"
      /> */}

      {/* The wrap and the flex column are the SAME element, and the children of
          this column are the real elements — no wrapper divs. A reveal wrapper
          around each one would become the flex item, and `align-items` would
          then be sizing the wrapper rather than the text inside it. */}
      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-2 md:gap-4 items-center px-[clamp(20px,5vw,64px)] lap:max-w-none lap:items-start lap:px-0">
        <span
          style={kicker.style}
          className={`inline-flex items-center gap-[0.65em] font-mono text-[0.74rem] font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[1.7rem] before:bg-current before:opacity-55 before:content-[''] ${kicker.className}`}
        >
          {hero.eyebrow}
        </span>

        {/* NOTE ON `ch`: it measures the "0" glyph OF THE ELEMENT'S OWN FONT, so
            this cap silently resizes whenever the heading face changes — that is
            what once pushed the headline onto a third line. It survives
            Montserrat because its lining figures sit close to its average letter
            width. Re-measure if the heading face changes.

            Leading is 1.04, and it is now the ONE display setting on the page
            that is not 1.2 — the five section headings were unified there, this
            h1 was left where it was. It sat at 0.78 for a long time — a
            deliberately tight, stacked-block setting — and the lines were
            opened up to here. The headline is the only place that tight a
            setting ever read as deliberate rather than cramped, so if it goes
            back down, keep the change scoped to this h1 and off SectionHeading.

            The laptop size is tuned to break the 39-character headline evenly
            over exactly TWO lines across the whole desktop range: ~21 characters
            fit per line at 961px and ~22 at 1440px, and the copy's natural
            midpoint ("…nobody | asks…") is 19/19. */}
        <h1
          className={`mt-1 max-w-[20ch] text-balance font-display text-[clamp(2.6rem,1.25rem+5.6vw,5.3rem)] font-bold leading-[1.2] tracking-[-0.022em] lap:max-w-[22ch] lap:text-[clamp(1.9rem,0.24rem+3.97vw,4.7rem)] ${OPTICAL}`}
        >
          <RevealText text={hero.headline} immediate delay={200} />
        </h1>

        <p
          style={sub.style}
          className={`mt-1 max-w-[48ch] text-pretty text-[clamp(1.1rem,1rem+0.6vw,1.38rem)] leading-[1.2] text-ink-soft lap:max-w-[42ch] ${sub.className}`}
        >
          {hero.subline}
        </p>

        <div
          style={ctas.style}
          className={`mt-3 flex flex-wrap justify-center gap-2 lap:justify-start ${ctas.className}`}
        >
          <Button contact variant="grad" withArrow>
            {hero.primaryCta}
          </Button>
          <Button href={hero.secondaryHref} variant="ghost" className="border border-black">
            {hero.secondaryCta}
          </Button>
        </div>

        <p
          style={reassure.style}
          className={`mt-0 font-mono text-[0.8rem] tracking-[0.03em] text-ink-faint ${reassure.className}`}
        >
          {hero.reassurance}
        </p>
      </div>
    </header>
  );
}

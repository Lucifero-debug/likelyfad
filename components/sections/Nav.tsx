"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { WRAP } from "@/lib/ui";

/* Fixed bar that compacts once scrolled and retracts when scrolling down.

   The scrolled state is a THICK material rather than a thin one, for two
   reasons that turn out to be the same reason.

   LEGIBILITY. At 74% the bar was translucent enough that the link colour was
   composited against whatever happened to be scrolling underneath — warm paper
   one moment, the near-black work band or a moving clip the next. Text contrast
   was therefore not a fixed number and could not be guaranteed.

   PERFORMANCE. The backdrop-filter that made the thin version work had to
   re-blur the strip on every frame anything moved behind it, and two marquees
   move behind it continuously.

   At 92% the bar still reads as a material (it is not flat paint, and content
   still tints it) while the ink on it is effectively fixed. */
const LINK =
  "relative -my-3 py-3 text-[0.95rem] font-normal text-ink-soft " +
  "transition-opacity duration-150 hover:text-ink active:opacity-60 " +
  // Gradient underline growing from the left. Offset back out of the padded
  // box so it still sits 3px under the TEXT, not under the tap target — the
  // py-3/-my-3 pair grows the target to ~48px without changing bar height.
  "after:absolute after:bottom-[calc(0.75rem-3px)] after:left-0 after:h-[1.5px] after:w-full " +
  "after:origin-left after:scale-x-0 after:bg-[image:var(--grad)] after:content-[''] " +
  "after:transition-transform after:duration-[280ms] after:ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "hover:after:scale-x-100";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Only retracts well past the hero, so the bar does not flicker on the
      // small scroll corrections people make while reading the headline.
      setHidden(y > lastY.current && y > 400);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-[transform,background-color,padding,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] ${
        scrolled ? "bg-paper/92 py-3 shadow-[0_1px_0_var(--color-line)]" : "py-4"
      } ${hidden ? "-translate-y-[115%]" : "translate-y-0"}`}
    >
      <div className={`${WRAP} flex items-center justify-between gap-6`}>
        <a href="#top" className="flex items-center" aria-label={`${content.brand} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
              mark, already the right pixels; the optimiser has nothing to do. */}
          <img src="/ls-icon.png" alt="Likelyfad Studio" className="h-10 w-30 object-contain" />
        </a>

        {/* Dropped below the tablet breakpoint, where the wordmark and the CTA
            already fill the bar and the links would wrap it onto two rows. */}
        <nav className="ml-auto mr-6 hidden gap-8 tab:flex" aria-label="Primary">
          {content.nav.links.map((l) => (
            <a key={l.label} href={l.href} className={LINK}>
              {l.label}
            </a>
          ))}
        </nav>

        <Button contact variant="dark" size="compact" className="shrink-0">
          {content.nav.cta}
        </Button>
      </div>
    </header>
  );
}

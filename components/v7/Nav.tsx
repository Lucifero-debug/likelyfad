"use client";

import { useEffect, useState } from "react";
import { CTA, content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { DISPLAY_600, MONO, T_12 } from "@/lib/v7/theme";

/* ============================================================================
   THE NAV — the wordmark centred at the top, and almost nothing else.

   THE REFERENCE PUTS ITS WORDMARK SMALL AND CENTRED OVER THE HERO IMAGE and
   that is the right instinct to keep: a centred wordmark reads as a masthead
   on a printed sheet, which is the register this page is in, where the same
   mark pushed into the left corner with a row of links beside it reads as an
   application chrome bar.

   THE WORDMARK IS SET AS TYPE, NOT AS public/ls-icon.png, AND THAT IS A
   DELIBERATE DEPARTURE FROM WHAT THE OTHER FIVE ROUTES DO. The PNG mark is a
   pink-to-purple gradient. This brief's clearest instruction is to kill that
   gradient, on the grounds that it is the most recognisable AI-generated
   design tell in circulation and a strange thing to wear on a site whose pitch
   is that its output does not read as AI. Dropping a gradient wordmark at the
   very top of the page would spend the first impression on exactly the tell
   the page is built to avoid, and it would be the only multi-colour object in
   a five-colour palette. Set in the display face it also becomes the smallest
   instance of the type that carries every headline, so the top of the page and
   the middle of it agree.

   THE MARK IS NOT BANISHED — it is in the hero's status pill, at 28px, inside
   a white tile, where it reads as a studio's logo rather than as a gradient
   headline treatment. To put it back here instead, swap the span below for the
   img and nothing else changes.

   IT TAKES A GROUND ON SCROLL, ONCE. Over the hero the bar is transparent with
   white type, because the hero is a full-bleed ad and a cream strip across the
   top of it would crop the composition. Past the hero it takes the board
   colour and a hairline, which is the minimum required to keep the links
   legible once white cards start passing underneath them.

   AN INTERSECTION OBSERVER, NOT A SCROLL LISTENER. A scroll handler runs on
   every frame of every gesture and does a layout read to find out where it is;
   this fires twice in the life of the page.

   NO HAMBURGER, AND NO CTA BELOW 761px. This is arithmetic rather than taste.
   At 375 the wordmark centred absolutely occupies roughly 151px to 223px and a
   right-aligned CTA pill occupies 167px to 351px: they overlap, and the only
   ways out are to un-centre the wordmark, shorten the copy, or drop one of
   them. So below the tab breakpoint the bar is the wordmark alone, the four
   links live in the footer where they are reachable in one jump from the end
   of the page, and the first CTA is the Start a project pill about one screen
   down. A drawer to hold four anchors into a page you are already scrolling is
   a menu that exists to hold a menu.
   ========================================================================== */
export function Nav({ heroId }: { heroId: string }) {
  /* Starts true: the prerendered HTML is the top of the page, which is the
     hero, so the server and the hydrating client agree and nothing flashes. */
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    /* The observer is the only thing that ever writes this state. There is
       deliberately no fallback branch setting it here: a setState in an effect
       body is a cascading render, and the case it would guard — this page
       rendering without its hero — cannot happen without someone editing
       page.tsx, at which point the nav's ground is not the defect they have. */
    if (!hero) return;

    const io = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <header
      /* data-dark is what globals.css keys the white focus ring off, so a
         keyboard user tabbing the bar while it is over the hero can see where
         they are. It tracks the state rather than being fixed, because past
         the hero the same ring has to go back to ink. */
      data-dark={overHero || undefined}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero ? "text-white" : "border-b border-hair bg-board/92 text-mark backdrop-blur-sm"
      }`}
    >
      {/* relative, because the wordmark is centred against the BAR rather than
          against whatever space the links and the button leave over. With
          flex-1 thirds the CTA's own width pushes the centre off-axis, and it
          is visibly off at exactly the widths where the bar is tightest. */}
      <div className="relative mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between px-[clamp(24px,5vw,64px)] tab:h-[72px]">
        <nav aria-label="Sections" className="hidden tab:block">
          <ul className={`${MONO} ${T_12} flex items-center gap-[32px]`}>
            {content.nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-opacity duration-200 hover:opacity-65">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#top"
          aria-label={`${content.brand}, back to top`}
          className={`${DISPLAY_600} absolute left-1/2 -translate-x-1/2 text-[1.0625rem] tracking-[0.02em]`}
        >
          {content.brand}
        </a>

        {/* Dropped below tab. See the arithmetic in the note above. */}
        <a
          href={contactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${MONO} ${T_12} hidden rounded-[999px] bg-cue px-[16px] py-[8px] text-white transition-colors duration-200 hover:bg-[#c31d51] tab:ml-auto tab:block`}
        >
          {CTA}
        </a>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CTA, content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { HERO_SECTION_ID } from "@/lib/v5/data";
import { MONO, T_12 } from "@/lib/v5/theme";

/* ============================================================================
   THE NAV — four numbered items, centred, with the CTA pinned right.

   THE SUPERSCRIPT NUMBERS ARE THE REFERENCE'S IDEA AND THEY EARN THEIR PLACE
   HERE: they are the first appearance of the numbering that then runs down the
   whole page in the section header rows. Four numbered nav items over six
   numbered sections is the same document speaking twice, which is why the nav
   items and the section indices are deliberately NOT the same numbers — the
   nav numbers the routes through the page, the header rows number the page.

   IT CHANGES STATE ONCE, AND ONLY BECAUSE IT HAS TO. This is the only one of
   the four routes that is half near-black and half white, so a nav with one
   fixed colour is illegible on one half of the page. Over the hero it is
   transparent with white type; past the hero it takes a white ground and ink
   type. That is a common pattern and it is usually decoration; here it is the
   minimum required to keep the thing readable.

   AN INTERSECTION OBSERVER, NOT A SCROLL LISTENER. A scroll handler runs on
   every frame of every gesture and does a layout read to find out where it is;
   this fires twice in the life of the page. The rootMargin insets the viewport
   top by the nav's own height, so the swap happens exactly as the hero's bottom
   edge passes under the bar rather than a nav-height too late.

   THE MOBILE LAYOUT IS TWO ROWS, NOT A HAMBURGER. Four short links plus a CTA
   do not fit on one 375px line, and the usual answer is to hide them behind a
   menu button. That trades a real cost — every route through the page now
   costs a tap and a modal — for a saved 24px. On the second row the four items
   total about 291px against 327px of measure, so they fit, and the whole
   navigation stays visible on a phone. There is no JS menu on this page at all.
   ========================================================================== */
const LINKS = [
  { label: "Work", href: "#work", n: "01" },
  { label: "Process", href: "#process", n: "02" },
  { label: "Pricing", href: "#pricing", n: "03" },
  { label: "Contact", href: "#contact", n: "04" },
];

export function Nav() {
  /* Starts true: the prerendered HTML is the top of the page, which is the
     hero, so the server and the hydrating client agree and nothing flashes. */
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const hero = document.getElementById(HERO_SECTION_ID);
    /* The observer is the only thing that ever writes this state. There is
       deliberately no fallback branch setting it here: a setState in an effect
       body is a cascading render, and the case it would guard — this page
       rendering without its hero — cannot happen without someone editing
       page.tsx, at which point the nav's colour is not the defect they have. */
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <header
      /* data-dark is what globals.css keys the white focus ring off, so a
         keyboard user tabbing the nav over the hero can see where they are. It
         tracks the state rather than being fixed, because past the hero the
         same ring has to go back to ink. */
      data-dark={overHero || undefined}
      className={`${MONO} ${T_12} fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero ? "text-white" : "border-b border-crease bg-white/92 text-press backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[12px] px-[clamp(24px,5vw,64px)] py-[16px] tab:flex-row tab:items-center tab:gap-[24px]">
        {/* Row one on a phone, the left third on a tablet up. */}
        <div className="flex items-center justify-between tab:flex-1">
          <a href="#top" className="flex items-center" aria-label={`${content.brand}, back to top`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
                mark at its native pixels; the optimiser has nothing to do. */}
            <img
              src="/ls-icon.png"
              alt={content.brand}
              className="h-[22px] w-[72px] object-contain"
            />
          </a>

          {/* The CTA lives here on a phone so row one is brand-and-action,
              which is the pair a visitor needs if they read nothing else. */}
          <CtaLink className="tab:hidden" />
        </div>

        <nav aria-label="Sections" className="tab:flex-none">
          <ul className="flex items-center justify-between gap-[12px] tab:justify-center tab:gap-[24px]">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex items-start gap-[4px] transition-opacity duration-200 hover:opacity-70"
                >
                  {link.label}
                  {/* A real <sup>, so it is a superscript to a screen reader
                      and to a text-only rendering rather than a span that
                      happens to sit high. aria-hidden because "Work zero one"
                      read aloud is noise: the number orders the list visually
                      and the list order already carries that to assistive tech. */}
                  <sup aria-hidden="true" className="text-[0.625rem] opacity-60">
                    {link.n}
                  </sup>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* The right third on a tablet up. Balanced against the left third so
            the four centred links land on the page's centre axis rather than on
            the centre of whatever space the brand and the button leave over. */}
        <div className="hidden tab:flex tab:flex-1 tab:justify-end">
          <CtaLink />
        </div>
      </div>
    </header>
  );
}

/* The one place on this page the accent appears outside the section header
   diamonds. It keeps the magenta ground in BOTH nav states: the button is the
   thing the whole page is for, and a button that changes colour when you scroll
   is a button you have to re-find. */
function CtaLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-cue px-[16px] py-[8px] text-white transition-colors duration-200 hover:bg-[#c31d51] ${className}`}
    >
      {CTA}
    </a>
  );
}

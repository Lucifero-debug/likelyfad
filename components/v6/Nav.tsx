"use client";

import { useEffect, useState } from "react";
import { CTA, content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { MONO, T_12 } from "@/lib/v6/theme";

/* ============================================================================
   THE NAV — four links and one pill.

   THE REFERENCE'S NAV IS Features / Use Cases / Gallery / Pricing / Blogs /
   SIGN UP, and every one of those is wrong for us. Sign Up is wrong because
   there is nothing to sign up for. Features and Use Cases are wrong because
   they describe a tool the visitor would operate. Blogs is wrong because there
   is no blog in this repo and a nav link to a page that does not exist is the
   fastest way to look unfinished. What is left is the four things a brand
   marketer actually wants — the work, how it runs, what it costs, and the
   questions — plus the one action.

   THE WORDMARK IS THE MARK ITSELF, not type. It sits at 24px tall, which lands
   its letterforms on roughly the cap height of the mono links beside it, so the
   bar reads as one row rather than as a logo with links parked next to it. The
   mark carries its own warm-to-violet gradient, which is why the accent stays
   rationed to the pill and the cycling word — a third source of colour in a bar
   this small would just be noise.

   IT GAINS A GROUND ON SCROLL. Over the hero the bar is transparent, because
   the hero is a full-bleed image and a solid strip across the top of it would
   crop the composition. Past the hero the page is flat #080B14 and the bar
   takes a translucent ground of the same colour, which keeps the links legible
   once bright work tiles start passing underneath them. That is one state
   change, and it is the minimum required to keep the thing readable rather
   than a flourish.

   AN INTERSECTION OBSERVER, NOT A SCROLL LISTENER. A scroll handler runs on
   every frame of every gesture and does a layout read to find out where it is;
   this fires twice in the life of the page.

   NO HAMBURGER. Four short links plus a pill fit on one 375px line once the
   links drop to the second row, and the usual answer — hiding them behind a
   menu button — trades a real cost (every route through the page now costs a
   tap and a modal) for a saved 24px. There is no JS menu on this page at all.
   ========================================================================== */
const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

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

    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-88px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero ? "" : "border-b border-edge bg-night/85 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[12px] px-[clamp(24px,5vw,64px)] py-[16px] tab:flex-row tab:items-center tab:gap-[32px]">
        <div className="flex items-center justify-between tab:flex-1">
          <a
            href="#top"
            className="flex items-center"
            aria-label={`${content.brand}, back to top`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
                mark at its native pixels; the optimiser has nothing to do. */}
            <img
              src="/ls-icon.png"
              alt={content.brand}
              className="h-[24px] w-[78px] object-contain"
            />
          </a>

          {/* The action sits on row one at phone widths so the pair a visitor
              needs if they read nothing else — who this is, and how to reach
              them — is the first thing on the page. */}
          <CtaPill className="tab:hidden" />
        </div>

        <nav aria-label="Sections">
          <ul className={`${MONO} ${T_12} flex items-center justify-between gap-[16px] text-haze tab:justify-center tab:gap-[32px]`}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors duration-200 hover:text-beam"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Balanced against the left third so the four links land on the
            page's centre axis rather than on the centre of whatever space the
            wordmark and the pill leave over. */}
        <div className="hidden tab:flex tab:flex-1 tab:justify-end">
          <CtaPill />
        </div>
      </div>
    </header>
  );
}

/* One of exactly two places the accent appears on this page. The other is the
   cycling word. It keeps its magenta ground in BOTH nav states: the pill is
   the thing the whole page is for, and a button that changes colour when you
   scroll is a button you have to re-find. */
function CtaPill({ className = "" }: { className?: string }) {
  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${MONO} ${T_12} rounded-[999px] bg-cue px-[16px] py-[8px] text-white transition-colors duration-200 hover:bg-[#c31d51] ${className}`}
    >
      {CTA}
    </a>
  );
}

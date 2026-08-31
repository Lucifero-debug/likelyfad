"use client";

import { useEffect, useRef, useState } from "react";
import { CTA, content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { MONO, T_12, T_24 } from "@/lib/v4/theme";

/* ============================================================================
   THE CORNER FURNITURE — logo top-left, Menu top-right, CTA bottom-right, and
   the overlay the Menu opens.

   THE ONE PLACE THIS PAGE DEPARTS FROM THE REFERENCE. Personaal has no
   persistent CTA, because Personaal is a portfolio being read by designers who
   are browsing. This page is read by a brand marketer deciding in about eight
   seconds whether we can be trusted with budget, and asking them to open a
   menu to find out how to reach us would be borrowing the reference's
   confidence without having earned it. So the CTA is pinned, always visible,
   and it is one of only two things on the page wearing the accent.

   IT SITS BOTTOM-RIGHT, not in the top bar. The top bar is where the reference
   puts navigation, and a magenta button up there would turn the corner
   furniture into a conventional nav — the exact thing the flat scale is
   avoiding. Diagonally opposite the logo it reads as a fixed action rather
   than as a nav item, and it never collides with the Menu overlay's own close.

   THE OVERLAY IS FIVE WORDS AND NOTHING ELSE. No dropdowns, no submenus, no
   description under each link. The whole justification for hiding navigation
   is that there is almost none to hide.
   ========================================================================== */
const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Frame() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /* Escape closes, focus goes to the first link on open and back to the Menu
     button on close, and the page behind stops scrolling. An overlay that
     leaves focus on the page under it is a keyboard trap in reverse: you tab
     into content you cannot see. */
  useEffect(() => {
    if (!open) return;

    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <>
      {/* Top rail. Two items, both small, both mono — the page's whole
          chrome. It does not change on scroll: the ground is one flat sheet
          colour everywhere, so there is never a moment where these stop
          reading against what is behind them. */}
      <header
        className={`${MONO} ${T_12} pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-[24px] mix-blend-normal`}
      >
        <a
          href="#top"
          className="pointer-events-auto flex items-center bg-sheet px-[8px] py-[6px]"
          aria-label={`${content.brand}, back to top`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size
              mark at its native pixels; the optimiser has nothing to do. */}
          <img
            src="/ls-icon.png"
            alt={content.brand}
            className="h-[18px] w-[59px] object-contain"
          />
        </a>

        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="pointer-events-auto bg-sheet px-[8px] py-[4px] text-carbon"
        >
          Menu
        </button>
      </header>

      {/* The persistent action. */}
      <a
        href={contactUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${MONO} ${T_12} fixed right-[24px] bottom-[24px] z-50 bg-cue px-[16px] py-[12px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
      >
        {CTA}
      </a>

      {open && (
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-sheet"
        >
          <div className={`${MONO} ${T_12} flex items-start justify-between p-[24px]`}>
            <span className="text-ash">{content.brand}</span>
            <button type="button" onClick={close} className="text-carbon">
              Close
            </button>
          </div>

          <nav aria-label="Sections" className="flex flex-1 items-center px-[24px]">
            <ul className="flex flex-col gap-[16px]">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={close}
                    className={`${T_24} text-carbon`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The action is in the overlay too. Someone who opened the menu
              looking for "contact" should not have to close it again to find
              the one thing the page wants them to do. */}
          <div className="p-[24px]">
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`${MONO} ${T_12} inline-flex bg-cue px-[16px] py-[12px] text-white`}
            >
              {CTA}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

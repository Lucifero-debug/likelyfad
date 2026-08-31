import { content } from "@/lib/content";
import { MONO, PILL, T_12, WRAP } from "@/lib/v3/theme";
import { CtaButton } from "./CtaButton";

/* ============================================================================
   THE NAV — two floating pills, not a bar.

   A full-width bar would put a hard horizontal edge across the top of a page
   whose whole visual idea is objects floating on a light ground. Two pills
   sitting over the page keep that idea intact from the first pixel, and the
   near-white showing between them is what tells you they are floating.

   NO BACKDROP BLUR AND NO SCROLL STATE. Both would be solving a problem this
   page does not have: the pills are opaque and the ground behind them is the
   same near-white everywhere, so there is never a moment where content slides
   under them illegibly. Adding a scroll listener to change something nobody
   would see is cost with no return.

   NO HAMBURGER BELOW 761px. The four links are anchors into a page you are
   already scrolling, and a drawer to reach them is a menu that exists to hold
   a menu. The wordmark and the button stay, which are the two things that
   actually have to be there.
   ========================================================================== */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-[16px] z-50">
      <div className={`${WRAP} flex items-center justify-between gap-[16px]`}>
        <a
          href="#top"
          className={`${PILL} flex items-center bg-raised px-[20px] py-[13px]`}
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

        <div className={`${PILL} flex items-center gap-[8px] bg-raised p-[8px]`}>
          <nav aria-label="Sections" className="hidden tab:block">
            <ul className={`${MONO} ${T_12} flex items-center gap-[24px] px-[16px] text-stone`}>
              {content.nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:text-graphite"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <CtaButton size="sm" />
        </div>
      </div>
    </header>
  );
}

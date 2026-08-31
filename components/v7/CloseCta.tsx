import { CTA, content } from "@/lib/content";
import { PARENT_COMPANY, SITE_NAME, X_HANDLE, contactUrl } from "@/lib/site";
import { CLOSE_KICKER, STUDIO } from "@/lib/v7/data";
import {
  ANCHOR,
  DISPLAY,
  MONO,
  SECTION,
  T_12,
  T_17,
  T_80,
  WRAP,
} from "@/lib/v7/theme";
import { Pushpin } from "./Marks";

/* ============================================================================
   THE CLOSE — the last ask and the colophon, in one bracket.

   IT IS THE <footer>, so the page does not end on a CTA and then start again
   with a strip of links underneath it. One ending.

   IT STAYS ON THE BOARD. The obvious move is a full-bleed dark band to bookend
   the hero, and it is the wrong one here: this page's whole idea is that it is
   ONE WALL, and a dark band at the bottom would announce that the wall has
   stopped and something else has begun. The hero is dark because it is a
   video. Nothing else needs to be.

   80, THE SAME SIZE AS THE HERO, AND THE ONLY OTHER PLACE IT APPEARS. Those
   two lines are the claim and the ask, they are the two things a visitor who
   reads nothing else should come away with, and they are the two ends of the
   page. Everything between them tops out at 44.

   ONE BUTTON. The brief says one and there is one — no secondary link, no
   "or book a call", no second colour. The last screen of a page is the worst
   possible place to give somebody a choice about what to do next.

   THE FOUR SECTION LINKS ARE HERE BECAUSE THE MOBILE NAV DOES NOT CARRY THEM.
   That is not a footer being thorough for its own sake: below 761px the bar is
   the wordmark alone (see the arithmetic in Nav.tsx), so this is the only
   place a phone visitor can jump between sections, and it is one scroll-to-end
   away from anywhere on the page.

   TODO — NO EMAIL ADDRESS EXISTS IN THIS REPO. There is an obvious slot for
   one in the contact rows below and the reference site fills its equivalent.
   lib/site.ts is explicit that the X profile is the only real outbound link on
   this site, so that is the only channel rendered; a fake mailto on a live
   page is a worse defect than a missing row. Add it to STUDIO in
   lib/v4/data.ts and this section will have somewhere to put it.
   ========================================================================== */
export function CloseCta() {
  return (
    <footer id="contact" aria-labelledby="v7-close-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>{CLOSE_KICKER}</p>

        <h2
          id="v7-close-title"
          className={`${DISPLAY} ${T_80} mt-[32px] max-w-[16ch] text-balance text-mark`}
        >
          {content.close.heading.replace(/\*/g, "")}
        </h2>

        <p className={`${T_17} mt-[32px] max-w-[52ch] text-note`}>{content.close.sub}</p>

        <div className="relative mt-[48px] inline-block">
          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`${MONO} ${T_12} relative inline-block rounded-[999px] bg-cue px-[32px] py-[16px] text-white transition-colors duration-200 hover:bg-[#c31d51]`}
          >
            {CTA}
          </a>

          {/* The third and last place the accent appears, pinned like the one
              in the studio statement. Outside the anchor, so it is never part
              of the link's hit area or its accessible name. */}
          <Pushpin className="pointer-events-none absolute -top-[9px] left-1/2 size-[22px] -translate-x-1/2" />
        </div>

        {/* ---- The colophon ---- */}
        <div className="mt-[96px] grid gap-[48px] border-t border-hair pt-[48px] phone:grid-cols-2 lap:grid-cols-4">
          <div>
            <p className={`${MONO} ${T_12} text-note`}>Studio</p>
            <p className={`${MONO} ${T_12} mt-[16px] text-mark`}>
              {`${STUDIO.city}, ${STUDIO.country}`}
            </p>
            <p className={`${MONO} ${T_12} mt-[8px] text-note`}>
              {`Working hours are ${STUDIO.timeZoneLabel}`}
            </p>
          </div>

          <div>
            <p className={`${MONO} ${T_12} text-note`}>Sections</p>
            <ul className="mt-[16px] flex flex-col gap-[8px]">
              {content.nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`${MONO} ${T_12} text-mark transition-opacity duration-200 hover:opacity-65`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`${MONO} ${T_12} text-note`}>Reach us</p>
            <p className="mt-[16px]">
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${MONO} ${T_12} text-mark transition-opacity duration-200 hover:opacity-65`}
                aria-label={`${SITE_NAME} on X, at ${X_HANDLE}`}
              >
                {`X / @${X_HANDLE}`}
              </a>
            </p>
          </div>

          <div>
            <p className={`${MONO} ${T_12} text-note`}>{SITE_NAME}</p>
            <p className={`${MONO} ${T_12} mt-[16px] text-mark`}>{content.footer.tagline}</p>
            <p className={`${MONO} ${T_12} mt-[8px] text-note`}>{`Part of ${PARENT_COMPANY}`}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

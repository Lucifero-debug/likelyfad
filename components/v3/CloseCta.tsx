import { content } from "@/lib/content";
import { X_HANDLE, contactUrl } from "@/lib/site";
import { DISPLAY, MONO, SECTION, T_12, T_17, T_72, WRAP } from "@/lib/v3/theme";
import { CtaButton } from "./CtaButton";

/* ============================================================================
   THE CLOSE — the page's last panel, and the largest one.

   It is near-black for the same reason every other panel is: this page puts
   the things that matter inside dark objects floating on a light ground, and
   the ask is the last thing that matters. Ending on the page colour instead
   would have let the close dissolve into the footer under it.

   The headline runs at the hero's size, deliberately. It is the only other
   place on the page at 72, and opening and closing on the same note is the
   argument made twice: the work, then the ask.

   THE CTA INVERTS HERE. Everywhere else the button is near-black on near-white
   and is the most solid thing in view. Inside a near-black panel that button
   would disappear, so it flips to the page colour — same shape, same label,
   still the only filled control in sight.
   ========================================================================== */
export function CloseCta() {
  return (
    <section className={SECTION} aria-labelledby="close-heading">
      <div className={WRAP}>
        <div className="rounded-[24px] bg-panel p-[32px] phone:p-[48px] lap:p-[96px]">
          <h2
            id="close-heading"
            className={`${DISPLAY} ${T_72} max-w-[16ch] text-balance text-page`}
          >
            Ready to run ads nobody clocks as AI?
          </h2>

          <p className={`${T_17} mt-[24px] max-w-[46ch] text-mist`}>{content.close.sub}</p>

          <div className="mt-[48px]">
            <CtaButton label={content.close.cta} className="!bg-page !text-panel hover:!bg-raised" />
          </div>

          {/* Contact details. The X profile is the only real outbound link on
              this site; everything else in lib/site.ts is a marked
              placeholder, so nothing here invents an address to fill a row. */}
          <p className={`${MONO} ${T_12} mt-[64px] text-mist`}>
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-page"
            >
              X / @{X_HANDLE}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

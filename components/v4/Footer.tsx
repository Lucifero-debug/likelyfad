import { content } from "@/lib/content";
import { PARENT_COMPANY, SITE_NAME, X_HANDLE, contactUrl } from "@/lib/site";
import { STUDIO } from "@/lib/v4/data";
import { MONO, SECTION, T_12, T_13, WRAP } from "@/lib/v4/theme";

/* ============================================================================
   THE FOOTER — set as an address block, the way a shop would print one.

   The reference site closes on hours, a street address and a phone number, and
   the effect is that you are looking at a place rather than a landing page.
   That is worth copying; the specific rows are not, because we do not have a
   street address or a phone line and printing one would be a lie in the one
   part of a site people actually trust.

   So this is the honest version of the same gesture: where we are, what we do,
   the one channel that really reaches us, and who owns the company. Every row
   is true, and the shape still says "a studio you can turn up to".

   TODO — NO EMAIL, same as the status panel. lib/site.ts is explicit that the
   X profile is the only real outbound link on this site. Add the address to
   STUDIO in lib/v4/data.ts and this block will carry it.
   ========================================================================== */
export function Footer() {
  return (
    <footer className={`${SECTION} border-t border-seam`}>
      <div className={WRAP}>
        <div className="grid gap-[48px] phone:grid-cols-2 lap:grid-cols-4">
          <div>
            <h2 className={`${MONO} ${T_12} text-ash`}>{SITE_NAME}</h2>
            <p className={`${T_13} mt-[16px] max-w-[28ch] text-carbon`}>
              {content.footer.tagline}
            </p>
          </div>

          <div>
            <h2 className={`${MONO} ${T_12} text-ash`}>Studio</h2>
            <p className={`${T_13} mt-[16px] text-carbon`}>
              {STUDIO.city}
              <br />
              {STUDIO.country}
            </p>
          </div>

          <div>
            <h2 className={`${MONO} ${T_12} text-ash`}>Hours</h2>
            <p className={`${T_13} mt-[16px] text-carbon`}>
              DMs, 7 days
              <br />
              First concepts in 48 hours
            </p>
          </div>

          <div>
            <h2 className={`${MONO} ${T_12} text-ash`}>Contact</h2>
            <p className={`${T_13} mt-[16px] text-carbon`}>
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-seam transition-colors duration-200 hover:decoration-carbon"
              >
                X / @{X_HANDLE}
              </a>
            </p>
          </div>
        </div>

        {/* 96 above the colophon, which is the same seam this page puts
            between sections. It is the last line and it should read as
            separate from the block over it, not as a fifth column. */}
        <p className={`${MONO} ${T_12} mt-[96px] text-ash`}>
          {STUDIO.city} based AI ad studio · {PARENT_COMPANY} · &copy;
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

import { content } from "@/lib/content";
import { PARENT_COMPANY, SITE_NAME, X_HANDLE, contactUrl } from "@/lib/site";
import { DISPLAY, MONO, SECTION, T_12, T_17, T_72, WRAP } from "@/lib/v2/theme";
import { CtaButton } from "./CtaButton";
import { SplitHeading } from "./SplitHeading";

/* ============================================================================
   THE CLOSE — and the footer, because on a nine-section service page they are
   the same thing. A separate footer under this would repeat the four nav links
   a reader has just scrolled past and add a second boundary to a page that
   already ends here.

   The headline runs at the hero's size, deliberately. It is the only other
   place on the page at 72, and the page opening and closing on the same note
   is the argument being made twice: the work, then the ask.
   ========================================================================== */
export function CloseCta() {
  return (
    <footer className={`${SECTION} border-t border-rule`}>
      <div className={WRAP}>
        <h2 className={`${DISPLAY} ${T_72} max-w-[18ch] text-balance`}>
          <SplitHeading raw={content.close.heading} />
        </h2>

        <p className={`${T_17} mt-[24px] max-w-[46ch] text-dim`}>{content.close.sub}</p>

        <div className="mt-[48px]">
          <CtaButton label={content.close.cta} />
        </div>

        {/* Contact details. The X profile is the only real outbound link on
            this site; everything else in lib/site.ts is a marked placeholder,
            so nothing here invents an address or a phone number to fill a row. */}
        <div
          className={`${MONO} ${T_12} mt-[96px] flex flex-wrap items-center gap-x-[32px] gap-y-[12px] border-t border-rule pt-[32px] text-dim`}
        >
          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-lit"
          >
            X / @{X_HANDLE}
          </a>
          <span>{content.footer.tagline}</span>
          <span className="ms-auto">
            {SITE_NAME} · {PARENT_COMPANY}
          </span>
        </div>
      </div>
    </footer>
  );
}

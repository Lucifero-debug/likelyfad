import { CTA } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { CORNER, MONO, T_12 } from "@/lib/v2/theme";

/* ============================================================================
   THE PRIMARY CTA — the only thing on this page wearing the accent.

   Four sections need it (nav, hero, pricing, close) and they all fire the same
   action, so it is one component rather than four copies of a class string.
   That is also what enforces the colour rule: #E0245E is spelled once, in
   globals.css, and any other accent on this page would have to be written by
   hand and would be obvious in review.

   Square, not a pill. A pill button on near-black with one bright accent is
   the other half of the default this page is trying not to be; 2px corners
   read as a slate, which is the room the rest of the page is set in. The
   Butter-modelled /v3 rounds the same button to a full pill, which is the
   clearest single tell of which page you are looking at.
   ========================================================================== */
export function CtaButton({
  label = CTA,
  size = "lg",
  className = "",
}: {
  label?: string;
  /** sm is the nav, where the button shares a 64px bar with the wordmark. */
  size?: "sm" | "lg";
  className?: string;
}) {
  const pad = size === "sm" ? "px-[16px] py-[8px]" : "px-[32px] py-[16px]";

  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${MONO} ${T_12} ${CORNER} ${pad} inline-flex items-center justify-center bg-cue text-white transition-colors duration-200 hover:bg-[#c31d51] ${className}`}
    >
      {label}
    </a>
  );
}

import { CTA } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { MONO, PILL, T_12 } from "@/lib/v3/theme";

/* ============================================================================
   THE PRIMARY CTA.

   Four places need it (nav, hero, pricing, close) and they all fire the same
   action, so it is one component rather than four copies of a class string.

   IT IS THE PANEL COLOUR, NOT THE ACCENT. On this page the near-black is the
   loudest thing available — every panel is already using it to hold media —
   so a button in the same near-black reads as the most solid object on a
   near-white page without spending the magenta. That leaves the accent free
   for the one place the brief reserves it: the word reveal in the statement
   section. A magenta button here would put the accent in five places and the
   statement would stop being the only coloured moment on the page.
   ========================================================================== */
export function CtaButton({
  label = CTA,
  size = "lg",
  className = "",
}: {
  label?: string;
  /** `sm` is the nav, where the button sits inside a pill with the links. */
  size?: "sm" | "lg";
  className?: string;
}) {
  const pad = size === "sm" ? "px-[16px] py-[8px]" : "px-[32px] py-[16px]";

  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${MONO} ${T_12} ${PILL} ${pad} inline-flex items-center justify-center bg-panel text-page transition-colors duration-200 hover:bg-graphite ${className}`}
    >
      {label}
    </a>
  );
}

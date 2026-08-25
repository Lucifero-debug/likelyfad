import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

/* Kicker over a big centred heading.

   The measure is derived from the title size rather than set in ch or em — an
   em cap would resolve against the BODY font size, not the title's — so every
   heading breaks over two lines at any viewport instead of three on a phone and
   one on a desktop. ~13 title-em is wide enough for that and far too narrow to
   collapse onto one line.

   The heading IS the RevealText root, so it carries `display: inline` and the
   words inside it are the boxes that lay the line out. That is v1's structure,
   not an accident of it — see RevealText on why plain text sets differently.

   titleSize and leading arrive as inline styles rather than as classes on
   purpose: a section that overrides either (WhyUs and Pricing both do) would
   otherwise be setting the same property from a second utility of equal
   specificity, and which one won would come down to the order Tailwind happened
   to emit them in. An inline style has no such argument to lose. */
const DEFAULT_TITLE = "clamp(1.9rem, 1.35rem + 4.4vw, 4.6rem)";

export function SectionHeading({
  kicker,
  heading,
  tone = "ink",
  titleSize = DEFAULT_TITLE,
  leading,
  className = "",
}: {
  kicker: string;
  heading: string;
  /** "bright" on the dark bands, where the paper-safe ramp goes muddy. */
  tone?: "ink" | "bright";
  titleSize?: string;
  /** Overrides the 1.04 the display sizes share. */
  leading?: string;
  className?: string;
}) {
  return (
    <div
      style={{ "--title": titleSize } as CSSProperties}
      className={`mx-auto mb-4 max-w-[calc(var(--title)*13)] text-center ${className}`}
    >
      <Reveal>
        {/* Section kickers sit above a big heading, so they carry more presence
            than the standalone one in the hero: bigger type, longer rule. */}
        <span
          className={`inline-flex items-center gap-[0.65em] font-mono font-medium uppercase tracking-[0.22em] text-[clamp(0.8rem,0.73rem+0.36vw,1.05rem)] before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-[''] ${
            tone === "ink" ? "text-pink-deep" : "text-ink-dim"
          }`}
        >
          {kicker}
        </span>
      </Reveal>
      {/* mt-3 is inert here and is kept only because v1 carries it: margin-top
          does nothing on a non-replaced inline element, and this h2 is inline.
          The gap under the kicker is line-box height, not margin. Give the h2 a
          block wrapper if you ever want that 12px back. */}
      <RevealText
        as="h2"
        tone={tone}
        text={heading}
        style={leading ? { lineHeight: leading } : undefined}
        className="mt-3 text-balance font-display text-(length:--title) font-bold leading-[1.04] tracking-[-0.022em]"
      />
    </div>
  );
}

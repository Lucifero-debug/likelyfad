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

   LEADING IS 1.2 ON ALL FIVE, and that is the whole rule — line-height is
   font-size * 1.2, so the 73.6px a heading sets at desktop leads at 88.3px.
   Why us used to run 0.92 and Pricing 0.9, on the grounds that a heading this
   large can take a tighter setting than the type around it; true, but three
   values across five headings that are otherwise identical read as three
   accidents rather than as one decision.

   titleSize and leading still arrive as inline styles rather than as classes,
   even with nothing overriding them today: a section that set either from a
   second utility would be writing the same property from two classes of equal
   specificity, and which one won would come down to the order Tailwind happened
   to emit them in. An inline style has no such argument to lose. */
const DEFAULT_TITLE = "clamp(1.9rem, 1.35rem + 4.4vw, 4.6rem)";

/* The measure, in title-em. 13 is the number that makes an UNBROKEN heading
   turn over two lines at every viewport — see the note above.

   A heading that sets its own break with a \n does not need that and is hurt by
   it: the measure then has to be wide enough that neither half wraps AGAIN, or
   the hard break buys a third line instead of fixing the second. Those pass a
   larger number. */
const DEFAULT_MEASURE = "13";

export function SectionHeading({
  kicker,
  heading,
  tone = "ink",
  titleSize = DEFAULT_TITLE,
  measure = DEFAULT_MEASURE,
  leading,
  className = "",
}: {
  kicker: string;
  heading: string;
  /** "bright" on the dark bands, where the paper-safe ramp goes muddy. */
  tone?: "ink" | "bright";
  titleSize?: string;
  /** Measure in title-em. Widen it for a heading that breaks itself with a \n. */
  measure?: string;
  /** Overrides the 1.2 every section heading sets. Nothing passes this today
      — the five headings are deliberately one number. */
  leading?: string;
  className?: string;
}) {
  return (
    <div
      /* --measure rides in beside --title for the same reason: a section that
         widened the measure with a second `max-w-` utility would be setting one
         property from two classes of equal specificity, and the winner would
         come down to Tailwind's emit order. An inline custom property has no
         such argument to lose. */
      style={{ "--title": titleSize, "--measure": measure } as CSSProperties}
      /* NO TOP MARGIN. The section's own padding is the entire gap above a
         heading; an 8px rider on top of it bought nothing and was half of why
         the FAQ's two columns started at visibly different heights. The 16px
         below is the heading-to-sub half of the rhythm — the rest of the gap
         belongs to the section, as HEAD_GAP. */
      className={`mx-auto mb-4 max-w-[calc(var(--title)*var(--measure))] text-center ${className}`}
    >
      <Reveal>
        {/* Section kickers sit above a big heading, so they carry more presence
            than the standalone one in the hero: bigger type, longer rule. */}
        <span
          className={`inline-flex items-center gap-[0.62em] font-mono font-medium uppercase tracking-[0.22em] text-[clamp(0.8rem,0.73rem+0.36vw,1.05rem)] before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-[''] ${
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
      {/* A heading that sets its own break with a \n must NOT be balanced. The
          two are the same decision made by different parties: `balance` evens
          the lines by choosing where they turn, which is precisely the choice
          the \n took away from it. Left on, it goes looking for a second break
          to even out the short line the author just made, and splits a half
          that would otherwise have fit — the hard break buys a third line
          rather than fixing the second.

          `text-pretty` and `text-balance` are one property written two ways, so
          this is a swap rather than an override: two classes both setting
          text-wrap would have their winner decided by Tailwind's emit order. */}
      <RevealText
        as="h2"
        tone={tone}
        text={heading}
        style={leading ? { lineHeight: leading } : undefined}
        className={`mt-3 ${
          heading.includes("\n") ? "text-pretty" : "text-balance"
        } font-display text-(length:--title) font-bold leading-[1.2] tracking-[-0.022em]`}
      />
    </div>
  );
}

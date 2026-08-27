import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_H2, TEXT_SMALL } from "@/lib/ui";

/* Kicker over a big centred heading.

   The measure is derived from the title size rather than set in ch or em — an
   em cap would resolve against the BODY font size, not the title's — so every
   heading breaks over two lines at any viewport instead of three on a phone and
   one on a desktop. ~13 title-em is wide enough for that and far too narrow to
   collapse onto one line.

   The heading IS the RevealText root, so it carries `display: inline` and the
   words inside it are the boxes that lay the line out. That is v1's structure,
   not an accident of it — see RevealText on why plain text sets differently.

   LEADING IS ONE SETTING ON ALL FIVE, and that is the whole rule. It is one
   SETTING and not one NUMBER, because --title spans 30px to 74px and leading
   tracks size inversely: 1.2 below the split, 1.1 from `lap:` up, where the
   clamp is past 48px and 1.2 starts reading as a gap between the lines rather
   than as the setting of a heading.
   Why us used to run 0.92 and Pricing 0.9, on the grounds that a heading this
   large can take a tighter setting than the type around it; true, but three
   values across five headings that are otherwise identical read as three
   accidents rather than as one decision.

   An overriding titleSize, and leading, still arrive as inline styles rather
   than as classes: a section that set either from a second utility would be
   writing the same property from two classes of equal specificity, and which
   one won would come down to the order Tailwind happened to emit them in. An
   inline style has no such argument to lose — and it beats the default below
   without needing to, since a style attribute outranks any class. */

/* THE HERO HEADLINE IS THE BIGGEST TYPE ON THE PAGE, and every section heading
   sits one step under it. That step is 0.88, and this ramp is nothing but the
   hero's own multiplied through by it — same floor, same slope, same ceiling,
   scaled. Change the hero's size and this has to move with it or the ladder
   inverts.

   IT NEEDS THE HERO'S BREAKPOINT TOO, which is the part that was missing. The
   hero sets two ramps, not one: below `lap:` it owns the full width and runs
   44→67px, and from 961px up it shares the row with the reel wall, so it drops
   to a column-sized 42→75px tuned to break its 39 characters over exactly two
   lines. A section heading is full-width in BOTH layouts, so a single clamp
   here tracked the wide one and sailed straight past the narrow one: at 1200px
   the hero set 51px and these set 74px — the page's biggest heading was a
   section, not the headline, by nearly half again.

   So this takes the hero's discontinuity along with its sizes. Sections do step
   down at 961px even though their own layout does not change; that is the cost
   of staying under a headline that steps down there, and the alternative — one
   continuous ramp low enough to clear the narrow hero — would have to hold every
   section heading at ~37px on a phone as well, where the hero is 44px and there
   is no reason for them to be that small.

   The measure below is in title-em, so it scales with these and the headings
   still break where they broke — smaller type over the same character count,
   not the same type over a longer line.

   The ramp itself is TEXT_H2, one step of the page's type scale — the ladder it
   belongs to, and the two steps that sit under it, are written up in lib/ui.ts. */

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
  titleSize,
  measure = DEFAULT_MEASURE,
  leading,
  className = "",
}: {
  kicker: string;
  heading: string;
  /** "bright" on the dark bands, where the paper-safe ramp goes muddy. */
  tone?: "ink" | "bright";
  /** Replaces the whole TITLE ramp, both sides of the breakpoint. Nothing
      passes this today — one heading size is the point. */
  titleSize?: string;
  /** Measure in title-em. Widen it for a heading that breaks itself with a \n. */
  measure?: string;
  /** Overrides the 1.2 / lap:1.1 every section heading sets. Nothing passes
      this today — the five headings are deliberately one setting. */
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
      style={
        { ...(titleSize ? { "--title": titleSize } : null), "--measure": measure } as CSSProperties
      }
      /* NO TOP MARGIN. The section's own padding is the entire gap above a
         heading; an 8px rider on top of it bought nothing and was half of why
         the FAQ's two columns started at visibly different heights. The 16px
         below is the heading-to-sub half of the rhythm — the rest of the gap
         belongs to the section, as HEAD_GAP. */
      className={`${TEXT_H2} mx-auto mb-4 max-w-[calc(var(--title)*var(--measure))] text-center ${className}`}
    >
      <Reveal>
        {/* Section kickers sit above a big heading, so they carry more presence
            than the standalone one in the hero: bigger type, longer rule. */}
        <span
          className={`inline-flex items-center gap-[0.62em] font-mono font-medium uppercase tracking-[0.22em] ${TEXT_SMALL} before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-[''] ${
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
        } font-display text-(length:--title) font-bold leading-[1.2] lap:leading-[1.1] tracking-[-0.022em]`}
      />
    </div>
  );
}

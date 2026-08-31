import { YEAR } from "@/lib/v5/data";
import { MONO, T_12 } from "@/lib/v5/theme";

/* ============================================================================
   THE THREE-PART HAIRLINE HEADER ROW — the signature element of this page.

   A thin rule with three things sitting on it: a diamond and an index on the
   left, the section name centred in parentheses, the year on the right. It
   appears above all six content sections and it is the single reason the page
   reads as a DOCUMENT rather than as a landing page. Everything between two of
   these rows is deliberately quiet; the boldness on this page is spent here and
   on the hero wordmark, and nowhere else.

   THE DIAMOND IS ONE OF ONLY TWO PLACES THE ACCENT APPEARS. The other is the
   CTA button. Six small magenta diamonds running down the left edge of the
   page, at 12px, are enough to carry the brand colour through a page that is
   otherwise black, white and grey — and spending the accent on anything else
   would flatten all of them.

   WHY A THREE-COLUMN GRID AND NOT flex WITH justify-between. The centre item
   has to be centred ON THE PAGE, not centred in whatever space the two side
   items leave over. With justify-between, "(Studio)" and "(Process)" would sit
   at visibly different x positions purely because one word is longer than the
   other, and six rows down the page that misalignment is the only thing you
   would see. Three equal columns with the middle one centred fixes every row to
   the same axis.

   IT STAYS ON ONE LINE AT 375. At 12px mono with 0.14em tracking the three
   items total about 180px against 327px of available measure, so nothing wraps
   and no narrow-width variant is needed.

   THE HEADING IS THE REAL <h2>. The section name is not decoration standing in
   front of a hidden heading somewhere else — it IS the heading, parenthesised.
   The parentheses are aria-hidden so a screen reader hears "Studio" rather than
   "left paren Studio right paren", and the index and the year are aria-hidden
   too: they are furniture, and a screen reader reading "diamond 01 Studio
   copyright 2026" for all six sections would be noise where the outline should
   be.
   ========================================================================== */
export function SectionHead({
  index,
  name,
  id,
}: {
  /** Two digits, from SECTIONS in lib/v5/data.ts so the run stays consecutive. */
  index: string;
  /** The section name. Rendered in parentheses, and it is the h2. */
  name: string;
  /** Ties the row's heading to the section for `aria-labelledby`. */
  id?: string;
}) {
  return (
    <div
      className={`${MONO} ${T_12} grid grid-cols-3 items-center gap-[16px] border-t border-crease pt-[16px] text-pencil`}
    >
      <span className="flex items-center gap-[8px] justify-self-start">
        {/* A geometric shape, not an icon import. There is no icon set on this
            page and adding one for a single 8px glyph would make it the only
            illustration in view. */}
        <span aria-hidden="true" className="text-cue">
          &#9670;
        </span>
        <span aria-hidden="true">({index})</span>
      </span>

      <h2 id={id} className="justify-self-center text-center text-lead">
        <span aria-hidden="true">(</span>
        {name}
        <span aria-hidden="true">)</span>
      </h2>

      <span aria-hidden="true" className="justify-self-end">
        &copy; {YEAR}
      </span>
    </div>
  );
}

/* ============================================================================
   THE MARK VOCABULARY — every drawn thing on this page, in one file.

   ALL OF IT IS DECORATIVE AND ALL OF IT IS aria-hidden. Not one of these
   carries information: the pushpin does not say "pinned", the paperclip does
   not say "attached", and the crop mark does not say anything at all. They are
   the texture that makes a cream page with big type read as a creative wall
   rather than as a template, which is a job done entirely by eye. A screen
   reader hearing "image" nine times would get nothing and lose the thread of
   the section it is in.

   NO ICON LIBRARY. Nine shapes at four to eight path commands each is less
   code than the import, and an off-the-shelf set would bring its own stroke
   weight, its own corner radius and its own optical sizing into a page whose
   whole argument is that its details were decided rather than defaulted. These
   are drawn to one stroke weight and one radius.

   WHY THE PUSHPIN IS FOUR CIRCLES AND NOT ONE. A flat magenta dot is clip art;
   it is the single fastest way to make this page look like a template that
   bought a sticker pack. What makes a pin head read as a physical object
   sitting ON the card rather than as a circle drawn INTO it is the cast shadow
   offset down and right, and the specular highlight offset up and left. Two
   extra circles, and they are the entire difference.
   ========================================================================== */

type MarkProps = { className?: string };

/* ---------------------------------------------------------------------------
   THE PUSHPIN. Head-on, as a pin looks when it is holding something flat
   against a wall rather than the three-quarter view every icon set draws.

   The head is the accent, and this is one of exactly three places the accent
   appears on the page — the others are the status dot in the hero and the
   primary CTA. Every pin on the page is the same pin at the same size; a wall
   where the pins vary is a wall someone decorated.
   --------------------------------------------------------------------------- */
export function Pushpin({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" focusable="false" className={className}>
      {/* Cast shadow, down and right. Drawn first so it sits under the head. */}
      <circle cx="11.7" cy="11.9" r="6.6" fill="rgba(20,19,16,0.16)" />
      <circle cx="10.4" cy="10.2" r="6.6" fill="var(--color-cue)" />
      {/* The rim. Without it the head floats on a light card with no edge. */}
      <circle cx="10.4" cy="10.2" r="6.6" fill="none" stroke="rgba(20,19,16,0.2)" strokeWidth="0.8" />
      {/* Specular, up and left, which is where the shadow says the light is. */}
      <circle cx="8.1" cy="7.9" r="1.9" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   THE PAPERCLIP. Stroked, never filled, and it takes its colour from
   currentColor so a clip on a white sticker and a clip on a cream card are the
   same object in two contexts rather than two hard-coded greys.
   --------------------------------------------------------------------------- */
export function Paperclip({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 14 28" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M10.2 6.2v14.1a4.2 4.2 0 0 1-8.4 0V7.6a2.8 2.8 0 0 1 5.6 0v12.6a1.4 1.4 0 0 1-2.8 0V8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   THE HOLE PUNCH — a ring, not a filled dot.

   THIS IS THE ONE THAT KEEPS THE STICKERS OUT OF TEMPLATE TERRITORY. The
   reference puts a small coloured dot on each of its labels, and copying that
   here left two bad options: four different colours, which invents a palette
   this page does not have and cannot justify, or four magenta dots, which
   spends the accent on decoration and leaves the CTA competing with four
   things that do nothing. A punched hole is what a tag pinned to a wall
   actually has, it costs no colour at all, and it is the detail that says
   somebody thought about what these objects are.

   The inner arc is a shadow on the top edge of the hole, which is what makes
   it read as punched THROUGH the paper rather than printed on it.
   --------------------------------------------------------------------------- */
export function HolePunch({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" className={className}>
      <circle cx="6" cy="6" r="3.6" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M3.1 4.4a3.6 3.6 0 0 1 5.8 0"
        fill="none"
        stroke="rgba(20,19,16,0.28)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   THE FOLDED CORNER. The gradient doing the work lives in globals.css as
   .v7-fold, because a two-layer gradient with a calc() stop is past what an
   arbitrary Tailwind value carries legibly. This is only the box it paints in.

   Bottom right, always. A dog-ear that appears on a different corner per card
   reads as an accident rather than as how these cards are made.
   --------------------------------------------------------------------------- */
export function FoldedCorner({ className = "" }: MarkProps) {
  return <span aria-hidden="true" className={`v7-fold absolute right-0 bottom-0 ${className}`} />;
}

/* ---------------------------------------------------------------------------
   THE THREE MARGINAL MARKS.

   THE REFERENCE SCATTERS ABOUT A DOZEN DOODLES — squiggles, clouds, a pen nib,
   a pair of eyes — and that is the single most template-looking thing on it.
   There are three here, they sit in the margins, and none of them ever crosses
   text. A wall that is pinned reads as a studio at work; a wall that is messy
   reads as a stock illustration pack.

   THEY ARE ALSO NOT GENERIC. A squiggle and a cloud belong to no particular
   trade. These three are marks an ad studio actually makes: a crop mark, an
   arrow pointing at the thing to look at, and a tick on the cut that got
   approved. Same visual register as the reference, pointed at our work.
   --------------------------------------------------------------------------- */

/** A registration corner. Two strokes with a gap where the corner would be,
    which is what a crop mark is and what distinguishes it from a bracket. */
export function CropMark({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 26 26" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M0 20h12M20 0v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The arrow a creative director draws next to the one to run. Curved, because
    a straight arrow reads as UI and this one is meant to read as drawn. */
export function Arrow({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 56 40" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M2 7c12-5 32-1 42 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M35.5 22.5 44 24l-2.5-8.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Approved. The mark that ends up on the cut that ships. */
export function Tick({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 24 20" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M2 10.5 8.5 17 22 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SIZE_16 } from "@/lib/ui";

const { testimonials } = content;

/* TESTIMONIALS — V5. The matted-frame reference, this page's palette and the
   real quotes. It shares WhyUsV5's header language — a 36px regular serif-
   weight heading on a 1.44 leading, centred, with no kicker over it — and
   nothing else. The desktop values:

     PANEL     1126 cap · 12 gutter · 80 top and bottom · 16 radius · tinted
     HEADER    660 measure · CENTRED
     HEADING   36px, leading 52 (1.44), REGULAR WEIGHT, ONE TONE
     COLUMNS   3, masonry · cards sized by their own content
     CARD      A DOUBLE FRAME:
               outer  8 padding · 20 radius · the panel's own tint
                      3.2 inset outline · a wide, soft, low drop shadow
               inner 16 padding · 12 radius · white · 3.2 inset accent outline
                     24 between the attribution block and the quote
     ATTRIB    44 avatar · 12 gap · 16px medium name over a 12px role, 4 apart

   WHAT SEPARATES V5 FROM V2, V3 AND V4:

     1. THE CARD IS A FRAME AROUND A FRAME. Two boxes, two outlines, two
        radiuses — and the numbers are concentric: the inner 12 plus the outer's
        8 of padding is the outer's 20 exactly, so the two curves stay parallel
        the whole way round. That is the whole trick, and it is why the outer
        padding cannot be nudged on its own.
     2. THE OUTER FRAME IS THE SAME COLOUR AS THE PANEL IT SITS ON. Its fill is
        invisible by design; what you see of it is the 3.2px outline and the
        shadow underneath, so it reads as a mat around a print rather than as a
        second card. Give it a different ground and the whole effect collapses
        into a card with a thick border.
     3. THE ATTRIBUTION COMES FIRST. Every other variant leads with the quote
        and signs it underneath; this one introduces the person and then lets
        them speak. It is the one ordering decision in the set that changes what
        the section is about — a list of quotes, or a list of people.
     4. THE QUOTE IS THE MUTED TEXT AND THE NAME IS NOT. Full-strength ink on
        the attribution, ink-soft on the quote — the inverse of V2, V3 and V4,
        and the same inversion as note 3, expressed in colour.
     5. IT IS A PANEL, NOT A BAND. The section draws its own tinted, rounded
        ground; every other variant here runs on the page's.

   The reference's warm orange family maps straight onto this page's: orange-50
   is `--color-paper-2`, the warm tint already used behind the Why-us claim, and
   orange-500 is `--color-rose`, the flame stop. So the inner outline is rose at
   the reference's own 25%, and the outer is the same hue further back.

   THE AVATARS ARE NOT PHOTOGRAPHS, and cannot be. The reference gives each card
   a 44px portrait; these clients asked to stay unnamed — the same constraint
   that put a gradient rule where a photo goes in the existing Testimonials.tsx.
   A 44px gradient tile stands in, and it is a SQUIRCLE rather than the
   reference's disc: at this size a circle reads as a cropped face, and a
   rounded square reads as a mark.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1126 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 28px on a 390 phone — the same pair WhyUsV5 uses, which is
   what makes the two headings the same heading. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* THE OUTER FRAME — the mat. Its ground is the panel's, see note 2; what draws
   it is the outline and the shadow. `outline` rather than `border` because at
   3.2px a border would push the inner frame in by 3.2 on every side and break
   the concentric arithmetic in note 1.

   The shadow is the reference's own: 25px of blur pulled back by a 15px spread
   at 25% black. That is a very wide, very faint ground shadow — it reads as the
   mat lifting off the panel rather than as a card casting onto it. */
const MAT =
  "rounded-[20px] bg-paper-2 p-2 " +
  "outline outline-[3.2px] -outline-offset-[3.2px] outline-rose/15 " +
  "shadow-[0px_2px_25px_-15px_rgba(0,0,0,0.25)] " +
  "transition-[outline-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:outline-rose/30 hover:shadow-[0px_6px_30px_-14px_rgba(0,0,0,0.3)]";

/* THE INNER FRAME — the print. 12 radius against the mat's 20, which is the
   same curve offset by the mat's 8 of padding. */
const PRINT =
  "flex flex-col items-start gap-6 rounded-xl bg-white p-4 " +
  "outline outline-[3.2px] -outline-offset-[3.2px] outline-rose/25";

export function TestimonialsV5() {
  return (
    /* Two boxes, and both are load-bearing. The OUTER one carries the page
       gutter, which the reference has no need of — its frame is a crop, so its
       12 of padding is the panel's own and nothing keeps the panel off the edge
       of a phone. The INNER one is the reference's panel exactly: 1126, 12, 80,
       a 16 radius and the warm tint. */
    <section className="px-6" aria-label={testimonials.kicker}>
      <div className="mx-auto flex w-full max-w-[1126px] flex-col items-center gap-10 rounded-2xl bg-paper-2 px-3 py-[clamp(56px,6.5vw,80px)]">
        {/* HEADER — a 660 measure, centred. NO KICKER: the reference opens on
            the heading itself, which is the same move WhyUsV5 makes.

            The reference also carries a sub-headline under its heading.
            `content.testimonials` has a kicker, a heading and the items and no
            such line, and writing one is a copy decision rather than a layout
            one — so the header is the heading alone and the 24 that would sit
            under it is simply not spent. If a sub is written, it goes here in
            `${SIZE_16} leading-6 text-ink-soft` and the wrapper needs `gap-6`. */}
        <div className="flex w-full max-w-[660px] flex-col items-center">
          {/* Regular weight on a 1.44 leading — airy and editorial rather than
              tight and display. ONE TONE: this reference does not split its
              heading light/dark, so unlike V2 and V3 there is no *asterisk*
              surgery here and the copy passes through as written.

              `text-balance` because this heading IS centred, and a centred
              heading with a ragged turn reads as a mistake rather than a
              choice. */}
          <RevealText
            as="h2"
            text={testimonials.heading}
            className={`text-balance text-center font-display ${HEADING} font-normal leading-[1.44] tracking-[-0.01em]`}
          />
        </div>

        {/* MASONRY, via CSS columns rather than a grid. The reference stacks two
            cards of different heights in each of three columns, which is what
            columns do natively: a card is as tall as its own quote, and the next
            one starts directly under it. A grid would either stretch every card
            in a row to the tallest or leave a ragged gap under the short ones.

            `break-inside-avoid` is what keeps a card whole — without it a column
            break can fall through the middle of one. The bottom margin is the
            stack gap; the column gap is the same 16, so the field reads evenly
            in both directions.

            With three quotes this resolves to one card per column. It is written
            as masonry anyway because that is what the layout IS — add a fourth
            quote to lib/content.ts and it lands under the shortest column with
            nothing here to change. */}
        <div className="w-full columns-1 gap-4 phone:columns-2 lap:columns-3">
          {testimonials.items.map((t, i) => {
            /* The copy separates who they are from the context they said it in
               with a `·`. The reference's two lines are a name over a role;
               these clients are unnamed, so what goes in the name's slot is who
               they are and in the role's slot is the context. A quote with no
               `·` renders one line, which is what the third one does. */
            const [attribution, context] = t.who.split(/\s*·\s*/, 2);
            return (
              <Reveal
                key={t.quote}
                delay={(i % 3) * 70}
                className="mb-4 break-inside-avoid"
              >
                <figure className={MAT}>
                  <div className={PRINT}>
                    {/* ATTRIBUTION FIRST — see notes 3 and 4. */}
                    <figcaption className="flex w-full items-center gap-3">
                      {/* A 44px gradient tile where the portrait goes. A
                          squircle, not a disc: at this size a circle reads as a
                          cropped face and this identifies nobody. Held back to
                          40% so it sits under the type rather than over it. */}
                      <span
                        aria-hidden
                        className="size-11 shrink-0 rounded-2xl bg-[image:var(--grad)] opacity-40"
                      />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className={`font-sans ${SIZE_16} font-medium leading-5 text-ink`}>
                          {attribution}
                        </span>
                        {context && (
                          <span className="font-sans text-xs leading-4 text-ink-faint">
                            {context}
                          </span>
                        )}
                      </span>
                    </figcaption>

                    {/* The quote is the MUTED text here, which is the inversion
                        note 4 describes. It is also 16px — the same size as the
                        name above it — so the card's whole hierarchy is carried
                        by weight and colour, with no size step at all. */}
                    <blockquote
                      className={`text-pretty font-sans ${SIZE_16} leading-6 text-ink-soft`}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

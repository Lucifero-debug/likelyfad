import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { CARD_GAP, HEAD_GAP, SECTION, SIZE_16, SIZE_32, SIZE_64, WRAP } from "@/lib/ui";

const { testimonials } = content;

/* Three real quotes, attributed by role rather than by name. With no avatar and
   no handle to hold, the card is just the quote and its source, so the quote
   gets the size.

   Three of them, so two columns would orphan one: straight from three to one,
   which also gives the longest quote its measure back.

   THE BOX IS THE PAGE'S, THE TYPE IS THIS SECTION'S OWN — the third section
   to land on that split, after Why us and Pricing. The type stays on the
   SIZE_* ramps, which hit the asked-for 64 / 32 / 16 at a desktop width and
   scale down from there. The box is SECTION, WRAP, HEAD_GAP and CARD_GAP
   again, so this band's gutter and ceiling are the hero's and its seams are
   the page's.

   THE ONE 32 THAT OWNED EVERY SEAM IN HERE IS THE THING THAT HAD TO GO, more
   than the gutter did. It ran the gap under the heading AND the gaps between
   the three cards, which makes the header block exactly as close to the quotes
   as the quotes are to each other — so proximity reads all four as one row of
   peers and the heading stops introducing anything. HEAD_GAP (32→64) over
   CARD_GAP (32→48) is the same two numbers the rest of the page uses, in the
   right order.

   THE HEADING IS SPELLED OUT HERE rather than coming from SectionHeading — that
   component sets one size for all five headings, which is the point of it, so a
   64px title and a Roboto kicker had to be written locally to keep the other
   four where they are. */
export function Testimonials() {
  return (
    /* SECTION OUTSIDE, WRAP INSIDE, like every other band. Without the
       ceiling these three cards ran to the viewport, so on a wide monitor a
       one-line quote was set across ~600px while the hero's own copy above it
       was capped at 42ch — the quotes read as a different page rather than as
       a section of this one. */
    <section className={SECTION} aria-label={testimonials.kicker}>
      <div className={WRAP}>
        {/* 832px is 13 × the 64px the title reaches on a desktop — the same
            13-title-em measure SectionHeading gives its other four. It is in px
            rather than em because it sits on this DIV, where an em would resolve
            against the body size and not against the title. */}
        <div className={`${HEAD_GAP} mx-auto max-w-[832px] text-center`}>
          {/* Roboto, not the mono the other kickers use — "rest use roboto"
              covers this. The rule stays in em so it tracks the type. */}
          <Reveal>
            <span
              className={`inline-flex items-center gap-[0.62em] font-sans ${SIZE_16} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-['']`}
            >
              {testimonials.kicker}
            </span>
          </Reveal>
          {/* mt-3 is inert on a non-replaced inline element and this h2 is one —
              kept because SectionHeading carries it and this is otherwise its
              markup. The gap under the kicker is line-box height, not margin. */}
          <RevealText
            as="h2"
            text={testimonials.heading}
            className={`mt-3 text-balance font-display ${SIZE_64} font-bold leading-[1.1] tracking-[-0.022em]`}
          />
        </div>

        <div className={`grid items-start ${CARD_GAP} lap:grid-cols-3`}>
          {testimonials.items.map((t, i) => (
            <Reveal key={t.quote} delay={i * 70} className="h-full">
              {/* CONTENT IS CENTRED, NOT TOP-ALIGNED. `h-full` in a grid row
                  resolves against the row, so all three cards take the height
                  of the longest quote — and the shortest one then held ~100px
                  of dead space under its attribution and read as unfinished
                  rather than as a short quote. Centring costs nothing when the
                  quotes happen to match and is invisible when they do not.
                  Sizing the cards to their own content instead would work, but
                  these quote lengths are uneven enough that it looks ragged. */}
              {/* PADDING IS 24→32, ONE RUNG UNDER THE 32→48 CARD_GAP PUTS
                  BETWEEN THE CARDS, which is the ordering the scale is for: the
                  quote is always nearer its own edge than its neighbour's. At
                  the 12/16 this had, a 32px quote sat 12px off the border and
                  the card read as a box the type had outgrown. */}
              <figure className="relative flex h-full flex-col justify-center rounded-3xl border border-line bg-white p-[clamp(24px,2.5vw,32px)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--shadow)]">
                <blockquote
                  className={`text-pretty font-sans ${SIZE_32} font-normal leading-[1.45] tracking-[-0.01em]`}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* A short gradient rule instead of a photo: it marks where the
                    quote ends and the attribution begins without pretending to
                    identify anyone. These clients asked to stay unnamed. */}
                <figcaption
                  className={`mt-2 flex items-center gap-[0.65em] font-sans ${SIZE_16} uppercase tracking-[0.07em] text-ink-faint before:h-0.5 before:w-5 before:flex-none before:rounded-sm before:bg-[image:var(--grad-ink)] before:content-['']`}
                >
                  {t.who}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

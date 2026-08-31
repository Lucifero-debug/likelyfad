import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SIZE_16, SIZE_32, SIZE_64 } from "@/lib/ui";

const { testimonials } = content;

/* Three real quotes, attributed by role rather than by name. With no avatar and
   no handle to hold, the card is just the quote and its source, so the quote
   gets the size.

   Three of them, so two columns would orphan one: straight from three to one,
   which also gives the longest quote its measure back.

   OFF THE PAGE'S SHARED SCALES, BY REQUEST — the third section to make that
   move, after Why us and Pricing. The box is authored to fixed pixels (16/12 on
   the section, 12/16 inside a card) and the type to the SIZE_* ramps, which land
   on the asked-for 64 / 32 / 16 at a desktop width and scale down from there.
   SECTION, WRAP, HEAD_GAP and CARD_GAP therefore do not appear below: ONE 32
   gap now owns every seam in the section — under the heading, and between the
   three cards — where those two constants used to run 32→64 and 32→48.

   THE HEADING IS SPELLED OUT HERE rather than coming from SectionHeading — that
   component sets one size for all five headings, which is the point of it, so a
   64px title and a Roboto kicker had to be written locally to keep the other
   four where they are. */
export function Testimonials() {
  return (
    /* NO WIDTH CAP, so the 16 reads as 16: the WRAP that used to sit inside this
       section carried both the page gutter and the 1180/1800 ceiling, and the
       gutter had to go with it. The three cards therefore run to the viewport.
       Put `mx-auto w-full max-w-[1180px] lap:max-w-[1800px]` on a div around the
       two blocks below to bring the ceiling back without touching the padding. */
    <section
      className="flex flex-col gap-[clamp(24px,2.2vw,32px)] px-4 py-3"
      aria-label={testimonials.kicker}
    >
      {/* 832px is 13 × the 64px the title reaches on a desktop — the same
          13-title-em measure SectionHeading gives its other four. It is in px
          rather than em because it sits on this DIV, where an em would resolve
          against the body size and not against the title. */}
      <div className="mx-auto max-w-[832px] text-center">
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

      <div className="grid items-start gap-[clamp(24px,2.2vw,32px)] lap:grid-cols-3">
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
            <figure className="relative flex h-full flex-col justify-center rounded-3xl border border-line bg-white px-3 py-4 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--shadow)]">
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
    </section>
  );
}

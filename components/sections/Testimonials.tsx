import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CARD_GAP, HEAD_GAP, SECTION, TEXT_LEAD, TEXT_META, WRAP } from "@/lib/ui";

const { testimonials } = content;

/* Three real quotes, attributed by role rather than by name. With no avatar and
   no handle to hold, the card is just the quote and its source, so the quote
   gets the size.

   Three of them, so two columns would orphan one: straight from three to one,
   which also gives the longest quote its measure back. */
export function Testimonials() {
  return (
    <section className={SECTION} aria-label={testimonials.kicker}>
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <SectionHeading kicker={testimonials.kicker} heading={testimonials.heading} />
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
              <figure className="relative flex h-full flex-col justify-center rounded-3xl border border-line bg-white p-[clamp(24px,2.5vw,32px)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--shadow)]">
                <blockquote className={`text-pretty ${TEXT_LEAD} font-normal leading-[1.45] tracking-[-0.01em]`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* A short gradient rule instead of a photo: it marks where the
                    quote ends and the attribution begins without pretending to
                    identify anyone. These clients asked to stay unnamed. */}
                <figcaption className={`mt-2 flex items-center gap-[0.65em] font-mono ${TEXT_META} uppercase tracking-[0.07em] text-ink-faint before:h-0.5 before:w-5 before:flex-none before:rounded-sm before:bg-[image:var(--grad-ink)] before:content-['']`}>
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

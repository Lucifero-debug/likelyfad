import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SECTION, WRAP } from "@/lib/ui";

const { testimonials } = content;

/* Three real quotes, attributed by role rather than by name. With no avatar and
   no handle to hold, the card is just the quote and its source, so the quote
   gets the size.

   Three of them, so two columns would orphan one: straight from three to one,
   which also gives the longest quote its measure back. */
export function Testimonials() {
  return (
    /* Leading padding removed — the seam above is owned by Pricing's trailing
       padding. The bottom stays on the section rhythm, so this still separates
       from the FAQ normally. */
    <section className={`${SECTION} pt-0`} aria-label={testimonials.kicker}>
      <div className={WRAP}>
        <SectionHeading kicker={testimonials.kicker} heading={testimonials.heading} />

        <div className="grid items-start gap-4 lap:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal key={t.quote} delay={i * 70} className="h-full">
              <figure className="relative h-full rounded-3xl border border-line bg-white p-[clamp(24px,2.5vw,32px)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--shadow)]">
                <blockquote className="text-pretty text-[clamp(1.1rem,1.02rem+0.35vw,1.28rem)] font-normal leading-[1.4] tracking-[-0.01em]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* A short gradient rule instead of a photo: it marks where the
                    quote ends and the attribution begins without pretending to
                    identify anyone. These clients asked to stay unnamed. */}
                <figcaption className="mt-2 flex items-center gap-[0.65em] font-mono text-[0.7rem] uppercase leading-[1.5] tracking-[0.07em] text-ink-faint before:h-0.5 before:w-5 before:flex-none before:rounded-sm before:bg-[image:var(--grad-ink)] before:content-['']">
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

import { content } from "@/lib/content";
import {
  ANCHOR,
  DISPLAY,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_17,
  T_44,
  TILT,
  WRAP,
} from "@/lib/v7/theme";
import { PinnedCard } from "./PinnedCard";

/* ============================================================================
   CLIENT REVIEWS — three real quotes, pinned.

   THE POSITION IN THE PAGE IS BORROWED WHOLESALE AND DELIBERATELY. The
   reference closes services, then reviews, then FAQ, then contact, and that
   run is genuinely well judged for a service business: you say what you make,
   somebody else says it works, you clear the remaining doubts, and only then
   do you ask. It is the one part of the reference's structure that needed no
   translation at all, so it was kept as it stands.

   THERE ARE NO NAMES AND NO COMPANIES, AND THAT IS NOT AN OVERSIGHT. The brief
   asks for name, role and company. Every client identity in this repo is
   private by request — the rule is written at the top of lib/content.ts, which
   also forbids inventing a quote outright — so the attribution is the role and
   the category, exactly as it was given to us. Three real reactions from
   people we cannot name is worth more than three invented endorsements from
   people we can, and a prospect who has read one fake testimonial stops
   believing the rest of the page.

   THE QUOTES ARE SET AT 17 AND NOT IN THE DISPLAY FACE. A one-line reaction
   blown up to 44px in heavy condensed caps stops sounding like a person and
   starts sounding like a poster of a person. These are short and plain and the
   flattest possible setting is the one that keeps them credible.

   <blockquote> AND <cite>, so the attribution is bound to its quote in the
   markup rather than by proximity. Pinned and tilted, but at the bottom of the
   rotation budget: they carry a sentence each.
   ========================================================================== */
export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="v7-reviews-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>{content.testimonials.kicker}</p>

        <h2
          id="v7-reviews-title"
          className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] text-mark`}
        >
          {content.testimonials.heading}
        </h2>

        {/* 48 between cards padded 32. */}
        <ul className="mt-[64px] grid gap-[48px] lap:grid-cols-3">
          {content.testimonials.items.map((item, i) => (
            <PinnedCard key={item.quote} as="li" pin tilt={TILT[i % TILT.length]}>
              <blockquote className="flex h-full flex-col">
                {/* mt-8 clears the pin head, which overhangs the top edge. */}
                <p className={`${T_17} mt-[8px] text-mark`}>{item.quote}</p>

                <cite className={`${MONO} ${T_12} mt-auto pt-[32px] text-note not-italic`}>
                  {item.who}
                </cite>
              </blockquote>
            </PinnedCard>
          ))}
        </ul>
      </div>
    </section>
  );
}

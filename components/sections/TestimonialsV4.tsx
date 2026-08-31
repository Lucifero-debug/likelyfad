import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

const { testimonials } = content;

/* TESTIMONIALS — V4. The same design language as WhyUsV4, applied to quotes.

   Left aligned at a 1280 cap, a 544 measure over a 56 gutter, a 12px mono
   kicker with a 20 × 2 gradient bar, a 48px extrabold heading, and rounded
   white cards on the page's own shadow. If both are ever on the page together
   they will read as one system, which is the point of building it twice. The
   desktop values:

     SECTION   1280 cap · 56 gutter · 144 top and bottom
     HEADER    544 measure · LEFT ALIGNED · 16 kicker → heading · 64 → cards
     KICKER    12px mono, uppercase, 0.1em tracked · 20 × 2 gradient bar · 8 gap
     HEADING   48px EXTRABOLD, left, leading 1.054, ONE TONE
     GRID      24 gap, matching the card's own padding exactly
     CARD      24 padding · 24 radius · white · a 2.4 INSET OUTLINE
               two soft shadows, 2/8 over 1/2
               24 under the quote, then the footer pushed to the bottom edge
               18px quote on 28 leading
               16 above a 40 footer row: a 24 avatar, 8, a 12px mono label

   WHAT SEPARATES V4 FROM V2 AND V3:

     1. THE FOOTER IS PUSHED, NOT SPACED. `flex-1` with `justify-end` under the
        quote, so the attribution sits on the card's bottom edge however short
        the quote is — "Insane realism." is two words and its footer still lines
        up with the other two. V2 does the same job with `justify-between` on a
        FIXED height; this does it with a growing spacer, so the card can still
        size to its content.
     2. THE HAIRLINE IS AN OUTLINE, AND IT IS THICK. 2.4px, inset by its own
        width — three times V2's and V3's 0.8. It stays an `outline` rather than
        becoming a `border` (which is what WhyUsV4 does with its 0.8) precisely
        because it is thick: at 2.4 a border would push the content in by 2.4 on
        every side and eat into the 24 padding, where an inset outline draws
        over the card's own edge and costs the layout nothing.
     3. THE ATTRIBUTION IS MONO, NOT SANS — 12px uppercase, the same face and
        size as the kicker above it, and the only place on the page where a
        card's footer and a section's kicker are set identically. They are both
        labels, and this variant says so.
     4. THE HEADING IS ONE TONE. V2 and V3 split theirs light/dark from the
        reference; this reference does not, so there is no `*asterisk*` surgery
        here and `testimonials.heading` is passed through as written.
     5. IT IS THE TALLEST BAND OF THE THREE — 144 top and bottom against 96.

   The reference's two shadows are `0 2px 8px` at 5% over `0 1px 2px` at 4%, on
   the page's own ink. That is very nearly `--shadow-sm` and not exactly it, so
   the pair is spelled out rather than pointed at the token — a card that reads
   as 3px lifted where the token reads as 6px is the difference the reference
   was drawn around.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1280 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at the top, 32px on a 390 phone — the same pair WhyUsV4 uses, which is
   what makes the two headings the same heading. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* 18px quotes, down to 16. The floor is the page's body size: below a phone
   width a pull-quote that is still larger than body copy has nothing left to
   be larger THAN. */
const QUOTE = "text-[clamp(1rem,0.95rem+0.34vw,1.125rem)]";

/* THE CARD. The outline is inset by its own width so it draws inside the 24
   radius rather than around it — see note 2 for why it is not a border.

   The lift is the page's standard card hover. These are rounded, shadowed,
   separated shapes like the rest of the site's cards, so they move. */
const CARD =
  "flex h-full flex-col rounded-3xl bg-white p-6 " +
  "outline outline-[2.4px] -outline-offset-[2.4px] outline-ink/10 " +
  "shadow-[0px_2px_8px_0px_rgba(22,20,26,0.05),0px_1px_2px_0px_rgba(22,20,26,0.04)] " +
  "transition-[transform,box-shadow,outline-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1.5 hover:outline-transparent hover:shadow-[var(--shadow)]";

export function TestimonialsV4() {
  return (
    /* 1280 cap and a 56 gutter, both the reference's — and 144 top and bottom,
       which is the deepest section on the page. */
    <section
      className="mx-auto flex w-full max-w-[1280px] flex-col items-start px-[clamp(24px,4.4vw,56px)] py-[clamp(80px,11vw,144px)]"
      aria-label={testimonials.kicker}
    >
      {/* HEADER — a 544 measure, left aligned, 16 under the kicker. In px on the
          wrapper: an em here would resolve against the body size, not against
          the 48px heading it is meant to measure. */}
      <div className="flex w-full max-w-[544px] flex-col items-start">
        {/* 12px mono, uppercase, 0.1em of tracking and a 20 × 2 BAR rather than
            the 1px rule the rest of the page uses. The bar is a filled shape, so
            it takes the bright ramp; `rounded-xs` is the reference's 2px, which
            on a 2px-tall bar just rounds the ends. */}
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase leading-5 tracking-[0.1em] text-ink-faint">
            <span
              aria-hidden
              className="h-0.5 w-5 shrink-0 rounded-xs bg-[image:var(--grad)]"
            />
            {testimonials.kicker}
          </span>
        </Reveal>

        {/* EXTRABOLD, heavier than any other heading on the page, and ONE TONE —
            see notes 4. `leading-[1.054]` is the reference's 50.59-on-48 kept as
            a ratio so it travels down the clamp. No `text-balance`: this heading
            is left aligned and ragged by design.

            The `pt-4` is the reference's 16, on the wrapper rather than as a
            margin on the heading, so it survives RevealText's inline layout. */}
        <div className="w-full pt-4">
          <RevealText
            as="h2"
            text={testimonials.heading}
            className={`font-display ${HEADING} font-extrabold leading-[1.054] tracking-[-0.02em]`}
          />
        </div>
      </div>

      {/* 64 under the header, as `pt-16` on the grid's own wrapper — the
          reference's number, and the largest gap in the section.

          THREE UP, not the reference's four: there are three real quotes. The
          reference shows a fourth ("Absolute fire...") that is not in
          lib/content.ts — if it is a genuine client quote it belongs there,
          under the house rule at the top of that file, and this grid takes it
          without a change. Move to `lap:grid-cols-4` when it does. */}
      <div className="w-full pt-16">
        <div className="grid items-stretch gap-6 phone:grid-cols-2 lap:grid-cols-3">
          {testimonials.items.map((t, i) => {
            /* The reference's attributions are short — "Founder, EU brand",
               "Creative lead". The copy here carries a context clause after a
               `·` ("after the first batch") that these 12px mono caps have no
               room for, so only the half before it is set. The full string is
               still what the other testimonial variants render. */
            const [attribution] = t.who.split(/\s*·\s*/, 1);
            return (
              <Reveal key={t.quote} delay={(i % 3) * 70} className="h-full">
                <figure className={CARD}>
                  {/* 24 under the quote, and the footer's own 16 below that. */}
                  <blockquote className={`pb-6 text-pretty font-sans ${QUOTE} leading-7 text-ink`}>
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* THE SPACER THAT DOES THE WORK — see note 1. It is a flex
                      column rather than `mt-auto` on the row so the row keeps
                      its own 16 of top padding either way. */}
                  <figcaption className="flex flex-1 flex-col justify-end">
                    <span className="flex h-10 items-center gap-2 pt-4">
                      {/* A 24px gradient tile at half strength, standing in for
                          an avatar. These clients asked to stay unnamed, so
                          there is no face and no logo to put here — a shape that
                          identifies nobody is the honest version of the
                          reference's, and the existing Testimonials.tsx already
                          takes the same approach with a gradient rule.
                          `rounded-xl` is the reference's 12 on a 24 box: a
                          squircle, not a disc, so it never reads as a cropped
                          photograph. */}
                      <span
                        aria-hidden
                        className="size-6 shrink-0 rounded-xl bg-[image:var(--grad)] opacity-50"
                      />
                      {/* Mono, 12px, uppercase — the kicker's own setting. See
                          note 3. Its tracking is 0.025em where the kicker's is
                          0.1em, which is the reference's distinction: a kicker
                          is a heading for a section and this is a caption for a
                          card. */}
                      <span className="font-mono text-xs uppercase leading-5 tracking-[0.025em] text-ink-faint">
                        {attribution}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

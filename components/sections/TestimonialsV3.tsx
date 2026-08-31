import { content } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { SIZE_16 } from "@/lib/ui";

const { testimonials } = content;

/* TESTIMONIALS — V3. The same design language as WhyUsV3, applied to quotes.

   Left aligned, square cornered, mono kicker with a square dot, a 36px regular
   heading and a hairline card closed by a gradient rule along its bottom edge.
   If both are ever on the page together they will read as one system, which is
   the point of building it twice. The desktop values:

     SECTION   1128 cap · 24 gutter · 96 top and bottom · 40 between blocks
     HEADER    640 measure · LEFT ALIGNED · 12 between the kicker and heading
     KICKER    14px mono, uppercase, semibold · 6px SQUARE dot · 6 gap · no pill
     HEADING   36px, left, leading 40 (1.11), REGULAR WEIGHT
     GRID      16 column gap · 32 row gap
     CARD      320 × 384 · NO RADIUS · 0.8 hairline
               1.6 accent rule along the bottom edge
               BODY ZONE  24 padding · 40 between the mark and the quote
                          24 mark · 20px MEDIUM quote on 24 leading
               FOOTER     96 tall · 24 padding · content centred
                          16px attribution over a 14px context line, 4 apart

   WHAT THIS IS THAT TestimonialsV2 AND THE EXISTING Testimonials.tsx ARE NOT:

     1. THE CARD IS TWO ZONES, NOT ONE BOX. A body that grows and a fixed 96px
        footer, each carrying its OWN 24 of padding — so the quote and the
        attribution are separated by 48 of padding rather than by a gap or a
        rule. V2 marks that seam with a 1px line; this one marks it with air,
        and the only drawn line in the card is the accent along its bottom.
     2. THE QUOTE IS SET IN THE DISPLAY FACE AND THE ATTRIBUTION IS NOT. The
        reference runs its quote in Inter Display at medium and its footer in
        plain Inter, which is the inverse of WhyUsV3's cards (sans throughout).
        Here the quote IS the content, so it gets the display face; the footer
        is a label and stays in the UI face.
     3. IT IS LEFT ALIGNED AND SQUARE, where V2 is centred with a 40px radius.

   THE LOGO SLOT HOLDS NO LOGO, and cannot. The reference opens each card with a
   24px-tall client logo; these clients asked to stay unnamed — which is why the
   existing Testimonials.tsx already substitutes "a short gradient rule instead
   of a photo ... without pretending to identify anyone". The same substitution
   is made here, at the reference's own varying widths (80 / 96 / 128) so the
   row keeps the rhythm a set of real lockups would give it. If logos ever
   arrive, this is the box they go in: 24 tall, above a 40 gap.

   The teal accent maps to the brand ramp: `--grad` on the bottom rule, the
   kicker's square and the mark (all filled shapes), `--grad-ink` on the
   heading's own gradient run, which is text on paper. neutral-900 cards on dark
   invert to white on paper and white/20 hairlines become border-line.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at 1128 and up, 28px on a 390 phone — the same pair WhyUsV3 uses, which
   is what makes the two headings the same heading. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* 20px quotes, down to 18. */
const QUOTE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* THE CARD. Square, hairlined, and closed at the bottom by the accent rule.
   `lap:min-h-96` is the reference's 384 as a FLOOR rather than a height: three
   real quotes are not the same length, and a hard height would either clip the
   longest or strand the shortest. The grid row equalises them above the floor.

   No lift on hover, matching WhyUsV3: these are hard-cornered cards in a tight
   grid and they brighten in place rather than breaking the row's alignment. */
const CARD =
  "group relative flex h-full flex-col overflow-hidden " +
  "border-[0.8px] border-line bg-white lap:min-h-96 " +
  "transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink/15 hover:shadow-[var(--shadow-sm)]";

/* The accent rule — its own element rather than a border so it can carry the
   gradient, sitting at full width and deepening on hover rather than growing
   in from one side. Same rule WhyUsV3 uses, same reason. */
const RULE =
  "pointer-events-none absolute inset-x-0 bottom-0 h-[1.6px] bg-[image:var(--grad)] " +
  "transition-[height] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "group-hover:h-[2.4px]";

/* The reference's three lockup widths, cycled. They are what stops the three
   marks reading as three identical dashes — a real logo row is never one
   width, and the substitute should not be either. */
const MARK_WIDTHS = ["w-20", "w-24", "w-32"];

/* Two-tone in the reference — full strength for the opening clause, muted for
   the rest. RevealText draws that from *asterisks*, and they are added HERE
   rather than in lib/content.ts because the same string feeds the existing
   Testimonials.tsx and TestimonialsV2. If the copy is rewritten the replace
   finds nothing and the heading renders in one tone, which is the correct way
   for this to fail. */
const HEADING_TEXT = testimonials.heading.replace("as sent.", "*as sent.*");

export function TestimonialsV3() {
  return (
    /* `items-start`, and it is the whole design: the section is a left-aligned
       column, so the header does not centre itself and the cards do not centre
       their text. */
    <section
      className="mx-auto flex w-full max-w-[1128px] flex-col items-start gap-[clamp(32px,3.5vw,40px)] px-6 py-[clamp(64px,8vw,96px)]"
      aria-label={testimonials.kicker}
    >
      {/* HEADER — 640 measure, left aligned, 12 between its two lines. Wider
          than WhyUsV3's 600, which is the reference's difference and not an
          accident: that heading turns over two lines and this one is given the
          room to decide for itself. */}
      <div className="flex w-full max-w-[640px] flex-col items-start gap-3">
        {/* Mono, uppercase, semibold, 14px, with a 6px SQUARE mark and no added
            tracking — the page's own kicker convention at the reference's
            numbers. The square rhymes with the card corners below; `--grad` and
            not `--grad-ink` because it is a filled shape, not text. */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold uppercase leading-5 text-pink-deep">
            <span aria-hidden className="size-1.5 shrink-0 bg-[image:var(--grad)]" />
            {testimonials.kicker}
          </span>
        </Reveal>

        {/* REGULAR WEIGHT, and `leading-[1.11]` is the reference's 40-on-36 kept
            as a ratio so it travels down the clamp. No `text-balance`: this
            heading is left aligned and ragged by design.

            RevealText lays each word out as its own box and stitches the ramp
            back across them, so this cannot be swapped for a plain <h2> without
            changing both the rhythm and the colour. */}
        <RevealText
          as="h2"
          text={HEADING_TEXT}
          className={`font-display ${HEADING} font-normal leading-[1.11] tracking-[-0.01em]`}
        />
      </div>

      {/* 16 between columns, 32 between rows — the reference's two gaps, which
          are not the same number. With three quotes this is one row of three at
          `lap:`, so the row gap only shows below that breakpoint. */}
      <div className="grid w-full gap-x-4 gap-y-8 phone:grid-cols-2 lap:grid-cols-3">
        {testimonials.items.map((t, i) => {
          /* The copy separates who they are from the context they said it in
             with a `·`. Split on the first one only: a `who` with no separator
             becomes a single line and `context` is undefined, which is what the
             third quote does. */
          const [attribution, context] = t.who.split(/\s*·\s*/, 2);
          return (
            <Reveal key={t.quote} delay={(i % 3) * 70} className="h-full">
              <figure className={CARD}>
                {/* THE BODY ZONE — grows, carries its own 24, and holds the mark
                    40 above the quote. `flex-1` is what pushes the footer to the
                    bottom edge on a card taller than its content. */}
                <div className="flex flex-1 flex-col items-start gap-[clamp(24px,2.8vw,40px)] p-6">
                  {/* The 24px slot. The box keeps its height whatever is in it,
                      so the geometry above survives a real logo landing here. */}
                  <span aria-hidden className="flex h-6 items-center">
                    <span
                      className={`h-0.5 ${MARK_WIDTHS[i % MARK_WIDTHS.length]} rounded-sm bg-[image:var(--grad)]`}
                    />
                  </span>
                  <blockquote
                    className={`text-pretty font-display ${QUOTE} font-medium leading-6 tracking-[-0.015em] text-ink`}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                {/* THE FOOTER ZONE — a fixed 96 with its own 24, content centred
                    in it. The 24 here meets the 24 above, so the quote and the
                    attribution are held apart by 48 of padding and nothing is
                    drawn between them. See note 1. */}
                <figcaption className="flex h-24 flex-col justify-center gap-1 p-6">
                  <span className={`font-sans ${SIZE_16} font-medium leading-5 text-ink`}>
                    {attribution}
                  </span>
                  {context && (
                    <span className="font-sans text-sm leading-5 text-ink-faint">
                      {context}
                    </span>
                  )}
                </figcaption>

                <span aria-hidden className={RULE} />
              </figure>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

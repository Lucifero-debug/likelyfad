import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16 } from "@/lib/ui";

const { why, pricing } = content;

/* WHY US — V5. The divided-columns reference, this page's palette and copy.

   The fifth take on the same six pillars, and the first one with NO CARD AT
   ALL. The desktop values, which every clamp below reaches and holds:

     SECTION   1032 cap · 112 top and bottom · centred
     HEADER    560 measure · CENTRED · 24 between the heading and the lead
     HEADING   36px, leading 52 (1.44) · regular weight
     LEAD      16px on 24 leading
     COLUMNS   40 above the row, 56 below it · 1px × 160 rules between columns
     COLUMN    24 between the glyph and the text · 16 between title and body
     GLYPH     28px · a 3 × 3 dot matrix, lit in a per-pillar pattern
     TITLE     24px medium on 28 leading
     BODY      18px on 28 leading

   WHAT SEPARATES V5 FROM V2, V3 AND V4:

     1. NOTHING IS A CARD. No ground, no border, no radius, no shadow, no
        padding around anything. Six columns of bare text on the page ground,
        and the only drawn thing in the whole band is a 1px rule between them.
        Every other variant answers "how is a pillar bounded"; this one answers
        "it isn't".
     2. THE SEPARATOR IS SHORT AND CENTRED — 160px in a column that is taller
        than that, so it floats in the gutter rather than dividing it edge to
        edge. That is what keeps it reading as punctuation instead of as a table
        rule, and it is the reason this is a ::before and not `divide-x`.
     3. THE COLUMN BODY IS LARGER THAN THE SECTION LEAD — 18 against 16, which
        inverts the ordering every other section on this page holds to. It is
        the reference's, and it works because the lead is a 560px centred line
        under the heading and the bodies are three separate columns: they are
        not competing for the same rank, they sit in different places. Worth
        knowing before "fixing" it.
     4. THE HEADING'S LEADING IS LOOSE — 1.44 against the 1.05–1.11 the other
        variants set. A 36px serif-weight line at 52px leading is an airy,
        editorial heading rather than a tight display one, and the whole band's
        calm depends on it.
     5. IT ENDS IN A BUTTON ROW, not a claim panel. The reference closes with
        two side-by-side CTAs; `why.claim` becomes the line above them, so the
        section's argument still lands and the copy is not dropped.

   The reference's warm orange maps to `--color-rose`, the flame stop and the
   brand's own warm end — an exact match in role, so the rules and the lit dots
   take it directly rather than going through the gradient. The gradient stays
   out of this variant except in the heading's own run: with no filled shapes
   anywhere, there is nothing for the bright ramp to sit on.

   THE REFERENCE'S BUTTONS ARE NOT CARRIED OVER. It draws its own chrome — a
   3.2px inset outline, an inset top highlight, an inset bottom shade and a
   coloured drop shadow, on an 8px radius — which is a whole button system, not
   a variant. This page already has one in components/ui/Button.tsx, and every
   CTA on the site is that button; forking it for one section would leave two
   button languages on one page. The row's STRUCTURE is the reference's (two
   CTAs, primary then secondary, 24 apart, centred); the chrome is the site's.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1032 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 28px on a 390 phone. Same pair as V3 — the two variants with
   a regular-weight heading agree on its size as well as its weight. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* 24px column titles, down to 20. */
const COL_TITLE = "text-[clamp(1.25rem,1.05rem+0.89vw,1.5rem)]";

/* 18px column bodies, down to 16 — see note 3. The floor is the page's body
   size, so at a phone width this stops being larger than everything else and
   simply becomes normal text. */
const COL_BODY = "text-[clamp(1rem,0.95rem+0.34vw,1.125rem)]";

/* THE COLUMN, and the divider that sits in the gutter to its left.

   The rule is a ::before rather than a border or `divide-x` because it is 160px
   tall in a column that is not: a border runs the full height of its box and
   there is no way to shorten one. `--col-gap` is declared on the grid below and
   read here, so the rule is centred in whatever the gutter currently resolves
   to without the clamp being written twice.

   WHICH COLUMNS GET ONE depends on how many columns there are, which only CSS
   knows — so the three rules below are nth-child, not an index test in the map.
   At one column there is no gutter and every rule is off. At two, the rule goes
   on the even children, which are the right-hand column of each row. At three,
   it goes on everything that is not the first of a row. The two `lap:` rules
   select mutually exclusive sets, so their order relative to each other cannot
   matter; `lap:` wins over `phone:` for the children both match because
   Tailwind orders its breakpoints by min-width. */
const COLUMN =
  "relative h-full " +
  "before:absolute before:top-1/2 before:h-40 before:w-px before:-translate-y-1/2 " +
  "before:bg-rose/40 before:content-[''] before:left-[calc(var(--col-gap)/-2)] " +
  "before:hidden " +
  "phone:[&:nth-child(even)]:before:block " +
  "lap:[&:not(:nth-child(3n+1))]:before:block lap:[&:nth-child(3n+1)]:before:hidden";

/* THE GLYPH. The reference gives each column a 3 × 3 dot matrix with some dots
   lit in the accent and the rest left at a low-opacity tint — a checkerboard, a
   plus and an I-beam across its three columns. It is a system rather than three
   drawings, so it extends: six patterns, one per pillar, each nine characters
   read row by row, `1` lit.

   The first three ARE the reference's, in its order. The last three continue the
   idea — an X, a bar and a diagonal — chosen to stay legible at 28px, which
   rules out anything with a lone dot in the middle of a sparse field. */
const PATTERNS = [
  "010101010" /* checker  — reference 1 */,
  "010111010" /* plus     — reference 2 */,
  "111010111" /* I-beam   — reference 3 */,
  "101010101" /* X                      */,
  "111111000" /* bar                    */,
  "100010001" /* diagonal               */,
];

/* 6px dots on a 5px gap comes to 28 across, which is the reference's 28px box
   arrived at from its own parts rather than set as a size and divided up. */
function DotGlyph({ pattern }: { pattern: string }) {
  return (
    <span aria-hidden className="grid grid-cols-3 gap-[5px]">
      {[...pattern].map((lit, i) => (
        <span
          key={i}
          className={`size-1.5 rounded-full ${lit === "1" ? "bg-rose" : "bg-rose/25"}`}
        />
      ))}
    </span>
  );
}

export function WhyUsV5() {
  return (
    /* 1032 cap — the narrowest of the five variants, and 148 inside the page's
       own 1180. With no card grounds to hold the eye, the measure is doing all
       of the containing, so the reference keeps it tight.

       The gutter is not in the reference, which is a crop rather than a page:
       `px-6` is the floor every variant here uses, so the columns never touch
       the edge of a phone. */
    <section
      id="why"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1032px] flex-col items-center px-6 py-[clamp(64px,8.7vw,112px)]`}
      aria-label={why.kicker}
    >
      {/* HEADER — 560 measure, centred, 24 between its two lines. No kicker:
          the reference has none, and this is the only one of the five variants
          that opens on the heading itself. */}
      <div className="flex w-full max-w-[560px] flex-col items-center gap-6">
        {/* Regular weight and a 1.44 leading — see notes 4. `text-balance`
            because this heading IS centred, unlike V3's and V4's, and a centred
            heading with a ragged turn reads as a mistake rather than as a
            choice.

            RevealText lays each word out as its own box and stitches the
            gradient back across them, so this cannot be swapped for a plain
            <h2> without changing both the rhythm and the colour. */}
        <RevealText
          as="h2"
          text={why.heading}
          className={`text-balance text-center font-display ${HEADING} font-normal leading-[1.44] tracking-[-0.01em]`}
        />
        <Reveal delay={100}>
          <p className={`text-pretty text-center font-sans ${SIZE_16} leading-6 text-ink-soft`}>
            {why.lead}
          </p>
        </Reveal>
      </div>

      {/* 40 above the columns and 56 below — the reference's two numbers, which
          are not the same. `--col-gap` is declared here and read by each
          column's divider; the row gap is the section's own 56, so the two rows
          are separated by more than the columns are and the grid reads as two
          rows of three rather than as six loose blocks. */}
      <div className="w-full pt-10 pb-14 [--col-gap:clamp(32px,7vw,96px)]">
        <div className="grid gap-x-[var(--col-gap)] gap-y-14 phone:grid-cols-2 lap:grid-cols-3">
          {why.pillars.map((p, i) => (
            /* Stagger runs across the ROW, not the whole grid: at 6 × 70ms the
               last column would still be arriving long after the reader got
               there. It resets every three so none waits more than 140ms.

               The divider rides on this element rather than on the <article>
               because THIS is the grid item — the nth-child tests in COLUMN
               only mean anything against the grid's own children. */
            <Reveal key={p.title} delay={(i % 3) * 70} className={COLUMN}>
              <article className="flex h-full flex-col items-start gap-6">
                <DotGlyph pattern={PATTERNS[i % PATTERNS.length]} />
                <div className="flex flex-col items-start gap-4">
                  <h3 className={`font-sans ${COL_TITLE} font-medium leading-7 text-ink`}>
                    {p.title}
                  </h3>
                  {/* 28 leading on 18px type — the loosest body on the page, and
                      the reference's. With no card around it, the leading is
                      what gives the block its shape. */}
                  <p className={`text-pretty font-sans ${COL_BODY} leading-7 text-ink-soft`}>
                    {p.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* THE CLOSE. The reference ends on two CTAs 24 apart; the claim goes
          above them so the section's argument still lands. Sized at 0.78 of the
          heading and set in the same regular weight, so it reads as the
          heading's last word rather than as a second headline.

          A DIRECT flex child, deliberately: RevealText sets `display: inline` on
          its own tag, and `inline` on a flex item blockifies — which is what
          lets the 34ch measure apply at all. Wrap it in a Reveal <div> and the
          div becomes the flex item, the <p> stays inline, and the measure is
          silently dropped. */}
      <div className="flex w-full flex-col items-center gap-6">
        <RevealText
          as="p"
          text={why.claim}
          stagger={30}
          className="max-w-[34ch] text-balance text-center font-display text-[clamp(1.375rem,1rem+1.67vw,1.75rem)] font-normal leading-[1.3] tracking-[-0.01em]"
        />
        {/* Primary then secondary, 24 apart, centred — the reference's row.
            Wrapping rather than shrinking below `phone:`: two full-size buttons
            side by side do not fit a 390px screen, and stacking them keeps both
            at a tappable width. */}
        <Reveal delay={100}>
          <div className="flex flex-col items-center gap-6 phone:flex-row">
            <Button contact variant="grad" withArrow>
              {why.claimCta}
            </Button>
            <Button href="#pricing" variant="light">
              {pricing.cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

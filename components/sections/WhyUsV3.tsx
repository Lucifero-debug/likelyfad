import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16 } from "@/lib/ui";

const { why } = content;

/* WHY US — V3. The second reference's box, this page's palette.

   Same copy and same components as WhyUs.tsx and WhyUsV2.tsx. V2 and V3 share
   a section shell — 1128 cap, 24 gutter, 96 top and bottom, 40 between blocks,
   600 header measure, 12 inside it — and disagree about everything inside it.
   The desktop values, which every clamp below reaches and holds:

     SECTION   1128 cap · 24 gutter · 96 top and bottom · 40 between blocks
     HEADER    600 cap · 12 between kicker, heading and lead · LEFT ALIGNED
     KICKER    14px mono, uppercase, semibold · 6px SQUARE dot · 6 gap · no pill
     HEADING   36px, left, leading 40 (1.11), REGULAR WEIGHT
     GRID      3 up · 16 column gap · 20 row gap
     CARD      349 × 192 · 20 padding · NO RADIUS · 0.8 hairline
               1.6 accent rule along the bottom edge
               48 between the icon slot and the text block, both centred in the card
               24 icon · 16px title · 16px body · 8 between them

   WHAT ACTUALLY SEPARATES V3 FROM V2, since the two are easy to conflate:

     1. IT IS LEFT ALIGNED, all the way down. V2 centres the header and the card
        text; here the section, the header block and every card run off one left
        edge, so the kicker, the heading, the lead and the first card's title all
        start at the same x.
     2. SQUARE CORNERS. V2's shape is a 40px radius; this one has none at all,
        and the accent rule along the bottom is what gives each card its edge.
     3. TITLE AND BODY ARE THE SAME SIZE — 16 and 16. The only thing separating
        them is weight and colour: medium ink over regular ink-soft. That is the
        reference's move and it is why the cards read as a data table rather than
        as six little articles, and why the card gap can be 16 without the six of
        them turning to mush.
     4. THE HEADING IS NOT BOLD. 36px at regular weight, which is the one heading
        on this page that is not set in bold. It is the reference's look — a
        light, wide, Inter-Display headline — and dropping it to regular is most
        of what makes 36px hold its own against six cards. Set it bold and it
        stops being this design.
     5. NO DISPLAY FONT IN THE CARDS. The reference sets card titles in its UI
        face, not its display face, so the titles here are font-sans like the
        body under them. Montserrat appears once in the section, on the h2.

   The teal accent maps to the brand ramp: --grad on the bottom rule and the
   kicker's dot (filled shapes, so the bright cut), --grad-ink on the heading's
   gradient run (text on paper, so the darkened cut). Neutral-900 cards on a
   dark ground invert to white cards on warm paper, and the white/20 hairline
   becomes border-line.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above, so the design that was given is the design that renders at
   width; the ramp exists for everything narrower. */

/* 36px at 1128 and up, 28px on a 390 phone. A shallower ramp than V2's
   (32 → 48): a regular-weight heading has less ink to lose on the way down, so
   it needs a higher floor to keep reading as the section's title. */
const HEADING = "text-[clamp(1.75rem,1.3rem+2vw,2.25rem)]";

/* THE CARD. Square, hairlined, and closed at the bottom by a 1.6px gradient
   rule — a rule and not a `border-bottom`, because a border takes a colour and
   this one takes the brand ramp.

   `pb-[calc(...)]` is not decoration: the rule is an absolutely positioned
   child, so it sits OVER the padding box rather than adding to it, and without
   the extra 1.6 at the bottom the last line of a full card's body would touch
   it. The value is the padding clamp plus the rule's own thickness.

   Content is vertically CENTRED — `justify-center` — which is what the
   reference's fixed 192 height buys: 20 + 24 + 48 + 80 + 20 comes to exactly
   192, so the icon and the text block are not stacked at the top of a taller
   box, they fill it. `h-full` puts that back here, where the row decides the
   height instead.

   No lift on hover. V2's cards are separate floating shapes and rise; these sit
   in a grid 16 apart with hard corners and read as one ruled surface, so they
   brighten their own rule and their own border in place instead of breaking the
   row's alignment by moving. */
const CARD =
  "group relative flex h-full flex-col items-start justify-center overflow-hidden " +
  "gap-[clamp(24px,3.4vw,48px)] border-[0.8px] border-line bg-white " +
  "p-[clamp(16px,1.6vw,20px)] pb-[calc(clamp(16px,1.6vw,20px)+1.6px)] " +
  "lap:min-h-48 " +
  "transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:border-ink/15 hover:shadow-[var(--shadow-sm)]";

/* The accent rule. Its own element rather than a border so it can carry the
   gradient, and it scales from the LEFT on hover — from 100% to nothing would
   be backwards, so instead it sits at full width and deepens: the resting state
   is the design's, and the hover just adds 0.8px of thickness. */
const RULE =
  "pointer-events-none absolute inset-x-0 bottom-0 h-[1.6px] bg-[image:var(--grad)] " +
  "transition-[height] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "group-hover:h-[2.4px]";

/* The claim panel, in the section's own language: square, hairlined, and closed
   by the same accent rule the cards carry, so the largest box on the band is
   built from the same three parts as the six small ones. Two corner washes on
   warm paper — flame in at the top left, violet out at the bottom right. */
const CLAIM_BG =
  "bg-[radial-gradient(90%_130%_at_10%_0%,rgba(255,106,61,0.1),rgba(255,106,61,0)_55%),radial-gradient(90%_130%_at_95%_100%,rgba(138,79,224,0.1),rgba(138,79,224,0)_55%),var(--color-paper-2)]";

export function WhyUsV3() {
  return (
    /* `items-start`, and it is the whole design: the section is a left-aligned
       column, so the header block does not centre itself and the cards do not
       centre their text. Change this one word and the layout becomes V2's.

       WIDTH CAP AT 1128, the design's, which is narrower than the page's own
       1180 — so this band sits a little inside every other one on a wide
       monitor. That is the reference's proportion (three ~349 cards under a 600
       measure) and it is kept rather than stretched to the page gutter. */
    <section
      id="why"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1128px] flex-col items-start gap-[clamp(32px,3.5vw,40px)] px-6 py-[clamp(64px,8vw,96px)]`}
      aria-label={why.kicker}
    >
      {/* HEADER BLOCK — 600 cap, 12 between its three lines, left aligned. The
          cap is on this wrapper and in px: an em here would resolve against the
          body size, not against the 36px heading it is meant to measure. */}
      <div className="flex w-full max-w-[600px] flex-col items-start gap-3">
        {/* Mono, uppercase, semibold, 14px — which is the page's OWN kicker
            convention, arrived at from the other direction. The two differences
            from the other sections' version: a 6px square instead of the 2.2em
            rule, and NO added tracking. Both are the reference's. Mono is
            already wide at its natural spacing, and the 0.22em the rest of the
            page adds would push "Why us" past the 80px the design gives it.

            A SQUARE, deliberately, not a dot: `size-1.5` with no radius is the
            one hard-edged mark in the header and it rhymes with the card
            corners below. `--grad` and not `--grad-ink` because it is a filled
            shape, not text, so the bright cut is the correct one. */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold uppercase leading-5 text-pink-deep">
            <span aria-hidden className="size-1.5 shrink-0 bg-[image:var(--grad)]" />
            {why.kicker}
          </span>
        </Reveal>

        {/* Two-tone in the reference — full strength for the opening clause,
            muted for the rest. Here the second run is the page's gradient
            instead, marked with *asterisks* in lib/content.ts, which is the same
            job done in the brand's own terms.

            REGULAR WEIGHT, and see note 4 at the top of this file before
            changing it. `leading-[1.11]` is the reference's 40-on-36 kept as a
            ratio so it travels down the clamp.

            No `text-balance`: balancing evens the line lengths, and this heading
            is left-aligned and ragged by design — the reference's line turns
            where the measure runs out, not where a balancer would put it.

            RevealText lays each word out as its own box and stitches the ramp
            back across them, so this cannot be swapped for a plain <h2> without
            changing both the rhythm and the colour — see the note there. */}
        <RevealText
          as="h2"
          text={why.heading}
          className={`font-display ${HEADING} font-normal leading-[1.11] tracking-[-0.01em]`}
        />

        {/* The lead sits at the CARD BODY step, which in this design is also the
            card TITLE step. The whole section is two type sizes — 36 and 16 —
            and nothing else. That is what the reference does, and it is why the
            weight and colour separations inside a card have to do real work. */}
        <Reveal delay={100}>
          <p className={`max-w-[54ch] text-pretty font-sans ${SIZE_16} leading-5 text-ink-soft`}>
            {why.lead}
          </p>
        </Reveal>
      </div>

      {/* 16 between columns, 20 between rows — the reference's two gaps, which
          are not the same number. 3 up at the top, 2 from `phone:`, 1 below it.
          The turn to three waits for `lap:`: at 761 a third column leaves each
          card about 240 wide, and this card's body wants a ~30ch measure. */}
      <div className="grid w-full gap-x-4 gap-y-5 phone:grid-cols-2 lap:grid-cols-3">
        {why.pillars.map((p, i) => (
          /* Stagger runs across the ROW, not the whole grid: at 6 × 70ms the
             last card would still be arriving long after the reader got there.
             It resets every three so no card waits more than 140ms. */
          <Reveal key={p.title} delay={(i % 3) * 70} className="h-full">
            <article className={CARD}>
              {/* The reference's 24px icon slot. It holds the pillar's number
                  rather than a glyph — the set has no icons drawn for it, and an
                  empty box would just be 24px of air above every title. A
                  hairlined square rather than V2's filled circle, for the same
                  reason the kicker's mark is square. */}
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center border-[0.8px] border-line font-mono text-[0.62rem] leading-none text-pink-deep"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col items-start gap-2">
                {/* SAME SIZE AS THE BODY BELOW IT. Medium weight and full-
                    strength ink are the entire hierarchy here — see note 3. */}
                <h3 className={`font-sans ${SIZE_16} font-medium leading-5 text-ink`}>
                  {p.title}
                </h3>
                {/* The body's measure is NARROWER than the title's — 256 against
                    288 in the reference, inside the same card. Held as ch rather
                    than px so it survives the card getting narrower. */}
                <p
                  className={`max-w-[30ch] text-pretty font-sans ${SIZE_16} leading-5 text-ink-soft`}
                >
                  {p.body}
                </p>
              </div>

              <span aria-hidden className={RULE} />
            </article>
          </Reveal>
        ))}
      </div>

      {/* The argument, not a seventh card — so it gets the tinted ground and
          keeps the grid at six. Left aligned like everything else, and its
          padding is the card's roughly doubled at the ceiling: a full-width box
          at the card's own 20 would read as a card that had been stretched
          rather than as the band's closing statement. */}
      <div
        className={`relative flex w-full flex-col items-start gap-6 overflow-hidden border-[0.8px] border-line p-[clamp(24px,3.4vw,40px)] ${CLAIM_BG}`}
      >
        {/* A DIRECT flex child, deliberately: `display: inline` on a flex item
            blockifies, which is what lets the 26ch measure apply. Wrap it in a
            Reveal <div> and the div becomes the flex item, the <p> stays inline,
            and the measure is silently dropped.

            Regular weight, matching the h2 above — the claim is the same voice
            as the heading, one step down. Sized at 0.78 of it, which is close
            enough that the two share a texture and far enough that the claim
            can never outrank the section's own heading. */}
        <RevealText
          as="p"
          text={why.claim}
          stagger={30}
          className="max-w-[30ch] text-pretty font-display text-[clamp(1.375rem,1rem+1.67vw,1.75rem)] font-normal leading-[1.2] tracking-[-0.01em]"
        />
        <Reveal delay={100}>
          <Button contact variant="dark" withArrow>
            {why.claimCta}
          </Button>
        </Reveal>
        <span aria-hidden className={RULE} />
      </div>
    </section>
  );
}

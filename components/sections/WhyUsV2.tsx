import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16 } from "@/lib/ui";

const { why } = content;

/* WHY US — V2. The reference layout's box, this page's palette.

   Same copy and same components as WhyUs.tsx; what changes is every number.
   They are taken from the supplied design, and these are its desktop values —
   the ones the clamps below all reach and hold:

     SECTION   1128 cap · 24 gutter · 96 top and bottom · 40 between blocks
     HEADER    600 cap · 12 between pill, heading and lead
     PILL      16 × 8, fully rounded, 14px label beside an 8px dot
     HEADING   48px, centred, leading 1.05, tracking +0.02em
     GRID      3 up · 12 gap
     CARD      352 × 192 · 28 padding · 40 radius · 0.8 hairline
               20 between the icon slot and the text block
               24 icon · 20px title · 16px body · 8 between them

   THE ONE PLACE THIS ARGUES WITH lib/ui.ts: the grid gap is 12 against a card
   padded 28, so the seam between two cards is less than half the distance a
   card's own text sits from its edge. The scale's rule — a gap is never smaller
   than the padding inside the things it separates — says that groups a card's
   text with its neighbour's. It reads here because the 40px radius and the
   hairline are doing the separating instead: the cards are visibly closed
   shapes, so proximity never gets to be the only cue. Widen the gap to 28+ if
   the border ever comes off, and the layout goes back on the scale.

   OFF THE PAGE'S SHARED SCALES, like WhyUs, Pricing and Testimonials before it
   — SECTION, WRAP, HEAD_GAP, CARD_GAP and the TEXT_* ladder do not appear
   below. SIZE_16 is the exception: 14 → 16px is exactly the card-body step the
   design asks for, and it is already shared with the other three sections.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above, so the design that was given is the design that renders at
   width; the ramp exists for everything narrower. */

/* 48px at 1128 and up, 32px on a 390 phone. The floor is the same 32 the other
   authored sections bottom out at, so the two Why-us variants agree at the
   narrow end even though their ceilings differ (64 there, 48 here). */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* 20px card titles, down to 18. A tighter ramp than the heading on purpose:
   this is a component label, and at a 1.6× spread the six of them would start
   competing with the one heading above. */
const CARD_TITLE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* The card's own box. Held in one string because the six of them must not
   drift, and because the hover belongs to the shape rather than to any card.

   The lift is smaller than v1's 6px: these cards sit 12 apart, and a 6px rise
   on one of them crosses far enough into that seam to read as a collision. */
const CARD =
  "flex h-full flex-col items-start gap-5 overflow-hidden " +
  "rounded-[clamp(28px,3vw,40px)] border-[0.8px] border-line bg-white " +
  "p-[clamp(20px,2vw,28px)] " +
  "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow)]";

/* The claim panel, kept in the section's language rather than the old one's:
   the card radius, not a 24, so the largest box on the band is not the only one
   with a different corner. Two corner washes on warm paper — flame in at the
   top left, violet out at the bottom right — so the band carries the gradient's
   direction without putting a second colour under the type. */
const CLAIM_BG =
  "bg-[radial-gradient(90%_130%_at_10%_0%,rgba(255,106,61,0.1),rgba(255,106,61,0)_55%),radial-gradient(90%_130%_at_95%_100%,rgba(138,79,224,0.1),rgba(138,79,224,0)_55%),var(--color-paper-2)]";

export function WhyUsV2() {
  return (
    /* The section IS the flex column, so the 40 between the header, the grid
       and the claim is one declaration rather than a margin on each block.

       WIDTH CAP AT 1128, which is the design's, and is the one thing that reads
       differently from the other three authored sections: they run to the
       viewport. 1128 is narrower than the page's own 1180 ceiling, so this band
       sits a little inside every other one on a wide monitor. That is the
       reference's proportion — three 352 cards and a 600 measure over them — so
       it is kept rather than stretched to the page gutter. */
    <section
      id="why"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1128px] flex-col items-center gap-[clamp(32px,3.5vw,40px)] px-6 py-[clamp(64px,8vw,96px)]`}
      aria-label={why.kicker}
    >
      {/* HEADER BLOCK — 600 cap, 12 between its three lines. The cap is on this
          wrapper and in px: an em here would resolve against the body size, not
          against the 48px heading it is meant to measure. */}
      <div className="flex w-full max-w-[600px] flex-col items-center gap-3">
        {/* The pill, in place of the rule-and-caps kicker the other sections
            use. Reference numbers: 16 × 8, fully rounded, a 14px label beside an
            8px dot. Its ground is a 4% ink tint rather than the reference's
            white/5 — that one is a lift off a dark card and would be invisible
            on paper, so the same idea is inverted to a wash.

            The dot carries the brand ramp, which is the one bit of colour in
            the header: `--grad` and not `--grad-ink` because it is a filled
            shape here, not text, so the bright cut is the correct one. */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/4 px-4 py-2 font-sans text-sm leading-5 text-ink-faint">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-[image:var(--grad)]"
            />
            {why.kicker}
          </span>
        </Reveal>

        {/* Two-tone in the reference — full-strength for the opening clause,
            muted for the rest. Here the second run is the page's gradient
            instead, marked with *asterisks* in lib/content.ts, which is the
            same job done in the brand's own terms.

            RevealText lays each word out as its own box and stitches the ramp
            back across them, so this cannot be swapped for a plain <h2> without
            changing both the rhythm and the colour — see the note there. */}
        <RevealText
          as="h2"
          text={why.heading}
          className={`text-balance text-center font-display ${HEADING} font-bold leading-[1.05] tracking-[0.02em]`}
        />

        {/* The lead sits at the CARD BODY step, not a step of its own. The
            reference header is a pill and a headline only, so there is no size
            given for this line; putting it on the same 16 the cards use keeps
            the section to three type sizes total — 48, 20, 16 — which is what
            makes the heading read as far above everything else as it does. */}
        <Reveal delay={100}>
          <p
            className={`max-w-[54ch] text-pretty text-center font-sans ${SIZE_16} leading-5 text-ink-soft`}
          >
            {why.lead}
          </p>
        </Reveal>
      </div>

      {/* 3 up at the top, 2 from `phone:`, 1 below it. The turn to three waits
          for `lap:` rather than `tab:`: at 761 a third column leaves each card
          about 230 wide, and 28 of padding on each side of that is most of the
          card. */}
      <div className="grid w-full gap-3 phone:grid-cols-2 lap:grid-cols-3">
        {why.pillars.map((p, i) => (
          /* Stagger runs across the ROW, not the whole grid: at 6 × 70ms the
             last card would still be arriving long after the reader got there.
             It resets every three so no card waits more than 140ms. */
          <Reveal key={p.title} delay={(i % 3) * 70} className="h-full">
            <article className={CARD}>
              {/* The reference's 24px icon slot. It holds the pillar's number
                  rather than a glyph — the set has no icons drawn for it, and an
                  empty box would just be 24px of air above every title. Mono, so
                  two digits sit on a fixed width and the six badges line up. */}
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full bg-ink/4 font-mono text-[0.62rem] leading-none text-pink-deep"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col items-start gap-2">
                <h3
                  className={`text-balance font-display ${CARD_TITLE} font-bold leading-6 tracking-[-0.015em]`}
                >
                  {p.title}
                </h3>
                <p className={`text-pretty font-sans ${SIZE_16} leading-5 text-ink-soft`}>
                  {p.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* The argument, not a seventh card — so it gets the tinted ground and
          keeps the grid at six. Its padding is the card's, doubled at the
          ceiling: a full-width box at the card's own 28 would read as a card
          that had been stretched rather than as the band's closing statement. */}
      <div
        className={`flex w-full flex-col items-center gap-6 rounded-[clamp(28px,3vw,40px)] border-[0.8px] border-line p-[clamp(28px,4vw,56px)] text-center ${CLAIM_BG}`}
      >
        {/* A DIRECT flex child, deliberately: `display: inline` on a flex item
            blockifies, which is what lets the 26ch measure apply. Wrap it in a
            Reveal <div> and the div becomes the flex item, the <p> stays inline,
            and the measure is silently dropped.

            Sized at 0.75 of the heading, held there by sharing HEADING's clamp
            shape — a statement inside the section can never outrank the
            section's own heading. */}
        <RevealText
          as="p"
          text={why.claim}
          stagger={30}
          className="max-w-[26ch] text-pretty font-display text-[clamp(1.5rem,1rem+2.03vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.015em]"
        />
        <Reveal delay={100}>
          <Button contact variant="dark" withArrow>
            {why.claimCta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

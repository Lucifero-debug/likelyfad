import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16 } from "@/lib/ui";

const { why } = content;

/* WHY US — V4. The process-row reference's box, this page's palette and copy.

   The fourth take on the same six pillars. The desktop values, which every
   clamp below reaches and holds:

     SECTION   1280 cap · 56 gutter · 64 between the header and the cards
     HEADER    544 measure · LEFT ALIGNED · 16 between the kicker and the heading
     KICKER    12px mono, uppercase, 0.1em tracked · 20 × 2 gradient bar · 8 gap
     HEADING   48px EXTRABOLD, left, leading 1.054
     GRID      24 gap, matching the card's own padding exactly
     CARD      24 padding · 24 radius · 0.8 hairline · white
               36 gradient badge holding a 14px mono numeral
               16 badge → title · 20px EXTRABOLD title
               8 title → body · 16px body on 24 leading

   WHAT SEPARATES V4 FROM V2 AND V3:

     1. THE STACK INSIDE A CARD IS A LADDER OF SHRINKING GAPS — 16 then 8, not
        one gap repeated. The badge is further from the title than the title is
        from its body, so the three parts group correctly on their own: the
        title and the body read as one block that the badge introduces.
     2. THE BADGE IS THE COLOUR. V2 and V3 keep the brand to a dot and a rule;
        here a 36px gradient disc carries a white numeral, and it is the only
        saturated thing in the card. It is also the first thing the eye lands
        on, which is what makes the six read as an enumerated case.
     3. EXTRABOLD, TWICE. The heading and the card titles are both heavier than
        anything else on the page (`font-extrabold` against the usual bold), and
        the body under them is unchanged at 16. The contrast is carried by
        weight rather than by size, which is why a 20px title holds against a
        48px heading in the same band.
     4. GAP EQUALS PADDING — 24 and 24. This is the one variant that satisfies
        the rule in lib/ui.ts exactly rather than arguing with it (V2 runs 12
        against 28) or sidestepping it (V3 leans on its hard corners).
     5. LEFT ALIGNED like V3, and 1280 wide rather than 1128 — the widest of the
        four, and the only one wider than the page's own 1180 cap.

   THE CONNECTOR ARROW IS NOT HERE, and that is deliberate. The reference is a
   four-step PROCESS — Brief → Generate → Human QA → Delivered — and its arrows
   carry the eye along a sequence. These six pillars are a SET: they can be read
   in any order and none of them follows from the one before. Arrows between
   them would assert a flow that the copy does not have, and at three columns
   the third card's arrow would point off the right edge of the row into
   nothing. To add them back if this ever becomes a real four-step section, put
   `relative` on the Reveal wrapper and an absolutely positioned
   `left-full top-1/2 -translate-y-1/2` span beside the article — the gutter is
   24 wide and already has room for it.

   The 20 × 2 gradient bar, the badge and the ramp are `--grad`, the bright cut,
   because all three are FILLED SHAPES rather than text; only the heading's
   gradient run takes `--grad-ink`. neutral-900/10 outlines become border-line,
   which is the same 10% ink the reference asks for and already a token here.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1280 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at the top, 32px on a 390 phone — the same ceiling and floor V2 uses, so
   the two 48px variants agree at both ends even though one is centred and bold
   and this one is left and extrabold. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* 20px card titles, down to 18. */
const CARD_TITLE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* The card. `outline` in the reference rather than a border, with a negative
   offset to pull it inside the box — which is Figma's way of saying "a hairline
   that does not affect layout". A real border does the same job here and is
   what every other card on this page uses, so the outline is not carried over.

   The lift is the page's standard card hover, not V3's in-place brighten: these
   are rounded, shadowed, separated shapes like the rest of the site's cards, so
   they move. */
const CARD =
  "flex h-full flex-col items-start rounded-3xl border-[0.8px] border-line bg-white " +
  "p-[clamp(20px,2vw,24px)] " +
  "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow)]";

/* The claim panel, in this design's language: the card's radius and hairline at
   a larger scale. Two corner washes on warm paper — flame in at the top left,
   violet out at the bottom right — so the band carries the gradient's direction
   without putting a second colour under the type. */
const CLAIM_BG =
  "bg-[radial-gradient(90%_130%_at_10%_0%,rgba(255,106,61,0.1),rgba(255,106,61,0)_55%),radial-gradient(90%_130%_at_95%_100%,rgba(138,79,224,0.1),rgba(138,79,224,0)_55%),var(--color-paper-2)]";

export function WhyUsV4() {
  return (
    /* 1280 cap and a 56 gutter, both the reference's. The reference frame gives
       no vertical padding at all — it is a crop, not a section — so the top and
       bottom come from the same clamp V2 and V3 use, and the four variants can
       be swapped for each other without the seams above and below moving. */
    <section
      id="why"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1280px] flex-col items-start px-[clamp(24px,4.4vw,56px)] py-[clamp(64px,8vw,96px)]`}
      aria-label={why.kicker}
    >
      {/* HEADER BLOCK — a 544 measure, left aligned, 16 under the kicker. In px
          on the wrapper: an em here would resolve against the body size, not
          against the 48px heading it is meant to measure. */}
      <div className="flex w-full max-w-[544px] flex-col items-start">
        {/* The page's own kicker convention, at the reference's numbers: 12px
            mono, uppercase, 0.1em of tracking rather than the 0.22em the other
            sections add, and a 20 × 2 BAR instead of the usual 1px rule. The bar
            is a filled shape, so it takes the bright ramp and becomes the first
            piece of brand colour in the band — the badges below finish the
            thought. `rounded-xs` is the reference's 2px, which on a 2px-tall bar
            just rounds the ends. */}
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase leading-5 tracking-[0.1em] text-ink-faint">
            <span
              aria-hidden
              className="h-0.5 w-5 shrink-0 rounded-xs bg-[image:var(--grad)]"
            />
            {why.kicker}
          </span>
        </Reveal>

        {/* EXTRABOLD, which is heavier than any other heading on the page, and
            see note 3 at the top of this file before dialling it back. The
            `pt-4` is the reference's 16 — on the wrapper rather than as a margin
            on the heading, so it survives RevealText's inline layout.

            `leading-[1.054]` is the reference's 50.59-on-48 kept as a ratio so
            it travels down the clamp. No `text-balance`: this heading is left
            aligned and ragged by design, and balancing would even the lines out
            of the shape the measure gives them.

            RevealText lays each word out as its own box and stitches the
            gradient back across them, so this cannot be swapped for a plain
            <h2> without changing both the rhythm and the colour. */}
        <div className="w-full pt-4">
          <RevealText
            as="h2"
            text={why.heading}
            className={`font-display ${HEADING} font-extrabold leading-[1.054] tracking-[-0.02em]`}
          />
        </div>

        {/* The lead is not in the reference — its header is a kicker and a
            headline only — so it takes the card body's step and leading, which
            keeps the section to three sizes: 48, 20, 16. */}
        <Reveal delay={100}>
          <p className={`pt-4 text-pretty font-sans ${SIZE_16} leading-6 text-ink-soft`}>
            {why.lead}
          </p>
        </Reveal>
      </div>

      {/* 64 under the header, as `pt-16` on the grid's own wrapper — the
          reference's number, and the largest gap in the section.

          THREE UP, not the reference's four: there are six pillars, and six
          across four columns leaves two stranded on a second row. Three divides
          evenly into two full rows and gives each card ~390 at the 1280 cap,
          which is wider than the reference's ~270 — so the 24 padding sits in a
          roomier box than it was drawn for. Drop to `lap:grid-cols-4` if the set
          ever goes to four or eight. */}
      <div className="w-full pt-16">
        <div className="grid gap-6 phone:grid-cols-2 lap:grid-cols-3">
          {why.pillars.map((p, i) => (
            /* Stagger runs across the ROW, not the whole grid: at 6 × 70ms the
               last card would still be arriving long after the reader got there.
               It resets every three so no card waits more than 140ms. */
            <Reveal key={p.title} delay={(i % 3) * 70} className="h-full">
              <article className={CARD}>
                {/* 36px gradient disc, white 14px mono numeral. `rounded-[19px]`
                    in the reference is just a full round on a 36px box, so
                    `rounded-full` says the same thing and survives the clamp.

                    Hidden from a screen reader, loud to the eye. The numeral is
                    the most prominent thing in the card and carries none of its
                    meaning: read aloud, "one, It looks real, or it doesn't ship"
                    just prefixes every pillar with a number that says nothing
                    the order of the cards has not already said. */}
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] font-mono text-sm font-medium leading-6 text-white"
                >
                  {i + 1}
                </span>

                {/* THE SHRINKING LADDER — 16 here, 8 below. See note 1. */}
                <h3
                  className={`pt-4 text-balance font-display ${CARD_TITLE} font-extrabold leading-[1.2] tracking-[-0.025em]`}
                >
                  {p.title}
                </h3>
                {/* `leading-6` is the reference's 24-on-16, which is looser than
                    the 20 V2 and V3 set their card copy on. It is the right call
                    for this card: the box is wider here, so the lines are longer
                    and need the extra leading to stay trackable. */}
                <p className={`pt-2 text-pretty font-sans ${SIZE_16} leading-6 text-ink-soft`}>
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* The argument, not a seventh card — so it gets the tinted ground and
          keeps the grid at six. Sits on the same 64 the grid does, left aligned
          like everything above it, and its padding is the card's roughly doubled
          at the ceiling: a full-width box at the card's own 24 would read as a
          card that had been stretched rather than as the band's closing
          statement. */}
      <div className="w-full pt-16">
        <div
          className={`flex w-full flex-col items-start gap-6 rounded-3xl border-[0.8px] border-line p-[clamp(24px,3.4vw,48px)] ${CLAIM_BG}`}
        >
          {/* A DIRECT flex child, deliberately: `display: inline` on a flex item
              blockifies, which is what lets the 30ch measure apply. Wrap it in a
              Reveal <div> and the div becomes the flex item, the <p> stays
              inline, and the measure is silently dropped.

              Extrabold, matching the h2 and the card titles — in this variant
              the weight is the shared signature, so the claim has to carry it
              too. Sized at 0.73 of the heading, far enough below that it can
              never outrank the section's own title. */}
          <RevealText
            as="p"
            text={why.claim}
            stagger={30}
            className="max-w-[30ch] text-pretty font-display text-[clamp(1.375rem,0.9rem+2.03vw,2.2rem)] font-extrabold leading-[1.15] tracking-[-0.025em]"
          />
          <Reveal delay={100}>
            <Button contact variant="dark" withArrow>
              {why.claimCta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

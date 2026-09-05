import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import {
  ANCHOR,
  CARD_GAP,
  HEAD_GAP,
  SECTION,
  SIZE_16,
  SIZE_24,
  SIZE_32,
  SIZE_64,
  TEXT_STATEMENT,
  WRAP,
} from "@/lib/ui";

const { why } = content;

/* THE BOX IS THE PAGE'S. THE TYPE IS STILL THIS SECTION'S OWN.

   Two separate things were bundled together when this section went off-scale,
   and only one of them has come back.

   THE TYPE STAYS AUTHORED. 64 / 32 / 24 / 16, by request — the SIZE_* ramps
   below are those four desktop values made responsive, and no step of the
   page's shared ladder is involved. Change TEXT_H2 and this heading does not
   move.

   THE BOX IS NO LONGER AUTHORED. Gutter, ceiling, vertical rhythm and the two
   gaps all come from SECTION / WRAP / HEAD_GAP / CARD_GAP now, the same as
   every other band. The 16/12 padding standing in for them was doing neither
   job: 16px of gutter against the hero's clamp(24,5vw,64) started this
   section's cards a long way outboard of the copy above them, and 12px of
   vertical padding left a 24px seam between two bands the rest of the page
   separates by 80 to 128. Both read as misalignment because both were.

   ONE GAP BECAME TWO, which is the other half of the repair. A single 32 ran
   every seam here — heading to content and card to card — and that is the one
   arrangement the spacing scale exists to prevent: a header block sitting
   exactly as far from the cards as the cards sit from each other belongs to
   them as readily as to its own section. HEAD_GAP (32→64) over CARD_GAP
   (32→48) puts the ordering back. */

/* THE CARD IS V4'S, CENTRED. Everything that made a V4 pillar read as an
   enumerated case comes over intact — the 36px gradient disc, the extrabold
   20px title, the shrinking 16-then-8 ladder under it, the 24 radius and the
   0.8 hairline — and the only thing changed is the axis: `items-center` plus
   `text-center` on each part, so the badge sits over the middle of the title
   rather than beside its first word.

   THE HOVER HAIRLINE IS GONE WITH IT. It grew from the left edge, which is a
   left-aligned card's gesture; on a centred card it reads as arriving from
   somewhere. The lift and the shadow are the whole hover now, same as V4.

   PADDING IS STILL UNDER THE GRID GAP, which is the rule the scale exists to
   hold: 20→24 inside a card that CARD_GAP separates by 32→48, so a pillar's
   text is always nearer its own edge than its neighbour's. It is a step tighter
   than the 24→32 this section used before because the type inside shrank with
   it — a 20px title does not need a 32px surround. */
const PILLAR =
  "flex h-full flex-col items-center rounded-3xl border-[0.8px] border-line bg-white " +
  "p-[clamp(20px,2vw,24px)] text-center " +
  "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow)]";

/* 20px card titles, down to 18 — V4's step, not the section's SIZE_32. The
   contrast against the 64px heading is carried by WEIGHT here (extrabold
   against the page's usual bold) rather than by size, which is what lets a
   title this small still hold its own in the band. */
const CARD_TITLE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* THE NUMERAL CHIP, LIFTED FROM V2 AND SCALED UP.

   V2 sets its index in a 24px circle filled `bg-ink/4` with the numeral in
   pink-deep mono. That is the treatment; the only change here is the size.

   WHY IT IS A CIRCLE AGAIN AND STILL NOT THE OLD BALL. The disc this card used
   to carry was 36px of `--grad` at full saturation with a white numeral on top,
   which made it the loudest object in a white card — a decorative index
   outranking the claim it introduces. V2 keeps the round shape and inverts the
   emphasis: the fill drops to a 4% ink wash that barely separates from the card,
   and the COLOUR moves onto the digits. Same silhouette, opposite weight.

   36px, NOT V2's 24. V2's cards are small, flush-left and set at body size,
   where 24 is in proportion. These are centred, padded to 24 and titled in
   extrabold display, and at 24 the chip read as a leftover under that.

   36 IS THE DISC'S OWN FOOTPRINT, WHICH IS THE POINT AND NOT A COINCIDENCE. The
   card was drawn around a 36px mark, so the gap ladder under it and the balance
   between the mark and the title were both set against that size. Taking V2's
   treatment back up to it means the card gets its original proportions with the
   original's weight problem inverted: same 36px circle, 4% wash instead of full
   saturation, pink digits instead of white on a gradient. Shape and scale from
   the disc, emphasis from V2.

   The numeral rides up with the circle, 0.62rem → 0.78rem, so the digits keep
   their proportion inside it rather than swimming in the middle.

   ZERO-PADDED AND MONO, WHICH IS V2's REASON AND IT HOLDS AT ANY SIZE: `01`
   through `06` are a fixed two characters at a fixed advance, so all six chips
   hold their numeral on the same optical centre and the six line up down the
   grid. A bare `1` beside a `6` in a proportional face would not.

   STILL `aria-hidden`, as the disc was. Read aloud, "one, It looks real, or it
   doesn't ship" prefixes every pillar with a number that says nothing the
   reading order has not already said. The numbering is for the eye, to make six
   cards read as one enumerated set; it is not content.

   THE GAP LADDER BELOW IT IS UNTOUCHED — 16 to the title, 8 to the body. */
const NUMERAL =
  "grid size-9 shrink-0 place-items-center rounded-full bg-ink/4 " +
  "font-mono text-[0.78rem] leading-none tabular-nums text-pink-deep";

/* Two corner washes on warm paper rather than a flat tint: the flame stop
   enters top-left, the violet stop leaves bottom-right, so the band carries the
   gradient's direction without competing with the type sitting on it. */
/* THE CLAIM CARD'S GROUND — /bg.png, with the two brand tints washed over it.

   IT WAS RENDERING NO BACKGROUND AT ALL BEFORE THIS, and that is worth knowing
   because the bug is invisible and the shape that caused it is easy to write
   again. The old value was one `bg-[...]` holding three comma-separated layers,
   and the last of them was `var(--color-paper-2)` — a plain colour, #fff7f3. A
   colour is not a valid <bg-image>, and ONE invalid layer in a comma list
   invalidates the WHOLE declaration rather than just its own layer. Chrome
   reported `background-image: none` and `background-color: rgba(0,0,0,0)` on
   this element: the two tint radials had never painted either. So the colour is
   now a background-COLOR utility of its own, and only real image layers go in
   the image list.

   ORDER IS TOP-DOWN. The first layer paints nearest the viewer, so the two
   radials sit OVER the photograph and the photograph sits over the base colour.
   That keeps the original warm/cool corner wash doing its job — at 10% alpha it
   now reads as a glow on the texture rather than a tint on paper.

   THE BASE COLOUR IS noir AND IT IS LOAD BEARING. /bg.png carries an alpha
   channel and roughly a third of its canvas is transparent, so whatever sits
   under it shows through. Against the old paper-2 the card would have come out
   patchy — dark texture over most of it, near-white where the image runs out.
   noir (#141217) is within a couple of steps of the image's own darkest area,
   so the transparent region reads as more of the same ground instead of a hole.

   cover/center/no-repeat RATHER THAN THE NATURAL SIZE. The source is 3581x2417
   against a card that is wide and short, so at natural size it would tile and
   show its seams. `cover` crops to the middle band, which on this image is the
   part with the texture in it. */
const CLAIM_BG =
  "bg-noir bg-cover bg-center bg-no-repeat " +
  "bg-[image:radial-gradient(90%_130%_at_10%_0%,rgba(255,106,61,0.1),rgba(255,106,61,0)_55%),radial-gradient(90%_130%_at_95%_100%,rgba(138,79,224,0.1),rgba(138,79,224,0)_55%),url('/bg.png')]";

export function WhyUs() {
  return (
    /* THE TWO-ELEMENT SPLIT EVERY OTHER SECTION USES: the <section> owns the
       vertical rhythm and nothing else, the div inside it owns the gutter and
       the ceiling. Keeping them apart is what lets a band paint a ground edge
       to edge while its content still stops where the hero's content stops —
       and WRAP's ceiling IS the hero's stage, 1520 against the same gutter
       clamp, so that is one measurement shared rather than two similar numbers
       that happen to agree today. */
    <section id="why" className={`${SECTION} ${ANCHOR}`} aria-label={why.kicker}>
      <div className={WRAP}>
        {/* THE HEADER BLOCK IS ITS OWN FLEX COLUMN, and it has to be: RevealText
            renders its root as `display: inline`, so a margin on the h2 below is
            inert — the same trap SectionHeading documents on its own mt-3. A flex
            parent blockifies its children, which is what makes these gaps exist
            at all.

            12, THEN 24, THEN HEAD_GAP, opening as it goes down. The kicker
            belongs to the headline, the lead belongs to both, and the cards
            belong to the section; each gap being larger than the one above it is
            the only thing telling a reader which of those is which. */}
        <div className={`${HEAD_GAP} flex flex-col items-center gap-3 text-center`}>
          {/* Roboto, not the mono every other kicker on the page uses —
              "everything else Roboto" applies to this too. The rule keeps its
              length in em so it still tracks the 24px it sits beside. */}
          <Reveal>
            <span className={`inline-flex items-center gap-[0.62em] font-sans ${SIZE_24} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-['']`}>
              {why.kicker}
            </span>
          </Reveal>

        {/* The measure is in em ON THE H2 ITSELF, where em resolves against this
            element's own 64px rather than against the body size — which is why
            SectionHeading has to route the same cap through a custom property and
            this does not. 13em is the same ~13-title-em measure the rest of the
            page's headings use, so it still turns over two lines.

            A gradient run is marked in the copy with *asterisks* and RevealText
            lays each word out as its own box — see the note there before setting
            this as plain text. */}
          <RevealText
            as="h2"
            text={why.heading}
            className={`mx-auto max-w-[13em] text-center text-balance font-display ${SIZE_64} font-bold leading-[1.1] tracking-[-0.022em]`}
          />

          {/* mt-3 on top of the column's own 12 is the 24 the lead is owed: one
              step above the gap over it, one step below the gap under it. */}
          <Reveal delay={100} className="mt-3">
            <p className={`mx-auto max-w-[54ch] text-center text-pretty font-sans ${SIZE_32} leading-[1.45] text-ink-soft`}>
              {why.lead}
            </p>
          </Reveal>
        </div>

        <div className={`grid ${CARD_GAP} phone:grid-cols-2 lap:grid-cols-3`}>
          {why.pillars.map((p, i) => (
            /* Stagger runs across the ROW, not the whole grid: at 6 × 70ms the
               last card would still be arriving long after the reader got there.
               It resets every three so no card waits more than 140ms. */
            <Reveal key={p.title} delay={(i % 3) * 70} className="h-full">
              <article className={PILLAR}>
                {/* The 36px numeral chip — see NUMERAL. */}
                <span aria-hidden className={NUMERAL}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* THE LADDER OF SHRINKING GAPS — 16 here, 8 below, not one gap
                    repeated. The badge sits further from the title than the
                    title does from its body, so the title and body group as one
                    block that the badge introduces. */}
                <h3 className={`pt-4 text-balance font-display ${CARD_TITLE} font-extrabold leading-[1.2] tracking-[-0.025em]`}>
                  {p.title}
                </h3>
                {/* `leading-6` is 24-on-16: these cards run ~390 wide at the
                    ceiling, so the lines are long enough to need the extra
                    leading to stay trackable. */}
                <p className={`pt-2 text-pretty font-sans ${SIZE_16} leading-6 text-ink-soft`}>
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* The argument, not a card in the grid — so it gets the tinted ground,
            the larger radius, and a padding step above the pillars to match.
            Worth knowing if it ever looks empty: the claim text caps at 26ch, so
            most of this box's width IS padding at a desktop measure.

            THE TOP MARGIN IS CARD_GAP'S CLAMP, SPELLED OUT. The section is not a
            flex column any more, so this seam is a margin rather than a gap, and
            it is deliberately the same number as the seam between the cards
            above: the claim is the last item in that sequence, not a new one.
            Tailwind scans source TEXT and never sees a class assembled from a
            variable, which is why the clamp is written out rather than derived
            from CARD_GAP — the note at the foot of lib/ui.ts. */}
        {/* THE FOREGROUND FLIPPED WITH THE GROUND, AND IT HAD TO. /bg.png is a
            near-black texture, and everything in this box was drawn for the
            near-white one it replaced: the statement inherited `text-ink`
            (#16141a) from the body, the CTA was `variant="dark"` (ink pill,
            paper text) and the hairline was `border-line`, ink at 10% alpha.
            All three are near-black on near-black. Left alone the card would
            have rendered as a dark rectangle with an invisible sentence and an
            invisible button in it.

            `text-paper` here rather than on the statement itself so the whole
            box inherits it — the CTA's own variant sets its colour, so nothing
            is fighting over it, and anything added to this card later starts
            legible instead of starting invisible.

            `border-white/10` is `border-line` mirrored: the same 10% hairline,
            measured from the other end of the scale. */}
        <div
          className={`mt-[clamp(32px,3.5vw,48px)] flex flex-col items-center gap-6 rounded-3xl border border-white/10 p-[clamp(32px,3.5vw,48px)] text-center text-paper ${CLAIM_BG}`}
        >
          {/* A DIRECT flex child, deliberately: `display: inline` on a flex item
              blockifies, which is what lets the 26ch measure apply. Wrap it in a
              Reveal <div> and the div becomes the flex item, the <p> stays inline,
              and the measure is silently dropped.

              Roboto rather than Montserrat: it is a statement, not a heading, and
              "everything else Roboto" covers it. Its SIZE is still the page's
              STATEMENT step — no fixed value was given for this one. */}
          <RevealText
            as="p"
            text={why.claim}
            stagger={30}
            className={`max-w-[26ch] text-pretty font-sans ${TEXT_STATEMENT} font-bold leading-[1.2] lap:leading-[1.1] tracking-[-0.022em]`}
          />
          <Reveal delay={100}>
            {/* `grad` rather than `dark`, which is now an ink pill on an ink
                ground. It is also the same variant the hero gives this exact
                action — both are `contact`, both open the DM — so the page's
                primary CTA looks the same in both places it appears. */}
            <Button contact variant="grad" withArrow>
              {why.claimCta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

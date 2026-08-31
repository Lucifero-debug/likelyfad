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

/* The gradient hairline that draws itself across the top of a card on hover.
   `before` rather than a border, so it can grow from the left instead of
   appearing all at once. */
/* PADDING IS ON THE SCALE AND UNDER THE GRID GAP, which is the rule the whole
   scale exists to hold: 24→32 inside a card that CARD_GAP separates by 32→48,
   so a pillar's text is always nearer its own edge than its neighbour's. The
   12/16 it carried before did not break that rule — it was simply too little
   air for a card running a 32px title at a desktop measure, and it made the
   six of them read as boxed in rather than as composed. */
const PILLAR =
  "relative h-full overflow-hidden rounded-2xl border border-line bg-white " +
  "p-[clamp(24px,2.5vw,32px)] " +
  "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1.5 hover:border-transparent hover:shadow-[var(--shadow)] " +
  "before:absolute before:left-0 before:top-0 before:h-[3px] before:w-full before:content-[''] " +
  "before:origin-left before:scale-x-0 before:bg-[image:var(--grad)] " +
  "before:transition-transform before:duration-[280ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "hover:before:scale-x-100";

/* Two corner washes on warm paper rather than a flat tint: the flame stop
   enters top-left, the violet stop leaves bottom-right, so the band carries the
   gradient's direction without competing with the type sitting on it. */
const CLAIM_BG =
  "bg-[radial-gradient(90%_130%_at_10%_0%,rgba(255,106,61,0.1),rgba(255,106,61,0)_55%),radial-gradient(90%_130%_at_95%_100%,rgba(138,79,224,0.1),rgba(138,79,224,0)_55%),var(--color-paper-2)]";

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
                <span className={`font-sans ${SIZE_16} text-pink-deep`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`mt-3 text-balance font-display ${SIZE_32} font-bold leading-[1.3] tracking-[-0.025em]`}>
                  {p.title}
                </h3>
                <p className={`mt-2 text-pretty font-sans ${SIZE_16} text-ink-soft`}>{p.body}</p>
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
        <div
          className={`mt-[clamp(32px,3.5vw,48px)] flex flex-col items-center gap-6 rounded-3xl border border-line p-[clamp(32px,3.5vw,48px)] text-center ${CLAIM_BG}`}
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
            <Button contact variant="dark" withArrow>
              {why.claimCta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

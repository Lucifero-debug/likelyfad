import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, SIZE_16, SIZE_24, SIZE_32, SIZE_64, TEXT_STATEMENT } from "@/lib/ui";

const { why } = content;

/* WHY US IS OFF THE PAGE'S SHARED SCALES, BY REQUEST.

   Every other section draws its box from SECTION/WRAP/HEAD_GAP/CARD_GAP and its
   type from the ladder in lib/ui.ts. This one is authored to fixed pixel values
   instead — 16/12 padding, a 32 gap, 64/32/24/16 type — so none of those
   constants appear below and the numbers are written where they apply.

   That means this section no longer moves with the rest of the page: change a
   shared constant and every band but this one follows. Anything here that
   should go back to the page's rhythm has to be put back by hand. */

/* The gradient hairline that draws itself across the top of a card on hover.
   `before` rather than a border, so it can grow from the left instead of
   appearing all at once. */
const PILLAR =
  "relative h-full overflow-hidden rounded-2xl border border-line bg-white " +
  "px-3 py-4 " +
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
    /* The section IS the flex column, so the 32 gap is one declaration rather
       than a margin on each block — and the 16/12 padding is the section's own
       box, with no inner wrapper adding a gutter on top of it.

       NO WIDTH CAP, which is the one place this reads differently from every
       other band: the rest of the page runs inside 1180 (1800 from `lap:` up)
       and this now runs to the viewport, so on a wide monitor its cards are far
       wider than any other section's. Add `mx-auto w-full max-w-[1180px]
       lap:max-w-[1800px]` here to put it back in line — the padding numbers
       below do not change either way. */
    <section
      id="why"
      className={`${ANCHOR} flex flex-col gap-[clamp(24px,2.2vw,32px)] px-4 py-3`}
      aria-label={why.kicker}
    >
      {/* Roboto, not the mono every other kicker on the page uses — "everything
          else Roboto" applies to this too. The rule keeps its length in em so
          it still tracks the 24px it sits beside. */}
      <Reveal className="text-center">
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

      <Reveal delay={100}>
        <p className={`mx-auto max-w-[54ch] text-center text-pretty font-sans ${SIZE_32} leading-[1.45] text-ink-soft`}>
          {why.lead}
        </p>
      </Reveal>

      <div className="grid gap-[clamp(24px,2.2vw,32px)] phone:grid-cols-2 lap:grid-cols-3">
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

      {/* The argument, not a card in the grid — so it gets the tinted ground and
          the larger radius. Its own padding stays on the page's spacing scale;
          the 12/16 above is the SECTION's padding, not every box inside it.
          Worth knowing if it ever looks empty: the claim text caps at 26ch, so
          most of this box's width IS padding at a desktop measure. */}
      <div
        className={`flex flex-col items-center gap-6 rounded-3xl border border-line p-[clamp(32px,3.5vw,48px)] text-center ${CLAIM_BG}`}
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
    </section>
  );
}

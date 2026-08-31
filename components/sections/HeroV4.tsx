import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_META } from "@/lib/ui";

const { hero } = content;

/* HERO — V4. "MASTHEAD".

   THE THESIS. The claim is one sentence, and it is the best thing this studio
   has to say. So the hero is that sentence at poster size and almost nothing
   else: a rule, the line, and one row underneath carrying everything a reader
   needs to act. The footage does not compete with it — it runs as a strip
   BELOW, in ReelWallV4, which is a sibling rather than a panel beside this.

   ARCHITECTURE, and it is what separates V4 from the other three. V1 and V2 are
   splits (text left, wall right); V3 is one element with the wall behind the
   type. This is STACKED: a full-width masthead, then a full-bleed strip under
   it. Mounting the pair means replacing the SPLIT block in app/page.tsx with
   `<HeroV4 />` and `<ReelWallV4 />` one after the other, with no wrapper —
   there is no column to balance and nothing to align across a gap.

   TYPE, and this is where the risk is.
     Display  Montserrat 500 — the LIGHTEST weight this project loads — set
              enormous, at leading 0.95 and -0.035em. Every other hero here goes
              the other way: V1 is bold at 1.04, V2 medium and regular at 1.04,
              V3 extrabold uppercase at 0.94. A masthead at 500 and 100px is a
              different instrument entirely, and it only works if the size is
              genuinely large — at anything under about 56px it stops reading as
              a deliberate lightness and starts reading as a heading that forgot
              its weight. Hence the steep clamp and the high floor.
              NOTE: `font-normal` would be 400, and app/layout.tsx loads
              Montserrat at 500/600/700/800 only — so 400 silently resolves to
              500 anyway. It is written as `font-medium` because that is what
              actually renders; add "400" to the weight array there if a
              genuinely lighter masthead is wanted.
     Utility  JetBrains Mono for the eyebrow rule and nothing else.
     Body     Roboto, and it stays SMALL — 17px — beside a 100px headline. The
              gap between them is the whole point: a subline that grows with the
              headline turns a masthead into a paragraph.

   PALETTE. The page's own paper and ink, no new values. The only colour is the
   marked run in the headline, on `--grad-ink` — the darkened cut, because this
   is text on warm paper and the bright cut drops to about 2.4:1 there. After
   fourteen dark variants in this set, V4 deliberately stays on the ground the
   rest of the page already runs on.

   THE ONE ROW. The subline and both buttons share a single row at `tab:` and
   up, which no other hero here does — V1, V2 and V3 all stack them. It is what
   keeps the masthead to two blocks: the line, and everything else.

   NO PAGE-LOAD FADE. V1 and V2 both run a four-element staggered entrance;
   here the headline's own word reveal is the entrance and nothing else moves.
   With type this large a second animation underneath it reads as fussiness, and
   this is also the only hero in the set that needs no client boundary at all —
   it is a server component.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1400 and
   holds it above; the ramp exists for everything narrower. */

/* 100px at the top, 40px on a 390 phone. The steepest ramp of any headline in
   this project — see the note on weight above for why the floor cannot go
   lower. */
const HEADLINE = "text-[clamp(2.5rem,1rem+7.2vw,6.25rem)]";

export function HeroV4() {
  return (
    <header
      id="top"
      className="relative bg-paper pb-[clamp(40px,5vw,64px)] pt-[clamp(112px,13vh,168px)]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col px-[clamp(24px,5vw,64px)]">
        {/* THE EYEBROW RULE. A mono label over a hairline that runs the full
            measure — not the 2.2em stub the rest of the page uses. At this
            headline size a short rule beside a small label reads as debris; a
            full-width one reads as the top edge of the masthead. */}
        <Reveal>
          <div className="flex w-full items-center justify-between gap-4 border-b border-line pb-4">
            <span
              className={`font-mono ${TEXT_META} font-medium uppercase tracking-[0.22em] text-pink-deep`}
            >
              {hero.eyebrow}
            </span>
            <span
              className={`hidden font-mono ${TEXT_META} uppercase tracking-[0.14em] text-ink-faint phone:block`}
            >
              {hero.reassurance}
            </span>
          </div>
        </Reveal>

        {/* THE MASTHEAD. 500 weight at 100px, leading 0.95.

            `text-balance` is on: this headline turns over three or four lines at
            most widths, and at 0.95 leading an orphaned last word is very
            visible. Balancing is the difference between a block and a block with
            a straggler.

            The measure is in `ch` ON THE H1, where it resolves against this
            element's own size rather than the body's. 18ch of Montserrat at
            100px is about 1080 — wide enough for three lines of this copy and
            narrow enough that the fourth never happens.

            RevealText lays each word out as its own box and stitches the
            gradient back across them, so this cannot be swapped for a plain
            <h1> without changing both the rhythm and the colour. */}
        <h1
          className={`mt-[clamp(24px,3.4vw,48px)] max-w-[18ch] text-balance font-display ${HEADLINE} font-medium leading-[0.95] tracking-[-0.035em]`}
        >
          <RevealText text={hero.headline} immediate delay={180} />
        </h1>

        {/* THE ONE ROW — see the note above. `items-end` rather than centre: the
            subline is two or three lines and the buttons are one, and aligning
            their baselines at the bottom is what makes the row read as a single
            band rather than as two things that happen to be side by side. */}
        <div className="mt-[clamp(32px,4vw,56px)] flex flex-col gap-8 tab:flex-row tab:items-end tab:justify-between">
          <p className="max-w-[46ch] text-pretty font-sans text-[1.0625rem] leading-[1.5] text-ink-soft">
            {hero.subline}
          </p>

          <div className="flex flex-none flex-wrap items-center gap-3">
            {/* The real Button, both variants, no fork. On paper `grad` and
                `light` both work as drawn — which is the quiet advantage of
                staying on the page's own ground and the reason V4 needs no local
                button code at all. */}
            <Button contact variant="grad" withArrow>
              {hero.primaryCta}
            </Button>
            <Button href={hero.secondaryHref} variant="light">
              {hero.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

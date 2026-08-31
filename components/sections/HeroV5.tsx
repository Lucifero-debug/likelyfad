import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_META } from "@/lib/ui";

const { hero } = content;

/* HERO — V5. "TITLE CARD".

   THE THESIS. A compact centred block that gets out of the way of its wall.
   The hero and the wall are one composition and the hero is the smaller half
   of it — which is the whole idea, and every number below follows from it.

   IT IS A SPLIT PAIR. HeroV5 and ReelWallV5 sit side by side inside SPLIT in
   app/page.tsx, the same arrangement V1 and V2 use: hero left, wall right on a
   laptop, stacked below the breakpoint. SPLIT owns the top clearance and the
   seam out of the block, which is why the `lap:` half of every padding here is
   zero, and it owns the gutter and the measure, which is why max-w and px are
   both dropped at `lap:` too. Neither of those can be left on — the column is
   already inset by the grid, and insetting it twice pushes the hero off the
   page's own gutter.

   WHAT SEPARATES V5 FROM THE OTHER FOUR:

     1. IT IS CENTRED, AND IT STAYS CENTRED IN THE COLUMN. V1 and V2 are the
        same two-column split with the type ranged LEFT at `lap:`; V3 sets its
        type over the stage; V4 is a left-aligned full-width masthead. Nothing
        else here is centred, so once V5 is in the same arrangement as V1 the
        centring is the entire thing telling them apart — which is exactly why
        it survives the move rather than falling back to `lap:items-start`.
     2. IT IS SHORT ON PURPOSE. Below the split the floor is one step rather
        than a full seam, so the top of the wall underneath peeks into the
        first screen instead of sitting entirely under the fold.
     3. THE WEIGHT GOES THE OPPOSITE WAY TO V4. That one is Montserrat 500 at
        100px — a masthead that works BECAUSE it is large and light. This is
        700 at 72px, tight at -0.03em and leading 1.0. Smaller and heavier, so
        the block reads as dense and settled under its own width rather than as
        an expanse. Putting V4's treatment at this size would just look like a
        masthead that came up short.
     4. THE EYEBROW IS A CENTRED RULE PAIR, not V4's full-measure hairline. Two
        short rules flanking the label, which is the one device on this page
        that only makes sense centred.

   PALETTE. The page's own paper and ink, and the marked run in the headline on
   `--grad-ink` — the darkened cut, because this is text on warm paper where
   the bright cut drops to about 2.4:1.

   NO CLIENT BOUNDARY. Like V4, this is a server component: the headline's own
   word reveal is the entrance and nothing else animates.

   IT IS A SIBLING OF ReelWallV5, not a parent. The two go inside one SPLIT
   wrapper in source order — hero first, wall second — and that order is what
   produces both layouts: two columns at `lap:`, and hero-over-wall below it,
   with nothing extra to declare at the narrow end.

   The clamps run DOWNWARD only, except the headline, which carries a second
   ramp for the column. See the note on HEADLINE. */

/* 72px at the top, 36px on a 390 phone. Lower ceiling than V4's 100 by design
   — see point 3 above.

   TWO CLAMPS, AND THE SECOND ONE IS NOT OPTIONAL. Below the split this hero is
   the full page width, so a vw-based ramp is measuring the box the type
   actually sits in. Beside the wall it is not: at `lap:` the hero is the 1fr
   half of a 1fr/0.9fr grid, so it holds roughly 434px at 961 and 859px at
   1800 — while `5.2vw` carries on reading the WHOLE viewport and would set 50px
   type into a 434px column. The `lap:` clamp is the same ramp re-derived
   against the column instead, which is exactly why TEXT_H1 in lib/ui.ts
   carries a second clamp of its own. Land it and the headline breaks over two
   lines in the column at every width from 961 up. */
const HEADLINE =
  "text-[clamp(2.25rem,1.05rem+5.2vw,4.5rem)] lap:text-[clamp(1.75rem,0.2rem+3.6vw,4.25rem)]";

/* The flanking rules. `h-px` over `border` so the two are one box each rather
   than a box with three transparent sides, and `w-` rather than `flex-1` so
   they stay short stubs beside the label instead of pushing it into a
   full-width divider — which is V4's device, not this one. */
const STUB = "h-px w-[clamp(24px,6vw,56px)] shrink-0 bg-line";

/* NO id="top" ON THE <header> BELOW. Hero, HeroV2, HeroV3 and HeroV4 all carry
   it already and this gallery page mounts every one of them, so a fifth copy is
   a fifth duplicate id — invalid, and pointless besides, since #top and the
   skip link only ever resolve to the first one in the document. Add it back if
   this variant is ever promoted to be the page's real hero and the others come
   out. */
export function HeroV5() {
  return (
    <header
      /* Below the split: clears the fixed nav, with a deliberately shallow
         floor so the top of the wall underneath peeks into the first screen.
         Beside the wall: no padding at all, because SPLIT in app/page.tsx owns
         both the top clearance and the seam out of the block. Same contract
         the original Hero runs on. */
      className="relative flex items-center overflow-hidden pt-[clamp(96px,10vh,128px)] pb-3 lap:py-0"
    >
      {/* max-w and px go at `lap:`, where SPLIT is already supplying both —
         leaving them on would inset this column inside a grid cell that is
         itself already inset, and the hero would sit visibly off its own
         gutter. `items-center` stays at every width: the centring IS this
         variant, and it is what still separates it from V1 once the two are in
         the same two-column arrangement. */}
      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col items-center px-[clamp(24px,5vw,64px)] text-center lap:max-w-none lap:px-0">
        {/* THE EYEBROW. Centred label between two stubs. */}
        <Reveal>
          <div className="flex items-center justify-center gap-4">
            <span className={STUB} aria-hidden="true" />
            <span
              className={`font-mono ${TEXT_META} font-medium uppercase tracking-[0.22em] text-pink-deep`}
            >
              {hero.eyebrow}
            </span>
            <span className={STUB} aria-hidden="true" />
          </div>
        </Reveal>

        {/* THE LINE. 17ch resolves against THIS element's own size rather than
            the body's, so at 72px it is about 830px — wide enough to break the
            39-character headline over two lines and narrow enough that a third
            never happens. text-balance evens those two lines, which matters
            more centred than it does ranged left: an orphan on a centred block
            is visible from across the room.

            RevealText lays each word out as its own box and stitches the
            gradient back across them, so this cannot be swapped for a plain
            <h1> without changing both the rhythm and the colour. */}
        <h1
          className={`mt-[clamp(20px,2.6vw,32px)] max-w-[17ch] text-balance font-display ${HEADLINE} font-bold leading-[1.0] tracking-[-0.03em]`}
        >
          <RevealText text={hero.headline} immediate delay={180} />
        </h1>

        <Reveal delay={320}>
          <p className="mx-auto mt-[clamp(16px,2vw,24px)] max-w-[54ch] text-pretty font-sans text-[1.0625rem] leading-[1.6] text-ink-soft">
            {hero.subline}
          </p>
        </Reveal>

        {/* Centred, and stacked on the narrowest widths rather than wrapped:
            two buttons wrapping under a centred block leave a single button
            sitting off-axis on the second line. */}
        <Reveal delay={420}>
          <div className="mt-[clamp(24px,3vw,32px)] flex flex-col items-center justify-center gap-3 phone:flex-row">
            <Button contact variant="grad" withArrow>
              {hero.primaryCta}
            </Button>
            <Button href={hero.secondaryHref} variant="light">
              {hero.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <p
            className={`mt-[clamp(16px,2vw,24px)] font-mono ${TEXT_META} uppercase tracking-[0.14em] text-ink-faint`}
          >
            {hero.reassurance}
          </p>
        </Reveal>
      </div>
    </header>
  );
}

import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { ReelWall } from "@/components/sections/ReelWall";
import { WhyUs } from "@/components/sections/WhyUs";
import { Work } from "@/components/sections/Work";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { WhyUsV2 } from "@/components/sections/WhyUsV2";
import { WhyUsV3 } from "@/components/sections/WhyUsV3";
import { WhyUsV4 } from "@/components/sections/WhyUsV4";
import { WhyUsV5 } from "@/components/sections/WhyUsV5";
import { TestimonialsV2 } from "@/components/sections/TestimonialsV2";
import { TestimonialsV3 } from "@/components/sections/TestimonialsV3";
import { TestimonialsV4 } from "@/components/sections/TestimonialsV4";
import { TestimonialsV5 } from "@/components/sections/TestimonialsV5";
import { FaqV2 } from "@/components/sections/FaqV2";
import { FaqV3 } from "@/components/sections/FaqV3";
import { FaqV4 } from "@/components/sections/FaqV4";
import { FaqV5 } from "@/components/sections/FaqV5";
import { FooterV2 } from "@/components/sections/FooterV2";
import { FooterV3 } from "@/components/sections/FooterV3";
import { FooterV4 } from "@/components/sections/FooterV4";
import { FooterV5 } from "@/components/sections/FooterV5";
import { PricingV2 } from "@/components/sections/PricingV2";
import { PricingV3 } from "@/components/sections/PricingV3";
import { PricingV4 } from "@/components/sections/PricingV4";
import { PricingV5 } from "@/components/sections/PricingV5";
import { HeroV2 } from "@/components/sections/HeroV2";
import { ReelWallV2 } from "@/components/sections/ReelWallV2";
import { HeroV3 } from "@/components/sections/HeroV3";
import { HeroV4 } from "@/components/sections/HeroV4";
import { ReelWallV4 } from "@/components/sections/ReelWallV4";
import { HeroV5 } from "@/components/sections/HeroV5";
import { ReelWallV5 } from "@/components/sections/ReelWallV5";
import { HeroV6 } from "@/components/sections/HeroV6";
import { HeroSplit } from "@/components/v8/HeroSplit";
import { WALL_COLUMNS } from "@/lib/v8/data";

/* HERO + REEL WALL SPLIT.

   On a laptop the hero and the wall sit side by side; below the breakpoint
   they stack (hero on top, wall underneath) and the wall flips to horizontal
   rows — which is just the two children in source order, so there is nothing
   to declare at that width beyond `relative`.

   Both columns are fractional, so without a ceiling the hero column keeps
   growing past the headline's 22ch measure: the headline stops at ~960px and
   the rest of the column becomes dead air between the copy and the wall. The
   wall has the mirror problem — its cards have no width of their own on
   desktop, so each stretches to its lane and the three lanes just get wider.
   Capping at 1800px fixes both at once.

   The trailing padding is the seam to Why us and it carries SECTION's clamp
   verbatim, so the hero block is separated from the first band by the same
   two-unit gap every other boundary on the page gets. It also un-sinks the
   hero: the two columns are centred against each other, so an 18px floor under
   a ~128px ceiling parked the whole block well below the optical centre and
   left the wall's caption row sitting on the fold with nothing under it. The
   clamp is spelled out rather than interpolated from SECTION because Tailwind
   scans source TEXT — see the note at the foot of lib/ui.ts. */
const SPLIT =
  "relative " +
  "lap:mx-auto lap:grid lap:w-full lap:max-w-[1800px] " +
  "lap:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lap:items-center " +
  "lap:gap-10 lap:px-[clamp(24px,5vw,64px)] " +
  "lap:pt-[clamp(96px,9vh,128px)] lap:pb-[clamp(40px,6.5vw,64px)]";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-3 focus:text-[0.85rem] focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />

      <main id="main">
        {/* <div className={SPLIT}>
          <Hero />
          <ReelWall />
        </div> */}

        {/* V2 is a genuine split pair, so it keeps SPLIT — plus `bg-noir`,
            which the pair needs: both halves paint their own dark ground, but
            SPLIT's own padding and gap would show paper through the seams. */}
        {/* <div className={`${SPLIT} bg-noir`}>
          <HeroV2 />
          <ReelWallV2 />
        </div> */}

        {/* V3 IS ONE COMPONENT. HeroV3 renders ReelWallV3 inside itself as the
            stage, so it takes no SPLIT and has no sibling — mounting it beside
            a second <ReelWallV3 /> renders the diptych twice, and both copies
            read the same module-level clip list, so every panel shows the same
            four reels. */}
        {/* <HeroV3 /> */}

        {/* V4 STACKS. A full-width masthead over a full-bleed filmstrip — put
            inside SPLIT they land side by side in two columns, which is the one
            arrangement the design is built not to be. */}
        {/* <HeroV4 />
        <ReelWallV4 /> */}

        {/* V5 IS A SPLIT PAIR, like V1 and V2: hero left, wall right on a
            laptop, stacked below the breakpoint. It takes SPLIT bare, with no
            background of its own — both halves sit on the page's own paper, so
            unlike V2 there are no dark grounds for SPLIT's padding and gap to
            show a seam through. */}
        {/* <div className={SPLIT}>
          <HeroV5 />
          <ReelWallV5 />
        </div> */}

        {/* V6 IS ONE COMPONENT AND TAKES NO SPLIT. HeroV6 renders ReelWallV6
            inside itself and owns its own grid, padding and 100svh, the way
            HeroSplit does — putting it inside SPLIT would nest one two-column
            grid in another and halve the copy's measure.

            IT ALSO TAKES ITS CLIPS AS A PROP: nothing about the wall is
            hardcoded, so the page decides which library it points at. WALL_COLUMNS
            is reused here rather than duplicated because ReelColumns and
            WallColumns are the same shape — four arrays of { src, poster, alt } —
            and TypeScript checks that structurally.

            IT HAS NO SIBLING. Mounting a bare <ReelWallV6 /> next to it renders
            the wall twice, once inside the hero and once beside it. A bare one
            also has to be given a height class of its own: the wall takes its
            footprint from `className` and derives nothing from its clips, which
            is what stops the uncapped parallax pushing the page around.

            Add `debug` for the live readout — scrollDelta, the set/cell
            seamlessness invariant, and column 4's wrapped y. */}
        <HeroV6 columns={WALL_COLUMNS} />

        {/* ONE VARIANT OF EACH BAND IS MOUNTED. THE REST ARE PARKED, AND THIS
            IS A PERFORMANCE DECISION RATHER THAN AN EDITORIAL ONE.

            Mounting all five of each put 140 <video> elements and seven
            marquees on one page — 96 of those clips and three of those marquees
            sat BELOW the fold, decoding and compositing continuously while the
            only thing anybody was looking at was the hero. The hero's parallax
            is scroll-linked and runs on the main thread, so it gets whatever
            frame budget the rest of the page leaves it, and with that much
            below it there was none: the wall juddered against the page for
            reasons that had nothing to do with the wall.

            TestimonialsV2 also carried its own scroll listener, so parking it
            takes a handler off the gesture path as well.

            TO COMPARE DIRECTIONS, uncomment the one you want to look at and
            re-comment it afterwards. Uncommenting a whole family at once is
            what created the problem in the first place. */}
        {/* WHY US, PRICING, FAQ AND THE FOOTER ARE ALL PARKED — every version of
            each, V1 included. Uncomment a band to bring it back. */}
        <WhyUs /> <WhyUsV2 /> <WhyUsV3 /> <WhyUsV4 /> <WhyUsV5 />

        <Work />

        <Pricing /> <PricingV2 /> <PricingV3 /> <PricingV4 /> <PricingV5 />

        <Testimonials />
        <TestimonialsV2 /> <TestimonialsV3 /> <TestimonialsV4 /> <TestimonialsV5 />

        <Faq /> <FaqV2 /> <FaqV3 /> <FaqV4 /> <FaqV5 />
      </main>

      <Footer /> <FooterV2 /> <FooterV3 /> <FooterV4 /> <FooterV5 />
    </>
  );
}

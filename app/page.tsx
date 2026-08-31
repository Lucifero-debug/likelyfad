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
        <div className={SPLIT}>
          <Hero />
          <ReelWall />
        </div>

        {/* V2 is a genuine split pair, so it keeps SPLIT — plus `bg-noir`,
            which the pair needs: both halves paint their own dark ground, but
            SPLIT's own padding and gap would show paper through the seams. */}
        <div className={`${SPLIT} bg-noir`}>
          <HeroV2 />
          <ReelWallV2 />
        </div>

        {/* V3 IS ONE COMPONENT. HeroV3 renders ReelWallV3 inside itself as the
            stage, so it takes no SPLIT and has no sibling — mounting it beside
            a second <ReelWallV3 /> renders the diptych twice, and both copies
            read the same module-level clip list, so every panel shows the same
            four reels. */}
        <HeroV3 />

        {/* V4 STACKS. A full-width masthead over a full-bleed filmstrip — put
            inside SPLIT they land side by side in two columns, which is the one
            arrangement the design is built not to be. */}
        <HeroV4 />
        <ReelWallV4 />

        <WhyUs />
        <WhyUsV2/>
           <WhyUsV3/>
           <WhyUsV4/>
            <WhyUsV5/>
        <Work />
        <Pricing />
        <PricingV2 />
        <PricingV3 />
        <PricingV4 />
        <PricingV5 />
        <Testimonials />
          <TestimonialsV2 />
          <TestimonialsV3 />
           <TestimonialsV4 />
           <TestimonialsV5 />
        <Faq />
        <FaqV2 />
        <FaqV3 />
        <FaqV4 />
        <FaqV5/>
      </main>

      <Footer />
      <FooterV2 />
      <FooterV3 />
      <FooterV4 />
      <FooterV5 />
    </>
  );
}

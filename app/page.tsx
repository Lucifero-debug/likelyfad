import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { ReelWall } from "@/components/sections/ReelWall";
import { WhyUs } from "@/components/sections/WhyUs";
import { Work } from "@/components/sections/Work";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

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

   The trailing 18px is the seam to Why us, and it is ONE number because both
   sides are wired to it: this padding and Why us's leading padding. Closing
   only one leaves the other still holding the two apart. */
const SPLIT =
  "relative " +
  "lap:mx-auto lap:grid lap:w-full lap:max-w-[1800px] " +
  "lap:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lap:items-center " +
  "lap:gap-[clamp(24px,3vw,48px)] lap:px-[clamp(20px,5vw,64px)] " +
  "lap:pt-[clamp(96px,9vh,128px)] lap:pb-[18px]";

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

        <WhyUs />
        <Work />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>

      <Footer />
    </>
  );
}

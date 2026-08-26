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
  "lap:gap-[clamp(24px,3vw,48px)] lap:px-[clamp(20px,5vw,64px)] " +
  "lap:pt-[clamp(96px,9vh,128px)] lap:pb-[clamp(40px,6.5vw,72px)]";

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

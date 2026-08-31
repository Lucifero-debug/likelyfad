import { Bento } from "@/components/v6/Bento";
import { CloseCta } from "@/components/v6/CloseCta";
import { CyclingLine } from "@/components/v6/CyclingLine";
import { Faq } from "@/components/v6/Faq";
import { FloatingWidget } from "@/components/v6/FloatingWidget";
import { Hero } from "@/components/v6/Hero";
import { Nav } from "@/components/v6/Nav";
import { Pricing } from "@/components/v6/Pricing";
import { Process } from "@/components/v6/Process";
import { WhyUs } from "@/components/v6/WhyUs";
import { Work } from "@/components/v6/Work";

/* ============================================================================
   /v6 — THE NIGHT SCREENING. Modelled on dreammotion.framer.website.

   THE FIFTH DIRECTION, AND THE ONE THAT MOST HAD TO THROW AWAY ITS REFERENCE'S
   PURPOSE. Dream Motion sells a tool people operate themselves: its nav ends
   in Sign Up, its bento grid lists capabilities you would use, its cycling
   pill is shaped like a prompt box because its users type prompts, and its
   corner widget carries a discount code. We do the work instead. So this page
   takes the visual language — deep navy-black, serif display, bento cards,
   motion — and refuses the funnel outright:

     Sign Up            → nothing to sign up for; the nav is four links and a DM
     Feature grid       → deliverables that arrive finished, not tools you drive
     "Make it Cartoon"  → "Make it Supplements": the category question a brand
                          marketer actually asks, in a pill with no input
                          affordances, because there is no box to type in
     "30% OFF" widget   → the 48-hour clock, which is a promise we keep
     Contact for quote  → tiers defined by scope and turnaround

   THE DARK GROUND IS EARNED RATHER THAN DEFAULT. Near-black with one bright
   accent is itself a stock AI-generated look, and naming that is the only way
   to stop the page coasting on it. It is justified here for one concrete
   reason: the tiles are bright, high-contrast vertical video and they should
   be the only bright thing on screen. What stops it being a stock dark SaaS
   page is the serif and the cycling vertical, which is why both got the
   argument written out rather than the default taken.

   ORDER. The claim, then the category question answered immediately, then what
   you get, then proof, then why, then how it runs, then what it costs, then
   the questions, then the ask. The cycling line sits second because "do you
   work in my category" is the first thing a brand marketer wants settled, and
   it costs one line to settle it.

   data-v6 is the hook globals.css uses to paint the canvas near-black and swap
   the focus ring off the homepage's magenta. It goes on the wrapper rather
   than on <body>, which belongs to the root layout and to every other route.
   ========================================================================== */

/* The nav and the floating widget both watch the hero: the nav to know when to
   take a ground, the widget to know when it is allowed to exist at all. Held
   here rather than typed into three files, because a typo in one of them fails
   silently — the nav would stay transparent over the work grid, and the widget
   would never appear. */
const HERO_ID = "v6-hero";

export default function V6Page() {
  return (
    <div
      data-v6
      id="top"
      className="bg-night font-body text-[0.875rem] leading-[1.6] text-beam antialiased"
    >
      <Nav heroId={HERO_ID} />

      <main>
        <Hero id={HERO_ID} />
        <CyclingLine />
        <Bento />
        <Work />
        <WhyUs />
        <Process />
        <Pricing />
        <Faq />
      </main>

      {/* The closing band is the <footer>: it carries the last ask and the
          colophon in one bracket, so the page does not end on a CTA and then
          start again with a strip of links under it. */}
      <CloseCta />

      <FloatingWidget heroId={HERO_ID} />
    </div>
  );
}

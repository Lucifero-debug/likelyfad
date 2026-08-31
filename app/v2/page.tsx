import { CloseCta } from "@/components/v2/CloseCta";
import { Faq } from "@/components/v2/Faq";
import { Hero } from "@/components/v2/Hero";
import { LogoRow } from "@/components/v2/LogoRow";
import { Nav } from "@/components/v2/Nav";
import { Pricing } from "@/components/v2/Pricing";
import { Process } from "@/components/v2/Process";
import { Stats } from "@/components/v2/Stats";
import { WhyUs } from "@/components/v2/WhyUs";
import { Work } from "@/components/v2/Work";

/* ============================================================================
   /v2 — THE SCREENING ROOM.

   One of two directions on the same content; /v3 is the other, near-white and
   modelled on butter.video. This one goes dark, and the reason is specific
   rather than stylistic: the work is bright, high-contrast vertical video of
   people talking, and on the homepage's cream ground it competes with the
   page. On near-black it reads like a screening room and the work is the only
   lit thing on screen.

   The homepage splits attention between a copy column and a work column, and
   both land at half strength. This page spends the whole first viewport on the
   work and lets the copy sit on top of it. Everything after that is the case
   for hiring the studio, in the order a buyer actually builds it: proof, then
   scale, then the catalogue, then the objections, then how it runs, then the
   number, then the questions, then the ask.

   data-v2 is the hook globals.css uses to paint the canvas near-black and to
   swap the focus ring off the homepage's magenta. It goes on the wrapper
   rather than on <body>, which belongs to the root layout and to every other
   route with it.

   THE CREDENTIALS BAND. LogoRow and Stats share a stack of hairlines with no
   section rhythm between them, on purpose: they are one band of evidence under
   the hero, not two sections. Everything below Work is 96 to 128 apart.
   ========================================================================== */
export default function V2Page() {
  return (
    <div data-v2 className="bg-stage font-body text-[1rem] leading-[1.6] text-lit antialiased">
      <Nav />
      <main>
        <Hero />
        <LogoRow />
        <Stats />
        <Work />
        <WhyUs />
        <Process />
        <Pricing />
        <Faq />
      </main>
      <CloseCta />
    </div>
  );
}

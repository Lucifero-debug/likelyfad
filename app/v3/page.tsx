import { CloseCta } from "@/components/v3/CloseCta";
import { Faq } from "@/components/v3/Faq";
import { Footer } from "@/components/v3/Footer";
import { Formats } from "@/components/v3/Formats";
import { Hero } from "@/components/v3/Hero";
import { LogoWall } from "@/components/v3/LogoWall";
import { Nav } from "@/components/v3/Nav";
import { Pricing } from "@/components/v3/Pricing";
import { Process } from "@/components/v3/Process";
import { Statement } from "@/components/v3/Statement";
import { WhyUs } from "@/components/v3/WhyUs";
import { WorkRail } from "@/components/v3/WorkRail";

/* ============================================================================
   /v3 — modelled on butter.video.

   THE ORDER IS AN ARGUMENT, not a list of available sections. One piece of
   work at full size, proof that other people pay for it, the claim itself,
   what you can order, how it runs, the volume behind it, why us, the number,
   the questions, the ask. Everything before Why us is evidence; everything
   after it is logistics.

   `data-v3` is the hook globals.css uses to paint the canvas near-white and to
   swap the focus ring off the homepage's magenta. It goes on the wrapper
   rather than on <body>, which belongs to the root layout and to every other
   route with it.
   ========================================================================== */
export default function V2Page() {
  return (
    <div
      data-v3
      className="bg-page font-body text-[1rem] leading-[1.6] text-graphite antialiased"
    >
      <Nav />
      <main>
        <Hero />
        <LogoWall />
        <Statement />
        <Formats />
        <Process />
        <WorkRail />
        <WhyUs />
        <Pricing />
        <Faq />
        <CloseCta />
      </main>
      <Footer />
    </div>
  );
}

import { CloseCta } from "@/components/v5/CloseCta";
import { Faq } from "@/components/v5/Faq";
import { Hero } from "@/components/v5/Hero";
import { LogoMarquee } from "@/components/v5/LogoMarquee";
import { Nav } from "@/components/v5/Nav";
import { Pricing } from "@/components/v5/Pricing";
import { Process } from "@/components/v5/Process";
import { Statement } from "@/components/v5/Statement";
import { Stats } from "@/components/v5/Stats";
import { WhyUs } from "@/components/v5/WhyUs";
import { Work } from "@/components/v5/Work";

/* ============================================================================
   /v5 — THE DOSSIER. Modelled on fuel.framer.website.

   THE FOURTH DIRECTION, AND THE ONE THAT FOLLOWS ITS REFERENCE MOST CLOSELY.
   Of every reference considered for this site, Fuel is the closest structural
   match, because it is already built for a studio selling production work on a
   productized basis: its hero says pick a plan, submit a job request, work
   kicks off within 24 hours. That is our pitch with a different number. So
   unlike /v2, /v3 and /v4, this page follows the reference's structure rather
   than adapting it.

   THE RHYTHM IS THE WHOLE IDEA. Two full-bleed dark video bands — the hero and
   the close — bracketing a run of clean white content sections. A page carrying
   this much video goes to slideshow the moment that alternation stops, which is
   why there are exactly two dark bands and not four.

   THE BOLDNESS IS SPENT IN TWO PLACES AND NOWHERE ELSE: the hero wordmark, and
   the six hairline section header rows. Everything between them is deliberately
   quiet — one type size, one rule weight, no shadows, no fills except the one
   pricing panel. That is what the reference is actually doing, and it is the
   part most easily lost by decorating the middle.

   ORDER. The work you can judge, then the numbers behind it, then who else
   buys it, then the work itself, then why us, then how it runs, then what it
   costs, then the questions, then the ask. The statement is first because it is
   the only thing that explains what the hero was; the work is fourth because by
   then the visitor has a reason to look at it.

   data-v5 is the hook globals.css uses to paint the canvas white and swap the
   focus ring off the homepage's magenta. It goes on the wrapper rather than on
   <body>, which belongs to the root layout and to every other route with it.
   ========================================================================== */
export default function V5Page() {
  return (
    <div
      data-v5
      id="top"
      className="bg-white font-body text-[0.9375rem] leading-[1.6] text-press antialiased"
    >
      <Nav />

      <main>
        <Hero />

        {/* Statement, Stats and the marquee are three sections sharing one
            white ground and one rhythm: the statement makes the claim, the
            numbers back it, the sectors say who else believed it. Only the
            statement carries a header row, because the three are one argument
            and the index counts arguments, not blocks. */}
        <Statement />
        <Stats />
        <LogoMarquee />

        <Work />
        <WhyUs />
        <Process />
        <Pricing />
        <Faq />
      </main>

      {/* The closing band is the <footer>: it carries the last ask and the
          colophon in one dark bracket, so the page does not end on a CTA and
          then start again with a strip of links under it. */}
      <CloseCta />
    </div>
  );
}

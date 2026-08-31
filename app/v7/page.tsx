import { CloseCta } from "@/components/v7/CloseCta";
import { Faq } from "@/components/v7/Faq";
import { Hero } from "@/components/v7/Hero";
import { Nav } from "@/components/v7/Nav";
import { Pricing } from "@/components/v7/Pricing";
import { Process } from "@/components/v7/Process";
import { Reviews } from "@/components/v7/Reviews";
import { Services } from "@/components/v7/Services";
import { Statement } from "@/components/v7/Statement";
import { Stats } from "@/components/v7/Stats";
import { WhyUs } from "@/components/v7/WhyUs";
import { Work } from "@/components/v7/Work";

/* ============================================================================
   /v7 — THE CREATIVE WALL. Modelled on creatiie.framer.website.

   THE SIXTH DIRECTION, AND THE ONE WHOSE REFERENCE NEEDED ITS VOICE CHANGED
   RATHER THAN ITS LOOK. Creatie is a portfolio built around one freelancer: it
   opens with a name and a role, its status card says "available for work", and
   its headlines are first person singular. Every one of those signals is wrong
   for a studio asking a brand to trust it with campaign spend, and the danger
   is that they are all small enough to copy without noticing:

     "Available for work"  → "Taking briefs". One says nobody is hiring us, the
                             other says the door is open. Same slot, opposite
                             claim.
     A founder photograph  → the studio mark. There is no founder photo in this
                             repo, and a stock face on a page arguing that our
                             output is indistinguishable from a real shoot is
                             the worst image it could open with.
     "I make designs..."   → nothing on this page is first person singular.
     Tool / year / client  → vertical and format. Client identities are private
                             by request and no filename in the library carries
                             a year, so both fields would have to be invented
                             on the one card whose job is to look like real
                             evidence.
     A dozen doodles       → three marks, in the margins, never over text, and
                             all three are marks an ad studio actually makes: a
                             crop mark, an arrow, an approval tick.

   WHAT IS KEPT IS THE CRAFT LANGUAGE, AND IT IS KEPT BECAUSE IT TRANSLATES.
   Stickers, pushpins, tilted cards and paper texture read as a scrapbook on a
   designer's portfolio; the identical vocabulary reads as A CREATIVE WALL for
   an ad shop — the pinned board of concepts, references and cuts every one of
   them actually works from. That is the whole argument for this direction
   being defensible rather than borrowed, and it is why the graph rule runs the
   full page rather than decorating one band.

   CREAM WITH A WARM ACCENT IS ITSELF A STOCK AI-GENERATED DEFAULT. What saves
   this page is the pinned vocabulary, executed properly. Strip the stickers,
   the pins, the folded corners and the rule and there is nothing left but a
   template, so those details are load-bearing rather than ornament — see
   components/v7/Marks.tsx for why the pushpin is four circles instead of one.

   THE BOLDNESS IS SPENT IN EXACTLY ONE PLACE: the four format stickers taped
   over the hero headline. Everything below is quiet on purpose. The reference
   over-decorates and a studio pitching for ad budget cannot afford to.

   ORDER. The claim over the work, then what the studio is, then the figures,
   then the work itself, then what we make, then why us, then how it runs, then
   who says so, then what it costs, then the questions, then the ask. The
   closing run — services, reviews, FAQ, contact — is the reference's own and
   is kept as it stands: it is genuinely well judged for a service business,
   and it is the one part of the structure that needed no translation.

   data-v7 is the hook globals.css uses to paint the canvas cream, resolve the
   two font families where next/font's variables are actually in scope, and
   swap the focus ring off the homepage's magenta. It goes on the wrapper
   rather than on <body>, which belongs to the root layout and to every other
   route.

   .v7-graph IS ON THE WRAPPER RATHER THAN PER SECTION, which is the same
   decision stated as code: the page is not a document with a textured band in
   it, it is one board with things pinned to it.
   ========================================================================== */

/* The nav watches the hero to know when to take a ground. Held here rather
   than typed into two files, because a typo fails silently — the bar would
   stay transparent with white type over a cream page and the links would
   disappear. */
const HERO_ID = "v7-hero";

export default function V7Page() {
  return (
    <div
      data-v7
      id="top"
      className="v7-graph bg-board font-body text-[0.875rem] leading-[1.6] text-mark antialiased"
    >
      <Nav heroId={HERO_ID} />

      <main>
        <Hero id={HERO_ID} />
        <Statement />
        <Stats />
        <Work />
        <Services />
        <WhyUs />
        <Process />
        <Reviews />
        <Pricing />
        <Faq />
      </main>

      {/* The closing band is the <footer>: it carries the last ask and the
          colophon in one bracket, so the page does not end on a CTA and then
          start again with a strip of links under it. */}
      <CloseCta />
    </div>
  );
}

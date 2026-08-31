import { Faq } from "@/components/v4/Faq";
import { Footer } from "@/components/v4/Footer";
import { Frame } from "@/components/v4/Frame";
import { Playground } from "@/components/v4/Playground";
import { Pricing } from "@/components/v4/Pricing";
import { Process } from "@/components/v4/Process";
import { Services } from "@/components/v4/Services";
import { StatusPanel } from "@/components/v4/StatusPanel";
import { WhyUs } from "@/components/v4/WhyUs";
import { WorkStrip } from "@/components/v4/WorkStrip";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v4 — THE OPEN SHOP.

   The third direction on the same content, and the one that refuses the move
   the other two make. /v2 opens at 72px over a wall of video; /v3 opens at
   72px over a dark panel; every competing AI-ad-studio site opens at 72px too.
   This page has no headline at all. Almost everything is set between 13 and
   15px, and the structure is carried by a rail that repeats identically down
   every section: a mono label parked left, the content right. You know what a
   thing is by WHERE it sits.

   THE OUTLINE IS NOT FLAT EVEN THOUGH THE SCALE IS. There is one h1 and it is
   visually hidden, because the thing it would name is a paragraph and dressing
   that paragraph in a heading would be the same error as setting it at 72px.
   Every section then carries a real h2 in the rail, and every item inside one
   carries an h3. A screen reader gets a normal document; a reader gets a page
   with no headline.

   data-v4 is the hook globals.css uses to paint the canvas off-white, swap the
   focus ring off the homepage's magenta, and arm the playground's grab cursor.
   It goes on the wrapper rather than on <body>, which belongs to the root
   layout and to every other route with it.

   ORDER. Statement, then the work you can pick up, then proof that somebody is
   here to answer, then the work in a list, then what you can order, then why
   us, then how it runs, then the number, then the questions. The playground is
   second because it is the most interesting thing on the page; the statement
   is first because it is the most necessary.
   ========================================================================== */
export default function V4Page() {
  return (
    <div
      data-v4
      className="bg-sheet font-body text-[0.9375rem] leading-[1.55] text-carbon antialiased"
    >
      {/* The one h1, for the document outline only. See the note above. */}
      <h1 className="sr-only">
        {SITE_NAME} — {SITE_TAGLINE}
      </h1>

      <Frame />

      <main>
        <Playground />
        <StatusPanel />
        <WorkStrip />
        <Services />
        <WhyUs />
        <Process />
        <Pricing />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}

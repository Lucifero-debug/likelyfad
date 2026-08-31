import Link from "next/link";
import { CTA, content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { TEXT_H1, TEXT_LEAD, TEXT_META } from "@/lib/ui";
import type { WallColumns } from "@/lib/v8/data";
import { ReelWall } from "./ReelWall";

const { hero } = content;

/* ============================================================================
   THE SPLIT HERO — copy left, parallax reel wall right.

   THE LAYOUT IS THE ONE THE HOMEPAGE ALREADY HAS and that is the point of this
   route: the only two changes are a fourth column in the wall and the drift.
   Everything about the footprint is held constant so that swapping it in is a
   layout no-op.

   THE WALL IS A FIXED-HEIGHT, overflow:hidden BOX, AND THAT IS THE CONSTRAINT
   THAT MATTERS MOST. Its height is set on the wrapper here rather than derived
   from the clips inside it, so no amount of drift, no aspect ratio and no
   number of clips can make it grow or push anything down the page. The column
   inside it is absolutely positioned, which takes it out of flow entirely — it
   cannot contribute height even in principle.

   NO GRADIENT ON THE HEADLINE OR THE CTA. The site's pink-to-purple ramp is
   dropped here in favour of one flat magenta, for the reason the brief gives
   and which is worth keeping written down: that gradient is the most
   recognisable AI-generated design tell in circulation, which is a strange
   thing to wear on a page whose entire pitch is that its output does not read
   as AI. The brand colour survives; the tell does not.

   THE COPY COMES OUT OF lib/content.ts RATHER THAN BEING RETYPED. Every string
   the brief specifies is already there, word for word, so this route reads the
   same source the live homepage does and cannot drift from it. The eyebrow is
   uppercased in CSS rather than in the data, so a screen reader gets "AI
   production studio" rather than four letters spelled out.

   THE H1 IS THE PAGE'S ONLY H1. The caption under the wall is a <p>, and the
   wall itself is one labelled decorative image — see ReelWall.
   ========================================================================== */

/* Two ends of the scale, and the gap rule the brief sets: the columns are one
   object, so the space between them (16, in ReelWall) has to be clearly
   smaller than the space between the copy and the wall, which is the real
   division on the page. */
const SPLIT_GAP = "gap-[48px] lap:gap-[64px]";

/* THE WALL'S FOOTPRINT. Fixed at every width, reduced below the split. Both
   ends of the clamp land on the spacing scale; what it resolves to in between
   does not and cannot, since that is the part that makes it fluid. */
const WALL_HEIGHT = "h-[clamp(320px,48svh,448px)] lap:h-[min(72svh,680px)]";

/* Shared by both CTAs. The focus ring is stated explicitly rather than left to
   the global :focus-visible rule — this is the one interaction on the page and
   it should not depend on a stylesheet three files away continuing to cover
   it. offset-2 keeps the ring clear of the filled pill's own edge. */
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink focus-visible:rounded-[999px]";

export function HeroSplit({
  columns,
  debug = false,
}: {
  columns: WallColumns;
  /** Forwarded to ReelWall. Turns on the live drift readout. */
  debug?: boolean;
}) {
  return (
    <section
      /* The nav's wordmark links to #top. Without this the browser falls back
         to the spec behaviour for a bare "#top" and scrolls to the document
         head anyway, so it is not broken without it — but the existing
         homepage hero carries the id, and having it here is what makes the
         swap described in the route note a true drop-in rather than a
         drop-in-plus-one-thing-you-have-to-remember. */
      id="top"
      /* 100svh minus the fixed nav, which is 72px at rest. min-h rather than h,
         so a short window scrolls the copy instead of clipping it. */
      className="relative flex min-h-[100svh] items-center bg-paper pt-[96px] pb-[64px]"
    >
      <div
        className={`mx-auto grid w-full max-w-[1400px] items-center ${SPLIT_GAP} px-[clamp(24px,5vw,64px)] lap:grid-cols-[45fr_55fr]`}
      >
        {/* ---- The copy ---- */}
        <div className="flex flex-col items-start">
          <p
            className={`font-mono ${TEXT_META} font-medium uppercase tracking-[0.22em] text-pink-deep`}
          >
            {hero.eyebrow}
          </p>

          {/* Flat ink, no gradient run. The asterisks in lib/content.ts mark the
              phrase the homepage paints with its ramp; stripping them here is
              what drops the gradient without forking the copy. */}
          <h1
            className={`mt-[16px] max-w-[18ch] text-balance font-display ${TEXT_H1} font-bold leading-[1.04] tracking-[-0.03em] text-ink`}
          >
            {hero.headline.replace(/\*/g, "")}
          </h1>

          <p className={`mt-[24px] max-w-[52ch] text-pretty font-sans ${TEXT_LEAD} text-ink-soft`}>
            {hero.subline}
          </p>

          <div className="mt-[32px] flex flex-wrap items-center gap-[16px]">
            {/* Flat magenta. White on #e0245e lands at 4.58:1, which clears AA
                for body-size text. */}
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[48px] items-center rounded-[999px] bg-cue px-[32px] font-sans text-[0.96rem] font-medium text-white transition-colors duration-200 hover:bg-[#c31d51] ${FOCUS}`}
            >
              {CTA}
            </a>

            {/* Points at the LIVE homepage's Why us section. /v8 is a preview
                route and has no #why of its own, and a link that scrolls
                nowhere is worse than one that leaves the page. */}
            <Link
              href="/#why"
              className={`inline-flex min-h-[48px] items-center px-[8px] font-sans text-[0.96rem] font-medium text-ink underline decoration-line underline-offset-[6px] transition-colors duration-200 hover:decoration-ink ${FOCUS}`}
            >
              {hero.secondaryCta}
            </Link>
          </div>

          <p
            className={`mt-[24px] font-mono ${TEXT_META} uppercase tracking-[0.14em] text-ink-faint`}
          >
            {hero.reassurance}
          </p>
        </div>

        {/* ---- The wall ---- */}
        <div className="min-w-0">
          <ReelWall columns={columns} className={WALL_HEIGHT} debug={debug} />

          <p
            className={`mt-[16px] font-mono ${TEXT_META} uppercase tracking-[0.06em] text-ink-faint`}
          >
            {content.reels.caption}
          </p>
        </div>
      </div>
    </section>
  );
}

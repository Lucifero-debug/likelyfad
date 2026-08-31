import { content } from "@/lib/content";
import { reelVideos } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { PLAYGROUND_CLIPS, tag, type WorkItem } from "@/lib/v4/data";
import { ANCHOR, MONO, RAIL, SECTION, T_12, T_13, WRAP } from "@/lib/v4/theme";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE WORK STRIP — and the place this page most firmly refuses the reference.

   Personaal puts its work behind a "Recent projects" link, and it can afford
   to: its visitors are designers who will click, and the restraint reads as
   confidence to them. Our visitor is deciding in about eight seconds whether
   an AI studio can be trusted with the creative that spends their budget, and
   the only thing that answers that is the work. Hiding it would be copying the
   reference's manner and losing its argument.

   SO THE WORK IS VISIBLE, AND STILL SMALL. A compact strip, tiles no taller
   than a paragraph block, tagged and scrollable. That keeps faith with the
   flat scale — nothing here is bigger than anything else — while putting the
   evidence on the page rather than one click away.

   IT IS ALSO THE PLAYGROUND'S ACCESSIBILITY FLOOR. Every clip scattered on the
   canvas above appears here in a plain, scrollable, keyboard-reachable list,
   which is what makes the drag an enhancement rather than a requirement.

   HORIZONTAL, WITH REAL OVERFLOW SCROLL. Not a marquee: a marquee moves work
   out of reach on a timer, and someone scanning for their own vertical needs
   to be able to stop. The list scrolls with a wheel, a trackpad, a thumb, or
   the keyboard, and it never moves on its own.
   ========================================================================== */

/* Rotated past the playground's window, so the strip opens on clips the canvas
   above was not already showing, then continues through the rest of the
   library. takeReels wraps, so nothing is dropped and nothing repeats. */
const ITEMS = takeReels(reelVideos, PLAYGROUND_CLIPS, 24).map(tag);

export function WorkStrip() {
  return (
    <section id="work" className={`${SECTION} ${ANCHOR} border-t border-seam`}>
      <div className={WRAP}>
        <div className={RAIL}>
          <h2 className={`${MONO} ${T_12} text-ash`}>Work</h2>
          <p className={`${T_13} text-carbon`}>{content.reels.caption}</p>
        </div>
      </div>

      {/* Full bleed, and the only element on the page that leaves the measure.
          A strip that stops at the gutter reads as a finished row of six; one
          that runs off the edge reads as a library you are looking at part of,
          which is the true statement about a sixty-eight clip folder. */}
      <ul
        /* tabIndex on a scroll container is a WCAG 2.1.1 fix, not a stray
           attribute: a region that only scrolls is unreachable to a keyboard
           unless it can take focus, and a marketer tabbing the page has to be
           able to get into the one place the work actually is. */
        tabIndex={0}
        aria-label="Recent client work"
        /* scroll-pl has to match the padding, or mandatory snapping eats it:
           the browser aligns the first item's snap edge to the scrollport
           edge, silently scrolling the strip by exactly one gutter and
           clipping the leftmost tile against the window. */
        className="mt-[32px] flex snap-x snap-mandatory gap-[8px] overflow-x-auto scroll-pl-[clamp(24px,5vw,48px)] px-[clamp(24px,5vw,48px)] pb-[16px]"
      >
        {ITEMS.map((item, i) => (
          <li key={item.reel.id} className="w-[132px] shrink-0 snap-start">
            <WorkTile item={item} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Split out so the section above reads as layout and the tile reads as a
   tile. The section is a server component and stays one; only ReelTile
   crosses into the client. */
function WorkTile({ item, index }: { item: WorkItem; index: number }) {
  return (
    <>
      <ReelTile
        reel={item.reel}
        /* Four lanes across the strip, so the per-lane playback cap is not all
           spent on whichever tiles happen to be at the left edge. */
        lane={`v4-strip-${index % 4}`}
        alt={`Still from an AI ad made for a ${item.vertical} brand`}
      />

      {/* The tag is not decoration and it is not behind a hover. A brand
          marketer scans for their own sector before they look at anything
          else, so it sits under every tile at rest.

          The client name appears here the moment lib/v4/data.ts has one. Every
          identity is private by request today, which is the same rule the
          testimonials run under, so nothing is invented to fill the line. */}
      <p className={`${MONO} ${T_12} mt-[8px] text-ash`}>
        {item.client ?? item.vertical}
      </p>
      <p className={`${MONO} ${T_12} mt-[4px] text-ash/70`}>{item.format}</p>
    </>
  );
}

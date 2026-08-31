import { content } from "@/lib/content";
import { reelVideos } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { tag, type WorkItem } from "@/lib/v3/data";
import { ANCHOR, CARD, DISPLAY, MONO, SECTION, T_12, T_40, WRAP } from "@/lib/v3/theme";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE WORK RAIL — a looping row of case cards, tagged by client vertical.

   THE TAG IS NOT DECORATION. A brand marketer scans for their own sector
   before they look at anything else, so the vertical sits on every card at
   rest rather than waiting behind a hover. It is the first thing on the card
   for the same reason.

   A ROW, NOT A GRID. The reference site runs its templates as a continuously
   scrolling rail, and it is the right shape for this content: a grid asks you
   to evaluate everything, a rail asks you to watch until something catches
   you, which is exactly how ad creative gets judged in the feed it was made
   for. It also means the section costs one screen of height instead of six.

   THE LOOP IS SEAMLESS WITH NO JS, and reduced motion lands it on the start of
   the identical second copy rather than freezing it mid-slide. Same mechanism
   as the logo wall, same reason.

   PAUSE ON HOVER IS FUNCTIONAL HERE, not a flourish: without it there is no
   way to stop on a card and actually look at the ad.
   ========================================================================== */
const CARDS: WorkItem[] = takeReels(reelVideos, 0, 14).map(tag);

function Rail({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 gap-[24px] pr-[24px]">
      {CARDS.map((item, i) => (
        <li key={item.reel.id} className="w-[200px] shrink-0 phone:w-[240px]">
          <ReelTile
            reel={item.reel}
            /* Four buckets across the whole rail, so useInViewPlay's per-lane
               cap does not hand every slot to the cards at the feeding edge. */
            lane={hidden ? `v3-rail-b-${i % 4}` : `v3-rail-a-${i % 4}`}
            alt={`Still from an AI ad made for a ${item.vertical} brand`}
            rounded="rounded-[16px]"
          />
          <div className={`${MONO} ${T_12} mt-[16px] flex items-center gap-[8px]`}>
            {/* The client name appears here the moment lib/v3/data.ts has one.
                Every identity is private by request today, which is the same
                rule the testimonials run under, so nothing is invented. */}
            <span className="text-graphite">{item.client ?? item.vertical}</span>
            <span className="text-stone">·</span>
            <span className="text-stone">{item.format}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function WorkRail() {
  return (
    <section id="work" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-stone`}>{content.work.kicker}</p>
        <h2 className={`${DISPLAY} ${T_40} mt-[16px] max-w-[18ch] text-balance text-graphite`}>
          {content.reels.caption}
        </h2>
      </div>

      {/* Full bleed and running off both edges: a rail that stops at the gutter
          reads as a carousel with a start and an end, which is the opposite of
          what a continuously looping row is for. */}
      <div className={`${CARD} group mt-[48px] overflow-hidden`}>
        <div className="flex w-max animate-lane-x [animation-duration:72s] group-hover:[animation-play-state:paused]">
          <Rail />
          <Rail hidden />
        </div>
      </div>
    </section>
  );
}

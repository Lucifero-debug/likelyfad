import { content } from "@/lib/content";
import { reelVideos } from "@/lib/reels.generated";
import { DISPLAY, MONO, PANEL, SECTION, T_12, T_14, T_17, T_72, WRAP } from "@/lib/v3/theme";
import { CtaButton } from "./CtaButton";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE HERO — one ad, not a wall of them.

   The homepage puts copy in one column and a scrolling wall of clips in the
   other, and both land at half strength. This opens with ONE piece of work
   playing large, because a studio's first claim is not how much it has made,
   it is how good the best one is. Volume is the work rail's job, further down,
   where a reader who is already interested goes looking for their own sector.

   THE PANEL IS THE WHOLE TRICK. A bright 9:16 clip dropped straight onto a
   near-white page fights it — the eye reads a hole punched in the layout. The
   same clip inside a deep near-black rounded panel reads as a screen, and the
   panel's own edge does the job a border would otherwise be asked to do.
   Nothing on this page carries a border.

   WHICH CLIP. Named explicitly rather than taken off the top of the list: this
   is the one slot on the page where the choice is editorial, and a generated
   ordering would quietly change what the studio leads with on every sync. If
   the id ever leaves the Drive folder the fallback keeps the hero rendering.
   ========================================================================== */
const HERO_CLIP_ID = "ai-podcast";
const HERO_CLIP = reelVideos.find((reel) => reel.id === HERO_CLIP_ID) ?? reelVideos[0];

export function Hero() {
  return (
    <section id="top" className={`${SECTION} pt-[128px]`}>
      <div className={WRAP}>
        {/* Centred, and the only centred copy on the page. Every section below
            is left-aligned, so the hero reads as the title card and the rest
            reads as the document. */}
        <div className="mx-auto max-w-[900px] text-center">
          <p className={`${MONO} ${T_12} text-stone`}>{content.hero.eyebrow}</p>

          <h1 className={`${DISPLAY} ${T_72} mt-[24px] text-balance text-graphite`}>
            Ads so real, nobody asks if they&rsquo;re AI.
          </h1>

          <p className={`${T_17} mx-auto mt-[24px] max-w-[60ch] text-stone`}>
            {content.hero.subline}
          </p>

          <div className="mt-[32px] flex flex-col items-center gap-[12px]">
            <CtaButton />
            {/* Body face, not the mono. This is a sentence, and the utility
                role on this page is labels — an uppercased sentence at 0.18em
                reads as fine print, which is the opposite of reassurance. */}
            <p className={`${T_14} text-stone`}>{content.hero.reassurance}</p>
          </div>
        </div>

        {/* The clip is 9:16 and the panel is not, on purpose: the letterboxing
            IS the design. A vertical ad standing in the middle of a wide dark
            panel reads as a screening rather than as a video that failed to
            fill its container. */}
        <div
          className={`${PANEL} mt-[64px] flex justify-center px-[24px] py-[32px] phone:px-[48px] phone:py-[48px]`}
        >
          <ReelTile
            reel={HERO_CLIP}
            lane="v3-hero"
            alt="Still from a Likelyfad AI ad: a podcast-style spot with two people talking to camera"
            rounded="rounded-[16px]"
            className="w-full max-w-[320px]"
          />
        </div>
      </div>
    </section>
  );
}

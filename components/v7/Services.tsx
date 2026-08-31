import { SERVICES } from "@/lib/v7/data";
import {
  ANCHOR,
  DISPLAY,
  DISPLAY_600,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_14,
  T_26,
  T_44,
  TILT,
  WRAP,
} from "@/lib/v7/theme";
import { Paperclip } from "./Marks";
import { PinnedCard } from "./PinnedCard";

/* ============================================================================
   SERVICES — the four things that arrive finished, as clipped cards.

   THEY CARRY PAPERCLIPS AND NOT PUSHPINS, AND THE DISTINCTION IS CONSISTENT
   ACROSS THE PAGE. A clip holds a tag; a pin holds a card. So the four hero
   stickers are clipped, these four are clipped because they name the same four
   things, and the stats and the reviews — which are cards, not tags — are
   pinned. That is what the brief means by keeping these consistent with the
   sticker language, and it is the difference between a vocabulary and a bag of
   ornaments applied at random.

   NOTHING HERE IS A NEW PROMISE. All four lines come from SERVICES in
   lib/v4/data.ts, where each one restates something lib/content.ts already
   says: hook-first and sized for every placement in the pillars, the four
   deliverables in the FAQ, hooks staying yours in the ownership answer.

   THE TILT IS AT THE BOTTOM OF THE BUDGET. These carry a sentence each, and
   the ceiling in lib/v7/theme.ts is a legibility budget rather than a taste
   one — one word can take 3 degrees, a line of body copy cannot.
   ========================================================================== */
export function Services() {
  return (
    <section id="services" aria-labelledby="v7-services-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>What we make</p>

        <h2
          id="v7-services-title"
          className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] text-mark`}
        >
          Four things, all of them finished.
        </h2>

        {/* 48 between cards padded 32. */}
        <ul className="mt-[48px] grid gap-[48px] phone:grid-cols-2 lap:grid-cols-4">
          {SERVICES.map((service, i) => (
            <PinnedCard key={service.name} as="li" tilt={TILT[i % TILT.length]}>
              {/* Clipped to the top-left corner, overhanging, exactly as the
                  hero stickers are. Decorative: the card is already named by
                  its own heading. */}
              <Paperclip className="absolute -top-[10px] left-[24px] h-[28px] w-[14px] -rotate-[14deg] text-note" />

              {/* NOT NUMBERED. Process is the one section on this page that
                  is, because there the order carries information. These four
                  are independent deliverables and an index would invent a
                  sequence — you do not get Static before you get Hooks. The
                  mt-8 clears the clip, which overhangs the top edge. */}
              <h3 className={`${DISPLAY_600} ${T_26} mt-[8px] text-mark`}>{service.name}</h3>

              <p className={`${T_14} mt-[16px] text-note`}>{service.body}</p>
            </PinnedCard>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { BENTO, bentoReel } from "@/lib/v6/data";
import { ANCHOR, CARD, HEAD_GAP, MONO, SECTION, SERIF, SERIF_400, T_12, T_14, T_24, T_40, WRAP } from "@/lib/v6/theme";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE BENTO GRID — what we make.

   THE REFERENCE'S GRID LISTS TOOL CAPABILITIES: "AI Image Generator",
   "Keyframe Control", "Style Presets". Every one of those is something the
   visitor would operate. Ours are DELIVERABLES — Video, UGC, Static, Hooks —
   things that arrive finished. That single substitution is the whole
   difference between the two business models expressed in four cards, and it
   is why these titles are nouns you receive rather than verbs you perform.

   VARYING WIDTHS ARE WHAT MAKE IT A BENTO. Four equal cards in a row is a
   feature grid; 4-2 over 2-4 on a six-column grid is a bento. The alternation
   also means the two cards with the most to say get the most room, which is
   the only honest reason to make a card wider than its neighbour.

   THE GAP IS 48 AND THE PADDING IS 32, AND THAT ORDER IS NOT NEGOTIABLE. This
   is the section the spacing rule exists for: a bento grid is nothing but
   padded cards sitting near each other, and at 32 against 32 the four stop
   being four cards and become one dark mass with some rules drawn on it.

   THE BORDER IS MEANT TO BE BARELY VISIBLE. #1B2130 on #101623 is about as
   faint as a border can be and still exist. It is not drawing a box, it is
   stopping two adjacent fills from bleeding into one another. Raise it and the
   grid becomes a wireframe.

   EACH CARD SHOWS THE FORMAT IT DESCRIBES. The clip inside the Video card is a
   video ad, the one inside the UGC card is a UGC ad. A card that describes one
   thing while showing another is decoration, and on the one section of this
   page that is meant to answer "what do I actually get", decoration is the
   wrong answer.

   WHICH IS WHY THE STATIC CARD DOES NOT MOVE. It renders a single frame and
   never mounts a video, at every motion preference. A Static card playing a
   loop would contradict the word printed directly above it, which is the exact
   failure the paragraph above describes — and the fix is also the honest
   demonstration, since a single-frame ad shown as a single frame is the
   product. See `still` in lib/v6/data.ts.
   ========================================================================== */
export function Bento() {
  return (
    <section
      id="services"
      aria-labelledby="v6-bento-title"
      className={`${SECTION} ${ANCHOR}`}
    >
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-haze`}>What we make</p>

        <h2 id="v6-bento-title" className={`${SERIF} ${T_40} ${HEAD_GAP} max-w-[20ch] text-beam`}>
          Four things, all finished, none of them filmed.
        </h2>

        {/* Six columns from lap, two from tab, one below — the single column
            the brief asks for at 375. The gap is the same 48 at every width,
            because the rule that a gap must exceed the padding inside either
            neighbour does not relax on a phone. */}
        <ul className="mt-[48px] grid gap-[48px] tab:grid-cols-2 lap:grid-cols-6">
          {BENTO.map((card, i) => (
            <li key={card.title} className={`${CARD} ${card.span} flex flex-col`}>
              <h3 className={`${SERIF_400} ${T_24} text-beam`}>{card.title}</h3>
              <p className={`${T_14} mt-[12px] max-w-[46ch] text-haze`}>{card.body}</p>

              {/* The clip sits at the bottom of the card and fills its width,
                  so a wide card and a narrow card differ in how much work they
                  show rather than in how much text they carry. mt-auto pins it
                  down regardless of how many lines the body ran to, which is
                  what keeps the four bottom edges aligned. */}
              <div className="mt-auto pt-[32px]">
                <ReelTile
                  reel={bentoReel(card.clip, i)}
                  /* One lane per card, so the per-lane playback cap is not all
                     spent on whichever card happens to scroll in first. */
                  lane={`v6-bento-${i}`}
                  alt={`Still from an AI ${card.title.toLowerCase()} ad`}
                  still={card.still}
                  /* The only place on the page a tile is not 9:16: inside a
                     card it is a strip showing the work exists, not a reel you
                     are meant to watch. A full 9:16 here would make every card
                     a metre tall and bury the four titles. */
                  className="!aspect-[16/9] rounded-[8px]"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

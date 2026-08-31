"use client";

import { useEffect, useRef, useState } from "react";
import { reelVideos } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { DISPLAY, SECTION, T_72, WRAP } from "@/lib/v3/theme";
import { useNarrow, useReducedMotion } from "@/lib/v3/useReducedMotion";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE STATEMENT — the signature, and the only place on this page that spends
   any boldness at all.

   THE IDEA. The sentence claims you cannot tell our work is AI. The evidence
   for that claim plays inside the sentence making it: three real client clips
   sit in the line where words would be, small enough to read as punctuation
   and large enough that you can see a face moving. The reference site embeds
   glossy 3D objects here; borrowing those literally would have given us
   decorative blobs, which is the generic answer. Our objects are the product.

   THE REVEAL. Each word arrives tinted in the magenta and settles to graphite.
   That is the ONLY appearance of the accent on the entire page, which is what
   makes it read as a moment rather than as a brand colour sprinkled around.
   The tint is on arrival only — a headline that stays multicoloured is
   decoration, and this one is meant to land and then get out of the way.

   ONCE, AND ONLY FORWARD. The observer disconnects on the first intersection.
   A reveal that replays every time you scroll back past it stops being an
   arrival and becomes an effect.

   REDUCED MOTION SKIPS ALL OF IT. `revealed` starts true, so the sentence is
   simply there, in its final colour, with no observer attached and no
   transition to interrupt — and the clips inside it render as poster frames,
   because ReelTile never mounts a video under that preference.
   ========================================================================== */

/* Three clips, taken from a window the work rail does not use, so no clip
   appears twice on the page. */
const CLIPS = takeReels(reelVideos, 40, 3);

/* The sentence, as the sequence it is rendered from. A string index marks a
   clip; everything else is a word. Written out rather than parsed from prose
   so the clip positions are a deliberate choice and not a regex's opinion. */
const TOKENS: (string | number)[] = [
  "Every",
  "frame",
  0,
  "you",
  "see",
  "here",
  "is",
  "AI.",
  1,
  "Nobody",
  "scrolling",
  "past",
  2,
  "could",
  "tell.",
];

/* Between one word landing and the next starting. Slow enough to read as a
   sentence assembling itself, fast enough that the last word is down well
   before a normal scroll has carried the line off the screen. */
const STAGGER_MS = 45;

export function Statement() {
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  const revealed = reduced || seen;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      /* Fires once a third of the sentence is up, so the reveal starts when
         the line is genuinely on screen rather than as its first pixel
         crosses the fold and the reader has not looked at it yet. */
      { threshold: 0.34 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className={SECTION} aria-labelledby="statement">
      <div className={WRAP}>
        <p
          ref={ref}
          id="statement"
          role="heading"
          aria-level={2}
          aria-label="Every frame you see here is AI. Nobody scrolling past could tell."
          className={`${DISPLAY} ${T_72} mx-auto max-w-[20ch] text-center text-balance`}
        >
          {TOKENS.map((token, i) =>
            typeof token === "number" ? (
              <InlineClip key={i} index={token} still={narrow || reduced} shown={revealed} step={i} />
            ) : (
              <span
                key={i}
                /* aria-hidden on every piece: the sentence is announced once
                   from the aria-label above, because reading it as fifteen
                   separate fragments with three images in the middle is not
                   the same sentence. */
                aria-hidden="true"
                style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
                className={`inline-block transition-[opacity,transform,color] duration-500 ease-out ${
                  revealed
                    ? "translate-y-0 text-graphite opacity-100"
                    : "translate-y-[0.25em] text-cue opacity-0"
                }`}
              >
                {token}
                {" "}
              </span>
            )
          )}
        </p>
      </div>
    </section>
  );
}

/* A clip sitting in the line like a word. `align-middle` rather than baseline:
   a 9:16 box on the baseline hangs below the descenders and pushes the line
   box open, which would make the leading uneven from line to line. */
function InlineClip({
  index,
  still,
  shown,
  step,
}: {
  index: number;
  still: boolean;
  shown: boolean;
  step: number;
}) {
  const clip = CLIPS[index];
  const box = "mr-[8px] inline-block w-[clamp(28px,3.6vw,52px)] align-middle";

  return (
    <span
      aria-hidden="true"
      style={{ transitionDelay: `${step * STAGGER_MS}ms` }}
      className={`inline-block transition-[opacity,transform] duration-500 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-[0.25em] opacity-0"
      }`}
    >
      {/* THE MOBILE FALLBACK. Under 561px the line is already breaking three
          ways and a running video in the middle of it is noise, so the clip
          drops to its own poster frame — same box, same rhythm, no decoder. */}
      {still ? (
        clip.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={clip.poster}
            alt=""
            loading="lazy"
            decoding="async"
            className={`${box} aspect-[9/16] rounded-[8px] bg-panel-2 object-cover`}
          />
        ) : null
      ) : (
        <ReelTile
          reel={clip}
          lane={`v3-statement-${index}`}
          alt=""
          rounded="rounded-[8px]"
          className={box}
          as="span"
        />
      )}
    </span>
  );
}

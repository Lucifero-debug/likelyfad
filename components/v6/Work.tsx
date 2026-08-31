"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";
import {
  CLUSTER_ITEMS,
  FILTERS,
  GRID_VISIBLE,
  WORK_ITEMS,
  type Format,
} from "@/lib/v6/data";
import { ANCHOR, HEAD_GAP, MONO, SECTION, SERIF, T_12, T_14, T_40, WRAP } from "@/lib/v6/theme";
import { useNarrow, useReducedMotion } from "@/lib/v6/useMedia";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE WORK GALLERY — the tilted cluster, then the grid that actually gets
   browsed.

   THE CLUSTER IS THE FLOURISH AND THE GRID IS THE TOOL, and keeping that
   distinction honest is the whole design of this section. A fanned deck of
   cards is lovely and almost unusable: you cannot scan it, you cannot filter
   it, and three of the five are partly behind the others. So it earns its
   place as an opening image and nothing depends on it — everything it shows
   also appears in the grid underneath, tagged and filterable.

   THE FAN STRAIGHTENS ON HOVER. At rest the five are dealt at slight angles
   and overlapping; on hover the whole cluster levels out and spreads, which
   turns the flourish into something you can actually read without making the
   reader click. It is one transform on each card, so it costs nothing.

   THREE STATES, NOT ONE. Fanned is only correct on a wide viewport with motion
   allowed:
     - REDUCED MOTION → dealt flat, no rotation at rest, no hover transform.
       A tilt is a transform applied at rest, which the global CSS block cannot
       reach, so it is decided here.
     - NARROW (below 760px) → a flat scrollable row. Fanned cards at 375 either
       overlap into illegibility or push their outermost pair off screen, and
       the brief asks for a flat fallback by name.
     - Otherwise → the fan.

   THE CLUSTER IS NOT KEYBOARD-INTERACTIVE and does not need to be. The cards
   are not links: there is no per-clip page in this repo to link them to, and a
   focusable div that does nothing is worse than a decorative one. It is
   aria-hidden, and the grid below is the accessible presentation of the same
   clips — which is also why the grid is not optional.

   THE CHIPS ARE REAL CONTROLS, not links: <button> with aria-pressed inside a
   named group, so a screen reader hears a toggle that is on or off rather than
   four unlabelled words.

   "SHOW ALL" EXPANDS, IT DOES NOT NAVIGATE. There is no /work page in this
   repo, and a dead link on the one section a visitor uses to decide is worse
   than no link. The count comes from the FILTERED list — with a filter on,
   "Show all (24)" would be a lie about what the button is going to do.
   ========================================================================== */
export function Work() {
  const [format, setFormat] = useState<Format | null>(null);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () => (format ? WORK_ITEMS.filter((item) => item.format === format) : WORK_ITEMS),
    [format]
  );

  const shown = expanded ? filtered : filtered.slice(0, GRID_VISIBLE);
  const hidden = filtered.length - shown.length;

  return (
    <section id="work" aria-labelledby="v6-work-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-haze`}>The work</p>

        <h2 id="v6-work-title" className={`${SERIF} ${T_40} ${HEAD_GAP} max-w-[20ch] text-beam`}>
          {content.reels.caption}
        </h2>
      </div>

      <Cluster />

      <div className={WRAP}>
        <div className="mt-[64px] flex flex-col gap-[24px] tab:flex-row tab:items-center tab:justify-between">
          <p className={`${T_14} max-w-[46ch] text-haze`}>{content.work.sub}</p>

          <div
            role="group"
            aria-label="Filter work by format"
            className="flex flex-wrap gap-[8px]"
          >
            {FILTERS.map((chip) => {
              const active = chip.value === format;
              return (
                <button
                  key={chip.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFormat(chip.value);
                    /* Collapse on every filter change. Otherwise switching
                       from an expanded All to a four-item Static leaves the
                       button offering to expand something already whole. */
                    setExpanded(false);
                  }}
                  className={`${MONO} ${T_12} rounded-[999px] border px-[16px] py-[8px] transition-colors duration-200 ${
                    active
                      ? "border-beam bg-beam text-night"
                      : "border-edge text-haze hover:border-haze hover:text-beam"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {shown.length > 0 ? (
          <ul className="mt-[48px] grid grid-cols-2 gap-[24px] tab:grid-cols-3 lap:grid-cols-4">
            {shown.map((item, i) => (
              <li key={item.reel.id}>
                <ReelTile
                  reel={item.reel}
                  /* Four lanes across the grid, so the per-lane playback cap is
                     not all spent on whichever tiles are in the first row. */
                  lane={`v6-grid-${i % 4}`}
                  alt={`Still from an AI ad made for a ${item.vertical} brand`}
                  className="rounded-[12px]"
                />

                {/* The tag is not decoration and it is not behind a hover. A
                    brand marketer scans for their own sector before they look
                    at anything else, so it sits under every tile at rest.

                    The client name appears here the moment lib/v4/data.ts has
                    one. Every identity is private by request today, the same
                    rule the testimonials run under, so nothing is invented to
                    fill the line. */}
                <p className={`${MONO} ${T_12} mt-[12px] text-beam`}>
                  {item.client ?? item.vertical}
                </p>
                <p className={`${MONO} ${T_12} mt-[4px] text-haze`}>{item.format}</p>
              </li>
            ))}
          </ul>
        ) : (
          /* Reachable: Static is a real format and the public reel may hold
             none of it. An empty grid with no explanation reads as a broken
             filter rather than as an honest answer. */
          <p className={`${MONO} ${T_12} mt-[48px] text-haze`}>
            Nothing in the public reel for this format yet. Ask us for samples.
          </p>
        )}

        {hidden > 0 && (
          <div className="mt-[48px]">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className={`${MONO} ${T_12} rounded-[999px] border border-edge px-[24px] py-[12px] text-beam transition-colors duration-200 hover:border-haze`}
            >
              Show all ({filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   THE TILTED STACK. Five cards dealt from a deck.

   The angles are hand-set rather than computed, because five is a small enough
   number that a formula would be more code than the list and would still need
   the middle card pinned at zero to look dealt rather than spun.
   --------------------------------------------------------------------------- */
const FAN = [
  { rest: "-rotate-[9deg] translate-y-[16px]", z: "z-10" },
  { rest: "-rotate-[4deg] translate-y-[4px]", z: "z-20" },
  { rest: "rotate-0", z: "z-30" },
  { rest: "rotate-[4deg] translate-y-[4px]", z: "z-20" },
  { rest: "rotate-[9deg] translate-y-[16px]", z: "z-10" },
];

function Cluster() {
  const reduced = useReducedMotion();
  const narrow = useNarrow();

  /* A flat, scrollable row. Below the tab breakpoint there is not enough
     horizontal room for five overlapping cards to be legible, and under
     reduced motion a resting tilt is itself motion the visitor asked not to
     have. Both cases land here. */
  if (narrow || reduced) {
    return (
      <div
        aria-hidden="true"
        className="mt-[48px] flex snap-x snap-mandatory gap-[16px] overflow-x-auto scroll-pl-[clamp(24px,5vw,64px)] px-[clamp(24px,5vw,64px)] pb-[16px]"
      >
        {CLUSTER_ITEMS.map((item, i) => (
          <div key={item.reel.id} className="w-[132px] shrink-0 snap-start">
            <ReelTile
              reel={item.reel}
              lane={`v6-cluster-${i}`}
              alt=""
              className="rounded-[12px] border border-edge"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    /* `group` is on the wrapper so hovering anywhere in the cluster levels the
       whole deck at once. Levelling only the card under the pointer would make
       the other four look like they had fallen over. */
    <div
      aria-hidden="true"
      className="group mt-[64px] flex items-center justify-center px-[clamp(24px,5vw,64px)]"
    >
      {CLUSTER_ITEMS.map((item, i) => (
        <div
          key={item.reel.id}
          className={`${FAN[i].z} ${FAN[i].rest} w-[clamp(120px,13vw,168px)] shrink-0 transition-transform duration-500 ease-out will-change-transform group-hover:translate-y-0 group-hover:rotate-0 ${
            /* Overlap at rest, spread flat on hover. The negative margin is the
               overlap; removing it on hover is what makes the deck deal out. */
            i > 0 ? "-ml-[32px] group-hover:ml-[16px]" : ""
          }`}
        >
          <ReelTile
            reel={item.reel}
            lane={`v6-cluster-${i}`}
            alt=""
            className="rounded-[12px] border border-edge shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)]"
          />
        </div>
      ))}
    </div>
  );
}

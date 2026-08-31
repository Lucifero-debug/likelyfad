"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";
import {
  FILTERS,
  SECTIONS,
  WORK_ITEMS,
  WORK_VISIBLE,
  type Format,
} from "@/lib/v5/data";
import { ANCHOR, HEAD_GAP, MONO, SECTION, T_12, T_20, WRAP } from "@/lib/v5/theme";
import { ReelTile } from "./ReelTile";
import { SectionHead } from "./SectionHead";

/* ============================================================================
   THE WORK GRID — the one section carrying the actual argument.

   FUEL'S PORTFOLIO GRID ASSUMES STILLS AND OURS CANNOT. A still of an AI ad
   proves nothing; the whole claim is about motion — skin, hands, lighting,
   lip-sync — and those are exactly the things a frozen frame hides. So every
   tile is video-backed, and everything that makes a wall of video affordable
   is handled in ReelTile and useInViewPlay: lazy, poster-framed, capped per
   lane, staggered on start, and paused the moment a tile leaves the viewport.

   THE FILTER CHIPS ARE REAL CONTROLS, NOT LINKS. They are <button> with
   aria-pressed, inside a group labelled "Filter work by format", so a screen
   reader hears a toggle that is on or off rather than four unlabelled words.
   A radio group would arguably be more correct still, but it would trade the
   chip shape the design wants for a control most users cannot restyle past —
   aria-pressed keeps both.

   "EXPLORE ALL" EXPANDS, IT DOES NOT NAVIGATE. There is no /work page in this
   repo. The reference links to one, and copying that link would put a dead end
   on the single section a visitor uses to decide. So the button reveals the
   rest of the library in place and names the count, which is the same promise
   kept honestly. Give the site a work page and this becomes an <a>.

   THE COUNT IN THE BUTTON IS DERIVED FROM THE FILTERED LIST, not from the
   library. With a filter on, "Explore all (24)" would be a lie about what the
   button is going to show you.
   ========================================================================== */
export function Work() {
  const [format, setFormat] = useState<Format | null>(null);
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(
    () => (format ? WORK_ITEMS.filter((item) => item.format === format) : WORK_ITEMS),
    [format]
  );

  const shown = expanded ? filtered : filtered.slice(0, WORK_VISIBLE);
  const hidden = filtered.length - shown.length;

  return (
    <section
      id="work"
      aria-labelledby="v5-head-work"
      className={`${SECTION} ${ANCHOR} bg-white`}
    >
      <div className={WRAP}>
        <SectionHead index={SECTIONS.work.index} name={SECTIONS.work.name} id="v5-head-work" />

        <div
          className={`${HEAD_GAP} flex flex-col gap-[24px] tab:flex-row tab:items-end tab:justify-between`}
        >
          <p className={`${T_20} max-w-[28ch] text-press`}>{content.reels.caption}</p>

          {/* The chips. Naming the group is what makes four bare words into a
              control a screen reader can explain. */}
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
                      ? "border-press bg-press text-white"
                      : "border-crease text-lead hover:border-press hover:text-press"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two up at 375, three from tab, four from lap. The tiles carry no
            padding of their own, so a 24 gutter is comfortably clear of the
            spacing rule and still lets four 9:16 tiles breathe on a wide
            screen. */}
        {shown.length > 0 ? (
          <ul className="mt-[48px] grid grid-cols-2 gap-[24px] tab:grid-cols-3 lap:grid-cols-4">
            {shown.map((item, i) => (
              <li key={item.reel.id}>
                <ReelTile
                  reel={item.reel}
                  /* Four lanes across the grid, so the per-lane playback cap
                     is not all spent on whichever tiles happen to be in the
                     first row. */
                  lane={`v5-work-${i % 4}`}
                  alt={`Still from an AI ad made for a ${item.vertical} brand`}
                />

                {/* The tag is not decoration and it is not behind a hover. A
                    brand marketer scans for their own sector before they look
                    at anything else, so it sits under every tile at rest.

                    The client name appears here the moment lib/v4/data.ts has
                    one. Every identity is private by request today, the same
                    rule the testimonials run under, so nothing is invented to
                    fill the line. */}
                <p className={`${MONO} ${T_12} mt-[12px] text-press`}>
                  {item.client ?? item.vertical}
                </p>
                <p className={`${MONO} ${T_12} mt-[4px] text-lead`}>{item.format}</p>
              </li>
            ))}
          </ul>
        ) : (
          /* Reachable: Static is a real format and the library may hold none of
             it. An empty grid with no explanation reads as a broken filter. */
          <p className={`${MONO} ${T_12} mt-[48px] text-lead`}>
            Nothing in the public reel for this format yet. Ask us for samples.
          </p>
        )}

        {hidden > 0 && (
          <div className="mt-[48px]">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className={`${MONO} ${T_12} text-press underline underline-offset-[6px] decoration-crease transition-colors duration-200 hover:decoration-press`}
            >
              Explore all ({filtered.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

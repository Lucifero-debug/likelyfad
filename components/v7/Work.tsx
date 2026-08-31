"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";
import { FILTERS, GRID_VISIBLE, WORK_ITEMS, type Format } from "@/lib/v7/data";
import {
  ANCHOR,
  CARD,
  DISPLAY,
  HEAD_GAP,
  LIFT,
  MONO,
  SECTION,
  T_12,
  T_14,
  T_44,
  WRAP,
} from "@/lib/v7/theme";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE WORK — clips pinned to the board, filterable by format.

   THE TILES ARE NOT TILTED, AND THAT IS THE ONE PLACE THIS PAGE PUTS THE
   METAPHOR DOWN. Everything else pinned to this wall is a card with two lines
   on it that you glance at; this is the section a brand marketer actually
   works, comparing twelve clips against each other to decide whether the
   output is good enough to spend on. Tilted video tiles are measurably harder
   to compare — the eye has to level each one before it can read the frame —
   and a metaphor that costs the visitor the one task the page exists to
   support has stopped being a design and started being a theme. The white mat
   and the pin language carry the wall here; the angle does not.

   THE MAT IS 8px OF WHITE AROUND EACH CLIP. That is what makes a tile read as
   a print pinned to a board rather than as a video embedded in a page, and it
   costs nothing in scannability because it does not rotate anything. The grid
   gap is 24, which clears the 8 by the same rule the 32-padded cards clear
   with 48.

   THE CHIPS ARE REAL CONTROLS, not links: <button> with aria-pressed inside a
   named group, so a screen reader hears a toggle that is on or off rather than
   four unlabelled words.

   "SHOW ALL" EXPANDS, IT DOES NOT NAVIGATE. There is no /work page in this
   repo, and a dead link on the one section a visitor uses to decide is worse
   than no link. The count comes from the FILTERED list — with a filter on,
   "Show all (24)" would be a lie about what the button is about to do.
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
    <section id="work" aria-labelledby="v7-work-title" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-note`}>{content.work.kicker}</p>

        <h2 id="v7-work-title" className={`${DISPLAY} ${T_44} ${HEAD_GAP} max-w-[18ch] text-mark`}>
          {content.reels.caption}
        </h2>

        <div className="mt-[32px] flex flex-col gap-[24px] tab:flex-row tab:items-end tab:justify-between">
          <p className={`${T_14} max-w-[44ch] text-note`}>{content.work.sub}</p>

          <div role="group" aria-label="Filter work by format" className="flex flex-wrap gap-[8px]">
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
                      ? "border-mark bg-mark text-board"
                      : "border-hair bg-card text-note hover:border-note hover:text-mark"
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
              <li key={item.reel.id} className={`${CARD} ${LIFT} p-[8px]`}>
                {/* The clip is decorative: the two lines under it already name
                    the vertical and the format, and a per-tile alt repeating
                    them would have a screen reader read every tile twice. */}
                <ReelTile
                  reel={item.reel}
                  alt=""
                  /* Bucketed by column so the playback budget fills evenly
                     across the grid rather than draining into row one. Must be
                     unique across every lane on the site — the registry in
                     lib/useInViewPlay.ts is global. */
                  lane={`v7-work-${i % 4}`}
                />

                <div className="flex items-baseline justify-between gap-[8px] px-[4px] pt-[12px] pb-[4px]">
                  <span className={`${MONO} ${T_12} text-mark`}>{item.vertical}</span>
                  <span className={`${MONO} ${T_12} text-note`}>{item.format}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`${T_14} mt-[48px] text-note`}>
            Nothing tagged that way yet. Try another format.
          </p>
        )}

        {hidden > 0 && (
          <div className="mt-[48px] flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className={`${MONO} ${T_12} rounded-[999px] border border-hair bg-card px-[24px] py-[12px] text-mark transition-colors duration-200 hover:border-note`}
            >
              {`Show all (${hidden} more)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

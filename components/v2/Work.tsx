"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";
import { reelVideos } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { FILTERS, HERO_TILE_COUNT, tag, type Filter, type WorkItem } from "@/lib/v2/data";
import {
  ANCHOR,
  CORNER,
  DISPLAY,
  HEAD_GAP,
  MONO,
  SECTION,
  T_12,
  T_17,
  T_40,
  WRAP,
} from "@/lib/v2/theme";
import { ReelTile } from "./ReelTile";

/* ============================================================================
   THE WORK — the catalogue, as opposed to the hero, which is the argument.

   THE VERTICAL IS ALWAYS VISIBLE AND THE FORMAT IS NOT. A brand marketer scans
   for their own sector before they look at anything else, so the sector cannot
   be behind a hover: it sits on every tile at rest. The format is what you
   want once a tile has already caught you, so it is what the hover reveals.
   That split is also why the chips filter on FORMAT and the tags show
   VERTICAL — the two axes do different jobs and neither is decoration.

   ROTATED PAST THE HERO. takeReels from HERO_TILE_COUNT returns the whole
   library, so nothing is dropped, but it opens on clips the wall upstairs was
   not already showing.

   LOAD MORE, NOT EVERYTHING. Sixty-eight tiles is sixty-eight video elements.
   useInViewPlay would keep all but a handful paused, but they would still be
   sixty-eight elements in the tree and sixty-eight poster fetches queued
   behind the fold.

   SIX COLUMNS AT lap, AND TWELVE PER PAGE. Twelve divides by 2, 3, 4 and 6, so
   every breakpoint fills its last row exactly and the grid never ends on a
   ragged half-row.
   ========================================================================== */
const STEP = 12;

export function Work() {
  const items = useMemo(
    () => takeReels(reelVideos, HERO_TILE_COUNT, reelVideos.length).map(tag),
    []
  );

  const [filter, setFilter] = useState<Filter>("All");
  const [shown, setShown] = useState(STEP);

  const matching = filter === "All" ? items : items.filter((item) => item.format === filter);
  const visible = matching.slice(0, shown);
  const remaining = matching.length - visible.length;

  function choose(next: Filter) {
    setFilter(next);
    /* Back to the first page. Keeping the old count would drop the reader
       somewhere in the middle of a set they have not seen the top of. */
    setShown(STEP);
  }

  return (
    <section id="work" className={`${SECTION} ${ANCHOR}`}>
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <p className={`${MONO} ${T_12} text-dim`}>{content.work.kicker}</p>
          <h2 className={`${DISPLAY} ${T_40} mt-[16px] max-w-[16ch] text-balance text-lit`}>
            {content.reels.caption}
          </h2>
          <p className={`${T_17} mt-[24px] max-w-[52ch] text-dim`}>{content.work.sub}</p>

          {/* The chips. aria-pressed and not a tablist: these are toggles over
              one grid, not tabs over separate panels, and announcing them as
              tabs would promise arrow-key navigation between panels that do
              not exist. */}
          <div
            role="group"
            aria-label="Filter work by format"
            className="mt-[32px] flex flex-wrap gap-[12px]"
          >
            {FILTERS.map((option) => {
              const on = option === filter;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(option)}
                  className={`${MONO} ${T_12} ${CORNER} border px-[16px] py-[8px] transition-colors duration-200 ${
                    on
                      ? "border-lit bg-lit text-stage"
                      : "border-rule text-dim hover:border-lit/40 hover:text-lit"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* The count changes without the focused chip changing, so it is
            announced rather than left for the reader to discover by scrolling. */}
        <p role="status" className="sr-only">
          Showing {visible.length} of {matching.length}{" "}
          {filter === "All" ? "ads" : `${filter} ads`}.
        </p>

        <ul className="grid grid-cols-2 gap-[12px] phone:grid-cols-3 tab:grid-cols-4 lap:grid-cols-6">
          {visible.map((item, i) => (
            <li key={item.reel.id} className="group relative">
              <Tile index={i} item={item} />
            </li>
          ))}
        </ul>

        {remaining > 0 && (
          <div className="mt-[48px] flex justify-center">
            <button
              type="button"
              onClick={() => setShown((n) => n + STEP)}
              className={`${MONO} ${T_12} ${CORNER} border border-rule px-[32px] py-[16px] text-dim transition-colors duration-200 hover:border-lit/40 hover:text-lit`}
            >
              Load {Math.min(STEP, remaining)} more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* Three lanes. The grid is scrolled through rather than taken in at once, so
   the playback cap is about what is on screen, not about what is mounted. */
function Tile({ item, index }: { item: WorkItem; index: number }) {
  return (
    <>
      <ReelTile
        reel={item.reel}
        lane={`v2-work-${index % 3}`}
        alt={`Still from an AI ad made for a ${item.vertical} brand`}
      />

      {/* At rest, and the reason the grid is scannable. */}
      <span
        className={`${MONO} ${T_12} ${CORNER} pointer-events-none absolute top-[8px] left-[8px] bg-stage/70 px-[8px] py-[4px] text-lit backdrop-blur-[2px]`}
      >
        {item.vertical}
      </span>

      {/* On hover. Opacity only, so the text stays in the accessibility tree
          at every state and a screen reader gets the format whether or not a
          pointer ever arrives.

          The client name appears here the moment lib/v2/data.ts has one —
          every identity is private by request today, which is the same rule
          the testimonials run under, so nothing is invented to fill the line. */}
      <div
        className={`${CORNER} pointer-events-none absolute inset-0 flex flex-col justify-end gap-[4px] bg-[linear-gradient(to_top,rgba(19,18,17,0.88),rgba(19,18,17,0.1)_60%,rgba(19,18,17,0))] p-[12px] opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      >
        {item.client && <p className={`${MONO} ${T_12} text-lit`}>{item.client}</p>}
        <p className={`${MONO} ${T_12} text-dim`}>{item.format}</p>
      </div>
    </>
  );
}

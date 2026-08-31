/* ============================================================================
   /v8 — the clip data the parallax wall is fed.

   THE WALL TAKES ITS CLIPS AS A PROP and knows nothing about this file. That is
   the brief's requirement and it is the right shape: ReelWall is a presentation
   component that renders four columns of whatever it is handed, so it can be
   pointed at a different library, a curated set, or fixtures in a test without
   touching a line of it. Everything here is the ROUTE's business — which clips,
   in what order, described how.

   HOUSE RULES CARRIED OVER FROM lib/content.ts. No em dashes in copy, and never
   a claim or a number a client did not actually give us.
   ========================================================================== */

import { reelVideos, type Reel } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { tag } from "@/lib/v4/data";

/* One clip, exactly the shape the brief specifies. `poster` is required rather
   than optional, which is what makes the no-layout-shift guarantee in ReelWall
   structural instead of a hope — see POSTERED below. */
export type WallClip = {
  src: string;
  poster: string;
  alt: string;
  /* CARRIED FOR THE LIGHTBOX, not for the wall. The tiles play `src`, a small
     silent cut; opening one asks to look closely, and that wants `hq` — the
     larger cut with audio — plus an `id` stable across a Drive sync. Neither is
     read while the clip is sitting in the wall. `hq` is null when the sync ran
     without ffmpeg, and the lightbox falls back to `src`. */
  id: string;
  hq: string | null;
};

/** Four columns. A tuple rather than WallClip[][], so handing the wall three
    columns or five is a type error at the call site rather than a layout that
    quietly comes out wrong. */
export type WallColumns = [WallClip[], WallClip[], WallClip[], WallClip[]];

export const COLUMNS = 4;
export const PER_COLUMN = 4;

/* ---------------------------------------------------------------------------
   WHY THIS FILE IMPORTS `tag` FROM lib/v4/data.ts.

   Same reason /v5, /v6 and /v7 do, and it is worth restating because the routes
   otherwise share nothing on purpose. The theme and layout of a direction has to
   be free to differ; `tag` is not a design decision. It is a factual mapping
   from a Drive filename to the vertical and format a clip was actually made for,
   hand-checked over fourteen filenames. It is the only honest source for alt
   text here, and duplicating it would mean two routes disagreeing about what a
   clip IS the first time either list is corrected.

   Nothing in v4 is modified by importing from it.
   --------------------------------------------------------------------------- */

/* POSTER FRAMES ARE NON-NEGOTIABLE, so the list is filtered on having one
   rather than falling back to an empty string. A <video> with no poster paints
   nothing until its first frame decodes, and sixteen of those inside a
   fixed-height wall is exactly the layout shift the brief asks to design out.
   Every clip in the library currently carries one, so this filter removes
   nothing today; it exists so that a future sync that drops a poster degrades
   by showing fewer clips rather than by punching holes in the wall. */
const POSTERED = reelVideos.filter((r): r is Reel & { poster: string } => Boolean(r.poster));

/* Describes one clip for a screen reader. Built from the hand-checked tagging
   rather than invented per clip.

   NOTE ON WHERE THIS ACTUALLY LANDS: the wall is decorative proof, so ReelWall
   marks the whole container as one image and every clip inside it is
   presentational. These strings are therefore not announced today. They are
   still correct and still worth carrying, because they are what the wall would
   need the moment a clip becomes individually exposed, and because a `poster`
   with no `alt` beside it is the kind of gap that gets shipped. */
function describe(reel: Reel): string {
  const { vertical, format } = tag(reel);
  return `An AI-made ${format.toLowerCase()} ad for a ${vertical.toLowerCase()} brand`;
}

/* Dealt round-robin rather than sliced, so consecutive picks land in DIFFERENT
   columns. takeReels already spreads same-shoot clips far apart in the sequence
   (see lib/reelOrder.ts); dealing across the columns keeps that spread working
   vertically as well as horizontally, which is what stops four near-identical
   doctor spots stacking into one column.

   Pure over module constants, so the server and the client build the identical
   list and nothing hydrates wrong. */
const PICKS = takeReels(POSTERED, 0, COLUMNS * PER_COLUMN);

export const WALL_COLUMNS: WallColumns = Array.from({ length: COLUMNS }, (_, c) =>
  PICKS.filter((_, i) => i % COLUMNS === c).map(
    (reel): WallClip => ({
      src: reel.src,
      poster: reel.poster as string,
      alt: describe(reel),
      id: reel.id,
      hq: reel.hq,
    })
  )
) as WallColumns;

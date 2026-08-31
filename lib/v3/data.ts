/* ============================================================================
   /v3 — the data this page needs and the homepage does not.

   Copy still comes from lib/content.ts, and the clips still come from
   lib/reels.generated.ts. What lives here is the two things v3 adds on top of
   both: the per-clip tagging the work grid filters on, and the four short
   lists (logos, stats, process, objections) that have no home in the existing
   content tree.

   HOUSE RULES CARRIED OVER FROM lib/content.ts. No em dashes, no dollar
   amounts, and never a number or a quote that a client did not actually give
   us. Where this file needs a figure we do not have, it says PLACEHOLDER in
   capitals and the value is obviously a stand-in rather than a plausible
   invention. Search this file for PLACEHOLDER before shipping.
   ========================================================================== */

import { reelVideos, type Reel } from "@/lib/reels.generated";

/* ---------------------------------------------------------------------------
   TAGGING.

   The work grid's whole argument is that a brand marketer scans for their own
   vertical before they look at anything else, so every tile carries one.

   WHAT IS REAL AND WHAT IS NOT. Fourteen of the sixty-eight clips arrived from
   Drive with a filename that says what they are: doctor-in-office-ai-ugc-
   health-product, perfume-blind-test-1, hoodie-ad-podcast-style. Those are
   tagged from the filename in KNOWN below, and those tags are true.

   The other fifty-four are camera-roll names (v3057, v6875) that carry no
   subject at all. They are tagged by placeholder(), which is deterministic so
   the page never reshuffles between server and client, and which is NOT
   knowledge. It is a stand-in for client metadata this repo does not have.
   Replace it by adding rows to KNOWN; the moment every id has one, the
   fallback stops being reached and can be deleted.
   --------------------------------------------------------------------------- */

/** Client vertical. A brand marketer's first filter, and the tag on every tile. */
export type Vertical = "Supplements" | "Skincare" | "Telehealth" | "DTC";

/** Deliverable type, which is what the filter chips switch on. */
export type Format = "Video" | "UGC" | "Static";

export type WorkItem = {
  reel: Reel;
  vertical: Vertical;
  format: Format;
  /** Named client, once one has cleared us to name them. Undefined for all of
      them today: identities are private by request, the same rule the
      testimonials in lib/content.ts run under. The hover overlay falls back to
      the vertical when this is unset, so filling it in is the only change
      needed to start naming clients. */
  client?: string;
  /** Tagged from a filename that actually said something, rather than by the
      placeholder below. Not rendered. It is here so this file can be audited
      by reading the data rather than by reading the comments. */
  derived: boolean;
};

/* The clips whose Drive filename identifies them. Every entry here is read off
   the id and nothing else. */
const KNOWN: Record<string, { vertical: Vertical; format: Format }> = {
  "ai-podcast": { vertical: "DTC", format: "UGC" },
  "ai-ugc-gym-perfume-ad": { vertical: "DTC", format: "UGC" },
  "boyfriend-angle-ai": { vertical: "DTC", format: "UGC" },
  "doctor-and-specialist-podcast-viral-ai-ugc": { vertical: "Telehealth", format: "UGC" },
  "doctor-in-office-ai-ugc-health-product": { vertical: "Telehealth", format: "UGC" },
  "expert-doctor-review-ai-ugc": { vertical: "Telehealth", format: "UGC" },
  "health-product-ai-ugc-1": { vertical: "Supplements", format: "UGC" },
  "hoodie-ad-podcast-style": { vertical: "DTC", format: "UGC" },
  "live-stage-doctor-ai-ugc-health-product": { vertical: "Telehealth", format: "Video" },
  "6th-august-movesmethod": { vertical: "Supplements", format: "Video" },
  "movesmethod-24th-july": { vertical: "Supplements", format: "Video" },
  "movesmethod-30-july": { vertical: "Supplements", format: "Video" },
  "movesmethod-7th-august": { vertical: "Supplements", format: "Video" },
  "perfume-blind-test-1": { vertical: "DTC", format: "UGC" },
};

const VERTICALS: Vertical[] = ["Supplements", "Skincare", "Telehealth", "DTC"];
const FORMATS: Format[] = ["Video", "UGC", "Static"];

/* The same FNV-1a used by lib/reelOrder.ts, for the same reason: it is pure
   and stable, so the tag a clip gets on the server is the tag it gets in the
   browser and nothing hydrates wrong. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* PLACEHOLDER, NOT KNOWLEDGE. Spreads the untagged clips over the four
   verticals and weights the formats 5 : 3 : 2 so the grid has something under
   every chip. Delete this the moment KNOWN covers the library. */
function placeholder(id: string): { vertical: Vertical; format: Format } {
  const h = hash(id);
  const f = h % 10;
  return {
    vertical: VERTICALS[(h >>> 8) % VERTICALS.length],
    format: FORMATS[f < 5 ? 0 : f < 8 ? 1 : 2],
  };
}

export function tag(reel: Reel): WorkItem {
  const known = KNOWN[reel.id];
  return { reel, ...(known ?? placeholder(reel.id)), derived: Boolean(known) };
}

/* How many clips the hero wall mounts. The work grid starts its rotation past
   these, so the catalogue opens on something the wall was not already showing.
   Shared from here because both walls have to agree on it or the offset drifts. */
export const HERO_TILE_COUNT = 18;

export const FILTERS = ["All", ...FORMATS] as const;
export type Filter = (typeof FILTERS)[number];

/* ---------------------------------------------------------------------------
   THE LOGO ROW.

   TODO — REAL CLIENT LOGOS. There are none in the repo (public/ holds one
   file, our own mark), and no client has cleared us to use theirs. Until they
   do, the row runs the categories we actually work in, which is the honest
   version of the same signal: a marketer looking for their own sector finds it
   here whether or not a logo sits next to it. Drop SVGs into public/logos and
   swap this array for them.
   --------------------------------------------------------------------------- */
export const LOGO_CATEGORIES = [
  "Supplements",
  "Skincare",
  "Telehealth",
  "Fitness",
  "Fragrance",
  "Apparel",
  "DTC",
] as const;

/* ---------------------------------------------------------------------------
   THE STATS STRIP.

   Two of the three are sourced. `delivered` counts the public reel library, so
   it is a floor rather than a guess and it can never go stale. `turnaround` is
   the 48 hours already promised in the hero and the FAQ.

   PLACEHOLDER — `brands` is the one figure on this page that nobody in this
   repo knows. It is written as an obvious round stand-in ON PURPOSE, so it
   reads as unfilled rather than as a claim. Put the real count in before this
   route goes public, or cut the third stat.
   --------------------------------------------------------------------------- */
const BRANDS_SERVED = "00"; // PLACEHOLDER — replace with the real number.

export const STATS = [
  { label: "Ads delivered", value: String(reelVideos.length), note: "In the public reel" },
  { label: "First concepts", value: "48h", note: "Brief in to first cuts" },
  { label: "Brands served", value: BRANDS_SERVED, note: "PLACEHOLDER" },
] as const;

/* ---------------------------------------------------------------------------
   PROCESS — THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing
   ships before it is signed off. The number is the information, which is
   exactly why Why us does not get one.

   Every claim here is already made somewhere in lib/content.ts (48 hours in
   the hero, revisions until sign-off and every ratio in pricing, full
   commercial rights in the FAQ). Nothing new is promised.
   --------------------------------------------------------------------------- */
export const PROCESS = [
  {
    title: "Brief in",
    body: "Send a product link and the angle you want. No forms, no onboarding maze. A DM is enough to start.",
  },
  {
    title: "First concepts, 48 hours",
    body: "You review finished cuts, not moodboards. Enough angles to see which direction is worth spending on.",
  },
  {
    title: "Revisions",
    body: "We iterate until you would run it yourself. Sign-off is yours, and there is no cap on getting there.",
  },
  {
    title: "Delivery",
    body: "Every ratio your channels need, no watermarks, full commercial rights, ready for your ad manager.",
  },
] as const;

/* ---------------------------------------------------------------------------
   WHY US — the objections, in the order a buyer actually raises them.

   These pair one to one with the first three pillars in lib/content.ts. They
   exist because this section is explicitly NOT numbered: without some
   structural device the three claims read as a run of paragraphs, and the
   honest device here is the question each one answers. A number would have
   implied a sequence that is not there. A question does not.
   --------------------------------------------------------------------------- */
export const OBJECTIONS = [
  "Will anyone clock it?",
  "How fast can we test?",
  "What does it replace?",
] as const;

/* ---------------------------------------------------------------------------
   Headings in lib/content.ts mark their emphasis with *asterisks* and their
   hard breaks with a newline. v1 ran the marked phrase through the brand
   gradient. That gradient is gone from this page, so the same markup drives
   emphasis by VALUE instead: the line sits in the dim ink and the marked
   phrase comes up to the lit one. Brand emphasis survives, the tell does not.

   split() with one capture group alternates plain, captured, plain, captured,
   so the index parity IS the emphasis and nothing has to be matched twice.
   Empty chunks are kept during the walk and dropped after, because dropping
   them first would shift the parity.
   --------------------------------------------------------------------------- */
export type HeadingPart = { text: string; lit: boolean; br: boolean };

export function parseHeading(raw: string): HeadingPart[] {
  return raw.split("\n").flatMap((line, lineIndex) =>
    line
      .split(/\*([^*]+)\*/g)
      .map((text, i) => ({ text, lit: i % 2 === 1, br: lineIndex > 0 && i === 0 }))
      // A hard break is carried by the first chunk of a line, so an empty
      // first chunk still has to survive if the line opens with emphasis.
      .filter((part) => part.text !== "" || part.br)
  );
}

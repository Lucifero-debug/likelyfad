/* ============================================================================
   /v4 — the data this page needs and lib/content.ts does not carry.

   HOUSE RULES CARRIED OVER FROM lib/content.ts. No em dashes, no dollar
   amounts, and never a number or a quote that a client did not actually give
   us. Where this file needs a figure we do not have, it says so in capitals
   and the value is obviously a stand-in rather than a plausible invention.
   ========================================================================== */

import type { Reel } from "@/lib/reels.generated";

/* ---------------------------------------------------------------------------
   TAGGING.

   Every clip on the playground carries the vertical it was made for, and that
   slug is the reason the drag is worth building: a brand marketer sorting a
   pile of clips is looking for their own sector, so the gesture and the job
   are the same gesture.

   WHAT IS REAL AND WHAT IS NOT. Fourteen of the sixty-eight clips arrived from
   Drive with a filename that says what they are: doctor-in-office-ai-ugc-
   health-product, perfume-blind-test-1, hoodie-ad-podcast-style. Those are
   tagged from the filename in KNOWN below, and those tags are true.

   The rest are camera-roll names (v3057, v6875) that carry no subject at all.
   They are tagged by placeholder(), which is deterministic so the page never
   reshuffles between server and client, and which is NOT knowledge. It is a
   stand-in for client metadata this repo does not have. Replace it by adding
   rows to KNOWN; the moment every id has one, the fallback stops being reached
   and can be deleted.
   --------------------------------------------------------------------------- */
export type Vertical = "Supplements" | "Skincare" | "Telehealth" | "DTC";
export type Format = "Video" | "UGC" | "Static";

export type WorkItem = {
  reel: Reel;
  vertical: Vertical;
  format: Format;
  /** Named client, once one has cleared us to name them. Undefined for all of
      them today: identities are private by request, the same rule the
      testimonials in lib/content.ts run under. */
  client?: string;
  /** Tagged from a filename that actually said something, rather than by the
      placeholder below. Not rendered. It is here so this file can be audited
      by reading the data rather than by reading the comments. */
  derived: boolean;
};

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
   verticals and weights the formats 5 : 3 : 2. Delete this the moment KNOWN
   covers the library. */
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

/* How many clips the playground scatters. Matches LAYOUT in Playground.tsx and
   the two have to agree, so the count lives here and the component reads it. */
export const PLAYGROUND_CLIPS = 9;

/* ---------------------------------------------------------------------------
   SERVICES — a plain list, one line each. No cards and no icons, which on a
   page with no size ramp is not a stylistic preference: a card would be the
   only filled shape in view and would instantly become the loudest thing on
   the page, which is not what a service list is for.

   Nothing here is a new promise. Every line restates something lib/content.ts
   already says: hook-first and sized for every placement in the pillars, the
   four deliverables in the FAQ, hooks staying yours in the ownership answer.
   --------------------------------------------------------------------------- */
export const SERVICES = [
  {
    name: "Video",
    body: "Spokesperson, podcast and story-led spots. Hook first, cut for the feed.",
  },
  {
    name: "UGC",
    body: "Creator-style ads that look filmed on a phone, without booking a creator.",
  },
  {
    name: "Static",
    body: "Single-frame ads, sized for every placement you actually run.",
  },
  {
    name: "Hooks",
    body: "Fresh openings on an ad that already works, so the body keeps earning.",
  },
] as const;

/* ---------------------------------------------------------------------------
   PROCESS — THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing
   ships before it is signed off. The number is the information, which is
   exactly why Why us does not get one.
   --------------------------------------------------------------------------- */
export const PROCESS = [
  {
    title: "Brief",
    body: "Send a product link and the angle you want. No forms, no onboarding maze. A DM is enough to start.",
  },
  {
    title: "Concept",
    body: "First cuts back in about 48 hours. You review finished ads, not moodboards.",
  },
  {
    title: "Revise",
    body: "We iterate until you would run it yourself. Sign-off is yours, and there is no cap on getting there.",
  },
  {
    title: "Deliver",
    body: "Every ratio your channels need, no watermarks, full commercial rights, ready for your ad manager.",
  },
] as const;

/* ---------------------------------------------------------------------------
   WHY US — the objections, in the order a buyer actually raises them.

   These pair one to one with the first three pillars in lib/content.ts. They
   exist because this section is explicitly NOT numbered: without some
   structural device the three claims read as a run of paragraphs, and the
   honest device is the question each one answers. A number would have implied
   a sequence that is not there. A question does not.
   --------------------------------------------------------------------------- */
export const OBJECTIONS = [
  "Will anyone clock it?",
  "How fast can we test?",
  "What does it replace?",
] as const;

/* ---------------------------------------------------------------------------
   THE STUDIO STATEMENT — this page's replacement for a headline.

   Held here rather than in lib/content.ts because it exists only on this
   route: the other two directions open with the hero headline that file
   carries, and this one deliberately has none.
   --------------------------------------------------------------------------- */
export const STATEMENT =
  "Likelyfad is an AI ad production studio. We make video, UGC and static ads that look shot on a real set, for consumer brands that need to test creative every week. First concepts in 48 hours. A human checks every frame. If it reads AI, we cut it before you ever see it.";

/* ---------------------------------------------------------------------------
   THE STUDIO'S OWN DETAILS.

   TODO — NO EMAIL ADDRESS EXISTS IN THIS REPO. The status panel and the footer
   both have an obvious slot for one, and the reference site fills it. Nothing
   is invented to fill ours: lib/site.ts is explicit that the X profile is the
   only real outbound link on this site, so that is the only contact channel
   rendered. Add the address here and both components will pick it up; until
   then a fake mailto on a live page is a worse defect than a missing row.

   The city and the timezone are real, and the timezone is load-bearing rather
   than decorative: a brand in London or New York wants to know when we are
   awake before it sends a brief at 2am.
   --------------------------------------------------------------------------- */
export const STUDIO = {
  city: "Ghaziabad",
  country: "India",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
} as const;

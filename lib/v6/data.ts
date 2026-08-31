/* ============================================================================
   /v6 — the data this page needs and lib/content.ts does not carry.

   HOUSE RULES CARRIED OVER FROM lib/content.ts. No em dashes, no dollar
   amounts, and never a number or a quote that a client did not actually give
   us. Where this file needs a figure nobody in this repo knows, it says so in
   capitals and the value is obviously a stand-in rather than a plausible
   invention.
   ========================================================================== */

import { reelVideos, type Reel } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { tag, type Format, type WorkItem } from "@/lib/v4/data";

/* ---------------------------------------------------------------------------
   WHY THIS FILE IMPORTS FROM lib/v4/data.ts WHEN THE ROUTES OTHERWISE SHARE
   NOTHING.

   The theme files are deliberately separate because a DESIGN decision has to
   be free to differ between directions. `tag` is not a design decision. It is
   a factual mapping from a Drive filename to the vertical and format a clip
   was actually made for, hand-checked over fourteen filenames, and the brief
   says to reuse existing work-item data where it is present. Copying it here
   would mean two routes disagreeing about what a clip IS the first time either
   list is corrected. /v5 imports it for the same reason.

   Nothing in v4 is modified by importing from it, which is what the rule about
   not touching the other routes actually asks for.
   --------------------------------------------------------------------------- */
export type { WorkItem, Format };

/* ---------------------------------------------------------------------------
   THE HERO CLIP.

   PICKED BY ID, NOT BY POSITION. reels.generated.ts is rewritten by the Drive
   sync on every run and the url suffixes change each time; the id is the only
   field that survives one. Taking reelVideos[0] would silently hand the hero
   to whatever happens to sort first the next time a file is added.

   WHY THIS CLIP. Nearly every ad in the library carries burned-in captions,
   because that is what performance creative looks like. This headline is
   CENTRED, which puts it exactly where those captions sit — so a caption-heavy
   clip would put two competing headlines in the same rectangle and the page
   would lose both. This one is photoreal, has no caption at all, and holds its
   subject high in the frame.

   It is also the strongest available answer to the only question the hero has
   to settle in the first second, which is whether the work reads as real. A
   frame nobody would think to question is worth more here than the ad with the
   best ROAS, because the hero is not selling the offer yet.

   THE HERO USES THE `hq` CUT. Everywhere else `src` is correct: it is a
   288x512 tile cut, exactly right for something rendered small. Full-bleed
   across a 1440 viewport it would be upscaled five times over and the hero
   would be the blurriest thing on a page whose whole argument is that the work
   looks shot on a real set. `hq` is null when the sync ran without ffmpeg, so
   `src` remains the fallback and the poster covers the gap either way.
   --------------------------------------------------------------------------- */
const HERO_ID = "v3532";

export const HERO_REEL: Reel = reelVideos.find((r) => r.id === HERO_ID) ?? reelVideos[0];

/** What a full-bleed band should load. See the note above. */
export const bleedSrc = (reel: Reel) => reel.hq ?? reel.src;

/* The closing band. A different clip from the hero, so the close echoes the
   opening without replaying it, and filtered so it can never BE the hero reel
   even if the id below stops existing. */
const CLOSE_ID = "ai-podcast";

export const CLOSE_REEL: Reel =
  reelVideos.find((r) => r.id === CLOSE_ID && r.id !== HERO_REEL.id) ??
  reelVideos.find((r) => r.id !== HERO_REEL.id) ??
  reelVideos[0];

/* ---------------------------------------------------------------------------
   WHERE THE CROP KEEPS ITS SUBJECT.

   A 9:16 clip in a landscape band shows about a third of its own height, and
   object-fit defaults to the MIDDLE third. On a full-height hero that middle
   third is somebody's torso: the head is cropped off the top, and the one
   thing a visitor is actually judging — whether the face reads as real, which
   is the hardest thing for this to get right and therefore the whole proof —
   never appears above the fold.

   These are per-clip and have to be: they are a fact about where the subject
   sits in one particular frame, not a global preference. They live beside the
   ids they belong to so changing a clip and forgetting its focus is one edit
   rather than two files apart. Verify by eye after a swap.
   --------------------------------------------------------------------------- */
export const HERO_FOCUS = "object-[50%_18%]";
export const CLOSE_FOCUS = "object-[50%_25%]";

/* ---------------------------------------------------------------------------
   THE CYCLING LINE — "Make it ______".

   THE REFERENCE CYCLES VISUAL STYLES because its users pick a style from a
   menu and then operate the tool themselves. We cycle CLIENT VERTICALS,
   because our visitor is a brand marketer and the first thing they look for on
   any agency page is whether we have worked in their category. Same mechanic,
   pointed at the question our visitor is actually asking rather than at the
   one the reference's visitor asks.

   THE FOUR ARE THE FOUR IN lib/v4/data.ts, not a longer invented list. Those
   are the verticals the work is actually tagged against, so every word that
   appears here is answerable by the grid further down the page.
   --------------------------------------------------------------------------- */
export const CYCLE = ["Supplements", "Skincare", "Telehealth", "DTC"] as const;

/** How long each word holds before the next one takes over. Long enough to
    read twice, which is what stops it reading as a slot machine. */
export const CYCLE_MS = 2200;

/* ---------------------------------------------------------------------------
   THE BENTO GRID — what we make.

   THE REFERENCE'S GRID IS TOOL CAPABILITIES: "AI Image Generator", "Keyframe
   Control", "Style Presets". Every one of those is a thing the visitor would
   operate. Ours are DELIVERABLES — things that arrive finished. That is the
   whole difference between the two business models expressed in four cards,
   and it is why the titles here are nouns you receive rather than verbs you
   perform.

   Nothing here is a new promise. Every line restates something lib/content.ts
   already says: hook-first and sized for every placement in the pillars, the
   four deliverables in the FAQ, hooks staying yours in the ownership answer.

   `span` is the card's width on the six-column desktop grid. Two wide, two
   narrow, alternating — which is what makes it a bento rather than a row.
   `clip` names the reel that loops inside the card, picked so each card shows
   work of the format it is describing.
   --------------------------------------------------------------------------- */
export const BENTO = [
  {
    title: "Video",
    body: "Spokesperson, podcast and story-led spots. Hook first, cut for the feed.",
    span: "lap:col-span-4",
    clip: "live-stage-doctor-ai-ugc-health-product",
    still: false,
  },
  {
    title: "UGC",
    body: "Creator-style ads that look filmed on a phone, without booking a creator.",
    span: "lap:col-span-2",
    clip: "ai-ugc-gym-perfume-ad",
    still: false,
  },
  {
    title: "Static",
    body: "Single-frame ads, sized for every placement you actually run.",
    span: "lap:col-span-2",
    clip: "perfume-blind-test-1",
    /* THE ONE CARD THAT DOES NOT MOVE, and the reason is the card's own
       claim. A Static card playing a looping video says the opposite of the
       word printed above it, which is precisely the "describes one thing while
       showing another" failure the note at the top of Bento.tsx warns about.
       Rendering the poster frame alone is both honest and self-demonstrating:
       the single-frame ad is shown as a single frame. */
    still: true,
  },
  {
    title: "Hooks",
    body: "Fresh openings on an ad that already works, so the body keeps earning.",
    span: "lap:col-span-4",
    clip: "boyfriend-angle-ai",
    still: false,
  },
] as const;

/** Resolves a bento card's clip by id, falling back to the spread order so a
    renamed file degrades to a different clip rather than to an empty card. */
export function bentoReel(id: string, fallbackIndex: number): Reel {
  return reelVideos.find((r) => r.id === id) ?? takeReels(reelVideos, fallbackIndex, 1)[0];
}

/* ---------------------------------------------------------------------------
   WHY US — three claims, verbatim from the brief.

   NOT NUMBERED, and the absence is the decision. These are three independent
   reasons and there is no order in which you have to accept them; a number
   would assert a sequence that is not there. The process section below is the
   proof by contrast — there the order is real, so there the numbers stay.

   NOT CARDS EITHER. The bento grid above already spent the card treatment, and
   a second grid of dark rounded boxes twelve hundred pixels later would flatten
   the page into one texture. These sit on the open ground with space around
   them.
   --------------------------------------------------------------------------- */
export const WHY = {
  headline: "The reason brands actually keep us.",
  sub: "One question decides this: why trust an AI studio with the creative that spends your money. Here is the honest case.",
  claims: [
    {
      title: "It looks real, or it doesn't ship",
      body: "Every frame is built to pass as a real shoot. Natural skin, hands, lighting, lip-sync. If it reads AI, we cut it before you ever see it.",
    },
    {
      title: "Days, not weeks",
      body: "Send a brief today, review first concepts in about 48 hours. Create at the speed your ad account actually moves.",
    },
    {
      title: "A fraction of the cost",
      body: "No crew, no location, no reshoots. You pay for the output, not the overhead, so you can finally afford to test more.",
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
   PROCESS — THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing
   ships before it is signed off. The number IS the information here, which is
   exactly why Why us above does not get one.
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
   PRICING — PRODUCTIZED TIERS, AND THE ONE PLACE THIS BRIEF AND THIS REPO
   PULL AGAINST EACH OTHER. Written out rather than quietly resolved.

   The brief asks for productized tiers with a stated turnaround rather than
   "contact for a quote". The house rules at the top of lib/content.ts forbid
   dollar amounts anywhere on this site, and lib/content.ts itself says in as
   many words "Priced to your brief, not a package".

   HOW BOTH ARE HONOURED. A tier is a defined SCOPE with a defined CLOCK. It
   does not require a price to be a tier — it requires you to know what you get
   and when. So each tier below states what arrives and how fast, and the
   number still comes back the same day, which is what lib/content.ts already
   promises. What is refused is the invented part: three made-up monthly
   figures under three made-up names, which is the kind of thing a landing page
   can fake and a service business cannot.

   EVERY SCOPE HERE IS SOURCED FROM COPY THAT ALREADY EXISTS.
     - "one paid test, full refund if you would not run it" is the FAQ answer
       to "What if I don't like the first batch?", verbatim in substance.
     - "20 to 40 distinct variants a month" is the fourth why-us pillar in
       lib/content.ts.
     - "monthly retainer sized to how much you test" is content.pricing.body.
     - 48 hours is the hero, the FAQ and the process, everywhere.
   Nothing in this list is a new commercial promise. If real numbers arrive,
   add a `price` field and the component renders it without restructuring.
   --------------------------------------------------------------------------- */
export const TIERS = [
  {
    name: "Single test",
    scope: "One angle, produced and delivered as a finished ad you could run tomorrow.",
    turnaround: "First concepts in 48 hours",
    includes: [
      "One paid test to start",
      "Full refund if you would not run it",
      "Every ratio your channels need",
    ],
    featured: false,
  },
  {
    name: "Batch",
    scope: "A set of distinct angles for one product, so you learn which direction wins before you spend on media.",
    turnaround: "First concepts in 48 hours",
    includes: [
      "Multiple angles per product",
      "Revisions until you sign off",
      "Hook variants on whatever wins",
    ],
    featured: true,
  },
  {
    name: "Monthly",
    scope: "A retainer sized to how much you actually test, running 20 to 40 distinct variants a month.",
    turnaround: "Rolling delivery every week",
    includes: [
      "20 to 40 variants a month",
      "Video, UGC and statics together",
      "Full commercial rights, yours to keep",
    ],
    featured: false,
  },
] as const;

/* Rendered under the tiers. The honest replacement for a price row, and it is
   a promise this repo already makes rather than a new one. */
export const PRICING_FOOT = "Most brands get a number back the same day.";

/* ---------------------------------------------------------------------------
   THE FLOATING WIDGET.

   THE REFERENCE PUTS A DISCOUNT CODE HERE ("V2 Launch 30% OFF"). We have no
   discount, no code and no launch, and inventing one would be the single
   cheapest-looking thing on the page. The slot is worth keeping because a
   small persistent card in the corner is genuinely useful; what goes in it is
   our strongest single line, which is the clock.
   --------------------------------------------------------------------------- */
export const WIDGET = {
  title: "First concepts in 48 hours",
  body: "Send a product link and the angle you want.",
  cta: "DM us",
} as const;

/* ---------------------------------------------------------------------------
   THE WORK GALLERY.

   The two clips already burning screen time in the two full-bleed bands are
   filtered out BY IDENTITY rather than by offsetting past them: takeReels'
   offset counts into its own SPREAD order, which is not the order of
   reelVideos, so an index taken from the raw list would skip an arbitrary clip
   and still leave the hero reel in the grid. One extra is requested and the
   two are removed by id, which is the only field that survives a Drive sync.

   THE CLUSTER TAKES THE FIRST FIVE. Five is the most that can fan at slight
   angles and still have every card readable; at six the outermost pair have to
   tilt far enough that they read as fallen over rather than as dealt.
   --------------------------------------------------------------------------- */
export const CLUSTER_COUNT = 5;
export const GRID_VISIBLE = 8;

const SHOWN_ELSEWHERE = new Set([HERO_REEL.id, CLOSE_REEL.id]);

export const WORK_ITEMS: WorkItem[] = takeReels(reelVideos, 0, 26)
  .filter((reel) => !SHOWN_ELSEWHERE.has(reel.id))
  .slice(0, 24)
  .map(tag);

export const CLUSTER_ITEMS: WorkItem[] = WORK_ITEMS.slice(0, CLUSTER_COUNT);

/** The filter chips, in the order the brief lists them. "All" is not a format,
    so it is held as null rather than as a fourth Format. */
export const FILTERS: { label: string; value: Format | null }[] = [
  { label: "All", value: null },
  { label: "Video", value: "Video" },
  { label: "UGC", value: "UGC" },
  { label: "Static", value: "Static" },
];

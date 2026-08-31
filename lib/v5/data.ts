/* ============================================================================
   /v5 — the data this page needs and lib/content.ts does not carry.

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
   WHY THIS FILE IMPORTS FROM lib/v4/data.ts, WHEN THE FOUR ROUTES OTHERWISE
   SHARE NOTHING.

   The four theme files are deliberately separate because a DESIGN decision has
   to be free to differ between directions. `tag` is not a design decision. It
   is a factual mapping from a Drive filename to the vertical and format the
   clip was actually made for, hand-checked over fourteen filenames, and the
   brief explicitly says to reuse existing work-item data where it is present.
   Copying eighty lines of it here would mean the two routes disagree about
   what a clip IS the first time either list is corrected.

   Nothing in v4 is modified by this import, which is what the brief's rule
   about not touching the other routes actually asks for.
   --------------------------------------------------------------------------- */
export type { WorkItem, Format };

/* ---------------------------------------------------------------------------
   THE YEAR IN THE SECTION HEADER ROWS.

   A LITERAL, NOT `new Date().getFullYear()`. Rendering the live year would
   compute it once on the server and again in the browser, and a page prerendered
   on the 31st of December and read on the 1st of January hydrates with two
   different strings in six places at once. It is also not the kind of thing
   that should silently change without anyone editing the site: the year in a
   colophon is a statement about the document, and a document that quietly
   re-dates itself every January is claiming to have been revised when it was
   not. Bump it by hand.
   --------------------------------------------------------------------------- */
export const YEAR = "2026";

/* The hero's element id. Nav.tsx watches this element to know when it has
   scrolled past the dark band and has to swap to its light state, so the two
   components have to agree on the string. Held here rather than typed into
   both, because a typo in one of them fails silently: the nav would simply
   stay transparent forever and be unreadable over the white sections. */
export const HERO_SECTION_ID = "v5-hero";

/* ---------------------------------------------------------------------------
   THE SECTION INDEX.

   The spine of the whole page: six hairline header rows, each carrying its own
   number, and the numbers only mean anything if they are consecutive and if no
   two sections claim the same one. Held here as one list rather than typed into
   six components, so that stays true when a section is added or reordered.

   The brief specifies 01 through 04. Pricing and FAQ continue the run, because
   a document that numbers four of its six sections and then stops has not made
   a decision, it has run out.
   --------------------------------------------------------------------------- */
export const SECTIONS = {
  studio: { index: "01", name: "Studio" },
  work: { index: "02", name: "Work" },
  why: { index: "03", name: "Why us" },
  process: { index: "04", name: "Process" },
  pricing: { index: "05", name: "Pricing" },
  faq: { index: "06", name: "FAQ" },
} as const;

/* ---------------------------------------------------------------------------
   THE HERO CLIP.

   PICKED BY ID, NOT BY POSITION. reels.generated.ts is rewritten by the Drive
   sync on every run and the url suffixes change each time; the id is the only
   field that survives one. Taking `reelVideos[0]` would silently hand the hero
   to whatever happens to sort first the next time a file is added.

   THE HERO USES THE `hq` CUT. Everywhere else on this site `src` is correct —
   it is a 288x512 tile cut, which is exactly right for something rendered at
   132px wide. Full-bleed across a 1440 viewport it would be upscaled five
   times over and the hero would be the blurriest thing on a page whose entire
   argument is that the work looks shot on a real set. `hq` is null when the
   sync ran without ffmpeg, so `src` is still the fallback and the poster still
   covers the gap either way.

   THESE CLIPS ARE 9:16 AND THE HERO IS LANDSCAPE, so object-cover crops hard
   at the sides on a desktop viewport. That is the right trade here: the
   alternative is letterboxing the one piece of evidence above the fold. It is
   also why the corner furniture is pinned to the corners rather than laid over
   the middle, which is where the crop keeps the subject.

   WHY THIS CLIP AND NOT A BETTER-PERFORMING ONE. Nearly every ad in the
   library carries burned-in captions, because that is what performance
   creative looks like. Full-bleed behind a 120px wordmark those captions are a
   second headline fighting the first, and the page loses both. This one is
   photoreal, has no caption at all, and holds its subject high in the frame,
   which is precisely where the lower third stays clear for the wordmark.

   It is also the strongest possible answer to the only question this hero has
   to settle in the first second, which is whether the work reads as real. A
   red-carpet frame that nobody would think to question is worth more here than
   the ad with the best ROAS, because the hero is not selling the offer yet. If
   a clip arrives that is both caption-free and better, swap the id.
   --------------------------------------------------------------------------- */
const HERO_ID = "v3532";

export const HERO_REEL: Reel =
  reelVideos.find((r) => r.id === HERO_ID) ?? reelVideos[0];

/** What the hero should actually load. See the note above. */
export const heroSrc = (reel: Reel) => reel.hq ?? reel.src;

/* ---------------------------------------------------------------------------
   WHERE THE CROP KEEPS ITS SUBJECT.

   A 9:16 clip in a landscape band shows about a third of its own height, and
   object-fit defaults to the MIDDLE third. On a full-height hero that middle
   third is somebody's torso: the head is cropped off the top, and the one
   thing a visitor is actually judging — whether the face reads as real, which
   is the hardest thing for this to get right and therefore the whole proof —
   never appears above the fold.

   These are per-clip, and they have to be: they are a fact about where the
   subject sits in a particular frame, not a global preference. They live
   beside the ids they belong to so that changing a clip and forgetting its
   focus is one edit rather than two files apart. Verify by eye after a swap.
   --------------------------------------------------------------------------- */
export const HERO_FOCUS = "object-[50%_18%]";
export const CLOSE_FOCUS = "object-[50%_25%]";

/* ---------------------------------------------------------------------------
   THE CLOSING CLIP. A different one from the hero, so the closing band echoes
   the opening without replaying it. Same id-not-position rule, and the filter
   guarantees it is never the hero clip even if the id below stops existing.
   --------------------------------------------------------------------------- */
const CLOSE_ID = "ai-podcast";

export const CLOSE_REEL: Reel =
  reelVideos.find((r) => r.id === CLOSE_ID && r.id !== HERO_REEL.id) ??
  reelVideos.find((r) => r.id !== HERO_REEL.id) ??
  reelVideos[0];

/* ---------------------------------------------------------------------------
   THE FOUNDER CARD — the floating personnel card, top-right of the hero.

   TODO — THERE IS NO PORTRAIT IN THIS REPO. public/ holds six files and one of
   them is our own icon; none of them is a photograph of a person. The card
   renders a monogram tile until a real portrait is dropped in at
   public/founder.jpg and `portrait` below is pointed at it. Nothing else in
   this file or in the component has to change.

   A STOCK HEADSHOT WOULD BE THE WORST POSSIBLE DEFECT ON THIS PARTICULAR PAGE.
   The whole pitch is that our output does not read as synthetic, and the one
   human face on the site being a stranger from a stock library — or worse, a
   generated one — is the single fastest way to lose that argument. A monogram
   is obviously a placeholder. A face is a lie.

   THE NAME IS NOT INVENTED EITHER. lib/site.ts is explicit that the X profile
   is the only real outbound link on this site, and the handle there is the
   only identity this repo actually knows. So the card carries the handle and
   the role, and links to the same profile every other CTA goes to. Put a real
   name in `name` when there is one to put.
   --------------------------------------------------------------------------- */
export const FOUNDER = {
  name: "@amanxdesign",
  role: "Founder",
  /** TODO — real portrait. See the note above. */
  portrait: null as string | null,
  /** Rendered in the tile while `portrait` is null. */
  monogram: "L",
} as const;

/* ---------------------------------------------------------------------------
   THE HERO'S CORNER FURNITURE. Small mono details tucked into the corners,
   which is the detail that does the most to make the hero read as a document
   rather than as a slide.
   --------------------------------------------------------------------------- */
export const HERO = {
  pitch: "Send a brief, and your first concepts kick off within 48 hours.",
  link: { label: "Explore work", href: "#work" },
  services: "01/ Video · UGC · Static",
  /* Not a claim, and deliberately not a number: it names what the clip behind
     it is, which is the one thing a visitor looking at a full-bleed video
     actually wants told. */
  utility: "Reel 01 · AI generated · No camera",
} as const;

/* ---------------------------------------------------------------------------
   THE STUDIO STATEMENT — one giant sentence, doing the work of an about
   section on its own. Given verbatim in the brief.

   Held here rather than in lib/content.ts because it exists only on this
   route: the other three directions each carry their own version of this line
   and none of them is this one.
   --------------------------------------------------------------------------- */
export const STATEMENT =
  "An AI production studio making video, UGC and statics that look shot on a real set, fast enough to test every week, clean enough to run straight into paid.";

/* ---------------------------------------------------------------------------
   THE STATS.

   Two of the three are sourced. `delivered` counts the public reel library, so
   it is a floor rather than a guess and it can never go stale. `turnaround` is
   the 48 hours already promised in the hero, the FAQ and the process.

   PLACEHOLDER — `brands` is the one figure nobody in this repo knows. It is
   written as an obvious stand-in ON PURPOSE, so it reads as unfilled rather
   than as a claim, and the note renders on the page rather than living only in
   this comment. Put the real count in, or cut the third row, before this route
   goes public.
   --------------------------------------------------------------------------- */
const BRANDS_SERVED = "00"; // PLACEHOLDER — replace with the real number.

export const STATS = [
  { label: "Ads delivered", value: String(reelVideos.length), note: "In the public reel" },
  { label: "Average turnaround", value: "48h", note: "Brief in to first cuts" },
  { label: "Brands served", value: BRANDS_SERVED, note: "PLACEHOLDER" },
] as const;

/* ---------------------------------------------------------------------------
   THE LOGO MARQUEE.

   TODO — REAL CLIENT LOGOS. There are none in this repo, and no client has
   cleared us to use theirs; every identity on this site is private by request,
   which is the same rule the testimonials in lib/content.ts run under. Until
   that changes, each box carries the sector instead, which is the honest
   version of the same signal: a marketer looking for their own category finds
   it here whether or not a logo sits beside it.

   Drop SVGs into public/logos, swap this list for them, and add `grayscale` to
   the lane. Nothing else in the component has to change.

   SEVEN AND NOT THE FOUR THE BRIEF NAMES. The lane renders its list twice and
   slides by exactly half its own width, so the track has to be wider than two
   viewports or the loop shows a gap on a wide screen. Four boxes is about
   800px of track; seven clears 1920 with room. The brief's four are all here.
   --------------------------------------------------------------------------- */
export const VERTICALS = [
  "Supplements",
  "Skincare",
  "Telehealth",
  "DTC",
  "Fitness",
  "Fragrance",
  "Apparel",
] as const;

/* ---------------------------------------------------------------------------
   WHY US — the three claims, verbatim from the brief.

   THIS SECTION IS NOT NUMBERED, and the absence is the decision. The section
   header row above it already carries (03); numbering the three claims inside
   it as 01 / 02 / 03 would be a second index in the same eyeful, saying
   nothing the first one did not. Worse, it would imply a sequence: these are
   three independent reasons and there is no order in which you have to accept
   them. A number that carries no information is decoration pretending to be
   structure, which is precisely what the process section below proves by
   contrast — there the order is real, so there the numbers stay.
   --------------------------------------------------------------------------- */
export const WHY = [
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
] as const;

/* ---------------------------------------------------------------------------
   PROCESS — THE ONE SECTION ON THIS PAGE THAT IS NUMBERED.

   The order is real: nothing is revised before it is briefed, and nothing
   ships before it is signed off. The number IS the information here, which is
   exactly why Why us above does not get one.

   Every claim restates something lib/content.ts already says. Nothing new is
   promised: 48 hours from the hero, revisions until sign-off and every ratio
   from pricing, full commercial rights from the FAQ.
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
   THE WORK GRID.

   takeReels spreads the library so two clips from the same shoot never land
   next to each other, then wraps, so nothing is dropped and nothing repeats.

   THE TWO CLIPS ALREADY ON THE PAGE ARE FILTERED OUT BY IDENTITY, not by
   offsetting past them. takeReels' offset counts into its own SPREAD order,
   which is not the order of reelVideos, so an index taken from the raw list
   would skip an arbitrary clip and still leave the hero reel in the grid. One
   extra is requested and the two are removed by id, which is the only field
   that survives a Drive sync.

   TWENTY-FOUR, SHOWN EIGHT AT A TIME. See Work.tsx for why "Explore all"
   expands the grid rather than linking somewhere: there is no /work page in
   this repo, and a dead link on the one section carrying the evidence is worse
   than no link at all.
   --------------------------------------------------------------------------- */
export const WORK_VISIBLE = 8;

const SHOWN_ELSEWHERE = new Set([HERO_REEL.id, CLOSE_REEL.id]);

export const WORK_ITEMS: WorkItem[] = takeReels(reelVideos, 0, 26)
  .filter((reel) => !SHOWN_ELSEWHERE.has(reel.id))
  .slice(0, 24)
  .map(tag);

/** The filter chips, in the order the brief lists them. "All" is not a format,
    so it is held as null rather than as a fifth Format. */
export const FILTERS: { label: string; value: Format | null }[] = [
  { label: "All", value: null },
  { label: "Video", value: "Video" },
  { label: "UGC", value: "UGC" },
  { label: "Static", value: "Static" },
];

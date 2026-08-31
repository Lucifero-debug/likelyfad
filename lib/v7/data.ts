/* ============================================================================
   /v7 — the data this page needs and lib/content.ts does not carry.

   HOUSE RULES CARRIED OVER FROM lib/content.ts. No em dashes in copy, no
   dollar amounts, and never a number or a quote a client did not actually give
   us. Where this file needs a figure nobody in this repo knows, it says so in
   capitals and no plausible-looking stand-in is written into the page.
   ========================================================================== */

import { reelVideos, type Reel } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { OBJECTIONS, PROCESS, SERVICES, STUDIO, tag, type Format, type WorkItem } from "@/lib/v4/data";

/* ---------------------------------------------------------------------------
   WHY THIS FILE IMPORTS FROM lib/v4/data.ts WHEN THE ROUTES OTHERWISE SHARE
   NOTHING. Same argument /v5 and /v6 already make, and for the same reason.

   The theme files are deliberately separate because a DESIGN decision has to
   be free to differ between directions. None of these five is a design
   decision. `tag` is a factual mapping from a Drive filename to the vertical
   and format a clip was actually made for. SERVICES, PROCESS and OBJECTIONS
   are copy, already written and already approved. STUDIO is where we are and
   what time it is here. The brief says to reuse existing data where it is
   present, and copying any of it here would mean two routes disagreeing about
   a fact the first time either list is corrected.

   Nothing in v4 is modified by importing from it, which is what the rule about
   not touching the other routes actually asks for.
   --------------------------------------------------------------------------- */
export { OBJECTIONS, PROCESS, SERVICES, STUDIO };
export type { WorkItem, Format };

/* ---------------------------------------------------------------------------
   THE HERO CLIP.

   PICKED BY ID, NOT BY POSITION. reels.generated.ts is rewritten by the Drive
   sync on every run and the url suffixes change each time; the id is the only
   field that survives one. Taking reelVideos[0] would silently hand the hero
   to whatever happens to sort first the next time a file is added.

   WHY THIS CLIP, AND IT IS THE SAME ONE /v6 USES. Nearly every ad in the
   library carries burned-in captions, because that is what performance
   creative looks like. This headline is CENTRED and set at 80px, which puts it
   exactly where those captions sit, so a caption-heavy clip would put two
   competing headlines in one rectangle and the page would lose both. This clip
   has no caption at all, is photoreal, and holds its subject high in the
   frame. That is a fact about the footage rather than a decision /v6 made, so
   two routes reaching the same clip from the same constraint is agreement, not
   duplication.

   THE HERO USES THE `hq` CUT. Everywhere else `src` is correct: it is a
   288x512 tile cut, exactly right for something rendered small. Full bleed
   across a 1440 viewport it would be upscaled five times over and the hero
   would be the blurriest thing on a page whose whole argument is that the work
   looks shot on a real set. `hq` is null when the sync ran without ffmpeg, so
   `src` remains the fallback and the poster covers the gap either way.
   --------------------------------------------------------------------------- */
const HERO_ID = "v3532";

export const HERO_REEL: Reel = reelVideos.find((r) => r.id === HERO_ID) ?? reelVideos[0];

/** What a full-bleed band should load. See the note above. */
export const bleedSrc = (reel: Reel) => reel.hq ?? reel.src;

/* WHERE THE CROP KEEPS ITS SUBJECT. A 9:16 clip in a landscape band shows
   about a third of its own height, and object-fit defaults to the MIDDLE
   third. On a full-height hero that middle third is somebody's torso: the head
   is cropped off the top, and the one thing a visitor is actually judging —
   whether the face reads as real — never appears above the fold. This is a
   fact about one particular frame, so it lives beside the id it belongs to.
   Verify by eye after a swap. */
export const HERO_FOCUS = "object-[50%_18%]";

/* ---------------------------------------------------------------------------
   THE STICKER LABELS — the signature of this page.

   FOUR FORMATS, NOT A TAGLINE. The reference tapes three discipline labels
   over its headline (UI/UX Design, Illustration, 3D Design) because a
   freelancer is telling you what they can be hired for. Ours name what arrives
   finished, and they are the four words a brand marketer is actually scanning
   the top of an ad studio's site for. Delivered as pinned tags rather than as
   a bullet list under the hero, which is where every competitor puts them.

   THESE FOUR AND NOT MORE. Every one of them is answerable further down the
   page: Video, UGC and Static are the three formats the work grid filters on,
   and Hooks is the fourth service in SERVICES. A fifth sticker would be a
   promise with nothing under it.

   `at` is the sticker's anchor inside the headline box, as PERCENTAGES, so the
   cluster tracks the headline as it reflows rather than being pinned to pixel
   positions that only hold at one width. Every one of them carries the `tab:`
   prefix and none has an unprefixed position, which is what makes the narrow
   fallback pure CSS: below 761px the container is a wrapped flex row in normal
   flow and these do nothing at all.

   THE FALLBACK IS CSS AND NOT A JS BRANCH ON PURPOSE. Rendering one set for
   phones and another for desktops would either duplicate all four labels in
   the DOM — a screen reader reading the formats twice — or flash the wrong
   layout for a frame while the media query resolves after hydration. One set
   of four elements, repositioned by breakpoint, has neither problem.

   `spin` is unprefixed and applies at every width. A slight angle reads as
   correct in the wrapped row too, and it is the tilt more than the position
   that makes these read as tags rather than as chips.
   --------------------------------------------------------------------------- */
export const STICKERS = [
  { label: "Video", at: "tab:left-0 tab:top-[2%]", spin: "-rotate-[3deg]" },
  { label: "UGC", at: "tab:right-0 tab:top-[24%]", spin: "rotate-[2.5deg]" },
  { label: "Static", at: "tab:left-[4%] tab:bottom-[18%]", spin: "rotate-[2deg]" },
  { label: "Hooks", at: "tab:right-[6%] tab:bottom-0", spin: "-rotate-[2.5deg]" },
] as const;

/* ---------------------------------------------------------------------------
   THE STATS — three pinned cards.

   TODO, AND IT IS THE HONEST KIND. The brief asks for ADS DELIVERED and BRANDS
   SERVED. NOBODY IN THIS REPO KNOWS EITHER NUMBER. lib/content.ts opens with a
   house rule that no number is ever invented, and a plausible-looking "200+
   ads delivered" on a live page is precisely the failure that rule exists to
   prevent — it is also the single easiest claim on a page like this for a
   prospect to check and find hollow.

   So the three figures below are the three this repo can actually source, and
   every one of them traces to copy that already exists:
     48 hours   — content.hero.reassurance, and the FAQ answer about the first
                  batch, and the Concept step in PROCESS
     20 to 40   — content.why.pillars, the "Angles, not one bet" pillar
     Every      — content.hero.reassurance, "A human checks every frame", which
                  is a claim about coverage rather than a count, and is set as
                  a word for exactly that reason

   ADD THE REAL COUNTS HERE when someone knows them and the third card can move
   aside. The component reads this array and renders whatever length it finds,
   so it is a one-line change and no markup moves.
   --------------------------------------------------------------------------- */
export const STATS = [
  { figure: "48 hrs", label: "To first concepts, from a brief" },
  { figure: "20 to 40", label: "Distinct variants a month" },
  { figure: "Every", label: "Frame checked by a person before it ships" },
] as const;

/* ---------------------------------------------------------------------------
   THE WORK GRID.

   Tagged from the same hand-checked mapping /v4, /v5 and /v6 read, and spread
   so two clips from the same shoot never land next to each other — see
   lib/reelOrder.ts for why that matters more than it sounds like it does.
   --------------------------------------------------------------------------- */
export const WORK_ITEMS: WorkItem[] = takeReels(reelVideos, 0, 24).map(tag);

/** How many tiles show before "Show all" expands the rest. Twelve fills three
    rows at the widest breakpoint and six at a phone, so the fold lands on a
    complete row rather than halfway through one at every width. */
export const GRID_VISIBLE = 12;

/* The chips. `null` is All, which is a real state rather than a fourth format,
   so the value is the filter itself rather than a string the component then
   has to special-case. */
export const FILTERS: { label: string; value: Format | null }[] = [
  { label: "All", value: null },
  { label: "Video", value: "Video" },
  { label: "UGC", value: "UGC" },
  { label: "Static", value: "Static" },
];

/* ---------------------------------------------------------------------------
   THE CASE STACK — the deck of work peeking in from the hero's bottom corner.

   THE REFERENCE'S CARD SHOWS TOOL, YEAR AND CLIENT NAME. We can show one of
   those three.

   NO CLIENT NAME. Every identity in this repo is private by request — see the
   note on WorkItem.client in lib/v4/data.ts, where the field exists and is
   undefined for all fourteen tagged clips, and the same rule the testimonials
   in lib/content.ts run under. A made-up brand name on a portfolio card is a
   lie a prospect can check in one search.

   NO YEAR EITHER, WHICH IS THE LESS OBVIOUS ONE. The clips are named by
   delivery date — "24th july", "6th august" — and not one of those filenames
   carries a year. Printing one would be a guess rendered as a fact on the card
   whose entire job is to look like a real case study.

   WHAT IS LEFT IS TRUE AND IS ALSO WHAT A BRAND MARKETER IS ACTUALLY SCANNING
   FOR: the vertical the ad was made for and the format it was delivered in.
   The stack is decorative and aria-hidden — every clip in it appears again in
   the work grid, tagged the same way and reachable by keyboard, which is why
   it can be dropped entirely at narrow widths without costing anything.
   --------------------------------------------------------------------------- */
export const CASE_STACK: WorkItem[] = takeReels(reelVideos, 24, 3).map(tag);

/* ---------------------------------------------------------------------------
   THE CLOSING SECTION'S CONTACT ROWS.

   TODO — NO EMAIL ADDRESS EXISTS IN THIS REPO, and lib/site.ts is explicit
   that the X profile is the only real outbound link on this site. The closing
   section has an obvious slot for an address and the reference site fills its
   equivalent; nothing is invented to fill ours. A fake mailto on a live page
   is a worse defect than a missing row. Add it to lib/v4/data.ts STUDIO and
   this section will have somewhere to put it.

   The city and the timezone are real, and the timezone is load-bearing rather
   than decorative: a brand in London or New York wants to know when we are
   awake before it sends a brief at 2am.
   --------------------------------------------------------------------------- */
export const CLOSE_KICKER = "Contact";

/* ---------------------------------------------------------------------------
   THE COPY THIS ROUTE ADDS.

   Everything else on this page comes out of lib/content.ts or lib/v4/data.ts.
   These four strings do not exist there because they belong to shapes only
   this direction has, and every one of them is checked against the two house
   rules: first person plural or no person at all, and no claim that is not
   already made somewhere in this repo.

   THE STATUS PILL IS THE LINE THAT MOST NEEDED CHANGING. The reference's
   equivalent says "Available for work" under a photograph of one person, which
   is a freelancer signalling they are between jobs. Run at a studio pitching
   for campaign spend that reads as "nobody is hiring us", which is the exact
   opposite of the signal it is placed there to send. "Taking briefs" says the
   door is open and says it in the language of the transaction the visitor is
   actually considering.

   THE AVATAR IS THE STUDIO MARK, NOT A FACE. There is no founder photograph in
   this repo, and a stock portrait on a page whose entire argument is that our
   output is indistinguishable from the real thing would be the single worst
   image we could put at the top of it. public/ls-icon.png is the real mark.
   --------------------------------------------------------------------------- */
export const STATEMENT_HEADING = "We make ads brands actually run.";

export const STATEMENT_CTA = "Start a project";

export const STATUS = {
  state: "Taking briefs",
  who: "Likelyfad · AI ad studio",
} as const;

/** On the case cards in the hero stack. Not a link: there is no per-clip page
    in this repo to send anyone to, and the stack is aria-hidden decoration
    whose contents all reappear in the work grid. It is a label on a picture of
    a case card, which is what the reference's is too. */
export const CASE_LABEL = "View work";

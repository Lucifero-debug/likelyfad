"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { content } from "@/lib/content";
import { takeReels } from "@/lib/reelOrder";
import { HOT } from "@/lib/useInViewPlay";
import { useLeanRowLength } from "@/lib/useLeanWall";
import type { Reel } from "@/lib/reels.generated";
import { Button } from "@/components/ui/Button";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Lightbox } from "@/components/ui/Lightbox";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DRIVE_LIBRARY_URL } from "@/lib/site";
import { ANCHOR, HEAD_GAP, SECTION, TEXT_META, WRAP } from "@/lib/ui";

const { work } = content;

/* THE WORK — the volume wall.

   Three full-bleed rows of clips gliding in alternating directions: right,
   left, right. Sheer count is the argument, which is why this is a wall and
   not a curated grid — you are meant to lose track of how many there are.

   Dark on purpose. It is the one band between two light sections, so the work
   reads as the exhibit rather than as more page. Everything inside therefore
   takes the BRIGHT cut of the ramp and the muted light ink; the paper-safe
   pink lands around 3.6:1 on near-black, under the bar for type this small.

   THIS WALL IS THE EXPENSIVE ONE. It carries three times the clips the hero
   wall does, so every rule the hero wall's comments lay out is load-bearing
   here rather than merely tidy: no mask over a moving layer, no box-shadow in
   a transition, and `contain` on every row. See the note at each.

   EVERY TILE IS GATED ON VISIBILITY, through the same machinery as the rest of
   the page. Each one is a LazyVideo on a lane of its own row — `work-row-0/1/2`
   — so lib/useInViewPlay observes it, withholds its source until it is within
   200px of the viewport, plays at most PER_LANE per row, staggers the starts
   and stops everything for the length of a scroll gesture. The full argument
   for each of those numbers is in that file; the note above Tile says how this
   wall in particular sits on them.

   IT WAS NOT ALWAYS SO, AND THE HISTORY IS THE REASON THE COMMENTS HERE ARE AS
   LOUD AS THEY ARE. This wall used to opt out of all of it: 96 <video>
   elements with `autoPlay` and preload="auto", one play() on mount, nothing
   watching. Measured on a 1920x1080 load with nothing scrolled, that was 96
   simultaneous decoders — each uploading a fresh 288x512 texture to the GPU
   thirty times a second and compositing as its own layer — and 60 distinct
   clips, 18MB of video, fetched before the visitor had moved. The decoders did
   not stop when you left the section, because nothing was watching, so it was
   felt as a page that scrolled badly everywhere rather than only here.

   content-visibility: auto ON THE SECTION NEVER COVERED THAT, and it is worth
   knowing why, because it looks like it should. It skips layout, paint and
   compositing for the whole subtree while it is off screen — so the tiles were
   decoding without being drawn — but it does nothing whatever about network or
   decode. It is still here and still worth having; it was simply never the
   thing standing between this wall and its cost. The marquees being paused
   until the section is near is the same kind of saving, and the same
   limitation: neither touches playback. */

const ROWS = 3;
/* Each row renders its clips TWICE and slides by exactly half its own length,
   so ONE copy has to be wider than the viewport or the wrap point comes into
   frame. Sixteen tiles at a ~170px pitch is ~2720px, which covers a 2560
   monitor. Do not cut this to trim DOM nodes without redoing that sum.

   IT IS THE CEILING NOW RATHER THAN THE COUNT, and only on machines that report
   themselves weak — see useLeanRowLength in lib/useLeanWall.ts, which redoes
   exactly that sum against the actual viewport instead of against a 2560
   monitor nobody on a phone is holding. This number is still what every other
   visitor gets, and still what the server renders for all of them. */
const PER_ROW = 16;
/* Starts past everything the hero wall shows (3 lanes x 6), so the two walls
   are never running the same clip at the same moment. */
const OFFSET = 18;

const ROW_STYLE = [
  { duration: "88s", reverse: false },
  { duration: "104s", reverse: true },
  { duration: "94s", reverse: false },
];

/* Dealt column-major, so tiles adjacent in a row are 3 apart in the spread
   order — takeReels already keeps same-shoot clips far apart, and this stops
   the three rows from being three contiguous slices of it.

   Hoisted out of the component because it is pure over module constants. It
   used to run per render, so the whole union-find-and-sort in reelOrder re-ran
   on every pause toggle and every lightbox open and close. */
const PICKS = takeReels(content.reels.videos, OFFSET, ROWS * PER_ROW);
const ROWS_OF_PICKS = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: PER_ROW }, (_, i) => PICKS[i * ROWS + row])
);

/* Tiles are smaller and squarer-cornered than the hero wall's cards: this wall
   is about count, and a smaller tile puts more of them on screen.

   THE POSTER IS AN <img>, NOT A BACKGROUND. It was a background-image, which
   paints early and needs no element — but a CSS background cannot be lazy
   loaded, so all ninety-six fetched and decoded the moment the section came
   into view: ~2.4MB over the wire and ~28MB of decoded bitmap, in one burst,
   during the scroll that brought them there. A real <img loading="lazy"> lets
   the browser defer everything off screen, so entering the section pays for
   roughly the dozen tiles per row actually visible and the rest arrive as they
   translate in. `bg-[#1a1620]` below is what shows until one lands.

   It is also the only copy of the poster, deliberately: setting it as the
   video's `poster` attribute as well made the browser hold two decoded rasters
   of the same webp per tile.

   OPACITY AND TRANSFORM ONLY. box-shadow used to be named in this transition
   too, driving a 54px-blur hover shadow, and it is the one property that can
   never be: it repaints that blur every frame, around a tile the marquee is
   translating and a video is decoding into. The bigger hover shadow is now a
   second layer cross-faded over the resting one (the ::after), which
   composites instead of repainting. Transform is safe for the opposite reason
   — the hover scale is a compositor operation on one tile at a time, and it
   costs nothing per frame while the tile sits at rest.

   The scale is 1.05 and NOT MORE, because the room for it is finite: see the
   padding on the row below, which is what stops it being clipped.

   Keep utility syntax OUT of these comments, incidentally — Tailwind scans the
   whole file, comments included, and will emit a real class for anything that
   parses as one.

   `overflow-hidden` moved off the tile and onto the span around the video, so
   the ::after is free to paint its shadow OUTSIDE the tile. The background
   image needs no clip of its own — a background is already clipped to the
   border box, radius included. */
const TILE =
  "relative aspect-[9/16] w-[clamp(112px,33vw,146px)] flex-none rounded-lg " +
  "bg-[#1a1620] shadow-[0_12px_32px_rgba(0,0,0,0.45)] " +
  "transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:scale-[1.05] active:brightness-90 " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] " +
  "after:shadow-[0_20px_54px_rgba(0,0,0,0.62)] after:opacity-0 after:content-[''] " +
  "after:transition-opacity after:duration-[280ms] hover:after:opacity-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white " +
  "tab:w-[clamp(116px,12vw,158px)] tab:rounded-xl";

/* The fade at each end, painted ON TOP rather than masked. A mask forces the
   layer beneath it — here a ~2720px-wide row holding thirty-two decoding
   videos — through an extra compositing pass on every single frame, while a
   gradient over a known solid background is a flat paint and looks identical.
   The stop colour IS the section's outer colour (#17141b), which is what the
   radial has settled to by the time it reaches these edges, and the far end
   names the same channels at alpha 0: fading to bare `transparent` would ramp
   through rgba(0, 0, 0, 0) and darken the middle of the fade.

   THE WIDTH IS SIZED TO A TILE, AND THAT IS WHY IT IS 12% AND NOT 7%. This is
   the second half of the playback budget in lib/useInViewPlay: PER_LANE tops
   out at 11 while 11-12 tiles per row clear THRESHOLD, so on the wide end of
   that range ONE tile per row is always held on its poster. The FIFO queue
   parks it at the edge the lane feeds in from — the right for rows 0 and 2,
   the LEFT for row 1, which runs reversed — so a fade wide enough to cover a
   tile there is what turns a frozen frame into an edge that is simply dark.

   7% was 133px against a ~170px tile pitch: never wide enough to cover one,
   so the held tile sat measurably outside it, ~200px in, at full
   intersectionRatio. 12% is 228px at a 1902px section, which reaches it. The
   number is a TILE PITCH, not a taste value — if the tile clamp or the row gap
   changes, this is derived from them and moves too. */
const FADE = "pointer-events-none absolute inset-y-0 z-[2] w-[12%]";

function Tile({
  reel,
  onOpen,
  label,
  lane,
  enabled,
}: {
  reel: Reel;
  onOpen: () => void;
  label: string;
  /** This tile's row, as a play-budget bucket. Unique across the page: the
      hero wall's columns are lanes too and must not collide with these. */
  lane: string;
  /** False holds the tile on its poster and registers nothing with either
      observer — see the same flag on LazyVideo and useInViewPlay. The wall
      passes false under prefers-reduced-motion; the note in Work() says why. */
  enabled: boolean;
}) {
  return (
    <button type="button" onClick={onOpen} aria-label={label} className={TILE}>
      {/* The clip gets its own box so the tile is free to paint shadows outside
          itself. A wrapper rather than border-radius straight on the <video>:
          Safari has been unreliable about clipping video to its own corners,
          and overflow:hidden on a plain box is not. */}
      <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {/* posterMode="element", NOT the `poster` attribute, and it is the
            whole reason this wall can afford 96 tiles. A poster attribute is
            never lazy, so all 48 distinct webps would be fetched the moment
            the section mounted; a real <img loading="lazy"> lets the browser
            defer everything off screen, so entering the section pays for
            roughly the dozen tiles per row actually visible and the rest
            arrive as they translate in. `bg-[#1a1620]` on the tile is what
            shows until one lands.

            THE lazy ATTRIBUTE WAS MISSING FROM THE <img> THIS REPLACES. The
            note here has argued for it since the poster stopped being a CSS
            background, but only `decoding="async"` was ever on the element, so
            all 48 fetched on first paint — 1.7MB of the 2.3MB of posters a
            cold load pulled. LazyVideo carries the attribute now.

            Setting a poster attribute AND an <img> makes the browser hold two
            decoded rasters of the same webp per tile, which is why LazyVideo
            makes the two modes a choice rather than a pair. */}
        {/* `relative` so the video is POSITIONED like the poster behind it and
            paint order falls back to DOM order. Left static it would paint in
            the in-flow step, which comes before positioned descendants — and
            the poster would sit on top of the playing clip. */}
        {/* THE WALL IS THE EXHIBIT, SO ITS LANES RUN HOT. The default policy is
            built for a wall you scroll past and it made this one look broken:
            measured at 1440x900, parked here, 0 of 28 visible tiles were moving
            at one second, 17 at three, and every scroll gesture took all of
            them back to zero. HOT removes the dwell and the scroll pause, cuts
            the stagger, and starts tiles 150px before they reach the edge so
            they slide in already running. The ceiling is still a ceiling and an
            off-screen tile still costs nothing — see PlayPolicy in
            lib/useInViewPlay.ts for what each number buys and what it costs. */}
        <LazyVideo
          lane={lane}
          src={reel.src}
          poster={reel.poster}
          posterMode="element"
          enabled={enabled}
          policy={HOT}
          className="relative size-full object-cover"
        />
      </span>
    </button>
  );
}

/* THIS WALL IS BACK ON THE SHARED PLAYBACK REGISTRY.

   IT USED TO PLAY EVERY TILE, FOREVER, AND NOT ASK WHERE IT WAS — one ref, one
   play() on mount, no observer, `autoPlay` and preload="auto". That policy was
   deliberate and it was measured to be the single most expensive thing on the
   page: on a 1920x1080 load with nothing scrolled, all 96 tiles were playing
   and fully buffered while sitting below the fold, which was 60 distinct clips
   and 18MB of video before the visitor had moved. `content-visibility: auto` on
   the section skips layout, paint and compositing for the subtree but does
   nothing whatever about network or decode, so it never covered this.

   Every tile is a LazyVideo now, keyed to a lane per row. What that buys, and
   the reasoning behind each number, is in lib/useInViewPlay: the source is not
   attached until a tile is within 200px of the viewport, at most PER_LANE play
   at once per row, a dwell means tiles you scroll PAST never fetch at all, and
   starts are staggered so a row does not open sixteen streams into one pipe.

   WHAT IT COSTS, stated plainly because the old policy existed to avoid it: a
   tile entering the row holds its poster for the dwell before it starts, and
   the tiles bunched at the feeding edge wait for a slot. That is the same
   behaviour the hero wall has always had, and the FIFO ordering puts the held
   ones under the row's own edge fade. */

/* WHETHER THIS SECTION'S MARQUEES SHOULD BE RUNNING AT ALL.

   IT USED TO GATE THE TILES TOO, and that was the more important of its two
   jobs: useInViewPlay observes every tile on the page through one shared
   IntersectionObserver, and an observer recomputes EVERY target it holds on any
   frame where something moved. The hero wall's lanes move constantly, which
   forced this section's 96 tiles to be re-intersected sixty times a second,
   each one a rect walked up through transformed and clipped ancestors, while
   the section was far below the fold and could not be seen. Profiled on the
   production build: 29% renderer main thread, 273ms of a 5s trace inside
   computeIntersections, against 1.1% with the section removed.

   THE TILES ARE OBSERVED AGAIN. That problem has not been designed away, it
   has been RE-ACCEPTED: all 96 are LazyVideo tiles registered with the shared
   observer, which is the same population the trace above measured.

   WHAT IS DIFFERENT is that only one of the two observers holds them for good.
   LazyVideo's attach observer unobserves each tile permanently the first time
   it comes near — it has nothing left to ask once the source is on — so that
   half drains to nothing. The playback registry's half does not drain, and
   cannot: it has to keep watching to know when a tile leaves.

   `near` DOES NOT GATE THEM, AND COULD. useInViewPlay and LazyVideo both take
   an `enabled` flag for exactly this, and this wall passes neither, so its
   tiles register on mount and stay registered whether or not the section is
   anywhere near. If computeIntersections shows up in a trace again, threading
   `near` down to Tile as `enabled` is the one-line way back to what the
   paragraph above describes. It is off for now because the source attach gate
   sits in front of playback, so an unregistered tile cannot be the thing that
   fetches early — the flag would buy observer time and nothing else, and that
   is a trade worth making from a trace rather than from a guess.

   WHAT IS LEFT IS THE MARQUEE. Three lanes dragging a 32-clip
   will-change: transform track composite every frame whether or not anyone can
   see them, and `near` is what stops that while the section is away.

   content-visibility ON THE SECTION DOES NOT COVER IT, quite: it skips
   rendering for an off-screen subtree, which is most of the cost, but the
   animations remain live and the two together are cheaper than either alone. */
function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      /* A NEGATIVE MARGIN, AND THE HERO IS WHY. This section begins exactly
           where a 100svh hero ends, so at scroll 0 its top edge is already
           touching the bottom of the viewport — any positive margin, and even
           0, reports it as intersecting before the visitor has scrolled a
           pixel, which is the whole cost this hook exists to avoid. Requiring
           it to be a fifth of a viewport IN is what makes the flag mean
           "arriving" rather than "adjacent".

           IT COSTS NOTHING NOW THAT IT ONLY GATES THE MARQUEE. While it also
           gated playback, a late flag meant the first row could arrive on
           posters and fill in over the following second; a lane that starts
           moving a fifth of a viewport in is simply a lane that starts moving
           when you get there. */
        { rootMargin: "-20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, near] as const;
}

export function Work() {
  const [active, setActive] = useState<Reel | null>(null);
  const [paused, setPaused] = useState(false);
  const [sectionRef, near] = useNearViewport<HTMLElement>();

  /* AUTOPLAYING VIDEO IS ITSELF MOVEMENT, AND THIS WALL WAS NOT ASKING.

     The lanes were already covered: the reduced-motion block in globals.css
     flattens every animation on the page, so the three marquees stop. The
     CLIPS were not. LazyVideo defaults `enabled` to true and this wall never
     passed it, so under the preference the tiles kept registering with the
     playback registry and kept playing — measured on the production build with
     reduced motion forced, scrolling to #work left 27 videos running while the
     page reported zero running animations. The section looked still and was
     not. ReelWallV6 has gated this from the start, for the reason stated in
     its own effect; this is that gate, on the wall that carries three times
     the clips.

     Read once rather than subscribed, which is the call every other motion
     effect in this repo makes: a visitor who changes the setting mid-session
     gets it on their next navigation.

     READ IN THE INITIALISER RATHER THAN IN AN EFFECT, which is where the hero
     wall reads it. Two reasons, and neither is style. An effect would set
     state on mount, and `react-hooks/set-state-in-effect` is an ERROR in this
     config — the hero wall only escapes it because its own setPlay sits behind
     an early return. And `enabled` reaches no markup: it is a dependency of
     LazyVideo's attach effect and of useInViewPlay's registration, and neither
     renders it, so a client-only value cannot desync the server HTML here.
     Deciding before the first commit is also strictly better than deciding one
     render after it — nothing has to register and then unregister. */
  const [play] = useState(
    () => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* HOW MANY TILES EACH LANE ACTUALLY NEEDS ON THIS MACHINE. PER_ROW on
     everything that does not report itself weak, which is the server's answer
     and therefore the one the markup hydrates against; on a weak machine, the
     count that spans this viewport and no more. The wall looks the same either
     way — see the note at the head of lib/useLeanWall.ts for why a lane can
     lose two thirds of its tiles without losing anything you can see. */
  const perRow = useLeanRowLength(PER_ROW);

  /* Sliced rather than re-dealt, so a trimmed lane is a PREFIX of the same
     column-major deal ROWS_OF_PICKS already made. Re-running takeReels against
     a smaller count would re-do the union-find spread and could pull two clips
     from one shoot next to each other, which is the one thing that deal exists
     to prevent. */
  const rows = useMemo(
    () =>
      perRow >= PER_ROW ? ROWS_OF_PICKS : ROWS_OF_PICKS.map((row) => row.slice(0, perRow)),
    [perRow]
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label={work.kicker}
      /* THIS SECTION IS SKIPPED ENTIRELY WHILE IT IS OFF SCREEN, and the reason
         is its three marquees rather than its size.

         The rows hold 96 <video> elements between them and each lane drags a
         32-clip `will-change: transform` track. The ANIMATIONS were not gated on
         anything: they composited every frame whether or not the section was on
         screen, which meant that sitting still on the hero, three tracks nobody
         could see were competing for frames with the hero wall's own lanes.

         IT MATTERS MORE SINCE THE CLIPS STOPPED BEING GATED. Those 96 elements
         are all playing all the time now — see the note at the head of the file
         — so this rule is no longer one saving among several. It is the only
         thing standing between an off-screen wall and the full cost of it, and
         it is why the tiles decode without also being laid out, painted and
         composited while nobody is looking at them.

         content-visibility: auto makes the browser skip layout, paint AND
         compositing for the whole subtree until it comes into view, so the cost
         is zero rather than merely small. Nothing changes once you reach it.

         contain-intrinsic-size IS NOT OPTIONAL HERE. Without it the skipped
         section measures 0 tall, the page shrinks by its full height, and the
         scrollbar jumps every time it enters or leaves — which would trade one
         kind of jank for a worse one. 1200px is this section's real height at a
         desktop width (three 158px tiles at 9:16, plus gaps, heading and the
         SECTION clamp); the `auto` keyword means the browser replaces that
         estimate with the measured height the first time it renders, so the
         guess only has to be close once. */
      className={`${SECTION} ${ANCHOR} relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_1200px] bg-[radial-gradient(120%_90%_at_50%_-10%,#241d2b,#17141b_72%)] text-[#f5f3f0]`}
    >
      <div className={WRAP}>
        <div className={HEAD_GAP}>
          <SectionHeading kicker={work.kicker} heading={work.heading} tone="bright" />
          <Reveal delay={100}>
            <p className={`mt-3 text-center font-mono ${TEXT_META} leading-1.2 tracking-[0.04em] text-ink-dim`}>
              {work.sub}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed: the rows run edge to edge, outside the wrap's cap. That is
          the whole effect — they run OUT of the page rather than stopping at an
          edge, which is what the fade sells. The two overlays span all three
          rows, so the effect costs two elements rather than one mask per row. */}
      <div className="relative flex flex-col gap-[clamp(8px,1.2vw,12px)]">
        {rows.map((row, ri) => (
          <div
            key={ri}
            /* Hovering a row dims everything except the tile under the pointer,
               so one clip can be read out of forty-eight without the rest going
               dark. `:not(:hover)` rather than dim-all-then-undim-one: two
               rules writing opacity at equal specificity would have their
               winner decided by emit order.

               `contain` scopes the marquee's per-frame layout and paint
               invalidation to the row rather than letting it walk the page.

               py-3 -my-3 IS WHAT GIVES THE HOVER SCALE SOMEWHERE TO GO. Both
               `overflow-hidden` and `contain: paint` clip at the padding box,
               and a row with no padding is exactly as tall as its tiles — so a
               tile growing 5% would have had its top and bottom sliced off. The
               12px of padding is the room, and the equal negative margin hands
               it straight back to the layout, so the visible gap between rows
               is still the container's own and nothing below moves. At the
               widest tile (158px, so 281px tall) a 1.05 scale needs 7px a side:
               inside 12, with margin to spare. Raise the scale and this has to
               rise with it.

               The rows' padding boxes now OVERLAP by that same 12px, which is
               why the hover needs a z-index as well: without it the next row
               paints over the part of the magnified tile that bleeds into the
               shared strip. Rows are flex items, so z-index applies to them
               with no positioning of their own. */
            className="py-3 -my-3 overflow-hidden [contain:layout_paint_style] hover:z-[3] [&:hover_button:not(:hover)]:opacity-45"
          >
            <div
              /* Hovering a tile stops THIS row and leaves the other two
                 running — see the same note on the hero wall's lane.

                 `active` STOPS ALL THREE, and it is the lightbox's blur that
                 needs it rather than anything visual: a full-viewport
                 backdrop-filter has to re-sample whatever moves behind it, so
                 three marquees dragging 96 clips underneath an overlay nobody
                 can see through were being paid for on every composited frame.
                 Nothing is visible past the scrim, so nothing needs to move. */
              className={`flex w-max animate-lane-x gap-[clamp(8px,1.2vw,12px)] will-change-transform [&:has(button:hover)]:[animation-play-state:paused] ${
                ROW_STYLE[ri].reverse ? "[animation-direction:reverse]" : ""
              } ${paused || !near || active ? "[animation-play-state:paused]" : ""}`}
              style={{ animationDuration: ROW_STYLE[ri].duration }}
            >
              {[...row, ...row].map((clip, i) => (
                <Tile
                  key={`${ri}-${i}`}
                  reel={clip}
                  lane={`work-row-${ri}`}
                  onOpen={() => setActive(clip)}
                  enabled={play}
                  /* Numbered off the count this lane actually rendered, not off
                     PER_ROW: the two diverge on a trimmed wall, and against the
                     constant the second copy of the set would be announced with
                     a different number from the first — the same clip, twice,
                     under two names. */
                  label={`Play reel ${ri * row.length + (i % row.length) + 1} full size`}
                />
              ))}
            </div>
          </div>
        ))}

        <div
          aria-hidden="true"
          className={`${FADE} left-0 bg-[linear-gradient(to_right,#17141b,rgba(23,20,27,0))]`}
        />
        <div
          aria-hidden="true"
          className={`${FADE} right-0 bg-[linear-gradient(to_left,#17141b,rgba(23,20,27,0))]`}
        />
      </div>

      {/* THE ONE CONTROL ON THIS BAND, AND IT IS THE END OF THE SCROLL RATHER
          THAN AN INTERRUPTION IN IT. The wall answers "is this real"; a visitor
          who is convinced by it has nowhere to go next except past the section,
          so the ask belongs under the evidence and after all three rows rather
          than beside the heading.

          `light`, NOT `grad`. The gradient is the page's primary action and it
          is spent twice already in the hero, and a second gradient pill on a
          dark band would read as the same button repeated rather than a
          different offer. A white pill on this ground is the only variant that
          is unmissable without competing: `dark` and `ghost` both paint ink on
          near-black and disappear.

          THE GAP MIRRORS HEAD_GAP, deliberately — clamp(32,4.5vw,64) above the
          CTA is the same air the heading block leaves below itself, so the wall
          sits in a band with matched margins instead of being top-heavy. Both
          ends are rungs on the scale in lib/ui.ts. It is spelled out rather
          than imported because HEAD_GAP is a `mb-` and Tailwind scans source
          TEXT, so a class built by swapping the prefix at runtime is never
          generated — the same reason the perspective and the lane speeds are
          literals.

          `items-center` in a column: the toggle, if it ever comes back, stacks
          under the CTA rather than beside it. It used to sit alone at the right
          edge, which is the right place for a utility control and the wrong
          place for the section's ask. */}
      <div
        className={`${WRAP} mt-[clamp(32px,4.5vw,64px)] flex flex-col items-center gap-4`}
      >
        <Reveal>
          <Button
            href={DRIVE_LIBRARY_URL}
            /* EXTERNAL, so the tab that opens cannot navigate this one — see
               the note on the prop. It is also the reason this is not a plain
               <a>: the rel is the half that gets forgotten. */
            external
            variant="light"
            withArrow
            ariaLabel={work.ctaAria}
          >
            {work.cta}
          </Button>
        </Reveal>

        {/* <MotionToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          label="the work wall"
          tone="dark"
        /> */}
      </div>

      {/* Dozens of near-identical tile labels would be noise to a screen
          reader, so one sentence stands in for the lot. */}
      <p className="sr-only">{work.description}</p>

      {active && <Lightbox reel={active} onClose={() => setActive(null)} />}
    </section>
  );
}

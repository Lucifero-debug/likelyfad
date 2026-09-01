"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInViewPlay } from "@/lib/useInViewPlay";
import { Lightbox } from "@/components/ui/Lightbox";

/* ============================================================================
   THE PARALLAX REEL WALL — four columns, one static, three receding.

   PORTED FROM https://codepen.io/branneman/pen/ALzorM. The pen is 2013 jQuery /
   Compass / Swipe.js and its stylesheet is commented out in the published
   version, so the CODE is worth nothing here. What is worth everything is its
   one function:

     getTop = (pos, col) => -(pos * Math.pow(1.5, col - 1))

   FOUR PROPERTIES ARE THE EFFECT. Every one of them is load-bearing, and each
   has a specific failure mode when it is "improved":

     1. COLUMN 1 NEVER MOVES *ON SCROLL*. It is not in the update loop — it is
        the reference plane the other three recede from. Give it a scroll speed
        and the other three stop reading as depth and start reading as four
        things sliding. (It does carry the ambient lane described further down,
        which is a deliberate departure from the reference — see THE AMBIENT
        LANE. Scroll response is what property 1 is actually protecting.)

     2. EVERY MOVING COLUMN GOES THE SAME WAY — UPWARD. The value is negative
        for all of them. Alternating the directions cancels the sense of one
        plane receding behind another and reads as churn.

     3. SPEED IS PROPORTIONAL TO RAW SCROLL, UNCAPPED. Column 2 at 1.5x, column
        3 at 2.25x, column 4 at 3.375x, forever. Normalising scroll to 0..1
        across the section, or capping the travel, converts the parallax into a
        gentle settle — the continuous unbounded differential IS the effect.

     4. THE MULTIPLIER IS A CONSTANT RATIO. Each column is faster than the last
        by the same factor, which is what makes it read as receding depth
        rather than as three arbitrary speeds.

   HOW UNCAPPED TRAVEL FITS IN A FIXED-HEIGHT PANEL, which is the one real
   problem here and is NOT solved by capping. Each column renders its clip list
   several times over and every offset is taken modulo one set's height:

     y = -(scrollDelta * SPEED_RATIO^(col-1))  mod  oneSetHeight

   The column then travels without bound while never running out of content and
   never showing a gap. Column 4 moves at 3.375x forever inside a fixed box.

   TWO MOTIONS, AND THEY ARE NOT THE SAME MOTION — this is the thing to hold on
   to when reading the markup, because the wall looks wrong the moment they get
   confused for each other:

     THE AMBIENT LANE is self-driven and never stops. Pure CSS, no JS per frame,
     and it is what makes the wall feel alive while the visitor is sitting still
     reading the headline.

     THE PARALLAX is scroll-driven and has no motion of its own. With the page
     still it contributes exactly nothing.

   THEY LIVE ON SEPARATE ELEMENTS BECAUSE THEY BOTH WRITE `transform`, and an
   element has one. Nesting them composes the two translates for free, the way
   the browser is built to:

     column cell        relative, clips the lane
       drift layer      transform: the parallax offset (JS writes it)
         track          animation: wall6-lane, translateY(0 -> -1 set)
           clip xN      the clip list, rendered COLUMN_SETS[c] times

   THE INVARIANT THAT MAKES IT SEAMLESS IS `oneSetHeight >= containerHeight`.
   Each offset stays in (-oneSetHeight, 0], so the visible window is always
   inside real content and every wrap point is pixel-identical because every set
   is the same set. What changes per column is how many offsets stack — see
   COLUMN_SETS, which is where the copy count is decided. Four 9:16 clips in a
   column this wide run ~2.5x the container at every viewport the wall renders
   at, so there is real slack; `debug` prints both numbers if you ever want to
   check it against a layout change.

   SET HEIGHT IS SPACED WITH margin-bottom, NOT A FLEX gap, AND THAT IS
   LOAD-BEARING. N items separated by `gap` have N-1 gaps, so a third of a
   three-set track is four clips plus 3.67 gaps while one true set is four clips
   plus four — the loop point lands a fraction of a gap out and the column
   visibly hitches once per cycle. A bottom margin on every item, including the
   last, makes each division exact. Flex containers include item margins in
   their content size, which is what makes `offsetHeight / sets` the exact
   figure. (The homepage wall has this error at its 4px gap: a 2px hitch every
   78 seconds, which is why nobody has ever seen it.)

   SCROLL IS READ FROM THE POINT THE WALL ENTERS THE VIEWPORT, not from absolute
   page scroll, so the wall starts neutral rather than pre-scrolled — mounted
   400px down a page, absolute scrollY would have column 4 already 1350px into
   its travel on the first frame.

   THE PEN LISTENS TO `scroll` DIRECTLY AND ANIMATES margin-top. Both are
   replaced: every event between two frames coalesces into one rAF read, and the
   write is transform: translate3d, which stays on the compositor and never
   touches layout.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   THE MULTIPLIER. This is the one number to change if the effect looks wrong.

   1.5 is the reference value. 1.3 is calmer, 1.7 more aggressive — and if the
   column count ever changes, this has to change with it, since the ratio
   compounds over every lane. Change this and nothing else: capping the travel,
   alternating the directions or giving column 1 a speed are the three edits
   that break the effect rather than tune it. */
const SPEED_RATIO = 1.5;

/* HOW MANY LANES THE WALL DIVIDES ITS WIDTH INTO.

   FOUR IS THE BRIEF'S NUMBER AND THE RATIO IS BUILT AROUND IT. The last column
   runs at SPEED_RATIO^(COLUMNS-1), so the two are not independent: six columns
   on a 1.5 ramp would put the last lane at 7.6x raw scroll, which is not depth,
   it is a blur. Change one and the other has to be re-derived.

   IT IS ALSO WHAT DECIDES CLIP SIZE, since a clip is w-full of its column. Four
   lanes means the clip is a quarter of the wall's width, so how much footage is
   on screen at once is settled by the wall's WIDTH and HEIGHT rather than
   anything in this file — see WALL_HEIGHT and WALL_WIDTH in HeroV6. */
const COLUMNS = 4;

/* SPEED_RATIO^(col-1) for the reference's 1-indexed columns, which is 1.5,
   2.25 and 3.375 for columns 2, 3 and 4.

   INDEX 0 IS 0, NOT 1, and that is the whole of property 1 above. The pen's
   formula returns 1 for column 1 — that column is simply never passed to it,
   because it is the plane everything else is measured against. Writing the
   exclusion as a zero here keeps it in one table instead of a special case
   buried in the write loop. */
const COLUMN_SPEED: number[] = Array.from({ length: COLUMNS }, (_, i) =>
  i === 0 ? 0 : Math.pow(SPEED_RATIO, i)
);

/* ---------------------------------------------------------------------------
   THE AMBIENT LANE — the second motion, and the one deliberate departure from
   the reference.

   THE PEN'S WALL IS DEAD WHEN THE PAGE IS STILL. Everything it does is a
   function of scroll position, so a visitor who lands on the hero and reads it
   sees four frozen columns until they touch the wheel. That is faithful, and on
   a hero it is wrong — so every column also runs a slow continuous loop
   underneath the parallax.

   THIS BREAKS PROPERTY 1 AS WRITTEN, and knowingly: column 1 is no longer
   absolutely still. What it keeps is the part that matters — column 1 is still
   the only column that does not respond to SCROLL, so it remains the plane the
   other three visibly recede from as you move. It just breathes while it does
   it.

   THE AMBIENT SPEEDS FOLLOW THE SAME RATIO AS THE PARALLAX, which is why this
   reads as one effect rather than two stacked ones: each column loops
   SPEED_RATIO times faster than the one before it, so the depth ordering the
   parallax draws on scroll is already there at rest. Duration is the inverse of
   speed, hence the division.

   180s on column 1 is about 6px per second — under the threshold where the eye
   tracks it as travel rather than as the wall being alive. Column 4 lands near
   21px/s, which is still calm. */
const AMBIENT_BASE_SECONDS = 180;

const AMBIENT_DURATION: string[] = Array.from(
  { length: COLUMNS },
  (_, i) => `${(AMBIENT_BASE_SECONDS / Math.pow(SPEED_RATIO, i)).toFixed(2)}s`
);

/* HOW MANY COPIES OF THE CLIP LIST EACH COLUMN RENDERS, and this is the number
   that stops the wall going blank at an unlucky moment.

   Each wrapping offset can reach a full set. Column 1 has ONE of them (the
   marquee), so its content only has to outlast a single set: two copies, and
   the bottom edge never rises above the bottom of the box. The moving columns
   have TWO independent offsets (marquee AND parallax) which can be near their
   maximum at the same time, so they need three.

   THIS IS THE COMPONENT'S BIGGEST SINGLE COST and the number to come back to
   when the wall feels heavy. Every copy is four more <video> elements per lane:
   [2,3,3,3] is 44 of them, [3,4,4,4] is 60. Nothing else in here scales like it.

   THE COUNT IS DECIDED BY THE WORST VIEWPORT, NOT THE TYPICAL ONE. A lane needs
   enough content that no combination of its offsets can pull the end of it into
   frame, and each wrapping offset can reach a full set:

     the static lane has ONE (the marquee)   -> needs (sets - 1) x set >= container
     a moving lane has TWO (marquee + drift) -> needs (sets - 2) x set >= container

   With three and two copies that comes to `set >= container` on both. The
   binding case is a phone held wide — around 760px, right below `tab`, where
   the wall is ~684px across. Four clips have to beat that on their own, which
   is what sets the floor under the clip clamp: 22vw lands them at ~167px there,
   for a 732px set. Narrow that clamp and the copies have to come back.

   `debug` prints the two numbers it is checking, and says SET TOO SHORT if the
   relationship ever stops holding. */
const COLUMN_SETS = [2, 3, 3, 3];

/* ---------------------------------------------------------------------------
   THE 3D STAGE — what turns four parallax columns into a gallery with depth.

   THE PARALLAX ALONE IS FLAT. Columns moving at different speeds is a depth
   CUE, but every column still sits on the same plane at the same size, so the
   recession only exists while you are scrolling. Placing them in actual 3D
   makes the depth true at rest as well: the outer columns are further away, so
   they are smaller and angled, and the parallax ramp then agrees with something
   the eye can already see.

   THE WHOLE STAGE TILTS AS ONE FLAT PLANE, and there is a hard reason it is
   not four columns each placed at its own depth.

   Per-column depth needs `transform-style: preserve-3d` on the grid, so that a
   column's translateZ composes with the grid's rotation instead of being
   flattened into it. That arrangement RENDERS correctly and is UNCLICKABLE.
   Each column also needs `overflow: hidden` to clip its lane, and overflow
   other than visible forces transform-style back to flat — which drops a
   flattening boundary into the middle of a 3D rendering context. Chrome paints
   that correctly but hit-tests it in the wrong space: the cards appear where
   the projection puts them and answer the pointer where their UNTRANSFORMED
   layout boxes are, which after a 22 degree rotation is somewhere else
   entirely. Hovering a card does nothing; clicking it does nothing.

   So the grid carries ONE 3D transform and no preserve-3d, which makes it an
   ordinary transformed element as far as hit testing is concerned — the browser
   inverts a single matrix and gets the right answer. The columns inside it are
   plain 2D boxes on a tilted plane.

   WHAT THAT COSTS is the per-column recession: the outer columns no longer sit
   further back than the inner pair. It is close to nothing in practice. At the
   35px it had reached, that recession was worth about 4% of scale between the
   inner and outer pairs, against the 35% the plane tilt spans on its own. It
   was invisible next to the tilt, and it was buying an uninteractive wall.

   THE PERSPECTIVE (900px) AND THE STAGE INSETS ARE NOT CONSTANTS HERE,
   deliberately. All are Tailwind classes on the grid, and Tailwind scans source
   TEXT — a class assembled from a variable is never generated, so the value
   would have to be written out in the class anyway. A constant that is not the
   thing actually in effect is worse than no constant: it reads as the source of
   truth and can drift from the class without anything failing. The numbers live
   in the class, and the note there explains what they are for. */

/* The 16px between clips is a MARGIN on the clip itself, and it has to switch
   axis with the lane — bottom in a column, right in a row — so it is a pair of
   responsive classes rather than a constant. Same reasoning as the perspective
   and the stage overhang: Tailwind scans source text, a class built from a
   variable is never generated, and a constant that is not the value in effect
   only invites drift. It is on the spacing scale either way. */

export type ReelClip = {
  src: string;
  poster: string;
  alt: string;
  /* Only read once a clip is OPENED. The wall plays `src`, a small silent cut;
     the lightbox wants `hq`, the larger cut with audio, and falls back to `src`
     when the Drive sync ran without ffmpeg. Optional so a caller with nothing
     but tiles still typechecks — it just gets the tile cut in the overlay. */
  id?: string;
  hq?: string | null;
};

/** Four columns. A tuple rather than ReelClip[][], so handing the wall three
    columns or five is a type error at the call site rather than a layout that
    quietly comes out wrong. */
export type ReelColumns = [ReelClip[], ReelClip[], ReelClip[], ReelClip[]];

/* ---------------------------------------------------------------------------
   ONE CLIP. Its own component only because useInViewPlay is a hook and the
   column maps over an array — calling a hook inside that map would tie the
   hook order to the clip count. */
function Clip({
  clip,
  lane,
  play,
  onOpen,
  reachable,
}: {
  clip: ReelClip;
  lane: string;
  play: boolean;
  onOpen: () => void;
  /** True only for the first rendered copy of a clip — see the note below. */
  reachable: boolean;
}) {
  const video = useInViewPlay(lane, play);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Play ${clip.alt} full size`}
      /* ONLY THE FIRST COPY IS A TAB STOP. Every lane renders its clip list
         three or four times over so the wrap has somewhere to go, so the wall
         holds sixty buttons for sixteen distinct reels. Left alone that is
         sixty tab stops, forty-four of which repeat something already offered —
         a keyboard user would page through the same handful of ads four times
         to get past a decorative wall. The duplicates stay clickable, because a
         pointer lands on whichever copy happens to be on screen and it would be
         bizarre for some of them to be dead. They are just not in the sequence.
         aria-hidden goes with it: a copy that cannot be reached should not be
         announced either. */
      tabIndex={reachable ? 0 : -1}
      aria-hidden={reachable ? undefined : true}
      /* THE ASPECT BOX IS ON THIS WRAPPER, so the space a clip occupies is
         decided before anything is fetched and is identical whether it ends up
         holding a decoded frame, a poster, or neither. That matters more here
         than in a static wall: a set that changes height mid-scroll changes
         what the modulo is taken against, and the loop point moves under you.

         THE SPACING IS A MARGIN, NOT THE PARENT'S flex gap, AND THAT IS LOAD
         BEARING — see the note at the top of the file. It also has to move axis
         with the lane: a bottom margin in a row would push the clip out of its
         track instead of separating it from the next one.

         WIDTH IS EXPLICIT IN A ROW, DERIVED IN A COLUMN. Stacked in a column a
         clip takes the column's width and the aspect box gives it a height.
         Laid out in a row there is nothing to take a width from — a flex item
         with only an aspect ratio collapses — so the phone layout states it and
         lets the aspect box give the HEIGHT, which is then what sets the row's
         height. That makes this clamp the control for how tall the whole phone
         wall is: at 88px a clip is 156px tall and three rows come to ~500px.

         SHRINKING THIS COSTS VIDEO ELEMENTS, WHICH IS NOT OBVIOUS. A narrower
         clip is a shorter SET, and the set is what has to outlast the wall's
         width at the wrap — so past a point the only way to keep the loop
         seamless is to carry another copy of every clip, which is four more
         <video> per lane. That is the trade this clamp is really making: at
         20vw/124px the wall needed 60 elements, at 22vw/168px it needs 44.
         Actual phones barely notice the difference (84px against 88px at 390);
         it is tablets in portrait that get the wider clips.

         THE HOVER GROWS THE CARD AND RAISES IT OVER ITS NEIGHBOURS. transform
         and opacity only: those composite, where a width or a box-shadow would
         repaint a card that a marquee is already translating every frame. The
         z-10 is what lets the magnified card overlap the clips above and below
         instead of being painted under them. Horizontal room for it comes from
         the cell's padding — see the grid. */
      className="group relative aspect-[9/16] w-[clamp(88px,22vw,168px)] mr-[16px] flex-none cursor-pointer overflow-hidden rounded-[12px] bg-poster transition-[scale] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] hover:z-10 hover:scale-[1.06] focus-visible:z-10 focus-visible:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cue active:scale-[1.02] tab:mr-0 tab:mb-[16px] tab:w-full"
    >
      <video
        ref={video}
        src={clip.src}
        poster={clip.poster}
        muted
        loop
        playsInline
        /* none, not metadata. The wall holds sixty of these for sixteen distinct
           reels, and useInViewPlay only ever starts the handful actually on
           screen, staggered. `metadata` opened sixty media players and sixty
           requests during load for tiles that mostly never become visible; the
           poster carries the layout until something asks to play. */
        preload="none"
        /* The button is the control; the video inside it is never a tab stop of
           its own and carries no label, or a screen reader would announce the
           same clip twice. */
        tabIndex={-1}
        aria-hidden="true"
        className="size-full object-cover"
      />
    </button>
  );
}

export function ReelWallV6({
  columns,
  className = "",
  label = "A wall of recent client ads, all of them AI-generated",
  debug = false,
}: {
  columns: ReelColumns;
  className?: string;
  label?: string;
  /** Live readout of the numbers that decide whether anything moves, including
      the oneSetHeight >= containerHeight invariant. Off by default. */
  debug?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  /* The grid. Measured rather than the box, because since the 3D stage it is
     the taller of the two — see the note in `report`. */
  const stage = useRef<HTMLDivElement>(null);
  /* TWO REFS PER COLUMN BECAUSE THE TWO MOTIONS LIVE ON TWO ELEMENTS. Both
     write `transform`, and an element has one — nesting them is what lets the
     browser compose the marquee's translate with the parallax's for free. The
     drift layer is written to by JS; the track is measured and animated by CSS,
     and nothing in this file ever writes to it. */
  const drifts = useRef<(HTMLDivElement | null)[]>([]);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const readout = useRef<HTMLPreElement>(null);

  /* THE ONE PIECE OF MOTION STATE THAT HAS TO BE REACTIVE, because it gates
     whether the clips register for playback and that is a prop on every tile
     rather than something to write to the DOM by hand.

     It starts false so the server and the first client paint agree — the server
     has no media query to read, and rendering "playing" then correcting it is a
     hydration mismatch. The effect below settles it on mount. */
  const [play, setPlay] = useState(false);

  /* The clip the lightbox is showing, or null. Held here rather than in Clip
     because only one can be open at a time and the overlay is a sibling of the
     whole wall, not of the card that opened it. */
  const [active, setActive] = useState<ReelClip | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    /* Read once rather than subscribed, which is the call every other scroll
       effect in this repo makes: a visitor who changes the setting mid-session
       gets it on their next navigation. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ALL MOVEMENT OFF, NOT SLOWED. No listener is attached, so no transform is
       ever written and every track stays at its authored y = 0 — the wall as
       laid out, not a degraded variant of it. Autoplaying video is itself
       movement, so it is off under the same preference. */
    setPlay(!reduced);
    if (reduced) return;

    let frame = 0;
    let visible = false;
    /* Page scroll at the moment the wall first entered the viewport. Null until
       then, and never re-captured: resetting it on a second entry would jump
       every column back to neutral in the middle of the effect. */
    let origin: number | null = null;
    /* Size of ONE set of clips per lane, ALONG THE AXIS THAT LANE RUNS — the
       modulus. Index 0 is unused; the static lane has no parallax to wrap. */
    const setHeight: number[] = [];
    /* True below `tab`, where the wall is three horizontal rows rather than four
       vertical columns. Set by `measure`, read by `write`; the two must agree on
       the axis or the wrap lands mid-content. */
    let horizontal = false;

    /* WHAT THE INVARIANT IS MEASURED AGAINST, and getting it wrong here is
       silent: the wall stays full at most phases and goes briefly bare at one.

       On the 3D stage the grid OVERHANGS the box by 7% on each edge, so a column
       cell is taller than the wall's visible height and the box crops the
       difference — the set has to outlast the CELL, not the box. Below `tab`
       there is no overhang and the lane runs sideways, so the thing to beat is
       the wall's own WIDTH. */
    const cellHeight = () =>
      horizontal ? el.clientWidth : stage.current?.clientHeight ?? el.clientHeight;

    const report = () => {
      const pre = readout.current;
      if (!pre) return;
      const delta = origin === null ? 0 : window.scrollY - origin;
      const cell = cellHeight();
      pre.textContent = [
        `reduced motion : ${reduced}`,
        `on screen      : ${visible}`,
        `scrollDelta    : ${delta.toFixed(0)}px`,
        `set / cell     : ${(setHeight[1] ?? 0).toFixed(0)} / ${cell}` +
          `${(setHeight[1] ?? 0) < cell ? "  <- SET TOO SHORT, WILL GAP" : ""}`,
        `slowest/fastest: ${COLUMN_SPEED[1].toFixed(2)}x / ${COLUMN_SPEED[COLUMNS - 1].toFixed(2)}x`,
        /* `|| 1` not `?? 1`: an unmeasured set is 0, not undefined, and a
           modulus of zero makes the readout print NaN. */
        `last lane y    : ${wrap(-(delta * COLUMN_SPEED[COLUMNS - 1]), setHeight[COLUMNS - 1] || 1).toFixed(1)}px`,
      ].join("\n");
    };

    /* Divide by the column's OWN set count, not a constant — the static column
       renders two copies and the moving ones three. The margin-bottom
       construction is what makes this exact rather than approximate: with a
       flex `gap` the divisions land half a gap out. See the note at the top. */
    /* THE MODULUS IS THE SET'S SIZE ALONG WHICHEVER AXIS THE LANE RUNS, and
       below `tab` that is the horizontal one — the wall is three rows there, not
       four columns. Measuring the wrong axis does not fail loudly: the wrap
       lands at an arbitrary point in the content and the row visibly jumps once
       per cycle.

       761 IS `tab` FROM globals.css, WRITTEN OUT. It is the one number in this
       file duplicated from the stylesheet, and the layout classes below have to
       agree with it. There is no way to read a Tailwind breakpoint from script,
       and matching on a CSS class would be worse — this is at least a single
       named place. A breakpoint crossing is a resize, so the ResizeObserver
       already re-runs this; no separate media listener is needed. */
    const measure = () => {
      horizontal = !window.matchMedia("(min-width: 761px)").matches;
      for (let i = 1; i < COLUMNS; i++) {
        const track = tracks.current[i];
        if (!track) continue;
        /* A row hidden at this width measures 0 and is skipped in `write`. */
        setHeight[i] =
          (horizontal ? track.offsetWidth : track.offsetHeight) / COLUMN_SETS[i];
      }
      report();
    };

    const write = () => {
      frame = 0;
      if (origin === null) return;

      /* RAW SCROLL, UNCAPPED, measured from where the wall came into view. No
         normalisation, no ceiling — see property 3. */
      const delta = window.scrollY - origin;

      /* Column 0's drift layer is skipped entirely — it has no scroll response
         and nothing here ever touches it. Its track still runs the ambient lane;
         that is CSS and owes this loop nothing. */
      for (let i = 1; i < COLUMNS; i++) {
        const layer = drifts.current[i];
        const set = setHeight[i];
        if (!layer || !set) continue;
        /* ONE SCALAR, NOT A TRANSFORM. Which axis it applies to is a media
           query on the element, so the layout decides the direction and this
           loop stays identical at both widths — the alternative is branching on
           `horizontal` here and writing two different transform strings, which
           puts the breakpoint in two places that can disagree. */
        layer.style.setProperty(
          "--shift",
          `${wrap(-(delta * COLUMN_SPEED[i]), set)}px`
        );
      }
      report();
    };

    const onScroll = () => {
      /* Coalesce every event between two frames into one read, and only while
         the wall is on screen. Never an unthrottled handler. */
      if (!visible || frame) return;
      frame = requestAnimationFrame(write);
    };

    measure();

    /* MEASURING ONCE IS NOT ENOUGH, and it fails in the way that is hardest to
       see: a wall wired correctly that refuses to move. A set's height depends
       on the column's width, which depends on a grid still settling when the
       effect first runs, and on the display font, which lands later and can
       reflow the copy column beside it. Measure too early and the modulus is
       computed from a track that has not got its real height yet. */
    const ro = new ResizeObserver(() => {
      measure();
      write();
    });
    for (let i = 1; i < COLUMNS; i++) {
      const track = tracks.current[i];
      if (track) ro.observe(track);
    }

    /* THE CONTAINER OBSERVER DOES TWO JOBS. It captures the scroll origin the
       first time the wall comes into view, which is what makes the wall start
       neutral instead of pre-scrolled. And it short-circuits the scroll handler
       once the hero is gone.

       PLAYBACK IS PAUSED OFF SCREEN BY useInViewPlay, which observes each tile
       individually: when the hero leaves the viewport every tile in it leaves
       too, so all playback stops. Per-tile rather than per-wall is strictly
       more than the requirement — it also keeps the clips scrolled past the top
       of the wall from decoding while the ones below them are on screen. */
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      /* THE LANES STOP WHEN THE WALL IS NOT ON SCREEN, and this is the single
         most expensive thing the component was doing.

         The marquees are CSS animations, so nothing in JS was ever gating them:
         four tracks kept translating a 3D-rotated plane holding sixty video
         elements for as long as the page was open, including every second after
         the hero had scrolled away. A tilted plane is the worst case for that —
         the compositor cannot take its cheap path through a rotated layer, so
         every frame of an animation nobody can see was still being rasterised.

         The clips themselves were already handled: useInViewPlay observes each
         tile and pauses it on the way out. This is the other half of it. */
      el.toggleAttribute("data-off", !visible);
      if (visible) {
        if (origin === null) origin = window.scrollY;
        write();
      } else {
        report();
      }
    });
    io.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [columns]);

  return (
    <div
      ref={box}
      /* THE WALL IS ONE DECORATIVE OBJECT. role="img" plus a label describes it
         in a phrase and makes every clip inside it presentational, which is the
         correct reading of "decorative proof, not navigation": nothing here is
         focusable, nothing is a link, and a screen reader stepping through
         twenty-eight unlabelled videos would learn less than it does from the
         single sentence.

         FIXED HEIGHT AND overflow-hidden. The height comes from `className` and
         is never derived from the clips, so no amount of travel, no aspect ratio
         and no number of clips can make the wall grow or push the page down. */
      /* NOT role="img" ANY MORE, and that had to change the moment the clips
         became buttons: everything inside an element with role="img" is
         presentational, so sixty controls would have been announced as nothing
         at all. A labelled group keeps the one-phrase description of the wall
         while leaving the buttons inside it real. */
      role="group"
      aria-label={label}
      /* THE PERSPECTIVE LIVES HERE, ON THE BOX, because the thing being rotated
         is the STAGE — and `perspective` only applies to an element's direct
         children. 900px rather than the 1400 this had while the columns were
         rotated individually: perspective distance is what converts a rotation
         into visible foreshortening, and at 1400 against ~200px columns a 10
         degree turn produced about 2% of scale difference across a column,
         which is below the threshold where the eye reads "angled" at all. It
         was a very long lens on a very small subject. */
      className={`relative overflow-hidden tab:[perspective:900px] ${className}`}
    >
      {/* The columns are one object; the split between copy and wall is the real
          division on the page. Hence 16 here against the 48/64 the hero uses. */}
      {/* THE 3D IS GATED AT `tab:` AND THAT IS NOT A PERFORMANCE DECISION.
          Below the breakpoint the wall shows columns 1 and 2 only, and those are
          both on the SAME side of the centre line — placed in 3D they would tilt
          the same way and recede by different amounts, which is not a shallow
          version of the effect, it is a wall that looks accidentally skewed. The
          depth needs the symmetric four to read at all, so below `tab` the stage
          is a plain full-height grid and the parallax carries it alone. The
          overhang goes with it: cropping a grid that is not in 3D would just
          throw away the outer columns for nothing.

          THE WHOLE STAGE IS THE THING THAT TILTS, and that is the difference
          between reading as 3D and not. Rotating each column a few degrees on
          its own axis produced about 2% of scale difference across a column —
          arithmetically a rotation, visually nothing. One plane turned 8
          degrees swings its two edges 105px apart in Z, which against a 900px
          viewing distance is a ~25% size difference from one side of the wall
          to the other. That is a keystone you cannot miss.

          preserve-3d IS WHAT MAKES THE COLUMNS PART OF THAT PLANE rather than
          flat pictures painted on it. Without it the grid would rotate as a
          single flattened image and the per-column translateZ below would do
          nothing at all — the depth ramp would silently stop existing while
          every rule involved still looked correct.

          THE OVERHANG IS DIFFERENT ON THE TWO AXES, AND THAT IS THE WHOLE POINT
          OF SPLITTING IT. A grid sized exactly to the box leaves bare paper the
          moment anything recedes, so it has to be bigger and let the box crop
          it. But the two axes pay completely different prices for that:

            VERTICALLY the crop costs nothing. The lanes run up and down and
            never stop, so a clip crossing the top edge is just the marquee doing
            its job — there is no such thing as a clip that looks "cut" there.
            Hence 20%, which is generous, and buys ~150px of slack at the worst
            corner. It is the same constraint the set count answers from the
            other end: this overhang is part of what a set has to outlast, so
            raising it eats the slack COLUMN_SETS depends on.

            HORIZONTALLY the crop slices individual videos in half, and the
            two sides are NOT symmetric — which is the thing that is easy to get
            wrong and looks like a bug when you do.

            rotateY sends a point at +x to z = -sin(angle), so at a NEGATIVE
            angle it is the LEFT edge that recedes and the RIGHT edge that comes
            toward the viewer — the mirror of the way this used to lean. The near
            side is magnified (scale > 1) and already over-reaches the frame on
            its own; the far side projects small and falls short. They need
            opposite treatment, and the two numbers below swapped sides when the
            angle went negative:

              RIGHT gets a 4.5% INSET, not zero. At -22 degrees the near side
              projects at ~1.20 and overshoots the frame if the plane merely
              starts at its edge, so the plane is pulled slightly IN on this
              side. Solving for the magnification puts the right edge exactly on
              the frame at 4.5%: at 0 it overshot by ~14px and sliced that off
              the last column, at 8% symmetric it took ~29% off it.

              LEFT gets 13%, because at ~0.82 it lands well inside the frame
              without it.

          THE LEFT OVERHANG TRACKS THE TILT and has to be re-derived if the
          tilt changes: roughly 6% at 8 degrees, 11% at 15, 13% at 22. Too little and
          the left edge shows paper; too much and the left column is cropped for
          nothing. The right stays a small inset at any angle in this range.

          Both numbers are literal because Tailwind scans source TEXT and never
          sees a class built at runtime — see the note at the foot of lib/ui.ts,
          and the one at the head of this file on why they are not constants.

          THE NEAR SIDE IS A POSITIVE INSET, NOT ZERO. Dropping the per-column
          translateZ took 52px of recession off the outer columns, so the near
          side magnifies more than it did (~1.18 rather than ~1.11) and over-
          reaches the frame by more. Pulling the plane in on that side is what
          keeps its outermost column from being cropped again — the right one,
          now that the tilt runs right-to-left. */}
      <div
        ref={stage}
        className="grid grid-rows-3 gap-0 tab:absolute tab:-left-[13%] tab:right-[4.5%] tab:-inset-y-[20%] tab:h-auto tab:grid-rows-1 tab:grid-cols-4 tab:[transform:rotateY(-22deg)_rotateX(4deg)]"
      >
        {columns.map((column, c) => {
          const speed = COLUMN_SPEED[c];
          const sets = COLUMN_SETS[c];

          return (
            <div
              key={c}
              /* COLUMNS 3 AND 4 DROP BELOW `tab`, THEY DO NOT WRAP. The grid is
                 two columns wide down there and there are four children, so
                 without this the last two wrap onto a SECOND ROW and the wall
                 becomes a 2x2 block of half-height cells. Hiding them is what
                 makes the narrow layout two columns of full-height clips — and
                 columns 1 and 2 keep exactly the speeds they have at every other
                 width, static and 1.5x, because nothing about the speed table
                 is width-dependent.

                 overflow-hidden per cell as well as on the box: a moving track
                 runs past the bottom of its cell, and without a clip here that
                 overhang paints across the grid gap into its neighbour.

                 THE CELL CARRIES NO TRANSFORM OF ITS OWN, and that is what
                 keeps the wall clickable — see the note at the head of the file
                 on why preserve-3d and this element's overflow: hidden cannot
                 both exist without breaking hit testing. */
              /* THE GAP MOVED OUT OF THE GRID AND INTO THIS PADDING, so the
                 hover has somewhere to grow into. The cell clips its lane, so a
                 card scaled up against a cell sized exactly to it gets sliced
                 at both edges — the magnification would read as a rendering
                 fault. Half the gap as padding on each of two neighbours is the
                 same 16px between columns it was before, and now 8px of it is
                 inside the clip rather than between them. Block padding on the
                 phone, where the lanes are rows and the growth is vertical. */
              className={`relative overflow-hidden py-[8px] tab:px-[8px] tab:py-0 ${
                c > 2 ? "hidden tab:block" : ""
              }`}
            >
              {/* ---- drift layer: parallax only, written by JS ---- */}
              <div
                ref={(node) => {
                  if (speed > 0) drifts.current[c] = node;
                }}
                /* will-change ON THE SCROLL-DRIVEN COLUMNS ONLY. Column 1's
                   drift layer is never written to, so promoting it would cost a
                   composited layer for nothing — its motion is one level down,
                   on the track, which carries its own. */
                /* THE AXIS IS A MEDIA QUERY, NOT A BRANCH IN JS. `write` sets a
                   single --shift scalar; these two rules decide whether it
                   lands on X or Y, so the breakpoint lives in the stylesheet
                   with the layout that depends on it. */
                className="[transform:translate3d(var(--shift,0px),0,0)] tab:[transform:translate3d(0,var(--shift,0px),0)]"
              >
                {/* ---- track: ambient lane only, driven by CSS ---- */}
                <div
                  ref={(node) => {
                    tracks.current[c] = node;
                  }}
                  style={{
                    /* Read by the wall6-lane keyframe, which slides the track by
                       exactly 100%/sets — one set, whatever the count. */
                    "--sets": sets,
                    animationDuration: AMBIENT_DURATION[c],
                  } as CSSProperties}
                  /* NO will-change HERE, DELIBERATELY, AND IT USED TO BE ON BOTH
                     THIS AND THE DRIFT LAYER. It is the standard advice for an
                     animated transform and it is the wrong call at this size: a
                     track is COLUMN_SETS x 4 clips stacked, which at desktop
                     widths is between 2,800 and 4,200px tall. will-change pins
                     an element that big as a composited layer for the lifetime
                     of the page — eight of them, each re-rasterised at whatever
                     scale the tilted plane projects it to, and none of it
                     released when the lanes pause off screen, which is exactly
                     when the memory should be going back.

                     The browser promotes a running transform animation on its
                     own and can tile, rasterise only what is near the viewport,
                     and drop the layer when the animation stops. Saying nothing
                     gets all of that; will-change opts out of it.

                     Row on a phone, column from `tab` up — and the lane keyframe
                     flips with it. Both carry the same --sets contract, so the
                     wrap arithmetic is identical on either axis. */
                  /* w-max IS LOAD BEARING IN THE ROW LAYOUT, and without it the
                     phone wall is wrong in two ways at once. A flex container is
                     block-level, so its width would be the CELL's, not the
                     clips' — `offsetWidth` would hand `measure` the wall's width
                     as the modulus, and the keyframe's -100%/--sets would slide
                     the track by a third of the CELL rather than a third of its
                     content. max-content makes the track as wide as what is in
                     it, which is what both of those numbers are supposed to be.
                     In the column layout the height is content-driven already,
                     so it goes back to auto. */
                  /* HOVERING A CLIP STOPS ITS OWN LANE, and only that lane. A
                     card you are trying to click should not be sliding out from
                     under the pointer, and the parallax cannot be paused (it is
                     a function of scroll position, not a clock) so the ambient
                     lane is the part that can. `:has(button:hover)` rather than
                     a bare :hover on the track: the track is far taller than the
                     cell it shows through, and a bare hover would also fire in
                     the gaps between clips, which reads as the wall stalling at
                     random. */
                  className="flex w-max animate-wall6-lane-x [&:has(button:hover)]:[animation-play-state:paused] [[data-off]_&]:[animation-play-state:paused] tab:w-auto tab:animate-wall6-lane tab:flex-col"
                >
                  {/* Duplication exists so the wraps have somewhere to go. Two
                      copies for the column carrying one offset, three for the
                      columns carrying two — see COLUMN_SETS. */}
                  {Array.from({ length: sets }, () => column)
                    .flat()
                    .map((clip, r) => (
                      <Clip
                        key={`${r}-${clip.src}`}
                        clip={clip}
                        onOpen={() => setActive(clip)}
                        /* The first copy of each clip is the one in the tab
                           order; r < column.length is exactly the first set. */
                        reachable={r < column.length}
                        /* Unique across every wall on the page — useInViewPlay
                           budgets play slots per lane, and colliding with
                           another wall's lane id would share one budget between
                           two unrelated columns. */
                        lane={`v6-wall-${c}`}
                        play={play}
                      />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Soft edges, so clips fade out rather than being sliced by the crop.
          --fade-stops is the page's own smoothstep ramp, keyed to --color-paper
          — a straight alpha ramp lands as a visible band, and these stops hug
          full paper, drop through the middle and tail off flat into nothing. */}
      {/* THE FADES ARE `tab`-AND-UP ONLY. From `tab` the lanes run vertically,
          so a top and a bottom ramp soften the edges the columns actually
          enter and leave by. On a phone the lanes run horizontally and the
          matching pair would be side ramps — but at a 13% width against a
          phone's measure they read as a shadow down both edges of the section
          rather than as the rows continuing past the frame, which is the same
          objection that removed the desktop side pair below. So the phone gets
          a clean crop and no gradient at all: `hidden tab:block`, not a
          responsive rewrite of the same two elements. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] hidden h-[64px] bg-[linear-gradient(to_bottom,var(--fade-stops))] tab:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[64px] bg-[linear-gradient(to_top,var(--fade-stops))] tab:block"
      />

      {/* NO SIDE FADES ON DESKTOP, DELIBERATELY. There were two here — a 3%
          ramp on the left and 6% on the right — softening the edges the tilted
          plane is cropped by, on the reasoning that a sliced column reads as a
          bug where a faded one reads as the wall continuing past the frame.
          They read as a shadow down both sides of the section instead, so they
          are gone and the crop is a clean cut.

          WHAT THAT COSTS, if either edge ever looks wrong again: the overhang
          on the far side of the tilt is still there (a plane turned 22 degrees
          has to be wider than its frame to still reach the far edge once it
          recedes), so the far column IS sliced — it is just sliced sharply now.
          The fix is the inset/overhang pair on the stage above, not a gradient
          back here. The top/bottom pair above is untouched: it softens the edge
          the lanes actually enter and leave by, and it is the one pair that
          never reads as a shadow. */}

      {/* THE OVERLAY. Everything about opening a clip is already solved here —
          it portals to the body, autoplays the HQ cut with audio, traps focus on
          the close button, closes on Escape or a backdrop click and locks the
          page behind it. The wall only has to say which clip.

          `id`/`hq` are optional on ReelClip, so a caller that supplies only
          tiles still works: the overlay falls back to the tile cut. */}
      {active && (
        <Lightbox
          reel={{
            id: active.id ?? active.src,
            src: active.src,
            hq: active.hq ?? null,
            poster: active.poster,
          }}
          onClose={() => setActive(null)}
        />
      )}

      {debug && (
        <pre
          ref={readout}
          aria-hidden="true"
          className="pointer-events-none absolute top-[8px] left-[8px] z-[3] rounded-[8px] bg-ink/85 px-[12px] py-[8px] font-mono text-[11px] leading-[1.5] whitespace-pre text-paper"
        />
      )}
    </div>
  );
}

/* Bring an unbounded translate into (-set, 0], which is the half-open range
   where the visible window is always inside real content.

   A BARE `%` IS NOT ENOUGH, and the case it misses is real rather than
   theoretical. JavaScript's remainder keeps the sign of the dividend, so
   `-(delta * speed) % set` lands in (-set, 0] only while `delta` is positive.
   Scroll UP past the point the wall entered the viewport — trivial to do when
   the wall sits at the top of a page and you arrive at it from below — and
   delta goes negative, the remainder comes back POSITIVE, and the track is
   pushed DOWN off its own top edge, exposing a gap above the first clip. This
   is the standard floored-modulus fix and it agrees with the reference formula
   exactly wherever the reference is defined. */
function wrap(y: number, set: number): number {
  return ((y % set) - set) % set;
}

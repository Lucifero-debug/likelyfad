"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInViewPlay } from "@/lib/useInViewPlay";
import type { WallClip, WallColumns } from "@/lib/v8/data";

/* ============================================================================
   THE REEL WALL — four columns of client work, each running a continuous
   vertical marquee, and each drifting at its own speed as the page scrolls.

   TWO MOTIONS, AND THEY ARE NOT THE SAME MOTION. This is the thing to hold on
   to when reading the markup, because the wall looks wrong the moment they are
   confused for each other:

     THE MARQUEE is self-driven and never stops. It runs whether or not the
     page is scrolling, and it is what makes the wall feel alive when the
     visitor is sitting still looking at the hero. Pure CSS, no JS per frame.

     THE PARALLAX is scroll-driven and has no motion of its own. It is a
     per-column offset derived from where the wall sits in the viewport, and
     with the page still it contributes exactly nothing.

   THEY LIVE ON SEPARATE ELEMENTS BECAUSE THEY BOTH WRITE `transform`, and an
   element has one. The earlier version of this file drove the drift from the
   same node that held the column, which was fine only for as long as there was
   no marquee — its own comment said so. Nesting them composes the two
   translates for free, the way the browser is built to: the outer layer is
   offset by the drift, the inner one slides inside it forever.

     column cell        relative, clips the lane
       drift layer      transform: the parallax offset (JS writes --p)
         track          animation: lane-y, translateY(0 -> -50%)
           clip x8      the four clips, rendered twice

   THE TRACK RENDERS ITS CLIPS TWICE AND SLIDES BY EXACTLY HALF ITS OWN LENGTH,
   which is the standard seamless-marquee construction and the same one the
   homepage wall uses — the frame the animation ends on is pixel-identical to
   the one it started on, so the loop needs nothing driving it.

   THE SPACING IS A MARGIN, NOT A FLEX GAP, AND THAT IS LOAD-BEARING. With a
   16px `gap`, eight items have SEVEN gaps, so half the track is four clips plus
   3.5 gaps while one full copy is four clips plus four — the loop point lands
   8px out and the wall visibly hitches once per cycle. A bottom margin on every
   item, including the last, makes one copy exactly half the track. (The
   homepage wall has the same 0.5-gap error; at its 4px gap it is a 2px hitch
   every 78 seconds, which is why nobody has ever seen it.)

   THE SPEED RAMP IS THE POINT OF THE PARALLAX. Each column drifts faster than
   the one before it by a constant factor — four columns at arbitrary speeds
   read as four things sliding, and four columns on a fixed ratio read as
   receding depth. The ratio is what matters, not the absolute numbers.

   PROGRESS IS MEASURED ACROSS THE WALL'S WHOLE TRIP THROUGH THE VIEWPORT.
   `p` runs 0 as the top edge enters the bottom of the window, through 0.5 with
   the wall centred, to 1 as the bottom edge leaves the top. It depends on
   nothing but the wall's own rect, so it behaves identically at the top of a
   page, in the middle of one, and on a route with only a screenful below it.
   Normalising against the wall's own top edge instead (-rect.top / height) is
   the tempting version and it is broken anywhere below the fold: it pins at 0
   for the entire time the wall is comfortably in view and only starts moving as
   the wall EXITS upward, so you scroll to it, look straight at it, and nothing
   happens.

   NEUTRAL IS THE MIDDLE OF THE TRAVEL, hence (p - 0.5) in the transform. At 0.5
   the wall is centred in the window, which is where a reader actually looks at
   it, and every column is at zero drift there — so the arrangement that was
   designed is the one on screen when it is being read.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   THE DRIFT CONSTANTS. Tune the parallax from here.

   RAMP_BASE is the constant factor between adjacent columns. MAX_DRIFT is the
   total travel of the FASTEST column, in px, over the whole scroll-through.
   Everything else is derived, so the ramp cannot drift out of proportion by
   somebody editing one number in a list.

   IF THE FOURTH COLUMN LOOKS LIKE IT IS RACING, LOWER RAMP_BASE — 1.3 gives
   [109, 142, 185, 240]. Do NOT cap the fourth column on its own: the constant
   ratio across all four is exactly what produces the depth read, and flattening
   one end of it turns the effect back into four things sliding.

   At the values below: [71, 107, 160, 240]. */
const RAMP_BASE = 1.5;
const MAX_DRIFT = 240;

/* Alternating direction — odd columns drift up, even columns drift down. The
   alternation reads as more depth than one shared direction, and it halves the
   travel any single column needs to show the same separation. */
const COLUMN_DRIFT: number[] = Array.from({ length: 4 }, (_, i) => {
  const ratio = Math.pow(RAMP_BASE, i) / Math.pow(RAMP_BASE, 3);
  const direction = i % 2 === 0 ? -1 : 1;
  return Math.round(MAX_DRIFT * ratio) * direction;
});

/* Neutral is the middle of the travel, so the furthest any column ever gets
   from rest is HALF the total. That is the amount of track that has to exist
   above the top edge and below the bottom edge of the box at all times, and it
   is why the drift layer is lifted by exactly this much — see the note on
   `measure` for the arithmetic that keeps it honest. */
const DRIFT_HEADROOM = MAX_DRIFT / 2;

/* ---------------------------------------------------------------------------
   THE MARQUEE CONSTANTS.

   ONE LOOP PER COLUMN, ALL DIFFERENT, AND NONE OF THEM A MULTIPLE OF ANOTHER.
   Equal durations would lock the four columns into step and the wall would read
   as one sheet sliding; a duration that is twice another re-syncs those two
   every other cycle, which is the same failure arriving more slowly. These are
   slow on purpose — the marquee is ambient texture behind the headline, and
   anything quick enough to track with your eye competes with the copy.

   The direction alternates with the drift direction rather than against it, so
   a column's ambient travel and its parallax travel agree. */
const LANE_DURATION = ["78s", "91s", "67s", "103s"];

/* Vertical space between clips, in px. Written as a number because the track
   arithmetic in `measure` needs it as one and the two must not disagree. */
const CLIP_GAP = 16;

/* Kept back from the measured room so a rounding error or a sub-pixel layout
   never lands the drift exactly on the edge of the track. */
const SAFETY_PX = 12;

/* ---------------------------------------------------------------------------
   ONE CLIP. Its own component only because useInViewPlay is a hook and the
   track maps over an array — calling a hook inside that map would tie the
   hook order to the clip count. */
function Clip({ clip, lane, play }: { clip: WallClip; lane: string; play: boolean }) {
  const video = useInViewPlay(lane, play);

  return (
    <div
      /* The aspect box is on the WRAPPER, so the space a clip occupies is
         decided before anything is fetched and is identical whether it ends up
         holding a decoded frame, a poster, or neither. Nothing in the wall
         moves as media loads — which matters far more here than it did before,
         because a track that changes height mid-animation changes what -50%
         means and breaks the loop point.

         flex-none so the column's own height can never compress a clip out of
         its aspect ratio. marginBottom rather than the parent's `gap`: see the
         note at the top on why half the track has to be exactly one copy. */
      style={{ marginBottom: `${CLIP_GAP}px` }}
      className="relative aspect-[9/16] w-full flex-none overflow-hidden rounded-[12px] bg-poster"
    >
      <video
        ref={video}
        src={clip.src}
        poster={clip.poster}
        muted
        loop
        playsInline
        /* none, not metadata: the track holds 32 clips and useInViewPlay only
           ever starts the handful actually on screen, staggered. Pulling
           metadata for all 32 up front is 32 requests for tiles that mostly are
           not visible and may never become visible. */
        preload="none"
        tabIndex={-1}
        aria-label={clip.alt}
        className="size-full object-cover"
      />
    </div>
  );
}

export function ReelWall({
  columns,
  className = "",
  label = "A wall of recent client ads, all of them AI-generated",
  debug = false,
}: {
  columns: WallColumns;
  className?: string;
  label?: string;
  /** Renders a live readout of the values that decide whether anything moves.
      See the note on `readout` below — "it isn't moving" has several possible
      causes and no way to tell them apart by eye. */
  debug?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);

  /* THE ONE PIECE OF MOTION STATE THAT HAS TO BE REACTIVE, because it gates
     whether the clips register for playback at all and that is a prop on 32
     children rather than something to write to the DOM by hand.

     It starts false so the server and the first client paint agree — the
     server has no media query to read, and rendering "playing" and then
     correcting it is a hydration mismatch. The effect below settles it. */
  const [play, setPlay] = useState(false);

  /* THE READOUT IS WRITTEN TO DIRECTLY, NOT THROUGH STATE. Putting p into
     useState would re-render the whole wall on every animation frame, which is
     both a real cost and a way to make a performance problem look like the bug
     you were chasing. textContent on one node costs nothing and cannot
     invalidate anything else. */
  const readout = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const box = container.current;
    if (!box) return;

    /* Read once rather than subscribed, which is the call every other scroll
       effect in this repo makes: a visitor who changes the setting mid-session
       gets it on their next navigation, and a live listener would be another
       thing to tear down for no real gain. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* AUTOPLAYING VIDEO IS ITSELF MOTION, which is why the preference stops
       playback and not just the drift. The marquee is stopped by the global
       reduced-motion rule in globals.css, which flattens every animation on the
       page — a seamless loop frozen at its end frame is pixel-identical to the
       same loop at its start, so what is left is simply the wall, still. */
    setPlay(!reduced);

    let frame = 0;
    let visible = false;

    /* Last computed values, kept only so the debug readout can show them. */
    let lastP = 0.5;
    let lastFit = 1;
    /* `ticks` separates "the listener never fires" from "it fires and p does
       not change", which the p value alone cannot tell you. */
    let ticks = 0;
    let trackH = 0;
    let boxH = 0;

    const report = () => {
      const el = readout.current;
      if (!el) return;
      /* The things that independently stop this wall moving. If drift is 0px,
         read UP the list to find which one did it. */
      el.textContent = [
        `reduced motion : ${reduced}${reduced ? "  <- ALL MOTION OFF BY DESIGN" : ""}`,
        `on screen      : ${visible}`,
        `track / box    : ${trackH} / ${boxH}${trackH === 0 || boxH === 0 ? "  <- UNMEASURED" : ""}`,
        `fit            : ${lastFit.toFixed(3)}${lastFit === 0 ? "  <- NO ROOM FOR DRIFT" : ""}`,
        `scroll ticks   : ${ticks}${ticks === 0 ? "  <- HANDLER NEVER RAN" : ""}`,
        `progress p     : ${lastP.toFixed(3)}`,
        `col4 drift     : ${((lastP - 0.5) * COLUMN_DRIFT[3] * lastFit).toFixed(1)}px`,
        `computed --p   : ${getComputedStyle(box).getPropertyValue("--p").trim() || "(empty)"}`,
      ].join("\n");
    };

    /* ---- how much drift this layout can afford ------------------------- */

    /* THE ROOM IS NOT A CONSTANT, which is the whole reason this measurement
       exists. The clips are 9:16, so their height is a function of COLUMN
       WIDTH, and the column width swings with the viewport. A hard 240px drift
       is comfortable at 1800px and can run past the end of the track at the
       narrow end, which would show empty paper at the top or bottom of a lane.

       THE ARITHMETIC. The track is two copies; the marquee slides it from 0 to
       minus one copy, so at the far end of a cycle the track's bottom edge has
       come up by exactly `half`. The drift layer is lifted by DRIFT_HEADROOM,
       so for the box to stay covered at every combination of marquee phase and
       drift:

         half  >=  box + 2 * DRIFT_HEADROOM

       `room` is how much slack there is per side, and `fit` is that slack
       expressed as a fraction of the headroom the drift actually wants.

       `fit` IS ONE FACTOR APPLIED TO ALL FOUR COLUMNS, which is the important
       part: clamping only the column that overflowed would flatten the ramp at
       one end and break the constant ratio the depth illusion depends on.
       Scaling all four preserves 1 : 1.5 : 2.25 : 3.375 exactly and just makes
       the whole effect proportionally smaller where there is less room. */
    const measure = () => {
      const track = probe.current;
      if (!track) return;
      trackH = track.offsetHeight;
      boxH = box.clientHeight;
      const half = trackH / 2;
      const room = (half - boxH - SAFETY_PX) / 2;
      const fit = Math.max(0, Math.min(1, room / DRIFT_HEADROOM));
      box.style.setProperty("--fit", String(fit));
      lastFit = fit;
      report();
    };

    /* ---- the parallax -------------------------------------------------- */

    const write = () => {
      frame = 0;
      ticks++;
      const rect = box.getBoundingClientRect();
      /* 0 as the wall's top edge enters the bottom of the viewport, 0.5 when it
         is centred on screen, 1 once its bottom edge leaves the top. The
         denominator is the full distance the wall travels across the window, so
         the rate is independent of how tall the wall or the window happens to
         be — and, critically, of where on the page the wall sits. */
      const p = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
      );
      box.style.setProperty("--p", String(p));
      lastP = p;
      report();
    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = requestAnimationFrame(write);
    };

    /* ---- wiring -------------------------------------------------------- */

    measure();

    /* MEASURING ONCE IS NOT ENOUGH and this is the failure that is hardest to
       see, because it leaves a wall that is wired correctly and still refuses
       to move. The track's height depends on the column's width, which depends
       on a grid that is itself still settling when the effect first runs — and
       on the display font, which lands later and can reflow the copy column
       beside it. Measure too early and `fit` is computed from a track that is
       shorter than the box, which pins it at 0 and scales the entire drift to
       nothing, permanently. A ResizeObserver on the track fires on the real
       height whenever it arrives, so the window-resize listener is a
       convenience rather than the only chance to get this right. */
    const ro = new ResizeObserver(measure);
    if (probe.current) ro.observe(probe.current);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      report();
      if (visible && !reduced) write();
    });
    io.observe(box);

    /* REDUCED MOTION NEVER ATTACHES THE LISTENER, so --p keeps the 0.5 the
       server rendered — the neutral point — and every column sits at exactly
       zero drift. That is the wall rendered static, not the wall rendered
       slower, and it is the same composition everyone else sees when the wall
       is centred rather than a separate degraded layout. */
    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

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
      ref={container}
      /* THE WALL IS ONE DECORATIVE OBJECT, not thirty-two. role="img" plus a
         label describes it in one phrase and makes every clip inside it
         presentational, which is the correct reading of "decorative proof, not
         navigation": nothing here is focusable, nothing is a link, and a screen
         reader stepping through thirty-two unlabelled videos would learn less
         than it does from the single sentence.

         --p and --fit are seeded here so the FIRST PAINT is the zero-drift
         composition, server and client agree, and nothing jumps on hydration. */
      role="img"
      aria-label={label}
      style={{ "--p": 0.5, "--fit": 1 } as CSSProperties}
      className={`relative overflow-hidden ${className}`}
    >
      {/* The columns are one object; the split between copy and wall is the
          real division. Hence 16 here against the 64 the section uses. */}
      <div className="grid h-full grid-cols-2 gap-[16px] tab:grid-cols-4">
        {columns.map((column, c) => (
          <div
            key={c}
            /* THE LAST TWO COLUMNS DROP BELOW `tab`, THEY DO NOT WRAP. The grid
               is two columns wide down there and there are four children, so
               without this the third and fourth wrap onto a SECOND ROW and the
               wall becomes a 2x2 block of half-height cells — which is not
               "two columns on mobile", it is the four-column layout folded in
               half.

               overflow-hidden per cell as well as on the box: the drift layer
               is lifted above the top of its cell and the track runs past the
               bottom, and without a clip here that overhang paints over the
               grid gap into the neighbouring column. */
            className={`relative overflow-hidden ${c > 1 ? "hidden tab:block" : ""}`}
          >
            {/* ---- drift layer: parallax only, no animation ---- */}
            <div
              style={
                {
                  "--drift": `${COLUMN_DRIFT[c]}px`,
                  /* Lifted by the maximum the drift can ever ask for, so there
                     is always a headroom of track above the top edge no matter
                     which way this column is currently pushed. `measure`
                     guarantees the matching headroom below. */
                  top: `-${DRIFT_HEADROOM}px`,
                  transform:
                    "translate3d(0, calc((var(--p) - 0.5) * var(--drift) * var(--fit)), 0)",
                } as CSSProperties
              }
              className="absolute inset-x-0 will-change-transform"
            >
              {/* ---- track: marquee only, no parallax ---- */}
              <div
                ref={c === 0 ? probe : undefined}
                /* animationDuration inline overrides the shorthand's 90s that
                   comes with the utility class, which is how the homepage wall
                   varies its lanes too. */
                style={{ animationDuration: LANE_DURATION[c] }}
                className={`flex animate-lane-y flex-col will-change-transform ${
                  c % 2 === 1 ? "[animation-direction:reverse]" : ""
                }`}
              >
                {/* Twice, which is what makes -50% a seamless loop. The key
                    carries the copy index because the same src appears in
                    both halves. */}
                {[...column, ...column].map((clip, r) => (
                  <Clip
                    key={`${r}-${clip.src}`}
                    clip={clip}
                    /* Unique across every wall on the page — useInViewPlay
                        budgets its play slots per lane, and colliding with the
                        homepage wall's "wall-0" would share a budget between
                        two unrelated columns. */
                    lane={`v8-wall-${c}`}
                    play={play}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Soft edges, so clips fade out rather than being sliced by the crop.
          --fade-stops is the page's own smoothstep ramp, keyed to --color-paper
          — a straight alpha ramp lands as a visible band, and these stops hug
          full paper, drop through the middle and tail off flat into nothing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[96px] bg-[linear-gradient(to_bottom,var(--fade-stops))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[96px] bg-[linear-gradient(to_top,var(--fade-stops))]"
      />

      {/* THE DIAGNOSTIC. Off by default and not rendered at all unless asked
          for, so it costs the shipped component one boolean. It exists because
          "the wall is not moving" has several independent causes and none of
          them is distinguishable by looking at the wall. */}
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

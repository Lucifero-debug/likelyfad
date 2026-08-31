"use client";

import { useRef, useState } from "react";
import { reelVideos } from "@/lib/reels.generated";
import { takeReels } from "@/lib/reelOrder";
import { PLAYGROUND_CLIPS, tag } from "@/lib/v4/data";
import { MONO, T_12, WRAP } from "@/lib/v4/theme";
import { useMounted, useNarrow, useReducedMotion } from "@/lib/v4/useMedia";
import { ReelTile } from "./ReelTile";
import { StudioStatement } from "./StudioStatement";

/* ============================================================================
   THE PLAYGROUND — the signature, and the only place this page spends any
   boldness at all.

   WHY THE DRAG EARNS ITS PLACE. A draggable media canvas is a portfolio trope
   and on most sites it exists to delight other designers. What makes it ours
   is the SLUG on every clip: each carries the vertical it was made for, so
   sorting the pile is the job a brand marketer actually came to do. They look
   for their own sector before they look at anything else, and here the gesture
   and the search are the same gesture.

   IT STARTS OFF, ON EVERY DEVICE, AND THEN TURNS ITSELF ON.
   The server renders the static grid, always. After hydration the canvas
   switches on unless the visitor is on a narrow screen or has asked for less
   motion. That ordering is deliberate three times over: it is the only way the
   markup can be identical on both sides of hydration, no drag code runs before
   the page is interactive, and the fallback is the state that SHIPS rather
   than the state we hope nobody sees.

   THE CLIPS DO NOT REMOUNT WHEN IT SWITCHES. On and off are the same elements
   under the same parent with different classes, so toggling never tears down a
   video, never refetches, and never restarts a clip mid-play. That is also why
   the canvas is switched between `absolute inset-0` and a grid rather than
   being conditionally rendered.

   NOTHING IS BEHIND THE DRAG.
     - The statement is FIRST IN THE DOM, above the canvas, so a keyboard, a
       screen reader and a marketer with eight seconds all reach the read
       before the interaction.
     - Every clip here also appears in the work strip below, as a plain
       scrollable list.
     - Each clip on the canvas is focusable and moves under the arrow keys, so
       the gesture has a real keyboard equivalent rather than only an escape
       hatch.
   ========================================================================== */

const CLIPS = takeReels(reelVideos, 0, PLAYGROUND_CLIPS).map(tag);

/* Hand-placed, not generated. A seeded shuffle would have been fewer lines and
   would have scattered clips across the lower left, which is the one region of
   this canvas that has to stay clear for the statement. Percentages for
   position so the arrangement survives any viewport width; pixels for width so
   a clip stays a clip rather than becoming a fraction of the screen.
   Rotations are small — past about six degrees a scattered pile stops reading
   as a desk and starts reading as an effect.

   THE CLEAR REGION IS THE LOWER LEFT, roughly x 15 to 62 below y 60, because
   that is where the statement sits and the statement is the one thing on this
   page that has to be readable before anything is touched. Index 6 started at
   x 56 y 44 and its slug landed across the second line of it; moved to the
   empty middle-left instead, which also balances a scatter that was piling up
   along the top edge. Anything added here has to clear that region too. */
const LAYOUT = [
  { x: 2, y: 4, w: 104, r: -5 },
  { x: 18, y: 1, w: 88, r: 3 },
  { x: 33, y: 9, w: 116, r: -2 },
  { x: 51, y: 2, w: 96, r: 5 },
  { x: 64, y: 13, w: 132, r: -3 },
  { x: 85, y: 4, w: 100, r: 4 },
  { x: 28, y: 36, w: 112, r: -4 },
  { x: 76, y: 56, w: 92, r: 6 },
  { x: 89, y: 32, w: 104, r: -2 },
] as const;

/* One arrow press. Large enough to be worth pressing, small enough to place a
   clip deliberately. */
const NUDGE = 16;

export function Playground() {
  const narrow = useNarrow();
  const reduced = useReducedMotion();
  const mounted = useMounted();

  /* DERIVED, AND OVERRIDABLE — not synced in an effect.

     The default is a function of three external facts, and the moment the
     visitor touches the switch it becomes a function of their choice instead.
     Written as `override ?? default` there is no effect, no cascading render,
     and no window where the two disagree.

     It also fixes a bug the effect version had: syncing on [narrow, reduced]
     meant a visitor who deliberately turned the playground ON had it turned
     back off the next time they resized the window. An explicit choice should
     outlast a resize, and here it does. */
  const [override, setOverride] = useState<boolean | null>(null);
  const on = override ?? (mounted && !narrow && !reduced);

  /* Committed offsets, in pixels, one per clip. A ref and not state: a drag
     writes a transform on every pointer event, and routing sixty of those a
     second through React would re-render nine videos for no reason. */
  const offsets = useRef(LAYOUT.map(() => ({ x: 0, y: 0 })));
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<{ i: number; px: number; py: number; ox: number; oy: number } | null>(null);
  const top = useRef(1);

  function paint(i: number) {
    const node = nodes.current[i];
    if (!node) return;
    const { x, y } = offsets.current[i];
    node.style.transform = `translate(${x}px, ${y}px) rotate(${LAYOUT[i].r}deg)`;
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>, i: number) {
    if (!on) return;
    const node = nodes.current[i];
    if (!node) return;
    node.setPointerCapture(e.pointerId);
    /* Whatever you last touched sits on top, which is how a pile of paper
       behaves and the only z-order that never surprises. */
    node.style.zIndex = String(++top.current);
    drag.current = {
      i,
      px: e.clientX,
      py: e.clientY,
      ox: offsets.current[i].x,
      oy: offsets.current[i].y,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    offsets.current[d.i] = { x: d.ox + e.clientX - d.px, y: d.oy + e.clientY - d.py };
    paint(d.i);
  }

  function onPointerUp() {
    drag.current = null;
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>, i: number) {
    if (!on) return;
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-NUDGE, 0],
      ArrowRight: [NUDGE, 0],
      ArrowUp: [0, -NUDGE],
      ArrowDown: [0, NUDGE],
    };
    const move = step[e.key];
    if (!move) return;
    /* Only once we know the key is one of ours — swallowing every keystroke
       would break scrolling for anyone tabbed into the canvas. */
    e.preventDefault();
    offsets.current[i] = {
      x: offsets.current[i].x + move[0],
      y: offsets.current[i].y + move[1],
    };
    paint(i);
  }

  return (
    <section id="top" className="relative">
      {/* FIRST IN THE DOM, ON PURPOSE — see the note above. When the canvas is
          on it is absolutely positioned behind this, so this block keeps the
          reading order regardless of what the layout is doing. */}
      <div
        className={`${WRAP} relative z-20 pt-[96px] pb-[clamp(48px,5vw,64px)] ${
          on ? "flex min-h-[100svh] flex-col justify-end" : ""
        }`}
      >
        <div className="max-w-[640px]">
          <StudioStatement />
        </div>

        <div
          className={`${MONO} ${T_12} mt-[48px] flex flex-wrap items-center gap-x-[16px] gap-y-[8px] text-ash`}
        >
          <span>{on ? "Drag to explore" : "Playground"}</span>

          {/* Two buttons rather than one toggle. A single button has to label
              itself either with its state or with its action, and gets read
              the other way half the time; a pressed pair says both at once. */}
          <span role="group" aria-label="Playground" className="flex items-center gap-[8px]">
            {(["On", "Off"] as const).map((option) => {
              const active = (option === "On") === on;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setOverride(option === "On")}
                  className={active ? "text-carbon underline underline-offset-4" : "text-ash"}
                >
                  {option}
                </button>
              );
            })}
          </span>

          {on && (
            <button
              type="button"
              onClick={() => setOverride(false)}
              aria-label="Turn the playground off"
              className="text-ash transition-colors duration-200 hover:text-carbon"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* THE CANVAS — one element, two behaviours.

          On: absolutely positioned over the whole section, clips placed by
          percentage and clipped at the edges so the pile reads as bigger than
          the window.
          Off: a plain grid in normal flow, under the statement. */}
      <div
        className={
          on
            ? "absolute inset-0 z-0 overflow-hidden"
            : `${WRAP} grid grid-cols-3 gap-[8px] pb-[clamp(48px,5vw,64px)] phone:grid-cols-4 tab:grid-cols-5`
        }
      >
        {CLIPS.map((item, i) => {
          const place = LAYOUT[i];
          return (
            <div
              key={item.reel.id}
              ref={(node) => {
                nodes.current[i] = node;
              }}
              data-drag={on ? "on" : "off"}
              tabIndex={on ? 0 : -1}
              role={on ? "group" : undefined}
              aria-label={
                on
                  ? `${item.vertical} ${item.format} clip. Use the arrow keys to move it.`
                  : undefined
              }
              onPointerDown={(e) => onPointerDown(e, i)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={(e) => onKeyDown(e, i)}
              style={
                on
                  ? {
                      position: "absolute",
                      left: `${place.x}%`,
                      top: `${place.y}%`,
                      width: place.w,
                      transform: `rotate(${place.r}deg)`,
                    }
                  : undefined
              }
              className={on ? "select-none" : ""}
            >
              <ReelTile
                reel={item.reel}
                /* Three lanes across nine clips, so useInViewPlay's per-lane
                   cap cannot spend every slot on the first three registered. */
                lane={`v4-play-${i % 3}`}
                alt={`Still from an AI ad made for a ${item.vertical} brand`}
              />

              {/* THE SLUG — what makes this pile ours rather than a generic
                  scatter. Only on the canvas: in the grid fallback the work
                  strip's own labels are already doing this job one screen
                  down, and repeating them here would put the same four words
                  on the page twice. */}
              {on && (
                <p className={`${MONO} ${T_12} mt-[8px] text-ash`}>
                  {item.vertical} · {item.format}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

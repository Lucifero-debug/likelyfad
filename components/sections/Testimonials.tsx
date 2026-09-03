"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { reelVideos, type Reel } from "@/lib/reels.generated";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import {
  CARD_GAP,
  HEAD_GAP,
  SECTION,
  SIZE_16,
  SIZE_24,
  SIZE_64,
  TEXT_META,
  TEXT_SMALL,
  WRAP,
} from "@/lib/ui";

const { testimonials } = content;

/* TESTIMONIALS — video cards that play in place.

   Built to the shape of Framer's `Testimonials Video` component — an auto-fit
   grid of cards that expand into a real player rather than opening an overlay —
   and then moved three steps away from it, each for a reason this page's own
   material forced:

     1. THE FRAME IS 9:16, NOT ONE OF THE REFERENCE'S FIVE RATIOS. Every reel in
        the library is vertical. At 3:4 the card threw away a third of each
        frame and the crop had to be biased up to keep faces in shot; at 9:16
        nothing is cut and the ad is shown as it was made. This is a section
        about the work being convincing, so cropping the work to fit a card was
        the wrong trade — the card fits the work instead.

     2. THE CARD IS PAPER, NOT GLASS. The reference sets its quote over the
        video behind a dark gradient. That reads beautifully in isolation and
        reads as a different website here: every other card on this page is
        white on paper with ink type and a pink accent. So the frame keeps its
        own corners inside a white card, and the quote sits under it on paper
        where it needs no scrim to be legible.

     3. THERE IS NO PLAY BUTTON. The reference puts a disc in the middle of
        every card and this has none, because a disc is an instruction to do
        something the card has already done: the clip is ALREADY RUNNING by the
        time you could aim at it. What replaces it is a cue that names the one
        thing left to gain — sound — and it only appears once the picture is
        moving, so nothing is ever asking to be pressed for a result it is
        already showing.

     4. IT PLAYS WITHOUT BEING ASKED, BY WHICHEVER MEANS THE DEVICE HAS. On a
        pointer device that is hover. On a touch device there is no hover, and
        the usual answer — put the button back for phones — gives the smallest
        screen the clumsiest version. So on a touch device the card plays when
        it REACHES THE MIDDLE OF THE VIEWPORT, one at a time, the way a feed
        behaves: scrolling IS the gesture. Both routes end in the same place,
        a silent clip with a cue offering sound, and neither needs a control.

   WHAT THE CARD CLAIMS, WHICH IS THE ONE THING NOT TO GET WRONG HERE. A play
   button over a face with a quote beneath it reads as "this video is the client
   speaking". These clients are unnamed, asked to stay that way, and none of them
   is on camera — so the caption above every quote says the frame is THE AD THE
   REACTION WAS ABOUT. It is not decoration: without it this section invents
   three video testimonials that do not exist. Moving the quote onto paper is
   what let this stop being a pill floating on the video and become an ordinary
   line of type, which is a better place for it.

   NO BRAND LOGOS, which the reference puts on every card. There are none, for
   the same reason there are no names.

   MEDIA ELEMENTS ARE CREATED, NEVER PARKED. A card at rest is a poster and
   nothing else: the preview clip mounts when the card is pointed at or scrolled
   into the middle band, and dies the moment it is not; the full player mounts on
   click and dies when another card takes over. The in-view route deliberately
   picks ONE card rather than every card in frame, which is what keeps this true
   on a phone where all three can be near the viewport at once. So the section
   holds at most ONE <video> at any moment. That is not fussiness — the
   page already mounts 128 of them between the hero wall and the work wall,
   which is past the number of media players a browser keeps alive at once, and
   three permanent ones here would come out of that budget to show a frame the
   poster already shows.

   ONE OPEN AT A TIME, enforced by the section rather than by each card: opening
   the second stops the first, because two ads talking over each other is the
   one failure this section cannot recover from. It also means the player's
   state never has to be reset — it dies with the element. */

/* AUTO-FIT WITH A CEILING, WHICH IS THE PART THAT MATTERS AT 9:16. A track that
   stretches to fill the row is fine for a squat card and ruinous for a tall one:
   at three across a 1180 wrap the cards would be ~360 wide and therefore ~640
   tall, and the section would run past two thousand pixels. Capping the track at
   300 and centring the row keeps a card ~533 tall at its largest, and the grid
   still reflows on its own — three across a desktop, two on a tablet, one on a
   phone, with no media query deciding it. */
const GRID =
  "grid grid-cols-[repeat(auto-fit,minmax(240px,300px))] justify-center";

/* The card is the page's own card: white, hairline, small shadow, lifting on
   hover. The 12px of padding is what turns the video frame into an object
   sitting ON something rather than a picture with a border. */
const CARD =
  "group flex h-full flex-col rounded-3xl border border-line bg-white p-3 shadow-[var(--shadow-sm)] " +
  "transition-[transform,box-shadow] duration-[320ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:-translate-y-1 hover:shadow-[var(--shadow)]";

/* The frame. `isolate` keeps every overlay inside stacked against this box, so
   a card can never lift a control over its neighbour. */
const MEDIA =
  "relative isolate aspect-[9/16] w-full overflow-hidden rounded-2xl bg-poster";

/* THE SOUND CUE — what stands where the play disc used to.

   IT ONLY EXISTS WHILE THE CLIP IS RUNNING, which is the whole idea. A control
   on a still poster has to advertise playback; this one arrives after playback,
   so it can advertise the only thing still missing, and it says so in words
   rather than in a glyph nobody has to decode. Its wording changes with the
   route in: "Click" where a pointer started it, "Tap" where scrolling did.

   IT IS NOT A BUTTON, and that is deliberate rather than sloppy: the whole
   frame is the button, so a second target inside it would only create a place
   where the click means the same thing but the cursor implies otherwise.
   pointer-events-none keeps it out of the way entirely.

   Paper rather than glass, like the badge above it, so it holds ink type over
   any frame without needing backdrop-filter to be supported. */
const SOUND_CUE =
  "pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/92 py-1 pl-2 pr-2.5 " +
  `font-mono ${TEXT_META} uppercase leading-none tracking-[0.08em] text-ink backdrop-blur-[2px] ` +
  "transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)]";

/* The format badge, and the light counterpart to the reference's glass pill:
   near-solid paper rather than a tinted blur, so it holds ink type over any
   frame without needing backdrop-filter to be supported. */
const BADGE =
  `pointer-events-none absolute right-3 top-3 rounded-full bg-white/92 px-2.5 py-1 font-mono ${TEXT_META} uppercase leading-none tracking-[0.08em] text-ink backdrop-blur-[2px]`;

/* THE CONTROL BAR, LIGHT. Same idea as the reference's glass, in this page's
   palette: the fill carries the contrast and the blur is the finish, not the
   other way round. 92% paper rather than a 45% tint means it stays readable
   where backdrop-filter is unsupported or switched off — which is the failure
   mode a dark glass bar has no answer to, since 45% black over a bright frame
   is ink on grey. */
const BAR =
  "flex items-center gap-2.5 rounded-2xl border border-line bg-paper/92 px-2.5 py-2 text-ink backdrop-blur-md";

/* The seek bar. A real <input type="range"> rather than a div with pointer
   handlers, because the div version cannot be operated from a keyboard and this
   is a control, not a progress meter — arrow keys seek, and that comes free.
   Everything below is the appearance stripped back and rebuilt; the FILL is an
   inline gradient rather than a class, since it changes on every frame of
   playback and Tailwind cannot emit a class per percentage. */
const SEEK =
  "h-1 w-full cursor-pointer appearance-none rounded-full bg-transparent outline-none " +
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full " +
  "[&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-deep " +
  "[&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.35)] " +
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-line " +
  "[&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:bg-pink-deep " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-deep";

/* Control buttons in the bar. 32px is under the 44px touch guidance and
   deliberately so: they sit inside a bar that is itself the target on a phone,
   and a 44px play button in a 9:16 card at one-column width is a fifth of the
   frame's width. The bar's own padding brings the effective target back up. */
const CTRL =
  "grid size-8 flex-none place-items-center rounded-full text-ink transition-colors duration-200 " +
  "hover:bg-ink/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep";

/* mm:ss. NaN until metadata lands, which is a real state rather than an edge
   case — the bar renders before the file has said how long it is. */
function clock(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/* Resolve a content id against the generated library. The ids are stable across
   a sync and the URLs are not, which is why content.ts stores the id. A miss
   returns undefined and the card renders as a quote with no frame rather than
   as an empty box. */
function reelById(id: string): Reel | undefined {
  return reelVideos.find((r) => r.id === id);
}

/* AUTOPLAYING VIDEO IS MOTION, so both routes into a preview are gated on the
   same preference. Read at the moment it matters rather than once on mount: it
   costs nothing — this runs on a hover or a scroll boundary, not on a frame —
   and a visitor who turns the setting on mid-session is respected immediately
   rather than on their next navigation. */
function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Whether a pointer entering a card should start the silent preview.

   THE pointerType CHECK IS WHAT KEEPS A TOUCH OUT OF THIS ROUTE. A tap fires
   pointerenter before it fires click, so without it a phone would start the
   silent preview and then open the full player anyway — two loads for one
   gesture, on the connection least able to afford it. Touch has its own route;
   see IN_VIEW_BAND. */
function wantsHoverPreview(pointerType: string): boolean {
  return pointerType === "mouse" && !reducedMotion();
}

/* THE MIDDLE BAND, and the whole of the touch behaviour.

   A card counts as "being looked at" when it crosses the middle 40% of the
   viewport — 30% shaved off the top and bottom of the root box. That is the
   number to change if it feels early or late, and the two ends do different
   things: widen it and two cards qualify at once on a phone (only the first
   still plays, but the switch happens sooner than the eye expects), narrow it
   and a card has to be almost perfectly centred, which on a slow scroll means
   the section spends most of its time showing stills.

   ONLY ON A DEVICE WITH NO HOVER. On a laptop with a touchscreen both routes
   would be live, and a card would start playing as it scrolled past whether or
   not the pointer was anywhere near it. `(hover: none)` is the query that
   separates them: it describes the PRIMARY input, so a phone matches and a
   touch-capable laptop does not. */
const IN_VIEW_BAND = "-30% 0px -30% 0px";

/* ---------------------------------------------------------------------------
   THE PLAYER. Mounted only while its card is the open one, so every piece of
   state below is scoped to one playback session and none of it needs resetting.
   The <video> is created here too, which is why a card at rest costs nothing. */
function Player({ reel, label }: { reel: Reel; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /* True between pointerdown and pointerup on the seek bar. While it is set,
     timeupdate stops writing `at` — otherwise the thumb fights the playhead and
     jumps back under the finger on every frame. */
  const scrubbing = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [ended, setEnded] = useState(false);
  const [at, setAt] = useState(0);
  const [length, setLength] = useState(NaN);
  /* Controls are visible whenever the video is not playing, and auto-hide two
     seconds after the last pointer while it is. Kept as state rather than a
     class toggle because the Watch Again screen reads it too. */
  const [showing, setShowing] = useState(true);

  /* AUTOPLAY WITH SOUND IS THE POINT — the card was clicked, so the gesture is
     there and the policy allows it. The fallback matters anyway: a browser with
     a stricter setting rejects the promise, and silently leaving a dead frame
     would look like a broken card. Muting and retrying gets the video running,
     and the mute control then says what happened. */
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      void el.play().catch(() => {});
    });
  }, []);

  useEffect(() => () => clearTimeout(hide.current), []);

  /* Show the bar, and say whether it should go away again.

     THE CALLER PASSES THE INTENT RATHER THAN THIS READING `playing`, and that
     is not a style choice. Every caller is an event handler that is itself
     about to change `playing` — onPlay fires before the state it sets has
     landed — so a version of this that read the state variable would arm the
     countdown against the value from BEFORE the event, and the bar would hang
     around for one whole transition after playback started. */
  const arm = useCallback((autoHide: boolean) => {
    setShowing(true);
    clearTimeout(hide.current);
    if (autoHide) hide.current = setTimeout(() => setShowing(false), 2200);
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.ended) {
      el.currentTime = 0;
      setEnded(false);
    }
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };

  const pct = Number.isFinite(length) && length > 0 ? (at / length) * 100 : 0;

  return (
    <div
      className="absolute inset-0"
      onPointerMove={() => arm(playing && !ended)}
      onPointerLeave={() => playing && !ended && setShowing(false)}
    >
      <video
        ref={video}
        /* The HQ cut, with audio — the tile cut the walls and the hover preview
           play is silent and small. `?? src` covers a sync run without ffmpeg. */
        src={reel.hq ?? reel.src}
        poster={reel.poster ?? undefined}
        playsInline
        preload="auto"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          setEnded(false);
          arm(true);
        }}
        onPause={() => {
          setPlaying(false);
          arm(false);
        }}
        onPlaying={() => setBuffering(false)}
        onWaiting={() => setBuffering(true)}
        onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (!scrubbing.current) setAt(e.currentTarget.currentTime);
        }}
        onEnded={() => {
          setEnded(true);
          setPlaying(false);
          arm(false);
        }}
        /* object-contain, NOT cover. The frame is 9:16 and so is the footage, so
           there is nothing to crop — and `contain` is the setting that keeps it
           that way if a non-vertical clip is ever pointed at from content.ts:
           it letterboxes onto the poster ground instead of silently cutting the
           sides off. */
        className="size-full cursor-pointer object-contain"
      />

      {/* BUFFERING. Shown only while actually stalled AND still playing — a
          spinner over a paused video says the wrong thing entirely. */}
      {buffering && !ended && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/30 border-t-white"
        />
      )}

      {/* WATCH AGAIN. The reference's replay screen: the card goes back to
          something you can act on rather than holding a black last frame. A
          PAPER wash rather than the reference's black one — the same decision
          as the bar, and it keeps the ended state looking like part of this
          page rather than like a video player that has taken the card over. */}
      {ended && (
        <div className="absolute inset-0 grid place-items-center bg-paper/80 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={toggle}
            className={`flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 font-sans ${TEXT_SMALL} font-medium text-ink shadow-[var(--shadow-sm)] transition-transform duration-200 hover:scale-105`}
          >
            <svg
              viewBox="0 0 12 12"
              width="12"
              height="12"
              fill="currentColor"
              aria-hidden="true"
              className="text-pink-deep"
            >
              <path d="M6 1.5V0L3.5 2 6 4V2.5a3.5 3.5 0 1 1-3.5 3.5H1a5 5 0 1 0 5-4.5z" />
            </svg>
            Watch again
          </button>
        </div>
      )}

      {/* THE BAR. `pointer-events-none` travels with the opacity so a hidden bar
          cannot swallow a click meant for the video underneath it. */}
      <div
        className={`absolute inset-x-0 bottom-0 p-2.5 transition-opacity duration-[280ms] ${
          showing ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className={BAR}>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className={CTRL}
          >
            {playing ? (
              <svg viewBox="0 0 10 12" width="10" height="12" fill="currentColor" aria-hidden="true">
                <rect x="0" y="0" width="3.5" height="12" rx="1" />
                <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 12" width="10" height="12" fill="currentColor" aria-hidden="true">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min={0}
            max={Number.isFinite(length) && length > 0 ? length : 0}
            step={0.01}
            value={at}
            aria-label="Seek"
            onPointerDown={() => (scrubbing.current = true)}
            onPointerUp={() => (scrubbing.current = false)}
            onChange={(e) => {
              const to = Number(e.currentTarget.value);
              setAt(to);
              if (video.current) video.current.currentTime = to;
            }}
            /* The fill is the value, so it cannot be a class — see SEEK. Both
               stops are tokens rather than literals, so the played portion is
               the page's pink and the rest is its hairline. */
            style={{
              background: `linear-gradient(to right, var(--color-pink-deep) ${pct}%, var(--color-line) ${pct}%)`,
            }}
            className={SEEK}
          />

          <span className={`flex-none font-mono ${TEXT_META} tabular-nums leading-none text-ink-soft`}>
            {clock(at)} / {clock(length)}
          </span>

          <button
            type="button"
            onClick={() => {
              const el = video.current;
              if (!el) return;
              el.muted = !el.muted;
              setMuted(el.muted);
            }}
            aria-label={muted ? `Unmute ${label}` : `Mute ${label}`}
            className={CTRL}
          >
            {muted ? (
              <svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor" aria-hidden="true">
                <path d="M0 4h3l3-3v10L3 8H0z" />
                <path d="M9 4l4 4M13 4l-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            ) : (
              <svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor" aria-hidden="true">
                <path d="M0 4h3l3-3v10L3 8H0z" />
                <path
                  d="M9 3.5a4 4 0 0 1 0 5M11 2a6.5 6.5 0 0 1 0 8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ONE CARD. The frame is a button until it is opened, and the quote lives under
   it on paper. */
function Card({
  item,
  reel,
  open,
  onOpen,
  inView,
  frameRef,
}: {
  item: (typeof testimonials.items)[number];
  reel: Reel | undefined;
  open: boolean;
  onOpen: () => void;
  /** True when this is the card the section has chosen as centred — touch
      devices only, and never more than one card at a time. */
  inView: boolean;
  /** Registers this card's frame with the section's observer. */
  frameRef: (node: HTMLDivElement | null) => void;
}) {
  /* THE TWO ROUTES MEET HERE. `hovering` is this card's own business; `inView`
     is the section's, because choosing one card out of three is a decision no
     single card can make. Either one plays the clip and neither knows about the
     other, which is what keeps the two behaviours from having to agree on
     anything beyond "is it running".

     `ready` IS SEPARATE BECAUSE THE FADE HAS TO BE STATE. The obvious shortcut
     is to drop the opacity class off the element in the `playing` handler and
     leave React out of it — and it works until anything re-renders this card,
     at which point reconciliation writes the original className back and a
     playing preview turns invisible. Opening ANOTHER card re-renders every
     card, so that is not a hypothetical. */
  const [hovering, setHovering] = useState(false);
  const [ready, setReady] = useState(false);
  /* The preview's own progress hairline, written through a ref rather than
     state: timeupdate fires ~4 times a second per playing clip, and putting
     that through React would re-render the card — and therefore its quote, its
     attribution and the whole figure — for a 2px bar. React never sets
     `transform` on this element, so nothing reconciles it away. */
  const bar = useRef<HTMLSpanElement>(null);

  const preview = !open && (hovering || inView);

  return (
    <figure className={CARD}>
      <div ref={frameRef} className={MEDIA}>
        {reel && open ? (
          <Player reel={reel} label={item.label} />
        ) : (
          reel && (
            <button
              type="button"
              onClick={onOpen}
              onPointerEnter={(e) => {
                if (!wantsHoverPreview(e.pointerType)) return;
                setReady(false);
                setHovering(true);
              }}
              onPointerLeave={() => setHovering(false)}
              /* The label says what OPENING it does. The quote and the
                 attribution are in the figure below, so a screen reader has them
                 either way; what it cannot get from a poster is that this
                 control plays an ad rather than a person talking. */
              aria-label={`Play the ad this reaction was about — ${item.label}`}
              className="absolute inset-0 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a remote
                  blob URL already at the size it renders. next/image would mean
                  a remotePatterns entry and a proxy hop to re-encode a 24KB webp
                  into itself; the only thing wanted here is the browser's own
                  lazy loading, which a plain <img> gives directly. */}
              <img
                src={reel.poster ?? undefined}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />

              {/* THE PREVIEW SITS OVER THE POSTER, NOT INSTEAD OF IT, and that
                  is the whole trick: the poster stays mounted underneath, so
                  the frame never blinks to empty while the clip loads and never
                  blinks back when it unmounts. The clip fades in as it starts
                  playing, so a slow connection degrades to "the poster stayed"
                  rather than to a black rectangle.

                  THE TILE CUT, NOT THE HQ ONE — small, silent, and already what
                  both walls play. A hover is not a request for audio. */}
              {preview && (
                <LazyVideo
                  src={reel.src}
                  poster={reel.poster}
                  /* IMMEDIATE, AND THIS IS THE ONE PLACE THAT IS RIGHT. The
                     element only exists because a pointer is already on the
                     card, so both of LazyVideo's gates are answers to a
                     question nobody asked: an intersection test on a tile the
                     visitor is looking at, then a dwell and a place in the
                     start queue, would answer a hover a third of a second
                     late. `immediate` attaches and plays on mount and
                     registers no lane — which is also why the lane below is
                     inert and named only to satisfy the prop. */
                  immediate
                  preload="auto"
                  lane="testimonial-preview"
                  onPlaying={() => setReady(true)}
                  /* The hairline is driven from here rather than from a
                     requestAnimationFrame loop: timeupdate is the event the
                     browser already fires for this, roughly four times a
                     second, which is smooth enough for a bar 2px tall and
                     costs nothing when the tab is in the background. */
                  onTimeUpdate={(e) => {
                    const el = bar.current;
                    const { currentTime, duration } = e.currentTarget;
                    if (!el || !Number.isFinite(duration) || duration <= 0) return;
                    el.style.transform = `scaleX(${currentTime / duration})`;
                  }}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-[320ms] ${
                    ready ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}

              {/* THE PROGRESS HAIRLINE — the second half of what replaces the
                  play button. Removing the disc removes the only thing on a
                  resting card that said "this is video"; once the picture moves
                  that is self-evident, but a clip on loop with no marks on it
                  still gives no sense of LENGTH, and a viewer who cannot see
                  how much is left reads a loop as a stutter. Two pixels of the
                  page's own ramp fixes that and asks for nothing.

                  scaleX from the left, so the only thing changing per frame is
                  a transform on a composited layer — a width would lay out the
                  frame four times a second. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[image:var(--grad)] transition-opacity duration-[280ms] ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
                ref={bar}
                /* Starts at zero width, not full: the first timeupdate is a
                   fraction of a second away, and a bar that begins full and
                   snaps back reads as the clip having restarted. */
                style={{ transform: "scaleX(0)" }}
              />

              {/* THE SOUND CUE, IN PLACE OF THE PLAY BUTTON — see SOUND_CUE. It
                  waits for `ready` rather than for `preview`, so it appears with
                  the moving picture and not over a still poster that is about to
                  be replaced. */}
              <span
                className={`${SOUND_CUE} ${
                  ready ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 14 12"
                  width="12"
                  height="11"
                  fill="currentColor"
                  className="text-pink-deep"
                >
                  <path d="M0 4h3l3-3v10L3 8H0z" />
                  <path
                    d="M9 3.5a4 4 0 0 1 0 5M11 2a6.5 6.5 0 0 1 0 8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    fill="none"
                  />
                </svg>
                {hovering ? "Click for sound" : "Tap for sound"}
              </span>

              <span className={BADGE}>{item.label}</span>
            </button>
          )
        )}
      </div>

      {/* THE TEXT BLOCK, ON PAPER. px-2 rather than 0: the card's own 12px of
          padding is right for a picture, which wants to sit near its edge, and
          too tight for type, which wants a margin. 20 over the frame, so the
          quote belongs to the card rather than to the video. */}
      <figcaption className="px-2 pb-2 pt-5">
        {/* THE LINE THAT KEEPS THIS HONEST — see the note at the top of the file
            before removing it. It comes BEFORE the quote because that is the
            order the eye takes them in: the frame above is the claim, so the
            correction has to arrive before the quote, not after it. */}
        {reel && (
          <p className={`font-mono ${TEXT_META} uppercase tracking-[0.1em] text-ink-faint`}>
            The ad this reaction was about
          </p>
        )}

        <blockquote
          className={`${reel ? "mt-2" : ""} text-pretty font-sans ${SIZE_24} leading-[1.4] tracking-[-0.01em]`}
        >
          &ldquo;{item.quote}&rdquo;
        </blockquote>

        {/* A short gradient rule instead of an avatar: it marks where the quote
            ends and the attribution begins without pretending to identify
            anyone. These clients asked to stay unnamed. --grad-ink, not --grad:
            this rule is back on paper, where the bright cut drops to ~2.4:1. */}
        <p
          className={`mt-3 flex items-center gap-[0.65em] font-sans ${TEXT_META} uppercase tracking-[0.09em] text-ink-faint before:h-0.5 before:w-5 before:flex-none before:rounded-sm before:bg-[image:var(--grad-ink)] before:content-['']`}
        >
          {item.who}
        </p>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  /* The open card's index, or null. Held here rather than in Card because only
     one may play at a time — see the note at the top. */
  const [open, setOpen] = useState<number | null>(null);

  /* The card a touch device is currently looking at, or null. Also held here,
     and for a stronger reason than `open`: "which of the three is centred" is
     not a question any one card can answer about itself. */
  const [centred, setCentred] = useState<number | null>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    /* BOTH GUARDS RUN BEFORE ANYTHING IS OBSERVED, so on a laptop this effect
       costs one media-query read and then nothing at all for the life of the
       page — no observer, no callbacks, no state. */
    if (!window.matchMedia("(hover: none)").matches) return;
    if (reducedMotion()) return;

    const els = frames.current.filter((el): el is HTMLDivElement => el !== null);
    if (!els.length) return;

    /* Insertion order is card order, so the LOWEST index in here is the highest
       card on the page — which is the one to play when a slow scroll leaves two
       of them touching the band at once. Picking the most-intersecting instead
       would swap between them mid-scroll, and every swap is a media element
       torn down and rebuilt. */
    const inBand = new Set<number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = els.indexOf(entry.target as HTMLDivElement);
          if (i < 0) continue;
          if (entry.isIntersecting) inBand.add(i);
          else inBand.delete(i);
        }
        setCentred(inBand.size ? Math.min(...inBand) : null);
      },
      { rootMargin: IN_VIEW_BAND }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    /* SECTION OUTSIDE, WRAP INSIDE, like every other band. Without the ceiling
       these cards ran to the viewport, so on a wide monitor a one-line quote was
       set across ~600px while the hero's own copy above it was capped at 42ch —
       the quotes read as a different page rather than as a section of this one. */
    <section className={SECTION} aria-label={testimonials.kicker}>
      <div className={WRAP}>
        {/* 832px is 13 × the 64px the title reaches on a desktop — the same
            13-title-em measure SectionHeading gives its other four. It is in px
            rather than em because it sits on this DIV, where an em would resolve
            against the body size and not against the title. */}
        <div className={`${HEAD_GAP} mx-auto max-w-[832px] text-center`}>
          {/* Roboto, not the mono the other kickers use — "rest use roboto"
              covers this. The rule stays in em so it tracks the type. */}
          <Reveal>
            <span
              className={`inline-flex items-center gap-[0.62em] font-sans ${SIZE_16} font-medium uppercase tracking-[0.22em] text-pink-deep before:h-px before:w-[2.2em] before:bg-current before:opacity-55 before:content-['']`}
            >
              {testimonials.kicker}
            </span>
          </Reveal>
          {/* mt-3 is inert on a non-replaced inline element and this h2 is one —
              kept because SectionHeading carries it and this is otherwise its
              markup. The gap under the kicker is line-box height, not margin. */}
          <RevealText
            as="h2"
            text={testimonials.heading}
            className={`mt-3 text-balance font-display ${SIZE_64} font-bold leading-[1.1] tracking-[-0.022em]`}
          />
        </div>

        <div className={`${GRID} ${CARD_GAP}`}>
          {testimonials.items.map((t, i) => (
            /* h-full so a card whose quote runs to three lines does not leave
               its neighbours short — the frames stay on one baseline and the
               text blocks take the difference. */
            <Reveal key={t.quote} delay={i * 70} className="h-full">
              <Card
                item={t}
                reel={reelById(t.reel)}
                open={open === i}
                onOpen={() => setOpen(i)}
                inView={centred === i}
                frameRef={(node) => {
                  frames.current[i] = node;
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

/* Word-mask reveal — each word rises from behind its own clip.

   This is not decoration you can swap for a plain <h1>: it decides how the
   headline LAYS OUT. Every word becomes its own inline-flex box, and the
   gradient run is stitched back across those boxes (see RAMP below) so the
   colour reads as one line-long sweep rather than restarting per word. Set the
   same text as plain inline text and both the rhythm and the colour come out
   different. */

type Token = { word: string; grad: boolean };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  for (const seg of text.split(/(\*[^*]+\*)/g).filter(Boolean)) {
    const grad = seg.startsWith("*") && seg.endsWith("*");
    const clean = grad ? seg.slice(1, -1) : seg;
    for (const word of clean.split(/(\s+)/)) {
      if (word === "") continue;
      tokens.push({ word, grad });
    }
  }
  return tokens;
}

/* Runs before paint on the client, and is a no-op on the server rather than a
   warning. The order matters: the words are rendered AT REST in the server
   HTML — so the page still reads with no JS at all — and are only pushed down
   out of view once, synchronously, before the browser has painted anything. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* The word transition's own duration. Named because the release below has to
   outlast it, and the two must not drift apart. */
const DURATION = 900;

/* ONE RAMP PER LINE, NOT ONE PER WORD.

   Each word has to stay its own element — that is what the clip-and-slide
   reveal is built on — but `background-clip: text` paints across the box that
   OWNS the background, so a gradient on every word restarts the ramp at every
   space: five words, five little sweeps, and the phrase never travels far
   enough along the ramp to reach its end colour at all.

   The fix is to give each gradient word THE WHOLE LINE'S RAMP and slide it
   sideways: `background-size` is the line's full ink width, and
   `background-position` is minus that word's offset into the line. Stitched
   back together the words read as one unbroken sweep — the ramp's first colour
   where the line starts, its last where the line ends — while the boxes stay
   separate and can still slide independently.

   Words are grouped by the top of their box, so a gradient run that WRAPS gets
   a full ramp on each of its lines rather than one stretched across both. Only
   gradient words count toward a line's extent, so a run sharing its line with
   plain text ramps across the coloured phrase, not the whole line box.

   Measured off the live layout because nothing else knows where the browser
   chose to break; re-measured on resize and once the webfont lands, since both
   move the breaks. */
type Ramp = { backgroundSize: string; backgroundPosition: string };

function sameRamps(a: Record<number, Ramp>, b: Record<number, Ramp>) {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(
    (k) =>
      b[+k] !== undefined &&
      a[+k].backgroundSize === b[+k].backgroundSize &&
      a[+k].backgroundPosition === b[+k].backgroundPosition
  );
}

/* `done` is not cosmetic. Every word carries `will-change: transform` so the
   compositor has its layer ready BEFORE the slide starts — that is what the
   property is for. What it is not for is staying on: a will-change that is
   never removed pins one layer per word for the life of the page, and this
   page sets 68 of them across the hero, six section headings, the testimonials
   and the FAQ. The compositor then carries all 68 through every scroll frame,
   on top of the six marquee tracks and the video tiles.

   So the reveal is a one-shot that CLEANS UP: `done` drops the hint, the
   transition and the transform once the last word has landed, and the words go
   back to being ordinary text the moment they stop moving. */
type Phase = "rest" | "armed" | "in" | "done";

export function RevealText({
  text,
  as: Tag = "span",
  className = "",
  /** ms between words. */
  stagger = 45,
  /** ms before the first word moves. */
  delay = 0,
  /** Skip the scroll trigger — for anything already on screen at load. */
  immediate = false,
  tone = "ink",
  style,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
  tone?: "ink" | "bright";
  /** For the one thing a class cannot win cleanly: a per-section leading. */
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("rest");

  useIsoLayoutEffect(() => setPhase("armed"), []);

  useEffect(() => {
    if (phase !== "armed") return;
    if (immediate) {
      const t = setTimeout(() => setPhase("in"), Math.max(delay, 16));
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("in");
        io.disconnect();
      },
      /* v1 triggered at "top 88%" — a little before the element is fully in, so
         the rise finishes as it reaches comfortable reading height. */
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase, immediate, delay]);

  /* Hand the layers back once the LAST word has landed — the last word is the
     one whose stagger offset is largest, so that is the clock to run to. The
     margin covers the gap between a transition's nominal duration and the frame
     it actually settles on.

     A timer rather than `transitionend`: the words are separate elements with
     separate transitions, so listening would mean one handler per word and a
     count to know which was last. Under prefers-reduced-motion the transition
     is neutralised globally and this just fires into an already-finished
     animation, which is harmless. */
  useEffect(() => {
    if (phase !== "in") return;
    const words = tokenize(text).filter((t) => !/\s+/.test(t.word)).length;
    const settles = delay + Math.max(0, words - 1) * stagger + DURATION;
    const t = setTimeout(() => setPhase("done"), settles + 120);
    return () => clearTimeout(t);
  }, [phase, text, delay, stagger]);

  /* The OUTER clip box of each gradient word, keyed by word index. The outer
     box is the one that never moves — the inner span is the one carrying the
     transform, so measuring that mid-reveal would read a translated position. */
  const wordBoxes = useRef(new Map<number, HTMLElement>());
  const [ramps, setRamps] = useState<Record<number, Ramp>>({});

  const measure = useCallback(() => {
    const words = [...wordBoxes.current.entries()];
    if (!words.length) return;

    /* Rects, not offsetLeft: these boxes sit inside inline-flex parents whose
       offsetParent is whatever happens to be positioned further up the tree. */
    const lines = new Map<number, { n: number; left: number; right: number }[]>();
    for (const [n, el] of words) {
      const r = el.getBoundingClientRect();
      if (!r.width) return; /* not laid out yet — leave the last ramp alone */
      const key = Math.round(r.top);
      const line = lines.get(key);
      if (line) line.push({ n, left: r.left, right: r.right });
      else lines.set(key, [{ n, left: r.left, right: r.right }]);
    }

    const next: Record<number, Ramp> = {};
    for (const line of lines.values()) {
      const start = Math.min(...line.map((w) => w.left));
      const end = Math.max(...line.map((w) => w.right));
      const width = end - start;
      for (const w of line) {
        next[w.n] = {
          backgroundSize: `${width.toFixed(2)}px 100%`,
          backgroundPosition: `${(start - w.left).toFixed(2)}px 0`,
        };
      }
    }
    setRamps((prev) => (sameRamps(prev, next) ? prev : next));
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    /* The webfont swap re-flows the line and takes every break with it. */
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [measure, text]);

  const grad = tone === "ink" ? "bg-[image:var(--grad-ink)]" : "bg-[image:var(--grad)]";
  const tokens = tokenize(text);
  let wordIndex = 0;

  return (
    <Tag ref={ref} style={style} className={`inline ${className}`}>
      {tokens.map((t, i) => {
        if (/\s+/.test(t.word)) {
          /* A newline in the source is a HARD break, not a space. It is the one
             way to say where a heading divides — `text-balance` picks its own
             break point from the measure, which is right for most of these and
             wrong when the split carries meaning, as it does wherever the plain
             half and the gradient half are meant to sit on separate lines.

             It stays in the copy rather than becoming a prop because it IS
             copy: the same file already decides which words run gradient, with
             the *asterisks*, and where a line turns is the same kind of call. */
          if (t.word.includes("\n")) return <br key={i} />;

          /* A PLAIN text space, not a span with a preserved-whitespace class.
             Both `pre` and `pre-wrap` keep the space from collapsing, and that
             is the problem at a line break: a preserved space can end up at the
             START of the wrapped line, where it is not collapsed either, so the
             line begins one space-width in. Normal white-space processing
             removes a space at a line break, which is why ordinary paragraphs
             never indent their wrapped lines.

             It is also what carries the ramp THROUGH the gaps: the spaces are
             ordinary text painted by nothing, so the sweep just keeps counting
             across them. */
          return " ";
        }
        const n = wordIndex++;
        return (
          /* Each word gets its own clipping box so the inner span can slide up
             from behind it. `align-top` keeps the inline-flex boxes on the text
             baseline.

             THE PADDING IS A DESCENDER ALLOWANCE, and it has to beat the
             line-height. These headings run at 1.04 or tighter (the hero sets
             0.78), which is SHORTER than the font's own content area (~1.22em
             for Montserrat), so the glyph box pokes out of the line box at both
             ends and this overflow:hidden shaves whatever pokes out the bottom.
             The negative margin cancels the padding in LAYOUT only — the clip
             region grows, the line spacing does not move. */
          <span
            key={i}
            ref={
              t.grad
                ? (el) => {
                    if (el) wordBoxes.current.set(n, el);
                    else wordBoxes.current.delete(n);
                  }
                : undefined
            }
            className="inline-flex overflow-hidden align-top pb-[0.16em] -mb-[0.1em]"
          >
            <span
              style={{
                /* The line-long ramp, scrolled to this word's place in it. */
                ...(t.grad ? ramps[n] : null),
                ...(phase === "in" ? { transitionDelay: `${delay + n * stagger}ms` } : null),
              }}
              /* pb/-mb again, for a different reason: on a gradient word the
                 visible letters ARE the background, and background-clip:text
                 only paints across this box. Anything outside it is clipped to
                 nothing rather than merely masked — which is why descenders on
                 gradient words vanish outright instead of being trimmed.
                 Padding extends the painted area; the negative margin keeps the
                 box the same size to lay out. */
              /* will-change rides the two moving phases ONLY, never the base:
                 in `done` the word is ordinary text again and holds no layer.
                 The 900ms here is DURATION written as a utility — Tailwind
                 scans source text, so it cannot be interpolated from the
                 constant. Change one, change the other. */
              className={`inline-block pb-[0.16em] -mb-[0.16em] ${
                t.grad ? `${grad} bg-no-repeat bg-clip-text text-transparent` : ""
              } ${
                phase === "armed"
                  ? "translate-y-[118%] will-change-transform"
                  : phase === "in"
                    ? "translate-y-0 will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    : ""
              }`}
            >
              {t.word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

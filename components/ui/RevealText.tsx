"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";

/* Word-mask reveal — each word rises from behind its own clip.

   This is not decoration you can swap for a plain <h1>: it decides how the
   headline LAYS OUT. Every word becomes its own inline-flex box, and on a
   gradient run each word carries its own background-clip, so the ramp restarts
   per word rather than stretching across the phrase. Set the same text as
   plain inline text and both the rhythm and the colour come out different. */

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
  const [phase, setPhase] = useState<"rest" | "armed" | "in">("rest");

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

  const grad = tone === "ink" ? "bg-[image:var(--grad-ink)]" : "bg-[image:var(--grad)]";
  const tokens = tokenize(text);
  let wordIndex = 0;

  return (
    <Tag ref={ref} style={style} className={`inline ${className}`}>
      {tokens.map((t, i) => {
        if (/\s+/.test(t.word)) {
          /* A PLAIN text space, not a span with a preserved-whitespace class.
             Both `pre` and `pre-wrap` keep the space from collapsing, and that
             is the problem at a line break: a preserved space can end up at the
             START of the wrapped line, where it is not collapsed either, so the
             line begins one space-width in. Normal white-space processing
             removes a space at a line break, which is why ordinary paragraphs
             never indent their wrapped lines. */
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
          <span key={i} className="inline-flex overflow-hidden align-top pb-[0.16em] -mb-[0.1em]">
            <span
              style={phase === "in" ? { transitionDelay: `${delay + n * stagger}ms` } : undefined}
              /* pb/-mb again, for a different reason: on a gradient word the
                 visible letters ARE the background, and background-clip:text
                 only paints across this box. Anything outside it is clipped to
                 nothing rather than merely masked — which is why descenders on
                 gradient words vanish outright instead of being trimmed.
                 Padding extends the painted area; the negative margin keeps the
                 box the same size to lay out. */
              className={`inline-block pb-[0.16em] -mb-[0.16em] will-change-transform ${
                t.grad ? `${grad} bg-clip-text text-transparent` : ""
              } ${
                phase === "armed"
                  ? "translate-y-[118%]"
                  : phase === "in"
                    ? "translate-y-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
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

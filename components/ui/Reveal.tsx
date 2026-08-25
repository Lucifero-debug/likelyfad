"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* Soft fade and lift on first entry — v1's numbers: 26px, 950ms, an eased-out
   quart, and 90ms between staggered siblings.

   One IntersectionObserver per element, each disconnecting the moment it fires:
   the animation is a one-shot, so there is nothing left to watch afterwards and
   nothing to unsubscribe on scroll.

   Three phases rather than two, the same shape RevealText uses. The server
   renders the content AT REST, so the page reads with no JS at all; the offset
   is applied once before the first paint, and only then transitioned away. A
   two-phase version would ship `opacity: 0` in the HTML, which is the version
   that leaves the page blank when a script fails.

   Under prefers-reduced-motion the transition is neutralised globally in
   globals.css, so the element still ends up visible, just instantly. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** ms — stagger siblings by passing i * 90. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"rest" | "armed" | "in">("rest");

  useIsoLayoutEffect(() => setPhase("armed"), []);

  useEffect(() => {
    if (phase !== "armed") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("in");
        io.disconnect();
      },
      /* v1 triggered at "top 86%" — a little before the element is fully in, so
         the rise finishes as it reaches comfortable reading height. */
      { rootMargin: "0px 0px -14% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase]);

  return (
    <div
      ref={ref}
      style={phase === "in" && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${
        phase === "armed"
          ? "translate-y-[26px] opacity-0"
          : phase === "in"
            ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-[950ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

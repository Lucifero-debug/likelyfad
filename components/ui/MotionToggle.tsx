"use client";

/* Pause/play control for the two autoplaying walls.

   Not decoration and not optional: anything that moves on its own for more
   than five seconds needs a way to stop it (WCAG 2.2.2), and both walls run
   continuously for the life of the page. It also answers the plainer question
   a visitor actually has — "hold still, I want to look at that one" — which
   otherwise is only reachable by hovering, i.e. only with a pointer.

   Styled as a sibling of the mono captions rather than as a Button: this is
   chrome for a wall, not one of the page's calls to action, and it must never
   read as one. Mono micro-label, a hairline instead of a fill, and a real 44px
   target regardless of how small the label is. */
const BASE =
  "inline-flex min-h-11 items-center gap-2 rounded-full border bg-transparent px-4 " +
  "font-mono text-[0.7rem] uppercase tracking-[0.12em] " +
  "transition-[color,border-color,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "active:opacity-60";

const TONES = {
  ink: "border-line text-ink-faint hover:border-ink-soft hover:text-ink",
  dark: "border-white/10 text-ink-dim hover:border-ink-dim hover:text-[#f5f3f0]",
};

export function MotionToggle({
  paused,
  onToggle,
  label,
  tone = "ink",
  className = "",
}: {
  paused: boolean;
  onToggle: () => void;
  /** What the control acts on, for screen readers: "the reel wall". */
  label: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${BASE} ${TONES[tone]} ${className}`}
      /* aria-pressed would describe the BUTTON's state; the thing with state
         here is the wall. A plain label saying what the next press does is less
         ambiguous, and it is what the visible text says too. */
      aria-label={`${paused ? "Play" : "Pause"} ${label}`}
    >
      <span className="inline-flex" aria-hidden="true">
        {paused ? (
          <svg viewBox="0 0 10 12" width="10" height="12" fill="currentColor">
            <path d="M0 0l10 6-10 6z" />
          </svg>
        ) : (
          <svg viewBox="0 0 10 12" width="10" height="12" fill="currentColor">
            <rect x="0" y="0" width="3.5" height="12" rx="1" />
            <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
          </svg>
        )}
      </span>
      {paused ? "Play" : "Pause"}
    </button>
  );
}

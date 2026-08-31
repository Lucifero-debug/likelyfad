import { LOGO_CATEGORIES } from "@/lib/v3/data";
import { MONO, SECTION, T_17, WRAP } from "@/lib/v3/theme";

/* ============================================================================
   THE LOGO WALL — an intro line, then a marquee.

   TODO — REAL CLIENT LOGOS. There are none in this repo (public/ holds one
   file, our own mark), and no client has cleared us to use theirs. Until they
   do, the row runs the sectors we actually work in, which is the honest
   version of the same signal: a marketer looking for their own category finds
   it here whether or not a logo sits beside it. Drop SVGs into public/logos,
   swap LOGO_CATEGORIES in lib/v3/data.ts for them, and add `grayscale` to the
   lane — nothing else in this file has to change.

   THE LOOP IS SEAMLESS WITH NO JS. The track holds the list TWICE and slides
   by exactly half its own width, so the frame it ends on is pixel-identical to
   the one it started on. The second copy is aria-hidden, so a screen reader
   reads the list once and hears no duplication.

   REDUCED MOTION IS ALREADY HANDLED, in globals.css, which drops every
   animation on the page to a single 0.001ms pass. That lands this track at
   translateX(-50%), which is the START of the identical second copy, so the
   row simply sits still and correctly composed rather than freezing mid-slide.
   ========================================================================== */
function Lane({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={`${MONO} flex shrink-0 text-stone`}>
      {LOGO_CATEGORIES.map((name) => (
        <li key={name} className="flex items-center text-[1.25rem]">
          <span className="px-[32px]">{name}</span>
          <span aria-hidden="true" className="text-[0.75rem]">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function LogoWall() {
  return (
    <section aria-label="Sectors we work in" className={SECTION}>
      <div className={WRAP}>
        <p className={`${T_17} text-stone`}>Trusted with the creative that spends the budget.</p>
      </div>

      {/* Full bleed, deliberately: a marquee that stops at the page gutter
          reads as a widget in a box. Running edge to edge under a wrapped
          intro line is what makes it read as a wall. */}
      <div className="group relative mt-[32px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_96px,#000_calc(100%_-_96px),transparent)]">
        <div className="flex w-max animate-lane-x [animation-duration:44s] group-hover:[animation-play-state:paused]">
          <Lane />
          <Lane hidden />
        </div>
      </div>
    </section>
  );
}

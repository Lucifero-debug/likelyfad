import { LOGO_CATEGORIES } from "@/lib/v2/data";
import { MONO, T_12 } from "@/lib/v2/theme";

/* ============================================================================
   THE CLIENT ROW.

   TODO — REAL CLIENT LOGOS. There are none in this repo, and no client has
   cleared us to use theirs. Until they do, the row runs the sectors we
   actually work in, which is the honest version of the same signal: a marketer
   looking for their own category finds it here whether or not a logo sits next
   to it. Drop SVGs into public/logos and swap LOGO_CATEGORIES in lib/v2/data.ts
   for them; nothing else in this file has to change.

   THE LOOP IS SEAMLESS WITH NO JS. The track holds the list TWICE and slides
   by exactly half its own width, so the frame it ends on is pixel-identical to
   the one it started on. The second copy is aria-hidden, so a screen reader
   reads the list once and hears no duplication.

   REDUCED MOTION IS ALREADY HANDLED, in globals.css, which drops every
   animation on the page to a single 0.001ms pass. That lands this track at
   translateX(-50%), which is the START of the identical second copy — so the
   row simply sits still, correctly composed, rather than freezing mid-slide.
   ========================================================================== */
function Lane({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={`${MONO} ${T_12} flex shrink-0 text-dim`}>
      {LOGO_CATEGORIES.map((name) => (
        <li key={name} className="flex items-center">
          <span className="px-[24px]">{name}</span>
          <span aria-hidden="true">·</span>
        </li>
      ))}
    </ul>
  );
}

export function LogoRow() {
  return (
    <section aria-label="Sectors we work in" className="border-t border-b border-rule">
      {/* The mask, not two overlaid gradient blocks: the row has to fade into
          the page at both ends and a painted fade would need to know the exact
          background behind it, which is one more place for a grey seam. */}
      <div className="group relative overflow-hidden py-[24px] [mask-image:linear-gradient(to_right,transparent,#000_96px,#000_calc(100%_-_96px),transparent)]">
        <div className="flex w-max animate-lane-x [animation-duration:38s] group-hover:[animation-play-state:paused]">
          <Lane />
          <Lane hidden />
        </div>
      </div>
    </section>
  );
}

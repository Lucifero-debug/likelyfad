import { VERTICALS } from "@/lib/v5/data";
import { MONO, T_12, WRAP } from "@/lib/v5/theme";

/* ============================================================================
   THE LOGO MARQUEE — each mark in its own bordered box, scrolling.

   TODO — REAL CLIENT LOGOS. There are none in this repo and no client has
   cleared us to use theirs; every identity on this site is private by request,
   which is the same rule the testimonials in lib/content.ts run under. Until
   that changes each box carries the sector, which is the honest version of the
   same signal: a marketer looking for their own category finds it here whether
   or not a logo sits beside it. Drop SVGs into public/logos, swap VERTICALS in
   lib/v5/data.ts for them, add `grayscale` to the box, and nothing else in
   this file changes.

   THE BOX IS THE POINT, not the marquee. Fuel's row works because each mark
   gets its own light rounded container rather than floating on the page, and
   that is what stops a row of mixed-weight logos reading as a ransom note. It
   also means the placeholder sectors sit in exactly the same furniture the
   real logos will, so swapping them in is not a redesign.

   THE LOOP IS SEAMLESS WITH NO JS. The track holds the list TWICE and slides by
   exactly half its own width, so the frame it ends on is pixel-identical to the
   one it started on. The second copy is aria-hidden, so a screen reader reads
   the list once and hears no duplication.

   REDUCED MOTION IS ALREADY HANDLED in globals.css, which drops every animation
   on the page to a single 0.001ms pass. That lands this track at
   translateX(-50%) — the START of the identical second copy — so the row simply
   sits still and correctly composed rather than freezing mid-slide. The brief
   asks for no marquee scroll under the preference, and this is that, without a
   second code path that could rot.

   IT PAUSES ON HOVER. A row that keeps moving while you are trying to read a
   name in it is a row that has decided its animation matters more than its
   content.
   ========================================================================== */
function Lane({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-[24px] pr-[24px]">
      {VERTICALS.map((name) => (
        <li
          key={name}
          className={`${MONO} ${T_12} flex h-[64px] w-[176px] shrink-0 items-center justify-center rounded-[8px] bg-stock px-[16px] text-lead`}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export function LogoMarquee() {
  return (
    <section aria-label="Sectors we work in" className="bg-white pb-[clamp(48px,5vw,64px)]">
      <div className={WRAP}>
        <p className={`${MONO} ${T_12} text-lead`}>Trusted with the creative that spends the budget</p>
      </div>

      {/* Full bleed, deliberately: a marquee that stops at the page gutter
          reads as a widget in a box. Running edge to edge under a wrapped intro
          line is what makes it read as a wall. The mask fades both ends so a
          box is never cut in half by the viewport edge. */}
      <div className="group relative mt-[24px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_64px,#000_calc(100%_-_64px),transparent)]">
        <div className="flex w-max animate-lane-x [animation-duration:48s] group-hover:[animation-play-state:paused]">
          <Lane />
          <Lane hidden />
        </div>
      </div>
    </section>
  );
}

import { STATS } from "@/lib/v2/data";
import { DISPLAY, MONO, T_12, T_40, WRAP } from "@/lib/v2/theme";

/* ============================================================================
   THE STATS STRIP. Three, thin, and bounded by hairlines rather than by
   whitespace — it belongs to the credentials band under the hero, not to the
   page's 96-to-128 section rhythm.

   NO COUNT-UP ANIMATION. A number that ticks up is the stock move here and it
   costs the reader the one thing the strip is for: the figure is unreadable
   for the whole first second, and a marketer scanning the page is gone by
   then.

   EVERY NOTE IS RENDERED, INCLUDING THE ONE THAT SAYS PLACEHOLDER. Brands
   served is the single figure nobody in this repo knows, and lib/v2/data.ts
   writes it as an obvious stand-in on purpose. Printing the flag on the page
   is what stops an invented number shipping quietly. Put the real count in
   BRANDS_SERVED, or cut the third stat, before this route goes public.
   ========================================================================== */
export function Stats() {
  return (
    <section aria-label="Studio in numbers" className="border-b border-rule">
      {/* Plain blocks, not a description list. A dl has to run dt before dd,
          and the figure has to sit above its label — reordering with CSS would
          leave a screen reader hearing the strip inside out, which is a worse
          trade than giving up a list role the section label already covers. */}
      <div className={`${WRAP} grid grid-cols-1 gap-[32px] py-[48px] phone:grid-cols-3`}>
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className={`${DISPLAY} ${T_40} text-lit`}>{stat.value}</p>
            <p className={`${MONO} ${T_12} mt-[12px] text-dim`}>{stat.label}</p>
            <p className={`${MONO} ${T_12} mt-[4px] text-dim/70`}>{stat.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* The class strings every section agrees on. They live here rather than in
   globals.css on purpose: the point of this rebuild is that the page is styled
   by utilities, so the shared bits are shared AS utilities, not as a `.wrap`
   rule that would then need its own overrides. The numbers are v1's, exactly.
*/

/* Page gutter and measure.

   1180px below the split breakpoint, 1800px above it. Desktop drops the
   reading cap so sections match the edge-to-edge hero — but bleeding to the
   viewport with NO ceiling stretched every row 2400px wide on a 2560px
   monitor. 1800 is not arbitrary: the split hero's headline clamp reaches its
   4.7rem ceiling at a 1798px viewport, so this is the one width where the
   column and the type stop growing together. Above it the extra width goes to
   the margin rather than into the columns. */
export const WRAP =
  "mx-auto w-full max-w-[1180px] px-[clamp(20px,5vw,64px)] lap:max-w-[1800px]";

/* Section rhythm, keyed to viewport WIDTH rather than height: how much air a
   band needs is a function of how wide its measure is, and a vh-based version
   squeezed the whole page to 30px of padding in a short window. Applied top
   and bottom, so adjacent sections are separated by 48–80px. */
export const SECTION = "py-[clamp(12px,6.5vw,30px)]";

/* The nav is fixed, so an anchor jump would land a section's top edge under
   it. This also covers the browser's OWN anchor navigation — a pasted #faq
   link, or a hash restored on reload. */
export const ANCHOR = "scroll-mt-[88px]";

/* Why us is the one section that does NOT get the shared rhythm above it. It
   follows the hero's reel wall directly, and below the split breakpoint the
   wall's caption row and this band read as one block — the gap between them
   was dead air rather than rhythm. So: flush on a phone, the shared value back
   from `lap:` up, where the wall sits BESIDE the hero and the seam is the
   18px in page.tsx instead.

   The clamp is repeated verbatim rather than interpolated from SECTION because
   Tailwind scans source TEXT: a class name assembled from a variable is never
   seen by the scanner and the utility is never emitted. If the rhythm number
   changes, it changes in both places — which is why they sit together here. */
export const SECTION_FLUSH_TOP = "pt-0 lap:pt-[clamp(12px,6.5vw,30px)]";

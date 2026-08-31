import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, TEXT_META, TEXT_SMALL } from "@/lib/ui";

const { pricing } = content;

/* PRICING — V4. The centred, hairline-ruled reference, in the same language as
   WhyUsV4, TestimonialsV4 and FaqV4: Bricolage-weight extrabold headings, a
   12px mono kicker, a 1280 page at a 56 gutter. The desktop values:

     SECTION   1280 cap · 56 gutter · 64 top and bottom
     HEADER    672 measure · CENTRED · 10 kicker → heading · 24 → body
               · 40 → list
     KICKER    12px mono, uppercase, 0.1em tracked · centred · NO BAR
     HEADING   48px EXTRABOLD, centred, leading 1.088
     LIST      761 measure · centred · rules top and bottom of every row
     ROW       24 top and bottom · inclusion and marker pushed apart
               20px BOLD display inclusion
     MARKER    28 squircle · 1px hairline · a typographic ✓
     CLOSE     40 under the list · CTA and footnote centred

   WHAT SEPARATES V4 FROM PricingV2 AND PricingV3:

     1. THERE IS NO BOX. V2 gives every inclusion a 24-radius card and V3 puts
        all four inside one square bordered panel; this draws one hairline under
        each row and one above the first, and nothing else. The list is a ruled
        spec table, not a stack of objects — which is the closest any of the
        four variants comes to reading like a price sheet, and it gets there
        without a price on it.
     2. THE LIST IS WIDER THAN THE HEADING — 761 against 672, both centred. The
        header is deliberately the narrower column, so the rows start and end
        outside the heading above them. Reversing that (a wide head over a
        narrow list) is the more common arrangement and reads completely
        differently: this one puts the emphasis on what is included.
     3. THE MARKER IS ON THE RIGHT, not beside the text. V2 and V3 both lead
        each line with the tick; here the inclusion sits left and its mark is
        pushed to the far edge of a 761 row, which is what makes the column read
        as a table with a status against each line rather than as a bulleted
        list. It is the same arrangement FaqV4 uses for its question and its +.
     4. THE MARKER IS TYPOGRAPHIC. A 28px squircle holding a real "✓" set in the
        display face, rather than V2's and V3's two drawn bars. It is heavier and
        less exact than a drawn glyph, which is the point in a section whose
        heading is extrabold.
     5. THE KICKER HAS NO BAR. WhyUsV4 and TestimonialsV4 both open with a
        20 × 2 gradient rule beside the label; this reference drops it and
        centres the bare mono line. With the label centred there is no left edge
        for a bar to start from, and one centred under a centred heading would
        read as a third element rather than as a mark on the first.
     6. IT IS THE SHALLOWEST BAND OF THE FOUR — 64 top and bottom, against V2's
        and V3's 96 and V5's 160.

   THE ONE THING THIS LAYOUT WANTS AND CANNOT HAVE IS A NUMBER. A centred ruled
   table with a 28px status marker on each row is the shape of a pricing sheet,
   and a reader arriving at it expects a figure — which makes this the variant
   where the absence is most visible, and the one worth thinking hardest about
   before shipping. It stays absent anyway: lib/content.ts's house rules forbid
   dollar amounts anywhere on this site, and the copy's stated position is
   "priced to your brief, not a package", so a number here would be an invented
   one. What fills the slot instead is `pricing.foot` — "most brands get a
   number back the same day" — set directly under the CTA, which answers the
   question the table raises without answering it falsely. If real figures ever
   exist, this is the variant that absorbs them with the least surgery: they go
   in the right-hand cell where the ✓ currently sits.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1280 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at the top, 32px on a 390 phone — the pair WhyUsV4, TestimonialsV4 and
   FaqV4 use, which is what makes the four headings one heading. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* 20px inclusions, down to 18 — the same step FaqV4 sets its questions at. */
const ROW_SIZE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* THE ROW. A hairline under every one, and the first also carries one above —
   which is what closes the list at both ends.

   THE TOP RULE IS SET FROM THE INDEX, NOT FROM `first:`. Every row here is the
   only child of its own Reveal wrapper, so `first-child` is true for all four
   of them and a `first:border-t` would draw a rule above every row on top of
   the one already under the row before it. */
const row = (first: boolean) => `group border-b border-line ${first ? "border-t" : ""}`;

/* The 28px squircle. `rounded-2xl` on a 28 box is the reference's 16-on-28 — a
   rounded square, not a disc, which is what keeps it from reading as a bullet.

   NO HOVER STATE. FaqV4's marker brightens on hover because its row is a
   <summary> and the whole thing is a control; these rows are static text and
   nothing here is clickable, so a hover response would promise an interaction
   that does not exist. */
const MARKER =
  "grid size-7 flex-none place-items-center rounded-2xl border border-line " +
  "font-display text-base font-bold leading-none text-pink-deep";

export function PricingV4() {
  return (
    /* 1280 cap and a 56 gutter, both the reference's. The reference frame gives
       no vertical padding at all — it is a crop, not a section — so the top and
       bottom come from the same clamp V2 and V3 use, and the four variants can
       be swapped for each other without the seams above and below moving. */
    <section
      id="pricing"
      className={`${ANCHOR} mx-auto w-full max-w-[1280px] px-6 py-[clamp(48px,6vw,64px)] tab:px-14`}
      aria-label={pricing.kicker}
    >
      {/* HEADER — 672, centred. 10 under the kicker is the tightest gap in the
          whole set, and it is what binds the two lines into one header block
          rather than leaving the kicker floating above it. */}
      <div className="mx-auto flex w-full max-w-[672px] flex-col items-center">
        <Reveal>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-pink-deep">
            {pricing.kicker}
          </span>
        </Reveal>

        {/* No `text-balance`: the copy carries a hard \n at the comma, which
            RevealText turns into a <br>, so the break is already decided in
            lib/content.ts and balancing would go looking for a second one. */}
        <RevealText
          as="h2"
          text={pricing.heading}
          className={`mt-2.5 text-center font-display ${HEADING} font-extrabold leading-[1.088] tracking-[-0.02em]`}
        />

        <Reveal delay={80}>
          <p
            className={`mt-6 text-pretty text-center font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}
          >
            {pricing.body}
          </p>
        </Reveal>
      </div>

      {/* THE LIST — 761, centred, and wider than the 672 header above it. See
          note 2: that inversion is the design. */}
      <ul className="mx-auto mt-10 w-full max-w-[761px]">
        {pricing.includes.map((item, i) => (
          <li key={item} className={row(i === 0)}>
            <Reveal delay={i * 60}>
              <div className="flex w-full items-center justify-between gap-6 py-6">
                <span
                  className={`font-display ${ROW_SIZE} font-bold leading-[1.3] tracking-[-0.02em]`}
                >
                  {item}
                </span>
                <span className={MARKER} aria-hidden="true">
                  ✓
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* THE CLOSE — 40 under the list, centred. The footnote is the answer to
          the number this table does not print; see the header note. */}
      <Reveal delay={100} className="mt-10 flex flex-col items-center gap-3">
        <Button contact variant="grad" withArrow>
          {pricing.cta}
        </Button>
        <p className={`font-sans ${TEXT_META} text-ink-faint`}>{pricing.foot}</p>
      </Reveal>
    </section>
  );
}

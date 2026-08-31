import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { ANCHOR, TEXT_SMALL } from "@/lib/ui";

const { faq } = content;

/* FAQ — V4. The centred, hairline-ruled reference, in the same language as
   WhyUsV4 and TestimonialsV4: Bricolage-weight extrabold headings, a 12px mono
   kicker, a 1280 page at a 56 gutter. The desktop values:

     SECTION   1280 cap · 56 gutter · 64 top and bottom
     HEADER    672 measure · CENTRED · 10 kicker → heading · 40 → list
     KICKER    12px mono, uppercase, 0.1em tracked · centred · NO BAR
     HEADING   48px EXTRABOLD, centred, leading 1.088
     LIST      761 measure · centred · rules top and bottom of every row
     ROW       24 top and bottom · question and marker pushed apart
               20px BOLD display question
     MARKER    28 squircle · 1px inset hairline · a typographic +

   WHAT SEPARATES V4 FROM FaqV2 AND FaqV3:

     1. THERE IS NO BOX. V2 gives every question a 24-radius pill and V3 gives
        it a square bordered card; this draws one hairline under each row and
        one above the first, and nothing else. The list is a ruled table, not a
        stack of objects — which is also what the existing Faq.tsx does, and the
        only thing the two share.
     2. THE LIST IS WIDER THAN THE HEADING — 761 against 672, both centred. The
        header is deliberately the narrower column, so the questions start and
        end outside the heading above them. Reversing that (a wide head over a
        narrow list) is the more common arrangement and reads completely
        differently: this one puts the emphasis on the list.
     3. THE KICKER HAS NO BAR. WhyUsV4 and TestimonialsV4 both open with a
        20 × 2 gradient rule beside the label; this reference drops it and
        centres the bare mono line. With the label centred there is no left edge
        for a bar to start from, and one centred under a centred heading would
        read as a third element rather than as a mark on the first.
     4. THE KICKER GAP IS 10, NOT 16. The tightest gap in the whole set, and it
        is what binds the two lines into one header block rather than leaving
        the kicker floating above it.
     5. THE MARKER IS TYPOGRAPHIC. A 28px squircle holding a real "+" set in the
        display face at 18px bold, rather than V2's and V3's two drawn bars. It
        is heavier and less exact than a drawn glyph, which is the point in a
        section whose headings are extrabold.
     6. IT IS THE SHALLOWEST BAND OF THE FOUR — 64 top and bottom, against V2's
        and V3's 96 and TestimonialsV4's 144.

   STILL NATIVE <details>. No state, no client boundary, and the accordion still
   opens if a script fails — the same reasoning as V1, V2 and V3.

   THE HEADING KEEPS ITS MARKED RUN. The reference sets its heading in one tone;
   this copy carries *asterisks* around its closing clause, and RevealText draws
   a gradient from them. Stripping the mark would mean rewriting the string in
   lib/content.ts, which the existing Faq.tsx and the other two variants also
   render — so the mark stays and only the size, weight and alignment come from
   the reference.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1280 and
   holds it above; the ramp exists for everything narrower. */

/* 48px at the top, 32px on a 390 phone — the pair WhyUsV4 and TestimonialsV4
   use, which is what makes the three headings one heading. */
const HEADING = "text-[clamp(2rem,1.35rem+2.7vw,3rem)]";

/* 20px questions, down to 18. */
const QUESTION_SIZE = "text-[clamp(1.125rem,1.05rem+0.31vw,1.25rem)]";

/* THE ROW. A hairline under every one, and the first also carries one above —
   which is what closes the list at both ends.

   THE TOP RULE IS SET FROM THE INDEX, NOT FROM `first:`. Every <details> here
   is the only child of its own Reveal wrapper, so `first-child` is true for all
   eight of them and a `first:border-t` would draw a rule above every row on top
   of the one already under the row before it. The variant has to come from the
   map, and it takes a function to keep the rest of the string in one place.

   Nothing is drawn on hover: there is no box to change the colour of. The
   question text and the marker take the hover instead, both from the same
   `group`. */
const row = (first: boolean) =>
  `group border-b border-line ${first ? "border-t" : ""}`;

const SUMMARY =
  "flex w-full cursor-pointer list-none items-center justify-between gap-6 py-6 text-left " +
  `font-display ${QUESTION_SIZE} font-bold leading-[1.3] tracking-[-0.02em] ` +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep active:opacity-60 [&::-webkit-details-marker]:hidden";

/* The 28px squircle. `rounded-2xl` on a 28 box is the reference's 16-on-28 — a
   rounded square, not a disc, which is what keeps it from reading as V1's
   circle. The hairline is a border rather than the reference's inset outline:
   at 1px the difference is a single pixel of layout, and a border is what every
   other bounded thing on this page uses. */
const MARKER =
  "grid size-7 flex-none place-items-center rounded-2xl border border-line " +
  "font-display text-lg font-bold leading-none text-ink " +
  "transition-[border-color,color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "group-hover:border-pink group-open:border-pink group-open:text-pink-deep";

/* The glyph rotates, NOT the box. A 45° turn on the squircle would spin its
   corners into a diamond; turning only the "+" inside leaves the frame still
   and swaps the mark to an ×. `leading-none` and the grid centring above are
   what keep it optically centred through the turn. */
const GLYPH =
  "block transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-open:rotate-45";

export function FaqV4() {
  return (
    <section
      id="faq"
      className={`${ANCHOR} mx-auto flex w-full max-w-[1280px] flex-col items-center px-[clamp(24px,4.4vw,56px)] py-[clamp(48px,5vw,64px)]`}
      aria-label="Frequently asked questions"
    >
      {/* HEADER — a 672 measure, centred, and NARROWER than the list below it.
          See note 2 before widening it to match. */}
      <div className="flex w-full max-w-[672px] flex-col items-center">
        {/* Bare centred mono, no bar — see note 3. */}
        <Reveal>
          <span className="block text-center font-mono text-xs uppercase leading-5 tracking-[0.1em] text-ink-faint">
            {faq.kicker}
          </span>
        </Reveal>

        {/* EXTRABOLD, and `leading-[1.088]` is the reference's 52.22-on-48 kept
            as a ratio so it travels down the clamp. The `pt-2.5` is the
            reference's 10 — see note 4 — and it sits on the wrapper rather than
            as a margin on the heading so it survives RevealText's inline
            layout.

            No `text-balance`: the copy carries a hard \n at the gradient
            boundary, which RevealText turns into a <br>, so the break is already
            decided in lib/content.ts and balancing would fight it. */}
        <div className="w-full pt-2.5">
          <RevealText
            as="h2"
            text={faq.heading}
            className={`text-center font-display ${HEADING} font-extrabold leading-[1.088] tracking-[-0.02em]`}
          />
        </div>
      </div>

      {/* 40 under the header, and a 761 measure — wider than the 672 above. */}
      <div className="w-full max-w-[761px] pt-10">
        {faq.items.map((item, i) => (
          /* Stagger caps at four steps: at 8 × 60ms the last row would still be
             arriving well after a reader reached it. */
          <Reveal key={item.q} delay={Math.min(i, 3) * 60}>
            <details className={row(i === 0)}>
              <summary className={SUMMARY}>
                <span>{item.q}</span>
                <span className={MARKER} aria-hidden="true">
                  <span className={GLYPH}>+</span>
                </span>
              </summary>
              {/* `-mt-1` pulls the answer up out of the summary's own 24 of
                  bottom padding, which would otherwise open the row with 24 of
                  air between a question and the sentence answering it. The 24
                  below it is the row's closing padding and stays. */}
              <p
                className={`-mt-1 max-w-[62ch] text-pretty pb-6 font-sans ${TEXT_SMALL} leading-6 text-ink-soft`}
              >
                {item.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>

      {/* The reference ends on the last rule. This copy has a CTA, and with a
          centred header there is no side column to put it in — so it closes the
          section, on the same 40 the list opened with. */}
      <Reveal delay={100} className="pt-10">
        <Button contact variant="light" withArrow>
          {faq.cta}
        </Button>
      </Reveal>
    </section>
  );
}

import { content } from "@/lib/content";
import { PARENT_COMPANY, X_HANDLE, contactUrl } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { TEXT_META } from "@/lib/ui";

const { brand, footer } = content;

/* FOOTER — V3. The compact sitemap reference, this page's palette and copy.

   The shortest of the three footers by a long way: one row, no closing
   statement, no rule, no bar. The desktop values:

     FOOTER    48 padding all round · dark ground
     INNER     1128 cap · 24 gutter · the two sides pushed apart, CENTRED
               against each other rather than top aligned
     LEFT      288 measure · 32 between the brand block and the credit
               BRAND BLOCK  16 between its three parts
                 24 mark · 8 · 20px serif wordmark
                 14px tagline on 20 leading
                 40 circular social buttons, 8 apart, 24 glyph
     RIGHT     480 measure · two link columns · 64 between them
               16 between every row, TITLE INCLUDED
     TYPE      14px throughout — title, link, tagline and credit are all one
               size, and only weight and opacity separate them

   WHAT SEPARATES V3 FROM THE OTHER TWO FOOTERS:

     1. IT IS ONE ROW. V1 has three stacked blocks (close, sitemap, copyright
        bar) separated by two hairlines; FooterV2 has two with 112 between them.
        This has a left side and a right side, vertically centred against each
        other, and nothing drawn anywhere.
     2. THERE IS ONE TYPE SIZE. Everything except the wordmark is 14px, and the
        column TITLE is the same 14 as the links under it — separated only by
        going from white/60 to full white and from regular to medium. That is
        the reference's flattest, most deliberate move, and it is what lets the
        whole footer be 208px tall.
     3. THE COLUMN TITLES ARE VISIBLE AGAIN. FooterV2 drops them to `aria-label`
        because its reference groups by gap alone; this one draws them, as V1
        does — but at link size rather than as a mono micro-label.
     4. THE CREDIT LINE REPLACES THE COPYRIGHT BAR. The reference ends the left
        column with "Built with love by …" and has no © anywhere.
        `PARENT_COMPANY` is exactly that line here. The © is kept underneath it
        rather than dropped — see the note below.
     5. IT IS DARK, like V1 and unlike FooterV2 — so every gradient in it takes
        `--grad` , the bright cut, which is the correct one on near-black.

   THIS VARIANT HAS NO CLOSING STATEMENT AND NO CTA BUTTON, and that is worth
   deciding on rather than discovering. V1 and FooterV2 both open the footer
   with `close.heading`, `close.cta` and `close.sub` — the page's last call to
   action. This reference is a pure sitemap and has no slot for any of it, so
   none of the three is rendered. The contact DESTINATION still survives: the X
   button in the social row points at `contactUrl()`, which is where every CTA
   on the site goes. To put the block back, add it above the row below as its
   own flex column with a `border-b border-white/10` under it, which is V1's
   arrangement.

   ONE SOCIAL BUTTON, NOT THE REFERENCE'S TWO. `content.footer.columns` has one
   external link — X — and `lib/site.ts` documents that as the only real
   outbound action on the site. A second circle with nothing behind it would be
   a placeholder, and this file does not invent one.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1128 and
   holds it above; the ramp exists for everything narrower. */

/* THE LINK. 14px at 60% white, going to full white on hover.

   `min-h-11` is the 44px tap target, and it is the one place this departs from
   the reference's measurements: its rows are 20px tall, which is a dense
   sitemap of the kind V1 deliberately rejected — see the comment at the top of
   Footer.tsx on the two separate rules (a 44px box AND a gap between boxes, the
   second being the one that is easy to miss). The reference's own 16 gap
   already satisfies the second. Drop `min-h-11` to get the reference's exact
   192px column height back, at the cost of the first.

   The underline is the non-colour signal that this is a link; the colour shift
   is the polish. Colour alone must not be what carries it. */
const LINK =
  "flex min-h-11 items-center text-white/60 " +
  "transition-[color,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-white hover:underline hover:underline-offset-[0.25em] " +
  "focus-visible:text-white focus-visible:underline focus-visible:underline-offset-[0.25em] " +
  "active:opacity-60";

/* The 40px circular social button. Transparent at rest — the reference's
   `bg-white/0` is a ground that only exists to be transitioned to — and it
   lifts to a 8% wash on hover. */
const SOCIAL =
  "grid size-10 shrink-0 place-items-center rounded-full bg-white/0 text-white/60 " +
  "transition-[background-color,color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:bg-white/8 hover:text-white focus-visible:bg-white/8 focus-visible:text-white " +
  "active:opacity-60";

export function FooterV3() {
  const year = new Date().getFullYear();

  return (
    /* Dark ground, so everything inside takes the BRIGHT cut of the ramp — the
       paper-safe one goes muddy against near-black. Same reasoning as V1. */
    <footer className="bg-noir p-[clamp(24px,3.4vw,48px)] text-white/60" aria-label="Footer">
      {/* `items-center`, not `items-start`: the two sides are different heights
          and the reference centres them against each other. Below `lap:` they
          stack and the alignment stops mattering. */}
      <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-10 px-6 lap:flex-row lap:items-center lap:justify-between">
        <div className="flex max-w-[288px] flex-col items-start gap-8">
          <div className="flex flex-col items-start gap-4">
            {/* THE BRAND ROW — a 24 mark, 8, then the wordmark. The mark carries
                the gradient and the wordmark is plain white, rather than V1's
                gradient-filled wordmark with no mark: with both beside each
                other the ramp would run twice in 130px and read as a smear.
                `rounded-lg` on a 24 box is a squircle, matching the marks the
                rest of this variant set uses. */}
            <a href="#top" className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-6 shrink-0 rounded-lg bg-[image:var(--grad)]"
              />
              <span className="font-display text-xl font-normal leading-5 tracking-[-0.02em] text-white">
                {brand}
              </span>
            </a>

            <p className="font-sans text-sm leading-5 text-ink-dim">{footer.tagline}</p>

            {/* ONE button, not the reference's two — see the note above. */}
            <div className="flex items-center gap-2">
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Likelyfad on X, @${X_HANDLE}`}
                className={SOCIAL}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* THE CREDIT — the reference's "Built with love by …", which is
              exactly what PARENT_COMPANY is here. The © sits under it rather
              than in a bar of its own: this reference has no bar, and dropping
              a copyright line entirely is a decision about the site rather than
              about its layout. */}
          <div className="flex flex-col items-start gap-1">
            <p className="font-sans text-sm leading-5 text-ink-dim">
              An AI production studio by{" "}
              <span className="font-medium text-white/80">{PARENT_COMPANY}</span>
            </p>
            <p className={`font-mono ${TEXT_META} text-white/40`}>
              © {year} {brand}. All rights reserved.
            </p>
          </div>
        </div>

        {/* THE LINK COLUMNS — 64 apart, 16 between every row including the
            title. `items-start` so a short column does not stretch. */}
        <Reveal delay={100}>
          <div className="flex max-w-[480px] flex-wrap items-start gap-[clamp(32px,4.4vw,64px)]">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
                {/* THE TITLE SITS AT THE SAME 14 AS THE LINKS under it, set
                    apart only by weight and full-strength white — see note 2.
                    The 16 gap is on the <nav>, so the title is spaced from the
                    first link exactly as the links are spaced from each other,
                    which is the reference's arrangement and what makes the
                    column read as one block rather than a heading over a list.

                    It is a sibling of the <ul>, not a row inside it: the list
                    holds links, and a screen reader announcing "Studio, list
                    item 1 of 5" would be describing a heading as a link. The
                    <nav>'s aria-label already carries the same word. */}
                <span className="font-sans text-sm font-medium leading-5 text-white">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-4">
                  {col.links.map((l) => {
                    const external = "external" in l && l.external;
                    return (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className={`${LINK} font-sans text-sm leading-5`}
                        >
                          {l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

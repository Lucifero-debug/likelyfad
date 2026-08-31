import { content } from "@/lib/content";
import { PARENT_COMPANY, contactUrl } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_META, TEXT_SMALL } from "@/lib/ui";

const { brand, close, footer } = content;

/* FOOTER — V2. The uppercase, roll-on-hover reference, this page's palette and
   copy. The desktop values:

     FOOTER    1432 measure · 40 gutter · 112 between the block and the bar
     TOP       statement column and link columns pushed apart, top aligned
     STATEMENT 672 measure · 36px MEDIUM UPPERCASE · leading 48 (1.333)
               64 under it, then the CTA
     CTA       18px MEDIUM UPPERCASE · a bare text link, no button
     COLUMNS   48 between them · 8 between links · NO COLUMN TITLES
     LINK      14px MEDIUM UPPERCASE · 80% ink · rolls on hover
     BAR       a 1px rule, 16, then a row: the mark left, copyright right

   WHAT SEPARATES V2 FROM THE EXISTING Footer.tsx:

     1. IT IS LIGHT, NOT DARK — and this is the big one. V1 ends the page on a
        near-black band (`bg-noir`) and takes the BRIGHT cut of the ramp because
        the paper-safe cut goes muddy on it. The reference is warm ink on a pale
        ground, so this runs on the page's own paper and every gradient in it
        switches to `--grad-ink`, the darkened cut. To put it back on dark:
        `bg-noir text-white/70`, the rule and the link colours to `white/…`, and
        `tone="bright"` on the RevealText. Those five changes and nothing else.
     2. EVERYTHING IS UPPERCASE. The statement, the CTA, every link. That is the
        reference's whole voice, and it is why the type sizes can be as small as
        they are and still hold — uppercase at 14px carries more presence than
        sentence case at 16.
     3. LINKS ROLL ON HOVER. Two copies of the label stacked inside a
        one-line-tall clipped box; hovering slides the column up exactly one
        line so the second copy takes the first one's place. The reference draws
        this as a duplicated label in an `overflow-hidden` box, which is exactly
        what it is.
     4. THE COLUMNS HAVE NO TITLES. V1 heads each with a mono label ("Studio",
        "Connect"); the reference just groups the links and lets the gaps say
        so. The titles are kept as each <nav>'s aria-label, so the grouping is
        still announced without being drawn.
     5. THE CTA IS NOT A BUTTON. V1 uses the site's gradient Button; here it is
        an 18px uppercase text link with the same roll as the nav links, which
        is what the reference has. It still points at the same place.

   WHAT THE REFERENCE HAS THAT THIS COPY DOES NOT: a third link column. The
   reference runs nav / social / legal; `content.footer.columns` has two —
   Studio and Connect — and there are no legal pages to put in a third. It maps
   straight across at whatever number the content holds.

   AND WHAT THIS COPY HAS THAT THE REFERENCE DOES NOT: `close.sub` and
   `footer.tagline`. The sub goes under the CTA, where V1 also keeps it; the
   tagline goes under the brand mark in the bottom bar, which makes that bar two
   lines tall on its left side rather than the reference's one. Both are real
   copy and neither has a slot in a design drawn for an architecture studio.

   THE BOTTOM BAR'S LEFT IS THE BRAND MARK, not the reference's row of social
   icon buttons. There is exactly one social account here and it already has a
   home in the Connect column; a row of one with divider rules between nothing
   would be a worse answer than putting the wordmark where the reference puts
   its marks. The right side is the copyright, as drawn.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1432 and
   holds it above; the ramp exists for everything narrower. */

/* 36px at the top, 26px on a 390 phone. A higher floor than the 28 the other
   36px headings in this set use: this one is UPPERCASE and set at medium, so it
   loses less to a small size than a mixed-case regular does, and it is the last
   thing on the page rather than the first thing in a band. */
const STATEMENT = "text-[clamp(1.625rem,1.15rem+2.1vw,2.25rem)]";

/* THE ROLL. Two copies of a label inside a box exactly one line tall; the
   column is two lines tall, so sliding it up by half swaps them with no seam.

   `h-5` against `leading-5` text at 14px leaves about 3px under the baseline,
   which is where the hover underline sits — without that slack the underline
   would be clipped by the box that makes the roll work. The underline is the
   NON-COLOUR signal that this is a link, and it has to survive: under
   prefers-reduced-motion the transform is neutralised globally, so the roll
   stops happening and the underline is all that is left.

   `min-h-11` on the anchor is the 44px tap target the reference does not have —
   its link boxes are 20px tall. The visible roll stays 20; the target around it
   is 44, and the 8 gap between links keeps adjacent targets from abutting. Both
   rules, and V1's comment on them, still apply here. */
const LINK =
  "group/link flex min-h-11 items-center text-ink-soft " +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-ink focus-visible:text-ink active:opacity-60";

const ROLL_BOX = "block h-5 overflow-hidden";

const ROLL_COL =
  "flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-hover/link:-translate-y-1/2 group-focus-visible/link:-translate-y-1/2";

const ROLL_LINE =
  "block h-5 leading-5 group-hover/link:underline group-hover/link:underline-offset-[0.18em] " +
  "group-focus-visible/link:underline group-focus-visible/link:underline-offset-[0.18em]";

/* One label, rendered twice. The second copy is aria-hidden — it exists to be
   the thing that arrives, not to be read out a second time. */
function Roll({ children }: { children: string }) {
  return (
    <span className={ROLL_BOX}>
      <span className={ROLL_COL}>
        <span className={ROLL_LINE}>{children}</span>
        <span className={ROLL_LINE} aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}

export function FooterV2() {
  const year = new Date().getFullYear();

  return (
    /* The page's own paper, not V1's near-black — see note 1. */
    <footer
      className="bg-paper text-ink"
      aria-label="Footer"
    >
      <div className="mx-auto flex w-full max-w-[1432px] flex-col gap-[clamp(56px,8vw,112px)] px-[clamp(24px,3vw,40px)] pb-8 pt-[clamp(64px,7vw,112px)]">
        {/* TOP BLOCK — statement on the left, links on the right, pushed apart
            and top aligned. Below `lap:` they stack, because a 672 measure and
            three link columns do not share a tablet. */}
        <div className="flex flex-col gap-[clamp(48px,5vw,64px)] lap:flex-row lap:items-start lap:justify-between">
          <div className="flex max-w-[672px] flex-col items-start gap-[clamp(32px,4.5vw,64px)]">
            {/* UPPERCASE at medium, and the tracking goes POSITIVE where every
                other heading in this project runs negative: caps have no
                descenders and no x-height variation to separate them, so they
                need the extra air that lowercase gets for free.

                A DIRECT flex child, deliberately: RevealText sets `display:
                inline` on its own tag, and `inline` on a flex item blockifies,
                which is what lets the 672 measure apply at all. */}
            <RevealText
              as="p"
              text={close.heading}
              className={`text-pretty font-display ${STATEMENT} font-medium uppercase leading-[1.333] tracking-[0.01em]`}
            />

            <Reveal delay={100} className="flex flex-col items-start gap-3">
              {/* A bare text link at 18px uppercase — see note 5. It carries the
                  same roll as the nav links, one step larger. */}
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send us a DM on X"
                className="group/link inline-flex min-h-11 items-center font-display text-lg font-medium uppercase leading-6 tracking-[0.02em] text-ink transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] hover:text-pink-deep focus-visible:text-pink-deep active:opacity-60"
              >
                <span className="block h-6 overflow-hidden">
                  <span className={ROLL_COL}>
                    <span className="block h-6 leading-6 group-hover/link:underline group-hover/link:underline-offset-[0.18em] group-focus-visible/link:underline group-focus-visible/link:underline-offset-[0.18em]">
                      {close.cta}
                    </span>
                    <span
                      className="block h-6 leading-6 group-hover/link:underline group-hover/link:underline-offset-[0.18em]"
                      aria-hidden="true"
                    >
                      {close.cta}
                    </span>
                  </span>
                </span>
              </a>
              <p className={`max-w-[34ch] font-mono ${TEXT_META} tracking-[0.02em] text-ink-faint`}>
                {close.sub}
              </p>
            </Reveal>
          </div>

          {/* THE LINK COLUMNS — 48 apart, no titles. `aria-label` carries the
              grouping that the reference stops drawing. */}
          <Reveal delay={140}>
            <div className="flex flex-wrap gap-[clamp(32px,3.4vw,48px)]">
              {footer.columns.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <ul className="flex flex-col gap-2">
                    {col.links.map((l) => {
                      const external = "external" in l && l.external;
                      return (
                        <li key={l.label}>
                          <a
                            href={l.href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className={`${LINK} font-display text-sm font-medium uppercase tracking-[0.04em]`}
                          >
                            <Roll>{l.label}</Roll>
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

        {/* THE BAR — a rule, 16, then the row. */}
        <div className="flex flex-col gap-4">
          <span aria-hidden className="h-px w-full bg-line" />
          <div className="flex flex-col items-start justify-between gap-4 phone:flex-row phone:items-end">
            <div className="flex flex-col items-start gap-1">
              {/* The gradient wordmark, on `--grad-ink` because this footer is
                  on paper now: the bright cut drops to about 2.4:1 as text on
                  this ground. Links to #top, as V1's does. */}
              <a
                href="#top"
                className="bg-[image:var(--grad-ink)] bg-clip-text font-display text-[1.4rem] font-extrabold uppercase leading-[1.2] tracking-[-0.01em] text-transparent"
              >
                {brand}
              </a>
              <p className={`max-w-[30ch] font-sans ${TEXT_SMALL} text-ink-faint`}>
                {footer.tagline}
              </p>
            </div>

            {/* Sentence case, not the reference's `capitalize`: that would
                render "Ai Production Studio" and title-case a company name that
                is not written that way. */}
            <p className={`font-mono ${TEXT_META} text-ink-faint`}>
              © {year} {brand}. An AI production studio by {PARENT_COMPANY}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

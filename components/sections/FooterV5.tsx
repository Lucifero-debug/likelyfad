import { content } from "@/lib/content";
import { PARENT_COMPANY, X_HANDLE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const { brand, footer } = content;

/* FOOTER — V5. The chipped-column, wide-gap reference, this page's palette and
   copy. The desktop values:

     FOOTER    36 gutter · 36 top · WHITE ground · 208 to the bottom bar
     LOCKUP    the wordmark, then a row of social glyphs under it
     COLUMNS   4 across · 16 between them · 12 between rows
     CHIP      a 12px LIGHT MONO UPPERCASE label in a 0.8 outlined box,
               4 of side padding and almost none top or bottom
     LINK      18px MEDIUM at 60% ink
     BAR       a 0.8 rule at 50% ink · 16 top and bottom · ONE CENTRED LINE
               at 18px, the same size as the links

   WHAT SEPARATES V5 FROM THE OTHER FOUR FOOTERS:

     1. THE COLUMN HEADER IS A CHIP, AND IT IS SMALLER THAN THE LINKS UNDER IT.
        12px mono in an outlined box against 18px links — an inversion of every
        other footer here, where the title is the same size as its links
        (FooterV3) or larger (V1, FooterV4). It works because the chip is not
        competing on size at all: the outline makes it an object rather than a
        heading, so it reads as a tab on the column instead of a title over it.
     2. THE LINKS ARE BIG AND FADED. 18px, medium, at 60% ink. Every other
        footer here runs its navigation at 12–14px; this one makes the links the
        largest text in the whole footer and pulls them back with opacity
        instead of with size.
     3. THE GAP IS 208. The distance between the sitemap and the bottom bar is
        larger than most of these footers are TALL. It is the single loudest
        number in the reference and the thing that makes the bar read as a
        separate object rather than as the last row of the block.
     4. THE BOTTOM BAR IS CENTRED AND IS ONE LINE. V1 and FooterV4 push a
        copyright and a second item apart; FooterV3 has no bar at all. This
        centres a single sentence at link size, which is why it can carry the
        weight of that 208 above it.
     5. THE GROUND IS WHITE. V1 and FooterV3 are near-black, FooterV2 is the
        page's paper, FooterV4 is a tinted band. On this page's warm paper,
        white reads as a slight LIFT rather than as no distinction at all,
        which is a little more than the reference gets on its own ground.

   THE SOCIAL GLYPHS ARE IN THE LOCKUP, under the wordmark — so this file splits
   `footer.columns` the same way FooterV4 does: any column whose links are all
   external goes to the lockup, the rest stay as chipped columns. With the
   current content that is "Connect" up and "Studio" left behind, and nothing is
   rendered twice.

   WHICH LEAVES ONE COLUMN WHERE THE REFERENCE HAS FOUR. That is what the
   content holds — `content.footer.columns` has two entries and one of them is
   social. The row is `flex-wrap` with columns sized to their content rather
   than `flex-1`, so a single column sits at its natural width instead of
   stretching across 1400px; add entries to `content.footer.columns` and the row
   fills with nothing here to change.

   THIS VARIANT HAS NO CLOSING STATEMENT AND NO CTA BUTTON, like FooterV3 and
   FooterV4. This reference is a sitemap-and-mark footer with no slot for
   `close.heading`, `close.cta` or `close.sub`. The contact destination survives
   on the X glyph in the lockup. To put the block back, add it as its own row
   above the lockup with a `border-b border-line` under it.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1400 and
   holds it above; the ramp exists for everything narrower. */

/* THE CHIP. A 0.8px outlined box around a 12px light mono label, with 4 of side
   padding and almost none above or below — the reference's `pt-0.5 pb-[3.07px]`
   is a 3px optical correction for mono caps sitting high in their line box, and
   `leading-3` on a 12px face is what makes the box hug the letters that tightly.

   `outline` rather than `border` so the box does not grow the label's own
   footprint: these chips sit at the top of a column and the links below them
   align to the column edge, not to the chip's inside. */
const CHIP =
  "inline-flex items-center rounded-sm px-1 pt-0.5 pb-[3.07px] " +
  "outline outline-[0.8px] -outline-offset-[0.8px] outline-ink " +
  "font-mono text-xs font-light uppercase leading-3 text-ink";

/* THE LINK. 18px medium at 60% ink, going to full ink on hover — see note 2.

   `leading-5`, not the reference's `leading-4`: 16px of leading on 18px type is
   shorter than the font's own content box, which is why the reference wraps
   every link in a positioned box with a -0.8px offset to stop the glyphs being
   clipped. A normal flow line at 20 gives the same rhythm with none of that.

   `min-h-11` is the 44px tap target — see the comment at the top of Footer.tsx
   on the two separate rules, a 44px box AND a gap between boxes. The
   reference's own 12 gap satisfies the second. Drop `min-h-11` for its exact
   144px column, at the cost of the first.

   The underline is the non-colour signal that this is a link; the opacity shift
   is the polish. Colour alone must not be what carries it. */
const LINK =
  "flex min-h-11 items-center font-display text-lg font-medium leading-5 text-ink/60 " +
  "transition-[color,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-ink hover:underline hover:underline-offset-[0.25em] " +
  "focus-visible:text-ink focus-visible:underline focus-visible:underline-offset-[0.25em] " +
  "active:opacity-60";

/* The bare social glyph. No button chrome at all — the reference draws the
   icons straight into the lockup — so the 44px target comes from an invisible
   collar rather than from a box, exactly as in FooterV4. */
const GLYPH =
  "relative inline-flex size-6 items-center justify-center text-ink " +
  "after:absolute after:-inset-2.5 after:content-[''] " +
  "transition-colors duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep focus-visible:text-pink-deep active:opacity-60";

export function FooterV5() {
  const year = new Date().getFullYear();

  /* Split the columns — social to the lockup, the rest to chipped columns. A
     column counts as social when every link in it is external; that is a
     property of the data rather than a name to match on, so renaming "Connect"
     does not silently move it back down. */
  const isSocial = (col: (typeof footer.columns)[number]) =>
    col.links.length > 0 && col.links.every((l) => "external" in l && l.external);
  const socialCol = footer.columns.find(isSocial);
  const linkCols = footer.columns.filter((c) => !isSocial(c));

  return (
    /* White, which on this page's warm paper is a slight lift — see note 5. */
    <footer
      className="flex flex-col gap-[clamp(80px,14vw,208px)] bg-white px-9 pt-9 text-ink"
      aria-label="Footer"
    >
      <div className="flex flex-col gap-12">
        {/* THE LOCKUP — wordmark, then the social glyphs beneath it. The
            reference draws both as one SVG; here the wordmark is type and the
            glyph is an icon, which is the same lockup assembled from the parts
            this project actually has. */}
        <div className="flex flex-col items-start gap-6">
          <a
            href="#top"
            className="bg-[image:var(--grad-ink)] bg-clip-text font-display text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-transparent"
          >
            {brand}
          </a>

          {socialCol && (
            <nav aria-label={socialCol.title} className="flex items-center gap-6">
              {socialCol.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brand} on X, @${X_HANDLE}`}
                  className={GLYPH}
                >
                  <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
                  </svg>
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* THE COLUMNS — 16 apart, 12 between the chip and the first link and
            between every link after it. `flex-wrap` with natural widths rather
            than the reference's `flex-1`: see the note at the top about there
            being one column here and four there. */}
        <Reveal delay={100}>
          <div className="flex flex-wrap items-start gap-4">
            {linkCols.map((col) => (
              <nav
                key={col.title}
                aria-label={col.title}
                className="flex min-w-[9rem] flex-col items-start gap-3"
              >
                <span className={CHIP}>{col.title}</span>
                <ul className="flex flex-col gap-3 pb-2.5">
                  {col.links.map((l) => {
                    const external = "external" in l && l.external;
                    return (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className={LINK}
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

      {/* THE BAR — a 0.8 rule at 50% ink, 16 above and below, one CENTRED line
          at link size. The tagline is folded into it rather than sitting in the
          block above: this reference has no slot for a standalone description,
          and the bar is a sentence about the studio either way. */}
      <div className="flex items-center justify-center border-t-[0.8px] border-ink/50 py-4 text-center">
        <p className="font-display text-lg font-medium leading-6 text-ink/60">
          © {year} {brand} — {footer.tagline} Built by {PARENT_COMPANY}.
        </p>
      </div>
    </footer>
  );
}

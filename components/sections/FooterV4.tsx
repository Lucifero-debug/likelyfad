import { content } from "@/lib/content";
import { PARENT_COMPANY, X_HANDLE, contactUrl } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const { brand, footer } = content;

/* FOOTER — V4. The tinted-band, oversized-wordmark reference, this page's
   palette and copy. The desktop values:

     FOOTER    20 gutter · 40 top · a TINTED ground · 36 to the wordmark band
     INNER     1240 cap · 20 between its three rows
     TOP BAR   pushed apart, 12 of bottom padding, a 0.8 rule UNDER it
               mark left · a 12px label, 20, then 32 square social buttons
     MIDDLE    240 tagline left · link columns right, 40 apart
     COLUMN    12 between rows
               TITLE  a 4px SQUARE accent · 12 · 14px MEDIUM
               LINK   INDENTED 16 · 12px · FULL-strength ink
     WORDMARK  a 240 band of oversized brand type, cropped at the bottom,
               with the copyright row sitting on it

   WHAT SEPARATES V4 FROM THE OTHER THREE FOOTERS:

     1. IT IS A TINTED BAND — neither the page's paper (FooterV2) nor near-black
        (V1 and FooterV3). The reference sits its footer on a mid-tone a clear
        step darker than the page, which is what marks the end of the document
        without changing the palette. There is no token for that step here, so
        it is `bg-ink/7`: the page's own ink at 7%, compositing over paper to
        about the same distance the reference travels from its own ground.
     2. THE SOCIAL LINKS ARE IN A TOP BAR, not in the sitemap. So this file
        SPLITS `footer.columns`: any column whose links are all external becomes
        the bar's label and buttons, and the rest stay as link columns. With the
        current content that means "Connect" and its X link move up, its TITLE
        becomes the bar's "Social media" label, and "Studio" is the one column
        left in the middle. Nothing is rendered twice.
     3. THE COLUMN TITLE HAS A SQUARE ACCENT AND THE LINKS ARE INDENTED PAST IT.
        A 4px square at x=0, the title text at x=16, and every link at x=16 too
        — so the dot hangs alone in a channel to the left of the whole column.
        That single 16px indent is what makes the group read as a group with no
        rule and no box.
     4. THE LINKS ARE FULL-STRENGTH INK AND THE TAGLINE IS MUTED — inverted from
        every other footer here, where the description reads brighter than the
        navigation. At 12px the links need the contrast more than the sentence
        does.
     5. IT ENDS ON AN OVERSIZED WORDMARK. The reference fills the last 240px
        with the brand mark, cropped at the bottom, and floats the copyright row
        on top of it. There is no logo file in this project, so the wordmark is
        the brand NAME set in the display face at about 17vw, held back to a
        faint ink so the copyright stays legible over it.

   THIS VARIANT HAS NO CLOSING STATEMENT AND NO CTA BUTTON, like FooterV3 and
   unlike V1 and FooterV2. This reference is a sitemap-and-mark footer with no
   slot for `close.heading`, `close.cta` or `close.sub`. The contact destination
   still survives on the X button in the top bar, which is where every CTA on
   the site points. To put the block back, add it as its own row above the top
   bar with a `border-b border-line` under it.

   AND THE REFERENCE'S BOTTOM-RIGHT LEGAL LINK has no counterpart: there are no
   Terms or Privacy pages in `content.footer.columns`. The X handle stands in
   the slot rather than leaving a 1240px row half empty — see the note down
   there — and should be swapped for Terms as soon as that page exists.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1240 and
   holds it above; the ramp exists for everything narrower. */

/* THE LINK. 12px at full ink — see note 4 — indented 16 past the title's
   accent square.

   `min-h-11` is the 44px tap target, and it is the one place this departs from
   the reference's measurements: its rows are 14px tall. See the comment at the
   top of Footer.tsx on the two separate rules — a 44px box AND a gap between
   boxes — the second of which the reference's own 12 gap already satisfies.
   Drop `min-h-11` for the reference's exact 96px column, at the cost of the
   first.

   The underline is the non-colour signal that this is a link; the colour shift
   is the polish. Colour alone must not be what carries it. */
const LINK =
  "flex min-h-11 items-center pl-4 text-ink " +
  "transition-[color,opacity] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:text-pink-deep hover:underline hover:underline-offset-[0.25em] " +
  "focus-visible:text-pink-deep focus-visible:underline focus-visible:underline-offset-[0.25em] " +
  "active:opacity-60";

/* The 32px square social button. `rounded-sm` is the reference's — a square with
   the corners barely taken off, which is the only non-round shape in any of
   these footers.

   THE HIT AREA IS 44 WITHOUT THE BOX BEING 44. `after:-inset-1.5` throws an
   invisible 6px collar around the 32px square, taking the target to 44 in both
   directions while the drawn button and the bar's height stay exactly as the
   reference sets them. Growing the button instead would push the top bar 12px
   taller and take the 0.8 rule with it. */
const SOCIAL =
  "relative grid size-8 place-items-center rounded-sm bg-ink/5 text-ink-soft " +
  "after:absolute after:-inset-1.5 after:content-[''] " +
  "transition-[background-color,color] duration-[280ms] ease-[cubic-bezier(0.22,0.7,0.2,1)] " +
  "hover:bg-ink/10 hover:text-ink focus-visible:bg-ink/10 focus-visible:text-ink " +
  "active:opacity-60";

export function FooterV4() {
  const year = new Date().getFullYear();

  /* SPLIT THE COLUMNS — see note 2. A column counts as social when every link
     in it is external; that is a property of the data rather than a name to
     match on, so renaming "Connect" does not silently move it back down. */
  const isSocial = (col: (typeof footer.columns)[number]) =>
    col.links.length > 0 && col.links.every((l) => "external" in l && l.external);
  const socialCol = footer.columns.find(isSocial);
  const linkCols = footer.columns.filter((c) => !isSocial(c));

  return (
    /* A tinted band — the page's own ink at 7%, see note 1. */
    <footer
      className="flex flex-col items-center gap-9 bg-ink/7 px-5 pt-10 text-ink-soft"
      aria-label="Footer"
    >
      <div className="flex w-full max-w-[1240px] flex-col gap-5">
        {/* TOP BAR — mark left, social right, and a 0.8 hairline underneath it
            rather than around it. `pb-3` is the reference's 12, and it is what
            sits between the row and its own rule. */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-[0.8px] border-line pb-3">
          <a
            href="#top"
            className="bg-[image:var(--grad-ink)] bg-clip-text font-display text-[1.4rem] font-extrabold leading-[1.2] tracking-[-0.03em] text-transparent"
          >
            {brand}
          </a>

          {socialCol && (
            <div className="flex items-center gap-5">
              {/* The reference's "Social media" label. This one is the column's
                  own title, which is real copy rather than a word invented to
                  fill the slot. */}
              <span className="font-sans text-xs leading-4 text-ink-faint">
                {socialCol.title}
              </span>
              <div className="flex items-center gap-2">
                {socialCol.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${brand} on X, @${X_HANDLE}`}
                    className={SOCIAL}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE — a 240 tagline on the left, the link columns on the right. */}
        <div className="flex flex-col justify-between gap-8 tab:flex-row tab:items-start">
          <p className="max-w-[240px] font-sans text-xs leading-4 text-ink-faint">
            {footer.tagline}
          </p>

          <Reveal delay={100}>
            <div className="flex flex-wrap items-start gap-10">
              {linkCols.map((col) => (
                <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
                  {/* THE TITLE ROW — a 4px SQUARE accent at x=0 and the label at
                      x=16, which is exactly where the links below it start. See
                      note 3: the square is the only thing in the channel, and
                      the channel is the whole reason the column holds together
                      without a rule.

                      A square, not a dot: `size-1` with no radius, in the flame
                      stop, which is where the reference puts its amber. */}
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="size-1 shrink-0 bg-rose" />
                    <span className="font-sans text-sm font-medium leading-4 text-ink">
                      {col.title}
                    </span>
                  </span>
                  <ul className="flex flex-col">
                    {col.links.map((l) => {
                      const external = "external" in l && l.external;
                      return (
                        <li key={l.label}>
                          <a
                            href={l.href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className={`${LINK} font-sans text-xs leading-4`}
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
      </div>

      {/* THE WORDMARK BAND — see note 5.

          The type is sized in vw so one word spans the measure at any width:
          "Likelyfad" is nine characters, and at roughly 0.58em average advance
          in Montserrat that puts a full-bleed setting near 17vw. The clamp caps
          it so it stops growing past the 1240 measure.

          `overflow-hidden` on the band with the glyphs pushed down is the crop
          the reference draws — the mark runs off the bottom edge of the page
          rather than sitting on it. `select-none` and `aria-hidden` because it
          is the brand as texture, and the real wordmark is the link in the top
          bar. */}
      <div className="w-full max-w-[1240px] overflow-hidden">
        <span
          aria-hidden
          className="block translate-y-[0.12em] select-none text-center font-display text-[clamp(3rem,17vw,13rem)] font-extrabold leading-[0.78] tracking-[-0.045em] text-ink/10"
        >
          {brand}
        </span>
      </div>

      {/* The copyright, sitting over the tail of the wordmark. The parent
          company is at full ink against the muted line around it, which is the
          reference's "Designed by Apollo Studio" treatment.

          THE RIGHT-HAND SLOT holds the X handle. The reference puts a legal
          link there and there are no legal pages in `content.footer.columns`,
          so the choice was a half-empty 1240px row or a real second item — and
          a written-out handle is a different affordance from the icon button in
          the top bar, not a duplicate of it. Swap it for Terms the moment that
          page exists. */}
      <div className="flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-2 pb-6">
        <p className="font-sans text-sm leading-4 text-ink-faint">
          © {year} {brand}. An AI production studio by{" "}
          <span className="text-ink">{PARENT_COMPANY}</span>
        </p>
        <a
          href={contactUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm leading-4 text-ink transition-colors duration-[280ms] hover:text-pink-deep hover:underline hover:underline-offset-[0.25em] focus-visible:text-pink-deep focus-visible:underline"
        >
          @{X_HANDLE}
        </a>
      </div>
    </footer>
  );
}

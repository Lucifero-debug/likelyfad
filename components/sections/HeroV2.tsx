"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { content } from "@/lib/content";
import { contactUrl } from "@/lib/site";
import { RevealText } from "@/components/ui/RevealText";
import { TEXT_META } from "@/lib/ui";

const { hero } = content;

/* HERO — V2. The dark split reference. Pairs with ReelWallV2, which is built
   from the same reference's right-hand column; the two are meant to be mounted
   together. The desktop values:

     SPLIT     1200 cap · 40 gutter · 56 between the halves · CENTRED
     COLUMN    504 · 40 between the text block and the buttons
     TEXT      28 between the pill, the headline and the subline
     PILL      240 × 32 · 12/8 padding · fully rounded · 0.8 hairline
               a 12px LIVE DOT · 10 · a 14px label
     HEADLINE  48px on 50 leading (1.04), TWO LINES IN TWO TREATMENTS
     SUBLINE   18px on 20 leading · 70% white · 504 measure
     BUTTONS   44 tall · 16 radius · 16 apart

   IT IS DARK, AND THAT IS THE HEADLINE CHANGE. V1's hero runs on the page's
   warm paper; this reference is white-on-near-black throughout, and the wall
   beside it is too. Both HeroV2 and ReelWallV2 paint `bg-noir` themselves, so
   each is correct in isolation — but the SPLIT wrapper in app/page.tsx has its
   own padding and gap, and paper shows through those. To mount the pair, add
   `bg-noir` to the SPLIT constant there. Everything inside then takes the
   BRIGHT cut of the ramp, which is the correct one on near-black.

   WHAT SEPARATES V2 FROM V1:

     1. THE HEADLINE IS TWO LINES IN TWO TREATMENTS. The reference sets line one
        in its sans at medium and line two in a SERIF, at its accent colour, on
        its own line. The copy already marks that split — `hero.headline` wraps
        its second clause in *asterisks* — so this file cuts the string there
        and renders each half as its own RevealText: line one plain at medium,
        line two on the brand ramp at regular.
        NO SERIF, because there is not one in this project: `--font-display` is
        Montserrat, `--font-sans` is Roboto, `--font-mono` is JetBrains. The
        reference's contrast is face + weight + colour; this delivers weight and
        colour. Add a serif to app/layout.tsx and `@theme` in globals.css and
        put `font-serif` on the second line to get the third.
     2. THE KICKER BECOMES A PILL WITH A LIVE DOT. V1's eyebrow is a mono caps
        line behind a hairline rule; here it is a bordered pill holding a 12px
        dot built from two stacked circles — a half-strength base and a
        full-strength top carrying a 20px glow. That glow is the only light
        source in the composition.
     3. THE BUTTONS ARE AUTHORED HERE, NOT `components/ui/Button.tsx`. Two
        reasons, and the first is decisive: on a near-black ground none of that
        component's four variants works for the SECONDARY — `ghost` is
        `border-ink`, `light` is white on white, `dark` is ink on noir. The
        second is that its BASE is `rounded-full` and its own comment documents
        that a `rounded-2xl` passed through `className` loses to it on emit
        order, so the reference's 16px radius is not reachable from outside.
        The primary keeps `--grad` and the site's easing, so the pair still
        reads as this site's buttons at a different radius.
     4. THE SECONDARY LABEL ROLLS, the same two-copies-in-a-clipped-box the
        reference draws and FooterV2 uses. Under prefers-reduced-motion the
        transform is neutralised globally and the label simply sits still.

   The clamps run DOWNWARD only. Each lands on its desktop number by ~1200 and
   holds it above; the ramp exists for everything narrower. */

/* Same three-phase load fade as V1 — the server renders everything AT REST, so
   the hero reads with no JS at all, and the offset is applied once before the
   first paint rather than baked into the HTML. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useHeroFade() {
  const [phase, setPhase] = useState<"rest" | "armed" | "in">("rest");
  useIsoLayoutEffect(() => setPhase("armed"), []);
  useEffect(() => {
    if (phase !== "armed") return;
    const t = setTimeout(() => setPhase("in"), 16);
    return () => clearTimeout(t);
  }, [phase]);

  /* i is the element's place in the stagger, not its DOM order — the headline
     sits between #0 and #1 and is animated by RevealText instead. */
  return (i: number) => ({
    style: phase === "in" ? { transitionDelay: `${150 + i * 90}ms` } : undefined,
    className:
      phase === "armed"
        ? "translate-y-[22px] opacity-0"
        : phase === "in"
          ? "translate-y-0 opacity-100 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          : "",
  });
}

/* 48px at the top, 34px on a 390 phone. Both halves of the headline share it,
   which is what keeps the two treatments reading as one headline. */
const HEADLINE = "text-[clamp(2.125rem,1.3rem+3.4vw,3rem)]";

/* THE SHARED BUTTON BOX — 44 tall, 16 radius, and the site's own easing. Held
   in one string so the two cannot drift apart on anything but colour. */
const BTN =
  "group/btn inline-flex h-11 items-center justify-center gap-3 rounded-2xl px-4 " +
  "font-sans text-lg font-medium leading-6 " +
  "transition-[background-color,border-color,box-shadow,color] duration-[280ms] " +
  "ease-[cubic-bezier(0.22,0.7,0.2,1)] active:opacity-[0.88]";

/* The primary. The reference stacks six barely-there outer shadows and three
   inset highlights to fake a lit plastic surface; the two that do the visible
   work are the inset top highlight and the inset bottom-lit wash, so those are
   the two kept. The outer six are a 3%-alpha ladder that is invisible against
   near-black and would cost a repaint on every hover. */
const PRIMARY =
  `${BTN} border-0 bg-[image:var(--grad)] text-white ` +
  "shadow-[inset_0px_1px_2px_-0.5px_rgba(255,255,255,0.12),inset_0px_8px_24px_-4px_rgba(255,255,255,0.16),0px_8px_24px_-8px_rgba(240,64,127,0.55)] " +
  "hover:shadow-[inset_0px_1px_2px_-0.5px_rgba(255,255,255,0.16),inset_0px_8px_24px_-4px_rgba(255,255,255,0.22),var(--shadow-pink)]";

/* The secondary. A lifted panel on the dark ground with a 0.8 hairline, which
   is the reference's `bg-neutral-900` + `border-white/20` translated to this
   palette's noir. */
const SECONDARY =
  `${BTN} border-[0.8px] border-white/20 bg-white/5 text-white ` +
  "hover:border-white/40 hover:bg-white/10";

/* The roll — two copies of a label in a box one line tall, sliding up exactly
   one line so the second takes the first one's place. */
const ROLL_COL =
  "flex flex-col transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "group-hover/btn:-translate-y-1/2 group-focus-visible/btn:-translate-y-1/2";

/* SPLIT THE HEADLINE at its marked run — see note 1. If the asterisks are ever
   removed from the copy the match fails, `line2` is empty, and the whole
   headline renders as one plain line rather than throwing. */
const marked = hero.headline.match(/^([\s\S]*?)\*([\s\S]+?)\*[\s\S]*$/);
const LINE_1 = (marked ? marked[1] : hero.headline).trim();
const LINE_2 = marked ? marked[2].trim() : "";

export function HeroV2() {
  const fade = useHeroFade();
  const [pill, sub, ctas, reassure] = [fade(0), fade(1), fade(2), fade(3)];

  return (
    /* `bg-noir` on the header itself so this is correct standing alone — see
       the note at the top about the SPLIT wrapper. */
    <header
      className="relative flex items-center overflow-hidden bg-noir pb-3 pt-[clamp(96px,10vh,128px)] text-white lap:py-0"
      id="top"
    >
      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col items-start px-[clamp(24px,5vw,64px)] lap:max-w-[504px] lap:px-0">
        {/* THE TEXT BLOCK — 28 between its three parts, which is one gap and
            not V1's four different margins. The reference groups the pill, the
            headline and the subline as one block and puts the whole 40 under
            it, so there is nothing here for four separate relationships to
            express. */}
        <div className="flex flex-col items-start gap-7">
          {/* The pill. Its ground is a 5% white lift rather than the
              reference's flat zinc-900: on this palette's noir a solid dark
              fill would be invisible, and a lift off the ground is the same
              idea done in the right direction. */}
          <span
            style={pill.style}
            className={`inline-flex items-center gap-2.5 rounded-full border-[0.8px] border-white/10 bg-white/5 px-3 py-2 font-sans text-sm leading-4 text-white ${pill.className}`}
          >
            {/* THE LIVE DOT — two stacked circles, a half-strength base under a
                full-strength top that carries the glow. Both are `--color-rose`,
                the flame stop, which is where the reference's orange lands on
                this palette. The glow is a 20px spread at 50%, the reference's
                own, and it is the only light source in the composition. */}
            <span aria-hidden className="relative block size-3 shrink-0">
              <span className="absolute inset-0 rounded-full bg-rose opacity-50" />
              <span className="absolute inset-0 rounded-full bg-rose shadow-[0px_0px_20px_0px_rgba(255,106,61,0.5)]" />
            </span>
            {hero.eyebrow}
          </span>

          {/* THE HEADLINE — two lines, two treatments, one size. See note 1.

              Each line is its own RevealText because the treatments differ by
              WEIGHT, and RevealText only distinguishes marked from unmarked
              text, not medium from regular. Splitting also gives the second
              line its own full gradient ramp, which is what a single line-long
              run should have.

              `leading-[1.04]` is the reference's 50-on-48. No `text-balance`:
              the break is decided by the copy's own asterisks, not by the
              measure, so balancing would only fight the two blocks. */}
          <h1 className={`max-w-[22ch] font-display ${HEADLINE} tracking-[-0.022em]`}>
            <span className="block font-medium leading-[1.04]">
              <RevealText text={LINE_1} immediate delay={200} tone="bright" />
            </span>
            {LINE_2 && (
              <span className="block font-normal leading-[1.04]">
                <RevealText text={`*${LINE_2}*`} immediate delay={340} tone="bright" />
              </span>
            )}
          </h1>

          {/* 18px on a 20 leading — tighter than the 1.45 V1 sets, and it is the
              reference's. At a 504 measure the subline is two lines, and 1.11
              keeps those two reading as one block under the headline rather than
              as a paragraph. */}
          <p
            style={sub.style}
            className={`max-w-[52ch] text-pretty font-sans text-lg leading-5 text-white/70 ${sub.className}`}
          >
            {hero.subline}
          </p>
        </div>

        {/* 40 under the text block, and 16 between the two buttons. */}
        <div
          style={ctas.style}
          className={`mt-10 flex flex-wrap items-center gap-4 ${ctas.className}`}
        >
          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Send us a DM on X"
            className={PRIMARY}
          >
            <span>{hero.primaryCta}</span>
            <span aria-hidden="true">→</span>
          </a>

          {/* The rolling secondary — see note 4. */}
          <a href={hero.secondaryHref} className={SECONDARY}>
            <span className="block h-6 overflow-hidden">
              <span className={ROLL_COL}>
                <span className="block h-6 leading-6">{hero.secondaryCta}</span>
                <span className="block h-6 leading-6" aria-hidden="true">
                  {hero.secondaryCta}
                </span>
              </span>
            </span>
          </a>
        </div>

        {/* The reassurance line has no slot in the reference — its pill carries
            a scarcity note instead, and `hero.eyebrow` is what went in there.
            This is real copy and it keeps V1's position under the buttons, at
            `ink-dim`, the muted ink this palette reserves for dark bands. */}
        <p
          style={reassure.style}
          className={`mt-4 font-mono ${TEXT_META} tracking-[0.03em] text-ink-dim ${reassure.className}`}
        >
          {hero.reassurance}
        </p>
      </div>
    </header>
  );
}

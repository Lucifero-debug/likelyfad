import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v6 — the night screening. Modelled on dreammotion.framer.website.

   THE FONTS LOAD HERE AND NOT IN THE ROOT LAYOUT. next/font works from any
   component, so scoping the two families to this segment means the homepage
   neither downloads them nor gains a variable it does not use. The brief's
   first rule is that the existing homepage is not touched, and this is the
   version of that rule that also holds at runtime. Geist is already requested
   by /v2, /v3, /v4 and /v5; next/font dedupes identical requests at build
   time, so it costs this route nothing.

   CORMORANT GARAMOND IS THE ONLY NEW DOWNLOAD ON THE PAGE, and it is the
   single most valuable thing taken from the reference. A serif on a dark
   cinematic ground reads as FILM; a grotesque on the same ground reads as
   SOFTWARE, which is what every competing AI-ad site opens with and the wrong
   claim for a studio that delivers finished ads rather than a tool.

   NOT INSTRUMENT SERIF, WHICH IS THE OBVIOUS PICK. Instrument over near-black
   has become the house style of the 2025 AI startup, so reaching for it would
   land straight back inside the stock look the brief warns about, just with
   better letterforms. Cormorant is a light classical serif: cinematic rather
   than trendy-editorial, and literally light, which is what was asked for.

   TWO WEIGHTS, AND THE REASON IS OPTICAL. Light high-contrast serifs THIN when
   set light-on-dark, because the glow of a bright letterform against a dark
   ground eats the hairlines. 300 holds at 64 and 40 where there is mass to
   spare and the lightness is the whole effect; at 24 it goes spindly, so card
   titles and FAQ questions run 400. See SERIF and SERIF_400 in
   lib/v6/theme.ts.

   THE MONO IS NOT REQUESTED HERE. JetBrains is already on <html> from the root
   layout, and the brief asks to keep the existing mono for small labels, so it
   is inherited rather than replaced.
   ========================================================================== */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-cormorant",
  display: "swap",
});

/* Body. 400 running text, 500 for the few places a line has to sit up. */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/v6" },
};

/* The root layout declares the homepage's warm paper. This page is near-black
   end to end, so a browser painting its chrome or its overscroll gutter from
   the theme colour has to be told that, or the seam shows on every load and on
   every scroll past the end. */
export const viewport: Viewport = {
  themeColor: "#080b14",
  colorScheme: "dark",
};

export default function V6Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${cormorant.variable} ${geist.variable}`}>{children}</div>;
}

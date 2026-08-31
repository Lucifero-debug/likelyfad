import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v7 — the creative wall. Modelled on creatiie.framer.website.

   THE FONTS LOAD HERE AND NOT IN THE ROOT LAYOUT. next/font works from any
   component, so scoping the two families to this segment means the homepage
   neither downloads them nor gains a variable it does not use. The brief's
   first rule is that the existing homepage and the other five routes are not
   touched, and this is the version of that rule that also holds at runtime.

   ARCHIVO IS REQUESTED AS A VARIABLE FONT WITH ITS WIDTH AXIS, and that is the
   whole reason it is here rather than Anton.

   Anton is the obvious pick for "heavy condensed poster face" and that is
   precisely the problem: it is a single-weight display font with one setting,
   so every page that reaches for it arrives at the same picture, and it has
   been the house face of template landing pages for years. On a page whose
   stated risk is collapsing into a stock template, the display face is the
   last place to take a default.

   Archivo carries a real wdth axis from 62 to 125 alongside wght from 100 to
   900. Requesting the axis makes the condensing a decision with a number on it
   — 82, set once in lib/v7/theme.ts — rather than a font that arrived
   pre-condensed. It also means ONE file serves both ends of the page: 800 at
   80px for the hero, 600 at 17px for the wordmark and the card titles. No
   `weight` is passed, which is what selects the variable cut; passing one
   would pin it to a static instance and the axis would be unavailable.

   THE MONO IS NOT REQUESTED HERE. JetBrains is already on <html> from the root
   layout, and the brief asks to keep the existing mono for small labels and
   stickers, so it is inherited rather than replaced.

   THE VARIABLE NAMES CARRY A -v7 SUFFIX ON PURPOSE. --font-archivo without one
   would look, to whoever reads globals.css next, like the missing definition
   that the @theme block's `--font-wide: var(--font-archivo), ...` is waiting
   for. It is not: that token is computed at :root where nothing defined here
   is in scope, so this would not fix /v2 or /v3, and a name that implies
   otherwise is a trap. Fixing those means touching those routes, which this
   change deliberately does not do.
   ========================================================================== */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo-v7",
  display: "swap",
});

/* Body. 400 running text, 500 for the few places a line has to sit up. */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-v7",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/v7" },
};

/* The root layout declares the homepage's warm paper and this page is a
   different cream end to end, so a browser painting its chrome or its
   overscroll gutter from the theme colour has to be told, or the seam shows on
   every load and on every scroll past the end. */
export const viewport: Viewport = {
  themeColor: "#f5f2ea",
  colorScheme: "light",
};

export default function V7Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${geist.variable}`}>{children}</div>;
}

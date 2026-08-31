import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v5 — the dossier. Modelled on fuel.framer.website.

   THE FONTS LOAD HERE AND NOT IN THE ROOT LAYOUT. next/font works from any
   component, so scoping the two families to this segment means the homepage
   neither downloads them nor gains a variable it does not use. The brief's
   first rule is that the existing homepage is not touched, and this is the
   version of that rule that also holds at runtime. /v2 and /v3 make the same
   two requests; next/font dedupes identical font requests at build time, so
   the three routes cost one download between them rather than three.

   ARCHIVO AT ITS NATURAL WIDTH. /v2 pushes the same file to wdth 118 for
   poster proportions. This page leaves the axis alone: the wordmark is already
   the loudest object that will ever appear here, and widening it as well would
   tip it from confident into shouting. The axis is still requested, because
   asking for it is what makes the file variable on weight, which is where the
   semibold in DISPLAY comes from.

   THE MONO IS NOT REQUESTED HERE. JetBrains is already on <html> from the root
   layout, and this page leans on it harder than any of the others — six
   section header rows, every index, all of the hero's corner furniture. The
   brief is explicit that keeping the existing mono is what makes the document
   framing work, so it is inherited rather than replaced.
   ========================================================================== */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
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
  alternates: { canonical: "/v5" },
};

/* The root layout declares the homepage's warm paper. This page opens on a
   full-bleed near-black band, so a browser painting its chrome from the theme
   colour has to be told that, or the seam shows at the top of the hero on
   every load. colorScheme stays light: the page is white from the wedge down,
   which is all but the two bracketing bands. */
export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  colorScheme: "light",
};

export default function V5Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${geist.variable}`}>{children}</div>;
}

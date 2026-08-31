import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v2 — the screening room.

   THE FONTS LOAD HERE AND NOT IN THE ROOT LAYOUT. next/font works from any
   component, so scoping the two families to this segment means the homepage
   neither downloads them nor gains a variable it does not use. The brief's
   first rule is that the existing homepage is not touched, and this is the
   version of that rule that also holds at runtime. /app/v3/layout.tsx makes
   the same request for the other direction; next/font dedupes identical font
   requests at build time, so the two routes cost one download between them.

   ARCHIVO, PUSHED. This page wants a display face with real width and
   character, because the wall behind the headline is already loud and neutral
   type would lose to it. Archivo carries a live wdth axis from 62 to 125, so
   requesting the axis buys expanded, poster-like proportions out of ONE
   download rather than a second family; DISPLAY in lib/v2/theme.ts pushes it
   to 118. Asking for axes makes the file variable on weight too, which is why
   no weight list is given here.
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
  alternates: { canonical: "/v2" },
};

/* The root layout declares the homepage's warm paper. A browser that paints
   its chrome or its overscroll gutter from this has to be told the page under
   it is dark, or the seam shows on every scroll past the end. */
export const viewport: Viewport = {
  themeColor: "#131211",
  colorScheme: "dark",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${geist.variable}`}>{children}</div>;
}

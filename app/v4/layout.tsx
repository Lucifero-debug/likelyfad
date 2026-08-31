import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v4 — the open shop.

   ONE FAMILY, NOT TWO. /v2 and /v3 both load Archivo for their display type;
   this page has no display type, so it does not load a display face. Geist
   runs the prose, and the mono comes from the root layout, which already puts
   JetBrains on <html> for the homepage. A flat type scale is not merely a
   visual decision — it is one fewer font download, and saying so here is what
   stops someone adding a heading face back in later without noticing what it
   costs.

   THE FONT LOADS IN THIS SEGMENT AND NOT IN THE ROOT LAYOUT. next/font works
   from any component, so scoping it here means the homepage neither downloads
   it nor gains a variable it does not use. next/font also dedupes identical
   requests at build time, so the Geist that /v2 and /v3 ask for is the same
   file this route gets.
   ========================================================================== */
const geist = Geist({
  subsets: ["latin"],
  /* 400 for everything, 500 for the handful of places a line has to sit up
     from the one under it. With no size contrast available, weight is one of
     only three tools left — the other two are case and letterspacing. */
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/v4" },
};

/* The root layout declares the homepage's warm paper, which is a different
   off-white from this one. Stated again here so a browser painting its chrome
   or its overscroll gutter from it matches the page rather than the homepage. */
export const viewport: Viewport = {
  themeColor: "#f2f1ee",
  colorScheme: "light",
};

export default function V4Layout({ children }: { children: React.ReactNode }) {
  return <div className={geist.variable}>{children}</div>;
}

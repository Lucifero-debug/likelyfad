import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/* ============================================================================
   /v3 — the screening room.

   THE FONTS LOAD HERE AND NOT IN THE ROOT LAYOUT. next/font works from any
   component, so scoping the two new families to this segment means the
   homepage neither downloads them nor gains a variable it does not use. The
   brief's first rule is that the existing homepage is not touched, and this is
   the version of that rule that also holds at runtime.

   ARCHIVO AT ITS NATURAL WIDTH. The reference site takes its character from
   motion and from the objects sitting inside its headlines, not from its
   typefaces, so the display face here is a neutral grotesque set tight and the
   inline clips in the statement section carry the personality instead. The
   `wdth` axis is requested anyway because it is what makes the file variable
   on weight as well, which is where the semibold in DISPLAY comes from.
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
  alternates: { canonical: "/v3" },
};

/* The root layout declares the homepage's warm paper, which is a different
   near-white from this one. Stated again here so a browser painting its chrome
   or its overscroll gutter from it matches the page rather than the homepage. */
export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  colorScheme: "light",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${geist.variable}`}>{children}</div>;
}

import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Montserrat, Roboto } from "next/font/google";
import { MEDIA_ORIGIN, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

/* One face for every heading — display type, wordmarks and card titles alike.
   Montserrat has a large x-height, so it holds at small sizes too and there is
   no second heading token to keep in sync.

   NO 600. Exactly one class string in the repo asked for it (the parked v1 FAQ
   title) and a 600 request with no 600 face resolves up to 700, which is the
   same accommodation Roboto's note below already describes. Listing it bought a
   fourth @font-face rule for a weight nothing renders.

   AND LISTING A WEIGHT COSTS NO BYTES, WHICH IS THE THING TO KNOW BEFORE
   TOUCHING THESE ARRAYS AGAIN. next/font resolves all three of these families
   to their VARIABLE file — every weight below emits its own @font-face rule,
   and every one of those rules points at the same single woff2 covering the
   whole 100-900 axis. Trimming the arrays makes the declaration honest; it does
   not make the page lighter, and adding a weight back would not make it
   heavier. The 104KB of font this page preloads is three files, one per family,
   and it is three files whether these arrays name two weights or nine.

   WHAT WOULD ACTUALLY MOVE THAT NUMBER is dropping a FAMILY, or dropping a
   family's preload — and neither is free here: all three are used above the
   fold (JetBrains in the hero kicker and the reassurance line), so an
   unpreloaded one swaps in visibly on first paint. */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});
/* Body copy. 400 running text, 500 emphasis, 700 buttons (Roboto has no 600,
   so a 600 request resolves up to 700 anyway). */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AI production studio",
    "AI ads",
    "photoreal AI video",
    "AI UGC",
    "performance creative",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }], // PLACEHOLDER
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og.png"], // PLACEHOLDER
    creator: "@amanxdesign",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f6",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  slogan: SITE_TAGLINE,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${roboto.variable} ${jetbrains.variable} scroll-smooth [font-feature-settings:'ss01']`}
    >
      <head>
        {/* WARM THE MEDIA ORIGIN BEFORE ANYTHING ASKS IT FOR A BYTE.

            Every poster and every clip on this page lives on the blob store, not
            on this origin — so the first tile's request begins with a DNS
            lookup, a TCP handshake and a TLS negotiation that nothing has
            started yet, and none of it can begin until the parser has reached a
            <video> most of the way down the body. On a phone that is a couple of
            hundred milliseconds of nothing in front of the FIRST poster, and the
            hero wall is the first thing anybody looks at.

            preconnect does the whole handshake now, from the head, in parallel
            with the rest of the document. crossOrigin is REQUIRED and not
            optional decoration: media and images are fetched in CORS mode, and a
            preconnect opened without it warms a connection in the wrong
            credentials mode that the real request then cannot reuse — the
            handshake gets paid twice and the hint is worse than nothing.

            dns-prefetch sits behind it for the browsers that ignore preconnect
            hints under connection pressure; it is a few bytes and resolves the
            name at least.

            NO rel="preload" FOR INDIVIDUAL POSTERS. The wall picks its clips
            through a round-robin deal at module scope, so which poster is on
            screen first is not knowable here, and a preload naming the wrong
            file spends the budget it was meant to save. */}
        <link rel="preconnect" href={MEDIA_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={MEDIA_ORIGIN} />
      </head>
      {/* v1's base type, which every section inherits: the fluid body size, the
          1.6 leading the whole page is spaced against, and the small negative
          tracking Roboto wants at this size. */}
      <body className="overflow-x-hidden bg-paper font-sans text-[clamp(1rem,0.96rem+0.2vw,1.075rem)] leading-[1.6] tracking-[-0.003em] text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

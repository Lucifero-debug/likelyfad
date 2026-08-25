/* ============================================================================
   Site constants + the one real outbound action: the X (Twitter) profile.
   Every other link in the UI is a clearly-marked placeholder.
   ========================================================================== */

export const SITE_URL = "https://likelyfad.vercel.app"; // PLACEHOLDER — swap when the custom domain goes live
export const SITE_NAME = "Likelyfad";
export const SITE_TAGLINE = "AI ads that look real";
export const SITE_DESCRIPTION =
  "Likelyfad makes AI video, UGC and statics that look shot on a real set. Fast enough to test every week, clean enough to run straight into paid.";

/* The parent company, named in the footer. */
export const PARENT_COMPANY = "Bright Life Creations";

/* Contact CTA → opens the X (Twitter) profile in a new tab. */
export const X_HANDLE = "amanxdesign";

export function contactUrl(): string {
  return `https://x.com/${X_HANDLE}`;
}

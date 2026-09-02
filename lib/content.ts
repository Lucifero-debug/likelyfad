/* ============================================================================
   CONTENT — single source of truth for all copy.
   Wrap a phrase in *asterisks* to gradient-highlight it in headings.

   The only real outbound link is the CTA (see lib/site.ts → contactUrl).

   HOUSE RULES for this copy. Keep them when editing:
     - No em dashes. Use a period or a comma instead.
     - No dollar amounts anywhere on the site.
     - Only REAL client quotes. Never invent a quote or a number.
   ========================================================================== */

import { X_HANDLE } from "./site";
import { reelVideos } from "./reels.generated";

/* Every CTA on the page says the same thing, so it lives in one place. */
export const CTA = "DM us your product";

export const content = {
  brand: "Likelyfad",

  nav: {
    links: [
      { label: "Why us", href: "#why" },
      { label: "Work", href: "#work" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: CTA,
  },

  hero: {
    eyebrow: "AI production studio",
    headline: "Ads so real, nobody *asks if they're AI.*",
    subline:
      "Likelyfad makes AI video, UGC and statics that look shot on a real set. Fast enough to test every week, clean enough to run straight into paid.",
    primaryCta: CTA,
    secondaryCta: "Why us",
    secondaryHref: "#why",
    reassurance: "First concepts in 48 hours · A human checks every frame",
  },

  /* 3D reel wall beside the hero. The clip list is generated from the Google
     Drive folder by `npm run sync:videos`, so add or remove reels in Drive. */
  reels: {
    caption: "Real client work. Every frame is AI.",
    videos: reelVideos,
  },

  why: {
    kicker: "Why us",
    heading: "The reason brands *actually keep us.*",
    lead: "One question decides this: why trust an AI studio with the creative that spends your money. Here is the honest case.",
    pillars: [
      {
        title: "It looks real, or it doesn't ship",
        body: "Every frame is built to pass as a real shoot. Natural skin, hands, lighting, lip-sync. If it reads AI, we cut it before you ever see it.",
      },
      {
        title: "Days, not weeks",
        body: "Send a brief today, review first concepts in about 48 hours. Create at the speed your ad account actually moves.",
      },
      {
        title: "A fraction of the cost",
        body: "No crew, no location, no reshoots. You pay for the output, not the overhead, so you can finally afford to test more.",
      },
      {
        title: "Angles, not one bet",
        body: "20 to 40 distinct variants a month, so you learn what wins before you pour real money into media.",
      },
      {
        title: "Built to run",
        body: "Hook-first, sized for every placement, and exported ready to drop straight into your ad manager.",
      },
      {
        title: "One DM to start",
        body: "No forms, no onboarding maze. Send a product link and the angle you want. We handle the rest.",
      },
    ],
    claim:
      "If your best ad is six months old, you don't have a creative problem. You have a volume problem.",
    claimCta: CTA,
  },

  /* THE WORK — the volume wall, ported from v3's SCENE 3. Three rows of clips
     gliding in alternating directions on a dark band. The tiles come from the
     same Drive-generated list as the hero wall, but start past the ones the
     hero already shows so the two walls never run the same clip. */
  work: {
    kicker: "The work",
    heading: "Every one of these is AI.",
    sub: "Different products, different sectors. Not one of them filmed.",
    /* The wall is decorative to a screen reader — dozens of near-identical
       tile labels would be noise — so one sentence stands in for all of it. */
    description:
      "A reel of dozens of AI-generated ads across different products and sectors. None of them were filmed.",
  },

  pricing: {
    kicker: "Pricing",
    /* Hard break at the comma, and the second half runs gradient — same shape
       as the FAQ heading. The turn is the point the line makes, so it is set
       here rather than left to the measure. */
    heading: "Priced to your brief,\n*not a package.*",
    body: "Every brand's scope is different. Formats, volume, turnaround. Tell us what you need and we'll send a straight number, no fine print. Most brands then move to a monthly retainer sized to how much they test.",
    includes: [
      "A fixed quote before anything starts",
      "Revisions until you sign off",
      "Every ratio your channels need",
      "Full commercial usage, yours to run anywhere",
    ],
    cta: "Get your quote",
    foot: "Most brands get a number back the same day.",
  },

  /* REAL quotes, sent by real clients. Identities are kept private by request,
     so attribution is the role and the category, never an invented handle.
     Never add an item here that a client did not actually write. */
  /* EACH QUOTE NOW CARRIES THE AD IT WAS ABOUT, which is what turned this
     section from three text cards into three playable ones.

     `reel` IS A reels.generated.ts ID, resolved at render. The ids are stable
     across a sync — the URLs are not, they take a fresh random suffix every
     time — so this is the only field that can be written down here. An id that
     no longer exists degrades to a quote-only card rather than an empty frame,
     but it is a typo worth fixing: see the lookup in Testimonials.tsx.

     THE PAIRINGS BELOW ARE READ OFF THE ATTRIBUTIONS, NOT OFF A RECORD OF
     WHICH AD EACH CLIENT WATCHED. The second quote says "podcast-style" and
     gets the podcast reel; the third says "health brand" and gets the health
     one; the first is an EU fashion brand and gets the closest thing to fashion
     in the library. If you know which ad each reaction actually landed on,
     these three ids are the edit — nothing else has to change.

     `label` sits where the reference block puts a duration badge. Durations are
     not in reels.generated.ts (the sync records id, src, hq and poster only), so
     rather than print a number nobody measured it names the format. If real
     durations ever land in the reel data, this is the field they replace. */
  testimonials: {
    kicker: "What clients say",
    heading: "Real reactions, as sent.",
    items: [
      {
        quote: "Looks great. Let's do the next one in German.",
        who: "Founder, EU fashion brand · after the first batch",
        reel: "boyfriend-angle-ai",
        label: "Fashion · UGC",
      },
      {
        quote: "You cooked on this edit. The AI looks so real. Very convincing.",
        who: "DTC brand owner · on a podcast-style ad",
        reel: "ai-podcast",
        label: "Podcast-style",
      },
      {
        quote: "Insane realism.",
        who: "Creative lead, health brand",
        reel: "doctor-in-office-ai-ugc-health-product",
        label: "Health · UGC",
      },
    ],
  },

  faq: {
    kicker: "Questions",
    /* The \n is a hard line break — see RevealText. It splits the heading at
       the gradient boundary, so the plain half sits on line one and the
       gradient half on line two rather than wherever the measure happened to
       put the turn. */
    heading: "The stuff founders ask\n*before they reach out.*",
    cta: CTA,
    items: [
      {
        q: "Will people be able to tell it's AI?",
        a: "That's the bar we build to. Look at the work above and judge for yourself. Every frame is checked by a person before it leaves us. If it reads fake, it doesn't ship.",
      },
      {
        q: "How fast is the first batch?",
        a: "First concepts in about 48 hours. Then we iterate until you'd run it.",
      },
      {
        q: "What do you need from us?",
        a: "A product link and a rough idea of the angle. Footage and past ads help but aren't required. A DM is enough to start.",
      },
      {
        q: "Who owns the work?",
        a: "You do. Full commercial rights, no watermarks, yours to run anywhere. Every winning hook and asset stays yours, even if you leave.",
      },
      {
        q: "How do you stay on-brand?",
        a: "We lock your colors, product, and tone up front, then a strategist reviews every output against it. No drift.",
      },
      {
        q: "What if I don't like the first batch?",
        a: "Start with one paid test. If you wouldn't run it, full refund. You only keep paying once it works.",
      },
      {
        q: "How much does it cost?",
        a: "It depends on how much creative you run a month. Tell us your volume in a DM and we'll send a plan that fits, same day.",
      },
      {
        q: "Video, static, or both?",
        a: "Both. Video, UGC, spokesperson and podcast ads, statics. If it runs on a feed, we make it.",
      },
    ],
  },

  /* The closing band, which sits at the top of the footer. */
  close: {
    heading: "Ready to run ads nobody clocks as AI? *Let's talk.*",
    sub: "No forms. No calls unless you want one. We reply within 24 hours.",
    cta: CTA,
  },

  footer: {
    tagline: "An AI production studio for brands that ship.",
    columns: [
      {
        title: "Studio",
        links: [
          { label: "Why us", href: "#why" },
          { label: "Work", href: "#work" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Connect",
        links: [{ label: "X / Twitter", href: `https://x.com/${X_HANDLE}`, external: true }],
      },
    ],
  },
} as const;

export type Content = typeof content;

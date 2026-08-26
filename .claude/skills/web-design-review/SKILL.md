---
name: web-design-review
description: Audit a live website or landing page against ten core UI design principles (hierarchy, contrast, proximity, alignment, consistency, feedback, affordance, progressive disclosure, forgiveness, accessibility) and return a prioritized critique of what works, what's missing, and what to fix first. Use this whenever someone shares a URL and asks for a design review, critique, teardown, audit, UX feedback, "what's wrong with my site", "what's missing", "how's the hierarchy", "roast my landing page", or asks how a page stacks up against design principles — and also when they paste a URL alongside any question about layout, usability, conversion, or accessibility, even if they never say the words "design review". Prefer this over an off-the-cuff opinion any time a real URL is on the table.
---

# Web Design Review

Turn a URL into a critique someone can act on this afternoon. The failure mode to avoid is a generic checklist essay that would read the same for any website. Every claim must point at something actually on the page.

## Step 1: Establish what you can actually see

Before judging anything, work out your evidence tier — this determines what you're allowed to claim.

**Tier A — rendered.** You have screenshots or a live browser (e.g. a browser-automation tool). You can judge real spacing, type scale, color contrast, hover states, motion, and mobile layout. Take at least: full-page desktop, above-the-fold desktop, and a narrow viewport (~390px). Scroll through rather than judging the hero alone.

**Tier B — source only.** You fetched the page as text/markup (`web_fetch`). You can judge information architecture, heading order, copy hierarchy, grouping, labels, alt attributes, link targets, repeated CTAs, and meta/technical issues. You **cannot** judge spacing, contrast ratios, type scale, or whether something "feels cramped."

State the tier in the output in one plain sentence, without jargon. Never bluff about pixels you didn't see — a reviewer who invents "the padding feels tight" from a text dump destroys their own credibility. If Tier B leaves a real gap, say which parts would need eyes on the rendered page.

If both are available, use both. If the fetch fails or returns nothing usable, say so and ask for a screenshot rather than guessing from the URL slug.

## Step 2: Read the page as a visitor, once, before analyzing

Go through top to bottom and note, in your own head:
- What is this, who is it for, what does it want me to do? (If you can't answer in 5 seconds, that's finding #1.)
- Where does the eye go first, second, third?
- What is the single conversion action, and how many paths lead to it?
- Where did momentum break — a question raised and not answered, a scroll that felt long, a claim with no proof?

This pass is what makes the review feel like a person rather than a linter. The principles below explain *why* those reactions happened; they don't replace having them.

## Step 3: Probe each principle

Work through all ten. Not every one produces a finding — a principle with nothing to say gets left out of the writeup rather than padded with a truism.

**1. Visual hierarchy** — Does each section have one clear loudest element? Is there a consistent pattern (eyebrow → headline → sub → action) or does every section reinvent itself? Can someone reading only the headlines get the whole pitch? Look for competing "primary" elements and for a hero that says less than the section below it.

**2. Contrast** — Is the accent color reserved for actions, or sprayed decoratively? Tier A: check body text against background (target 4.5:1, 3:1 for large text), and check muted/gray secondary text, which is where most sites fail. Tier B: you can still check whether the primary CTA is visually distinguished from secondary links by role.

**3. Proximity & grouping** — Do labels sit closer to what they describe than to the neighbouring item? Are related items chunked (cards, numbered lists, a grid) or run together? Is anything grouped by borders where whitespace would do the job better?

**4. Alignment & grid** — Tier A: do element edges line up, is there a visible spacing rhythm, does anything sit slightly off? Tier B: check structural alignment instead — does the section order have a logic, do parallel items have parallel structure (six value props where two have subheads and four don't).

**5. Consistency** — Same action, same label, same look, everywhere? Do repeated components (cards, buttons, section intros) share a pattern? Also external consistency: does the logo link home, does the nav behave the way people expect on this kind of site?

**6. Feedback** — Every action gets a visible response: hover and focus states, loading states, form validation, success confirmation. Autoplaying media needs a pause control. Tier A can verify these; Tier B can only spot whether controls exist in the markup.

**7. Affordance & signifiers** — Do buttons look pressable and links look clickable? Is anything interactive that doesn't announce itself (a clickable card with no cue, an accordion with no chevron, a carousel with no arrows or dots)? Conversely, is anything styled like a button that isn't one?

**8. Progressive disclosure** — Is the page showing everything at once, or revealing in layers? Watch for the inverse failure too: a section that raises an expectation and withholds the payload (a "Pricing" heading with no number, a "Case studies" link to nothing). Withholding is only good design when the visitor still gets enough to decide.

**9. Forgiveness** — Undo, confirmation before destructive actions, autosave, clear error recovery, a back door out of any flow. On marketing sites this often lives in the copy instead of the UI — refund terms, "no commitment", cancel-anytime. Credit it where it exists.

**10. Accessibility** — Alt text on content images (empty alt on the images that *are* the product is a real failure, not a nitpick). Logical heading order with one H1. Keyboard reachability and a skip-to-content link. Focus visibility. Tap targets ~44px. Never color alone to convey meaning. Captions or transcripts for video. Motion that respects `prefers-reduced-motion`.

**Also worth flagging, though not strictly design:** navigation and wayfinding gaps (long single-page sites with anchors only in the footer), single points of failure in the conversion path (every CTA pointing to one off-site destination), missing trust scaffolding (anonymous testimonials, no logos, no results), thin footers with no contact or legal pages, and outright technical bugs — canonical mismatches, broken anchors, mixed content. These frequently matter more to the visitor than any spacing issue, so don't suppress them for being off-taxonomy.

## Step 4: Write it up

Use this structure:

```
# Design review: [Site name]

[One or two sentences on evidence tier and its limits — plain language, no heading.]

## The read
[2–3 sentences: what the page is, who it's for, and the single biggest thing helping or hurting it.]

## Where it holds up
[3–6 items. Bold the principle, then name the specific element and why it works.]

## What's missing
[3–8 items. Bold a short title, then: what's wrong → which principle it violates → the concrete fix.]

## Bugs
[Only if there are real technical defects. Otherwise omit the section.]

## Fix these first
[Numbered 1–6, ordered by what a visitor actually feels. One line each, no explanation — the reasoning is above.]
```

## Calibration

**Be specific or say nothing.** "Improve the visual hierarchy" is worthless. "The Pricing section has no number in it, so the one moment a visitor is ready to self-qualify is the moment the page goes quiet" is a finding. Quote the site's actual headlines, labels, and section names.

**Find the real strengths.** A review that's all criticism reads as reflexive and gets discounted wholesale. Whatever the page does well — a consistent section rhythm, a genuinely good pause control, risk-reversal copy — name it and say why it works. If the page is weak everywhere, say that plainly instead of manufacturing praise.

**Cap the findings.** Eight issues is the ceiling. Beyond that nothing gets fixed. Merge related nitpicks into one item and drop anything you'd rank tenth.

**Rank by felt impact, not by taxonomy.** The top three should be things a visitor experiences — can't find pricing, can't find the nav, doesn't believe the testimonials. Alt text and canonical tags matter, but they go below the fold of your recommendations.

**Separate observation from inference.** "Every image has an empty alt attribute" is observed. "This probably hurts conversion for mobile users on slow connections" is inference — mark it as such with a hedge, don't state it as fact.

**Don't moralize about the business.** Review the design. If the copy makes claims you find dubious, that's only in scope when it creates a design problem (e.g. an unsupported claim with no proof element nearby).

**Match the register to the ask.** "Roast my landing page" invites bluntness; "can you take a look at our site" wants the same substance delivered kindly. The findings don't change either way.

## Variants

- **Asked to compare two sites** — run the same probes on both, then write one shared section per principle with a verdict, rather than two separate reviews stapled together.
- **Asked about one principle only** ("how's the accessibility") — go deep on that principle, and add at most two lines on anything else you couldn't help noticing.
- **Given a mockup or screenshot instead of a URL** — Tier A applies, minus anything interactive; say that hover, focus, and loading states can't be judged from a still.
- **Asked to fix it, not just review it** — do the review first, then offer the rewrite. People rarely want code before they've agreed on the diagnosis.
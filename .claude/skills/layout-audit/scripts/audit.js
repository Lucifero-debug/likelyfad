/* ============================================================================
   LAYOUT AUDIT — read-only measurement pass.

   Paste into DevTools console on the page you want measured, or run through a
   browser tool. Returns one object. Mutates nothing.

   It measures; it does not judge. Every number it flags is a SUSPECT, not a
   defect — the five traps below are why. Verify against source before writing
   any finding up.

     1. zoom          — meta.dpr. At DPR != 1 screenshot pixels are not CSS
                        pixels. Reported so a reader can discount the run.
     2. animation     — elements mid-reveal (transform/opacity in flight) are
                        excluded and listed under `unstable`. An element sitting
                        26px below its resting position turns a correct 64px gap
                        into a measured 38.
     3. fluid values  — anything that resolves from clamp()/vw is marked
                        `fluid: true` by re-reading it at a second width is not
                        possible from one pass, so instead the AUTHORED value is
                        pulled from the cascade and reported beside the computed
                        one. A clamp is not scale drift.
     4. breakpoints   — meta.width is stamped on every run. Compare two widths
                        before calling anything a flat defect.
     5. selector drift— every measurement carries the element's tag + class, so
                        a comparison can be verified as being about the same box.
   ========================================================================== */

(() => {
  "use strict";

  const SCALE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];
  const px = (v) => Math.round(parseFloat(v) * 100) / 100 || 0;
  const near = (v, t = 1.5) => SCALE.some((s) => Math.abs(v - s) <= t);

  const desc = (el) => {
    const cls = (el.className && typeof el.className === "string" ? el.className : "")
      .split(/\s+/).filter(Boolean).slice(0, 6).join(" ");
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? " ." + cls.replace(/\s+/g, " .") : ""}`.slice(0, 160);
  };

  /* --- trap 2: is this element mid-animation? ---------------------------- */
  const unstable = [];
  const isUnstable = (el, cs) => {
    const t = cs.transform;
    const moved = t && t !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(t);
    const faded = parseFloat(cs.opacity) < 0.99;
    const running = el.getAnimations
      ? el.getAnimations().some((a) => a.playState === "running")
      : false;
    if (moved || faded || running) {
      unstable.push({ el: desc(el), transform: t, opacity: cs.opacity, running });
      return true;
    }
    return false;
  };

  /* --- trap 3: authored value, so a clamp is visible as a clamp ---------- */
  const authored = (el, prop) => {
    // inline style wins, then any matching rule in the cascade, last one first
    const inline = el.style.getPropertyValue(prop);
    if (inline) return inline.trim();
    let out = "";
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; } // cross-origin
      if (!rules) continue;
      for (const r of rules) {
        if (!r.selectorText || !r.style) continue;
        let m = false;
        try { m = el.matches(r.selectorText); } catch { continue; }
        if (!m) continue;
        const v = r.style.getPropertyValue(prop);
        if (v) out = v.trim();
      }
    }
    return out;
  };
  const isFluid = (v) => /clamp\(|\bvw\b|\bvh\b|calc\(/.test(v || "");

  const all = [...document.querySelectorAll("body *")].filter((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });

  /* --- TYPE ------------------------------------------------------------- */
  const textEls = all.filter((el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
  );

  const type = textEls.map((el) => {
    const cs = getComputedStyle(el);
    const size = px(cs.fontSize);
    const lh = cs.lineHeight === "normal" ? null : px(cs.lineHeight);
    const ratio = lh ? Math.round((lh / size) * 1000) / 1000 : null;
    const track = px(cs.letterSpacing) || 0;
    const trackEm = Math.round((track / size) * 1000) / 1000;
    const upper = cs.textTransform === "uppercase";

    // inverse rule: bigger type leads tighter
    let want = null;
    if (size >= 48) want = [1.0, 1.1];
    else if (size >= 24) want = [1.2, 1.3];
    else if (size >= 16) want = [1.4, 1.5];
    else if (size >= 12) want = [1.5, 1.6];
    else want = [1.5, 1.6];

    const flags = [];
    if (ratio !== null && (ratio < want[0] - 0.03 || ratio > want[1] + 0.03))
      flags.push(`leading ${ratio} outside ${want[0]}–${want[1]} for ${size}px`);
    if (size < 12) flags.push(`${size}px below the 12px floor`);
    else if (size < 16 && el.matches("p, li, blockquote, dd"))
      flags.push(`body copy at ${size}px, below the 16px floor`);
    if (upper && trackEm < 0.05)
      flags.push(`uppercase tracked ${trackEm}em, under +0.05em`);
    if (!upper && size >= 48 && trackEm > -0.01)
      flags.push(`display tracked ${trackEm}em, wants about -0.02em`);

    // measure, in characters
    const chars = el.textContent.trim().length;
    const oneLine = size * 0.5; // rough average advance width
    const measure = Math.round(el.getBoundingClientRect().width / oneLine);

    return {
      el: desc(el),
      size, lineHeight: lh, ratio, trackEm, upper,
      family: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
      weight: cs.fontWeight,
      authoredSize: authored(el, "font-size"),
      authoredLeading: authored(el, "line-height"),
      fluid: isFluid(authored(el, "font-size")),
      measure: chars > 60 ? measure : null,
      flags,
    };
  });

  const sizes = [...new Set(type.map((t) => t.size))].sort((a, b) => b - a);
  const ramp = [];
  for (let i = 0; i < sizes.length - 1; i++) {
    const step = Math.round((sizes[i] / sizes[i + 1]) * 1000) / 1000;
    ramp.push({ from: sizes[i], to: sizes[i + 1], step, tooClose: step < 1.15 });
  }

  /* --- SPACING ---------------------------------------------------------- */
  // the one rule: gap between two things > padding inside either of them
  const spacing = [];
  all.forEach((el) => {
    const cs = getComputedStyle(el);
    if (isUnstable(el, cs)) return;
    const kids = [...el.children].filter((k) => {
      const kcs = getComputedStyle(k);
      if (kcs.display === "none" || kcs.position === "absolute" || kcs.position === "fixed")
        return false;
      return !isUnstable(k, kcs);
    });
    if (kids.length < 2) return;

    const padTop = px(cs.paddingTop), padBottom = px(cs.paddingBottom);
    const pad = Math.max(padTop, padBottom, px(cs.paddingLeft), px(cs.paddingRight));

    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i].getBoundingClientRect();
      const b = kids[i + 1].getBoundingClientRect();
      const gap = Math.round((b.top - a.bottom) * 100) / 100;
      if (gap < -2 || gap > 400) continue; // side-by-side, or not a stack

      const kidPad = Math.max(
        px(getComputedStyle(kids[i]).paddingBottom),
        px(getComputedStyle(kids[i + 1]).paddingTop)
      );
      const authoredGap =
        authored(kids[i + 1], "margin-top") || authored(el, "gap") || authored(el, "row-gap");

      const flags = [];
      if (!near(gap)) flags.push(`${gap} is off the 4/8/12/16/24/32/48/64/96/128 scale`);
      if (kidPad > 0 && gap < kidPad)
        flags.push(`gap ${gap} is smaller than the ${kidPad} padding inside a neighbour`);

      spacing.push({
        parent: desc(el),
        between: [desc(kids[i]), desc(kids[i + 1])],
        gap,
        parentPadding: pad,
        neighbourPadding: kidPad,
        authoredGap,
        fluid: isFluid(authoredGap),
        flags,
      });
    }
  });

  /* --- TAP TARGETS ------------------------------------------------------ */
  const targets = all
    .filter((el) => el.matches('a, button, [role="button"], input, select, textarea, summary'))
    .map((el) => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      return {
        el: desc(el),
        w, h,
        text: el.textContent.trim().slice(0, 40),
        flags: w < 44 || h < 44 ? [`${w}x${h}, under the 44x44 floor`] : [],
      };
    });

  /* --- TYPOGRAPHY STRUCTURE --------------------------------------------- */
  const families = {}, weights = {};
  type.forEach((t) => {
    families[t.family] = (families[t.family] || 0) + 1;
    weights[t.weight] = (weights[t.weight] || 0) + 1;
  });

  const only = (arr) => arr.filter((x) => x.flags.length);

  return {
    meta: {
      url: location.href,
      width: innerWidth,
      height: innerHeight,
      dpr: devicePixelRatio,
      dprWarning:
        devicePixelRatio !== 1
          ? `devicePixelRatio is ${devicePixelRatio} — screenshot pixels are NOT CSS pixels. Numbers here are CSS px and are fine; a screenshot of this page is not measurable.`
          : null,
      excluded: `${unstable.length} elements mid-animation, listed under 'unstable'`,
      note: "Re-run at a second viewport width before calling any fluid value a defect.",
    },
    typography: {
      families,
      weights,
      familyCount: Object.keys(families).length,
      weightCount: Object.keys(weights).length,
      ramp,
      rampTooClose: ramp.filter((r) => r.tooClose),
    },
    type: only(type),
    typeAll: type,
    spacing: only(spacing),
    spacingAll: spacing,
    tapTargets: only(targets),
    unstable,
    summary: {
      typeFlags: only(type).length,
      spacingFlags: only(spacing).length,
      tapFlags: only(targets).length,
      unstableCount: unstable.length,
    },
  };
})();

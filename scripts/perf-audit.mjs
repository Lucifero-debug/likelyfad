/**
 * perf-audit.mjs — frame-level performance harness.
 *
 * Measures what a Lighthouse score cannot: whether individual components drop
 * frames while scrolling, while hovering, while sitting still, and while
 * mounting or unmounting.
 *
 * Setup:
 *   npm i -D playwright && npx playwright install chromium
 *
 * Run:
 *   node scripts/perf-audit.mjs                    # against localhost:3000
 *   node scripts/perf-audit.mjs --url https://...  # against production
 *   node scripts/perf-audit.mjs --json             # machine-readable output
 *   node scripts/perf-audit.mjs --width 390 --height 844
 *   node scripts/perf-audit.mjs --reduced-motion   # forces the preference on
 *
 * BOTH SIDES OF THE `tab` BREAKPOINT NEED A PASS. It is 761px, and the walls
 * are different code paths either side of it — four tilted columns above, two
 * or three horizontal rows below. A pass at 1440 says nothing about 390.
 *
 * AND ONE PASS WITH --reduced-motion, which should come back quiet. Anything
 * still moving or still playing in that pass is a gate that was never wired.
 *
 * IMPORTANT: run this against a PRODUCTION build (`npm run build && npm start`),
 * not `next dev`. Dev mode is unminified, double-renders under Strict Mode, and
 * carries the HMR client — it is routinely several times slower and will send
 * you chasing problems that do not exist in production.
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const URL = flag("url", "http://localhost:3000");
const AS_JSON = args.includes("--json");
const REDUCED = args.includes("--reduced-motion");
const CONFIG = JSON.parse(readFileSync(flag("config", "perf-audit.config.json"), "utf8"));

/* --width/--height override the config viewport, so the two breakpoint passes
   are one flag rather than a second config file. */
const VIEWPORT = {
  width: +flag("width", CONFIG.viewport?.width ?? 1440),
  height: +flag("height", CONFIG.viewport?.height ?? 900),
};

/* SHORTER THAN THE 30s PLAYWRIGHT DEFAULT, ON PURPOSE. A target that cannot be
   reached should cost this run five seconds and one row saying so — see the
   note on `reach`. */
const ACTION_TIMEOUT = 5000;

/* A 60Hz frame is 16.7ms. Anything past 20ms means a frame was missed; past
   50ms is a hitch a person will describe as "it jumped". */
const FRAME_BUDGET = 20;
const HITCH = 50;

/* ---------------------------------------------------------------------------
   IN-PAGE INSTRUMENTATION.
   Injected before any app code runs, so nothing is missed during hydration.
   A rAF loop records frame timestamps; PerformanceObservers record long tasks
   (main-thread blocks) and layout shifts (things moving unexpectedly). */
const probe = () => {
  window.__perf = { frames: [], longTasks: [], shifts: [] };

  let last = performance.now();
  const tick = (now) => {
    window.__perf.frames.push(now - last);
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__perf.longTasks.push({ start: e.startTime, duration: e.duration });
    }
  }).observe({ entryTypes: ["longtask"] });

  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      /* hadRecentInput shifts are user-initiated and expected — a menu opening
         is not a layout bug. Only unprompted movement counts. */
      if (!e.hadRecentInput) window.__perf.shifts.push(e.value);
    }
  }).observe({ type: "layout-shift", buffered: true });
};

const reset = (page) =>
  page.evaluate(() => {
    window.__perf.frames.length = 0;
    window.__perf.longTasks.length = 0;
    window.__perf.shifts.length = 0;
  });

const collect = (page) => page.evaluate(() => window.__perf);

/* ---------------------------------------------------------------------------
   STATS. Percentiles rather than averages, because a mean of 16ms hides one
   200ms hitch and that hitch is the entire complaint. */
function analyse(label, raw) {
  const f = raw.frames.filter((d) => d > 0).sort((a, b) => a - b);
  if (!f.length) return { label, empty: true };

  const at = (p) => f[Math.min(f.length - 1, Math.floor(f.length * p))];
  const p50 = at(0.5);
  const p95 = at(0.95);
  const worst = f[f.length - 1];

  const dropped = f.filter((d) => d > FRAME_BUDGET).length;
  const hitches = f.filter((d) => d > HITCH).length;

  /* Jitter is what "not smooth" usually means: the frame rate is fine on
     average but inconsistent. A steady 40fps reads better than a 60fps
     average that swings between 8ms and 60ms. */
  const mean = f.reduce((a, b) => a + b, 0) / f.length;
  const jitter = Math.sqrt(f.reduce((a, d) => a + (d - mean) ** 2, 0) / f.length);

  const blocking = raw.longTasks.reduce((a, t) => a + t.duration, 0);

  /* A THROTTLED RUN IS NOT A SLOW ONE, AND MUST NEVER BE REPORTED AS ONE. No
     display runs at 10fps, so a p50 past 100ms is never the page — it is the
     rAF loop being throttled because the browser believes it is not visible.
     Grading that produces a table of confident FAILs describing nothing. */
  if (p50 > 100) return { label, throttled: true, p50: +p50.toFixed(1), frames: f.length };

  let verdict = "good";
  if (p95 > 33 || hitches > 0 || jitter > 12) verdict = "bad";
  else if (p95 > FRAME_BUDGET || dropped / f.length > 0.05 || jitter > 6) verdict = "warn";

  return {
    label,
    verdict,
    fps: +(1000 / p50).toFixed(1),
    p50: +p50.toFixed(1),
    p95: +p95.toFixed(1),
    worstFrame: +worst.toFixed(1),
    droppedPct: +((dropped / f.length) * 100).toFixed(1),
    hitches,
    jitter: +jitter.toFixed(1),
    longTasks: raw.longTasks.length,
    blockingMs: +blocking.toFixed(0),
    cls: +raw.shifts.reduce((a, b) => a + b, 0).toFixed(4),
  };
}

/* ONE STUCK TARGET MUST NOT TAKE THE RUN WITH IT. It used to: an action that
   threw propagated out of the top-level loop, so a single unreachable selector
   ended the audit and every scenario after it was simply absent — which reads
   as "not measured" only if you happen to be counting rows. A throw is now a
   row of its own, carrying whatever frames were recorded before it. */
async function sample(page, label, action, settle = 300) {
  await reset(page);
  await page.waitForTimeout(settle);
  let failed = null;
  try {
    await action();
  } catch (e) {
    failed = String(e?.message ?? e).split("\n")[0].trim();
  }
  const result = analyse(label, await collect(page));
  return failed ? { ...result, failed } : result;
}

/* GETTING TO A TARGET IS NOT PART OF WHAT THE TARGET COSTS, and it used to be
   measured as though it were: both loops below scrolled the element into view
   INSIDE the sample window, so every hover and toggle row carried whatever the
   travel cost — and on this page the travel is the expensive part, because
   entering a wall starts video decoders. A row named `toggle: work lightbox`
   was reporting the scroll that reached the tile. The scroll happens before the
   window opens now, and each row means what its name says.

   scrollIntoView RATHER THAN scrollIntoViewIfNeeded, and unconditionally: the
   Playwright method is an actionability call and waits for stability, which is
   the one thing a marquee cannot offer — see the note on `settle`. Landing the
   target in the CENTRE also puts it somewhere a pointer can reach without the
   nav over it. */
async function bring(page, el) {
  await el.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(600);
}

/* PUT THE POINTER ON A TARGET THAT IS NEVER GOING TO HOLD STILL.

   `locator.hover()` runs the actionability checks first, and one of them is
   STABILITY: the element must report the same bounding box on two consecutive
   frames. Every clip in both walls rides a perpetual marquee, and a marquee
   pauses ONLY ONCE HOVERED — so the check waits for a stillness that hovering
   is what would cause. That is a deadlock, and it cost the `hover: reel wall
   clip` row every number it should ever have produced: 30s of waiting, a
   throw, and the run over with every later scenario unmeasured.

   `force: true` is the right answer here rather than a way around one.
   Stability is precisely the precondition a marquee cannot offer, and a forced
   hover lands on the box the element occupies at dispatch — which is what a
   real pointer does to a moving tile too. */
const settle = (el) => el.hover({ force: true, timeout: ACTION_TIMEOUT });

/* ------------------------------------------------------------------------ */

const results = [];

const browser = await chromium.launch({
  /* HEADED, DELIBERATELY. Headless Chrome commonly falls back to software
     rasterisation, which makes anything on a 3D-transformed plane look far
     worse than it is on a real machine — you would "find" a problem that is an
     artefact of the harness. Headed uses the actual GPU. */
  headless: false,
  args: [
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    /* AND THIS ONE IS WINDOWS, AND IT IS NOT OPTIONAL THERE. Chrome computes
       native window occlusion on Windows separately from the three flags above:
       let anything cover the browser mid-run — another window, a screen
       blanking, the terminal you started this from — and it decides the page is
       invisible and throttles requestAnimationFrame to 1Hz. Every frame then
       measures ~1007ms and every scenario after the one where it happened reads
       as a catastrophic failure that is entirely an artefact of the harness.
       Seen in practice: a clean `at rest` row followed by fifteen rows of 1fps.
       `analyse` also refuses to grade a run like that — see `throttled`. */
    "--disable-features=CalculateNativeWinOcclusion",
  ],
});

const page = await browser.newPage({
  viewport: VIEWPORT,
  ...(REDUCED ? { reducedMotion: "reduce" } : {}),
});
await page.addInitScript(probe);
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

/* 1. AT REST. Nothing touched. Any frame cost here is something animating on
      its own — a CSS marquee, an autoplaying video, a spring still settling.
      This is the scenario a Lighthouse run will never show you. */
results.push(await sample(page, "at rest", () => page.waitForTimeout(5000)));

/* 2. SCROLL. Real wheel events rather than scrollTo, because scrollTo skips
      the per-frame work that scroll-driven effects actually do. */
results.push(
  await sample(page, "scroll down", async () => {
    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.min(40, Math.ceil(height / 200));
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(60);
    }
  })
);

results.push(
  await sample(page, "scroll up", async () => {
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, -200);
      await page.waitForTimeout(60);
    }
  })
);

/* 3. HOVER. Each configured target, measured on its own, so a slow card is
      attributed to that card rather than to "the page". */
for (const t of CONFIG.hover ?? []) {
  const el = page.locator(t.selector).first();
  if (!(await el.count())) {
    results.push({ label: `hover: ${t.name}`, missing: true });
    continue;
  }
  await bring(page, el);
  results.push(
    await sample(page, `hover: ${t.name}`, async () => {
      await settle(el);
      await page.waitForTimeout(1500);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(600);
    })
  );
}

/* 4. MOUNT / UNMOUNT. Appear-and-disappear cost: a lightbox opening, an
      accordion expanding. Layout shift matters more than frame rate here. */
for (const t of CONFIG.toggle ?? []) {
  const open = page.locator(t.open).first();
  if (!(await open.count())) {
    results.push({ label: `toggle: ${t.name}`, missing: true });
    continue;
  }
  /* THE POINTER GOES ON THE TARGET BEFORE THE WINDOW OPENS, for two reasons.
     A lane pauses under the pointer, so the click that follows has something
     stationary to hit and needs no force of its own. And the hover's own cost —
     a scale transition, a lane stopping — belongs to the hover row above, not
     to this one. What is left inside the window is the mount and the unmount,
     which is what this scenario is for. */
  await bring(page, open);
  await settle(open);
  results.push(
    await sample(page, `toggle: ${t.name}`, async () => {
      await open.click({ timeout: ACTION_TIMEOUT });
      await page.waitForTimeout(1200);
      if (t.close) {
        const close = page.locator(t.close).first();
        if (await close.count()) await close.click({ timeout: ACTION_TIMEOUT });
      } else {
        await page.keyboard.press("Escape");
      }
      await page.waitForTimeout(800);
    })
  );
}

await browser.close();

/* ------------------------------------------------------------------------ */

const output = {
  url: URL,
  at: new Date().toISOString(),
  viewport: VIEWPORT,
  reducedMotion: REDUCED,
  results,
};

if (AS_JSON) {
  console.log(JSON.stringify(output, null, 2));
} else {
  const mark = { good: "OK  ", warn: "WARN", bad: "FAIL" };
  console.log(
    `\n  ${URL}   ${VIEWPORT.width}x${VIEWPORT.height}${REDUCED ? "   reduced-motion: forced" : ""}\n`
  );
  console.log(
    "  " +
      ["", "scenario".padEnd(26), "fps", "p95", "worst", "drop%", "hitch", "jitter", "block", "cls"]
        .join("  ")
  );
  for (const r of results) {
    if (r.missing) {
      console.log(`  ????  ${r.label.padEnd(26)}  selector not found`);
      continue;
    }
    if (r.empty) {
      console.log(`  ????  ${r.label.padEnd(26)}  no frames recorded`);
      continue;
    }
    if (r.throttled) {
      console.log(
        `  ????  ${r.label.padEnd(26)}  THROTTLED (p50 ${r.p50}ms) — the window was not ` +
          `visible; nothing here was measured`
      );
      continue;
    }
    console.log(
      `  ${mark[r.verdict]}  ${r.label.padEnd(26)}  ${String(r.fps).padStart(4)}  ` +
        `${String(r.p95).padStart(5)}  ${String(r.worstFrame).padStart(5)}  ` +
        `${String(r.droppedPct).padStart(5)}  ${String(r.hitches).padStart(5)}  ` +
        `${String(r.jitter).padStart(6)}  ${String(r.blockingMs).padStart(5)}  ${r.cls}`
    );
    /* A partial row is worth more than a missing one, but only if it says so. */
    if (r.failed) console.log(`        ${"".padEnd(26)}  incomplete: ${r.failed}`);
  }
  console.log("");
}

writeFileSync("perf-audit-latest.json", JSON.stringify(output, null, 2));

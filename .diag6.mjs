/* WHAT IS HAPPENING ON THE HITCHED FRAMES of a cold first scroll. No emulation
   of anything — the page runs as shipped; the probe only records when clips are
   asked to play, when their bytes land, and when a frame ran long. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const PASSES = +(process.argv[3] ?? 2);
const W = 1440, H = 900, HITCH = 50;

const probe = () => {
  window.__perf = { frames: [], plays: [], loads: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push([now - last, window.scrollY, now]); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);

  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    window.__perf.plays.push([performance.now(), (this.currentSrc || this.src || "").split("/").pop()]);
    return play.apply(this, arguments);
  };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (/\.(mp4|webm|m4v)/.test(e.name))
      window.__perf.loads.push([e.responseEnd, e.name.split("/").pop(), Math.round(e.transferSize / 1024)]);
  }).observe({ type: "resource", buffered: true });
};

const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });

for (let p = 0; p < PASSES; p++) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  await page.addInitScript(probe);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const t0 = await page.evaluate(() => { const t = performance.now(); window.__perf.frames.length = 0; return t; });
  for (let i = 0; i < 32; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  const perf = await page.evaluate(() => window.__perf);
  await ctx.close();

  const hitches = perf.frames.filter((f) => f[0] > HITCH);
  const inGesture = (t) => t >= t0;
  console.log(`\n### cold pass ${p + 1}`);
  console.log(`  play() calls during gesture: ${perf.plays.filter((x) => inGesture(x[0])).length} (before: ${perf.plays.filter((x) => !inGesture(x[0])).length})`);
  console.log(`  video responses during gesture: ${perf.loads.filter((x) => inGesture(x[0])).length} (before: ${perf.loads.filter((x) => !inGesture(x[0])).length})`);
  console.log(`  hitches: ${hitches.length}`);
  for (const [ms, y, at] of hitches) {
    const near = (arr) => arr.filter(([t]) => Math.abs(t - at) < 150).map((x) => x[1]).slice(0, 4);
    console.log(`    ${ms.toFixed(0)}ms at y=${Math.round(y)}  plays±150ms: [${near(perf.plays).join(", ")}]  bytes±150ms: [${near(perf.loads).join(", ")}]`);
  }
}
await browser.close();

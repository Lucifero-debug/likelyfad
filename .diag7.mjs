/* The audit's own sequence — 5s at rest, 40 steps down, 40 steps up — with the
   event probe attached, because the rows that fail in the audit are `scroll
   down` after a rest and `scroll up` from the bottom, and neither is what a
   top-down-only cycle measures. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const PASSES = +(process.argv[3] ?? 2);
const W = 1440, H = 900, HITCH = 50, BUDGET = 20;

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
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (/\.(mp4|webm|m4v)/.test(e.name)) window.__perf.loads.push([e.responseEnd, e.name.split("/").pop()]); }).observe({ type: "resource", buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.longTasks = (window.__perf.longTasks ?? []).concat([[e.startTime, e.duration]]); }).observe({ entryTypes: ["longtask"] });
};

const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });

for (let p = 0; p < PASSES; p++) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  await page.addInitScript(probe);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  console.log(`\n### cold pass ${p + 1}`);

  const sample = async (label, action) => {
    const t0 = await page.evaluate(() => { const t = performance.now(); window.__perf.frames.length = 0; return t; });
    await action();
    const perf = await page.evaluate(() => window.__perf);
    const win = perf.frames;
    const d = win.map((f) => f[0]).filter((x) => x > 0).sort((a,b)=>a-b);
    const hit = win.filter((f) => f[0] > HITCH);
    const during = (arr) => (arr ?? []).filter(([t]) => t >= t0);
    console.log(`  ${label.padEnd(11)} p50 ${d[Math.floor(d.length*0.5)].toFixed(1)}  p95 ${d[Math.floor(d.length*0.95)].toFixed(1)}  worst ${d[d.length-1].toFixed(0)}  drop ${((d.filter(x=>x>BUDGET).length/d.length)*100).toFixed(1)}%  hitches ${hit.length}  plays ${during(perf.plays).length}  loads ${during(perf.loads).length}  longTasks ${during(perf.longTasks).length}`);
    for (const [ms, y, at] of hit) {
      const near = (arr) => (arr ?? []).filter(([t]) => Math.abs(t - at) < 200).length;
      console.log(`      ${ms.toFixed(0)}ms  y=${Math.round(y)}  plays±200ms ${near(perf.plays)}  loads±200ms ${near(perf.loads)}  longTask±200ms ${near(perf.longTasks)}`);
    }
  };

  await sample("at rest", () => page.waitForTimeout(5000));
  await sample("scroll down", async () => { for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); } });
  await sample("scroll up", async () => { for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, -200); await page.waitForTimeout(60); } });
  await ctx.close();
}
await browser.close();

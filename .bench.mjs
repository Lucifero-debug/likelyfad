/* The two numbers that decide this: what a gesture END costs (resume stalls),
   and what the gesture ITSELF costs (a full-page scroll). Both on one build. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900, HITCH = 50, BUDGET = 20;
const probe = () => {
  window.__perf = { frames: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push([now - last, now]); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
await page.addInitScript(probe);
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(6000);

console.log("### gesture end (one step, then 800ms still) — the resume stall");
const worsts = [];
for (let g = 0; g < 6; g++) {
  await page.mouse.wheel(0, 120); await page.waitForTimeout(60); await page.mouse.wheel(0, -120);
  const t0 = await page.evaluate(() => performance.now());
  await page.waitForTimeout(800);
  const f = (await page.evaluate(() => window.__perf.frames)).filter(([, t]) => t >= t0);
  const long = f.filter(([d]) => d > 50).map(([d]) => Math.round(d));
  const worst = Math.max(...f.map(([d]) => d));
  worsts.push(worst);
  console.log(`  gesture ${g + 1}  worst ${worst.toFixed(0).padStart(4)}ms  stalls>50ms: ${long.length} [${long.join(" ")}]`);
}
console.log(`  median worst ${worsts.slice().sort((a,b)=>a-b)[3].toFixed(0)}ms   total stalls>50ms ${worsts.filter(w=>w>50).length}/6 gestures`);

console.log("\n### full-page scroll — the gesture itself");
for (let p = 0; p < 3; p++) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.evaluate(() => { window.__perf.frames.length = 0; });
  for (let i = 0; i < 32; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  const f = await page.evaluate(() => window.__perf.frames);
  const d = f.map(([x]) => x).filter((x) => x > 0).sort((a,b)=>a-b);
  console.log(`  pass ${p+1}  p50 ${d[Math.floor(d.length*0.5)].toFixed(1)}  p95 ${d[Math.floor(d.length*0.95)].toFixed(1)}  worst ${d[d.length-1].toFixed(0)}  drop ${((d.filter(x=>x>BUDGET).length/d.length)*100).toFixed(1)}%  hitches ${d.filter(x=>x>HITCH).length}`);
}
await browser.close();

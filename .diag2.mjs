/* AT-REST cost by scroll position and by condition. rAF cadence is the proxy:
   on a 144Hz panel a parked page that ticks at 14ms is producing frames at half
   rate, which is a sustained cost rather than a hitch. */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900;

const probe = () => {
  window.__perf = { frames: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push(now - last); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

const browser = await chromium.launch({
  headless: false,
  args: ["--disable-background-timer-throttling", "--disable-renderer-backgrounding",
         "--disable-backgrounding-occluded-windows", "--disable-features=CalculateNativeWinOcclusion"],
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.addInitScript(probe);
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const stops = await page.evaluate(() => {
  const y = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null; };
  return [
    ["top (hero + reel wall)", 0],
    ["reel wall centred", Math.max(0, (y("#top") ?? 0) + 300)],
    ["#why", y("#why")],
    ["#work", y("#work")],
    ["#pricing", y("#pricing")],
    ["footer", document.body.scrollHeight - 900],
  ].filter(([, v]) => v !== null);
});

async function park(label, y, ms = 4000) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(900);
  await page.evaluate(() => { window.__perf.frames.length = 0; });
  await page.waitForTimeout(ms);
  const f = (await page.evaluate(() => window.__perf.frames)).filter((d) => d > 0).sort((a, b) => a - b);
  const p50 = f[Math.floor(f.length * 0.5)], p95 = f[Math.floor(f.length * 0.95)];
  console.log(`  ${label.padEnd(24)} y=${String(y).padStart(5)}  p50 ${p50.toFixed(1).padStart(5)}ms (${(1000/p50).toFixed(0).padStart(3)}fps)  p95 ${p95.toFixed(1).padStart(5)}  worst ${f[f.length-1].toFixed(0)}`);
}

async function pass(name) {
  console.log(`\n### ${name}`);
  for (const [label, y] of stops) await park(label, y);
}

await pass("baseline");

await page.evaluate(() => {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  for (const v of document.querySelectorAll("video")) v.pause();
});
await pass("videos paused (marquee running)");

await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.addStyleTag({ content: `*,*::before,*::after{animation-play-state:paused!important}` });
await pass("marquee paused (videos playing)");

await page.evaluate(() => {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  for (const v of document.querySelectorAll("video")) v.pause();
});
await pass("both paused");

await browser.close();

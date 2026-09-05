/* Scroll-hitch attribution: which condition, and where on the page. */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:3100";
const W = +(process.argv[3] ?? 1440), H = +(process.argv[4] ?? 900);
const HITCH = 50, BUDGET = 20;

const probe = () => {
  window.__perf = { frames: [] };
  let last = performance.now();
  const tick = (now) => {
    window.__perf.frames.push([now - last, window.scrollY]);
    last = now;
    requestAnimationFrame(tick);
  };
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

/* Section boundaries, so a hitch's scrollY can be named. */
const sections = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("section, header, footer")) {
    const r = el.getBoundingClientRect();
    out.push({ id: el.id || el.getAttribute("aria-label")?.slice(0, 28) || el.tagName,
               top: Math.round(r.top + window.scrollY), h: Math.round(r.height) });
  }
  return out;
});
const where = (y) => {
  const mid = y + H / 2;
  const hit = sections.filter((s) => mid >= s.top && mid < s.top + s.h);
  return hit.length ? hit[hit.length - 1].id : "—";
};

async function scrollPass(label) {
  await page.evaluate(() => { window.scrollTo(0, 0); window.__perf.frames.length = 0; });
  await page.waitForTimeout(800);
  await page.evaluate(() => { window.__perf.frames.length = 0; });
  const height = await page.evaluate(() => document.body.scrollHeight);
  const steps = Math.min(40, Math.ceil(height / 200));
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  const frames = await page.evaluate(() => window.__perf.frames);
  const d = frames.map((f) => f[0]).filter((x) => x > 0).sort((a, b) => a - b);
  const p50 = d[Math.floor(d.length * 0.5)], p95 = d[Math.floor(d.length * 0.95)];
  const dropped = d.filter((x) => x > BUDGET).length;
  const hitches = frames.filter((f) => f[0] > HITCH);
  console.log(`\n### ${label}`);
  console.log(`  p50 ${p50.toFixed(1)}  p95 ${p95.toFixed(1)}  worst ${d[d.length-1].toFixed(1)}  drop ${((dropped/d.length)*100).toFixed(1)}%  hitches ${hitches.length}`);
  for (const [ms, y] of hitches) console.log(`    hitch ${ms.toFixed(0).padStart(4)}ms  y=${String(Math.round(y)).padStart(5)}  ${where(y)}`);
}

const stopVideos = () => page.evaluate(() => {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  for (const v of document.querySelectorAll("video")) v.pause();
});
const stopAnim = () => page.addStyleTag({ content: `*,*::before,*::after{animation-play-state:paused!important}` });

await scrollPass("baseline");
await scrollPass("baseline (repeat, warm cache)");
await stopVideos();
await scrollPass("videos paused (marquee running)");
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await stopAnim();
await scrollPass("marquee paused (videos playing)");
await stopVideos();
await scrollPass("both paused");

await browser.close();

/* How many clips are actually playing where, and what scrolling costs with and
   without them. Three passes per condition, because one pass has been showing
   run-to-run swings of 3x on hitch count. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900, HITCH = 50, BUDGET = 20;

const probe = () => {
  window.__perf = { frames: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push([now - last, window.scrollY]); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.addInitScript(probe);
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const census = async (label, y) => {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1800);
  const c = await page.evaluate(() => {
    const vids = [...document.querySelectorAll("video")];
    const onScreen = (v) => { const r = v.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    const playing = vids.filter((v) => !v.paused && !v.ended && v.readyState > 2);
    return {
      total: vids.length,
      withSrc: vids.filter((v) => !!(v.currentSrc || v.src)).length,
      playing: playing.length,
      playingOnScreen: playing.filter(onScreen).length,
      playingOffScreen: playing.filter((v) => !onScreen(v)).length,
      onScreenTotal: vids.filter(onScreen).length,
    };
  });
  console.log(`  ${label.padEnd(22)} total ${c.total}  withSrc ${c.withSrc}  playing ${c.playing} (on-screen ${c.playingOnScreen}, OFF-screen ${c.playingOffScreen})  video els on screen ${c.onScreenTotal}`);
};

console.log("### census");
await census("top", 0);
await census("#work", await page.evaluate(() => Math.round(document.querySelector("#work").getBoundingClientRect().top + scrollY)));

async function scrollCycle() {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  await page.evaluate(() => { window.__perf.frames.length = 0; });
  const steps = 32;
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  const frames = await page.evaluate(() => window.__perf.frames);
  const d = frames.map((f) => f[0]).filter((x) => x > 0).sort((a, b) => a - b);
  return {
    p50: d[Math.floor(d.length*0.5)], p95: d[Math.floor(d.length*0.95)], worst: d[d.length-1],
    drop: (d.filter((x) => x > BUDGET).length / d.length) * 100,
    hitches: frames.filter((f) => f[0] > HITCH).length,
  };
}
async function passes(name, n = 3) {
  console.log(`\n### ${name}`);
  for (let i = 0; i < n; i++) {
    const r = await scrollCycle();
    console.log(`  pass ${i+1}  p50 ${r.p50.toFixed(1)}  p95 ${r.p95.toFixed(1)}  worst ${r.worst.toFixed(0)}  drop ${r.drop.toFixed(1)}%  hitches ${r.hitches}`);
  }
}
await passes("baseline (videos playing)");
await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.resolve(); for (const v of document.querySelectorAll("video")) v.pause(); });
await passes("videos paused");
await browser.close();

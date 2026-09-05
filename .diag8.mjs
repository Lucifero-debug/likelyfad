/* IS THE STALL THE RESUME? A reader scrolls in short bursts, so the gesture-end
   resume in watchScrolling() fires over and over. This does ten discrete
   one-step gestures and reports the worst frame in the 600ms after each, next
   to a control that never scrolls at all. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900;

const probe = () => {
  window.__perf = { frames: [], plays: [], pauses: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push([now - last, now]); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const play = HTMLMediaElement.prototype.play, pause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.play = function () { window.__perf.plays.push(performance.now()); return play.apply(this, arguments); };
  HTMLMediaElement.prototype.pause = function () { window.__perf.pauses.push(performance.now()); return pause.apply(this, arguments); };
};

const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
await page.addInitScript(probe);
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(6000);   // let the hero wall fill

const window600 = async (label) => {
  const t0 = await page.evaluate(() => performance.now());
  await page.waitForTimeout(600);
  const perf = await page.evaluate(() => window.__perf);
  const f = perf.frames.filter(([, t]) => t >= t0);
  const worst = Math.max(...f.map(([d]) => d));
  const plays = perf.plays.filter((t) => t >= t0).length;
  const pauses = perf.pauses.filter((t) => t >= t0).length;
  console.log(`  ${label.padEnd(26)} worst ${worst.toFixed(0).padStart(4)}ms   plays ${String(plays).padStart(3)}  pauses ${String(pauses).padStart(3)}`);
  return worst;
};

console.log("### control: no scroll at all");
const ctrl = [];
for (let i = 0; i < 5; i++) ctrl.push(await window600(`quiet ${i + 1}`));

console.log("\n### one wheel step, then 600ms of stillness (gesture ends, clips resume)");
const after = [];
for (let i = 0; i < 8; i++) {
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(60);
  await page.mouse.wheel(0, -120);   // back to where we were, so the wall is the same one each time
  after.push(await window600(`gesture ${i + 1}`));
}
const med = (a) => a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];
console.log(`\n  median worst frame — control ${med(ctrl).toFixed(0)}ms   after a gesture ${med(after).toFixed(0)}ms`);
await browser.close();

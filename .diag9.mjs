/* WHERE IN THE WINDOW THE STALL SITS, and whether it survives with no video at
   all. Same eight-gesture shape as .diag8, but every long frame is printed with
   its offset from the gesture end and the nearest play()/pause(). */
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
const noVideo = () => { HTMLMediaElement.prototype.play = function () { return Promise.resolve(); }; };
const noMarquee = () => {
  addEventListener("DOMContentLoaded", () => {
    const s = document.createElement("style");
    s.textContent = "*,*::before,*::after{animation-play-state:paused!important}";
    document.head.appendChild(s);
  });
};

const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });

async function condition(name, ...inits) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  await page.addInitScript(probe);
  for (const i of inits) await page.addInitScript(i);
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(6000);
  console.log(`\n### ${name}`);
  const worsts = [];
  for (let g = 0; g < 6; g++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(60);
    await page.mouse.wheel(0, -120);
    const t0 = await page.evaluate(() => performance.now());
    await page.waitForTimeout(700);
    const perf = await page.evaluate(() => window.__perf);
    const f = perf.frames.filter(([, t]) => t >= t0).sort((a, b) => b[0] - a[0]);
    const [d, at] = f[0];
    const near = (arr) => { const c = arr.filter((t) => t >= t0 - 300); return c.length ? Math.min(...c.map((t) => Math.abs(t - at))).toFixed(0) + "ms" : "none"; };
    worsts.push(d);
    console.log(`  gesture ${g + 1}  worst ${d.toFixed(0).padStart(4)}ms at +${(at - t0).toFixed(0).padStart(4)}ms after gesture   nearest play ${near(perf.plays)}  nearest pause ${near(perf.pauses)}   (plays in window ${perf.plays.filter((t) => t >= t0).length})`);
  }
  const med = worsts.slice().sort((a, b) => a - b)[Math.floor(worsts.length / 2)];
  console.log(`  median worst ${med.toFixed(0)}ms`);
  await ctx.close();
}

await condition("as shipped");
await condition("no video (play is a no-op)", noVideo);
await condition("no marquee (videos playing)", noMarquee);
await condition("neither", noVideo, noMarquee);
await browser.close();

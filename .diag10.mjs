/* IS IT THE 3D STAGE? A video layer changing state inside a rotated, perspective
   subtree cannot be re-composited on its own — the plane it sits on has to be
   re-rastered. This flattens the wall (no perspective, no rotate) and repeats
   the gesture test. Also prints EVERY long frame, not just the worst, so one
   big stall is distinguishable from a run of them. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900;

const probe = () => {
  window.__perf = { frames: [], plays: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push([now - last, now]); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { window.__perf.plays.push(performance.now()); return play.apply(this, arguments); };
};
const flatten = () => {
  addEventListener("DOMContentLoaded", () => {
    const s = document.createElement("style");
    s.textContent = `[class*="perspective"]{perspective:none!important}
                     [class*="rotateY"]{transform:none!important}
                     [class*="translateZ"]{transform:none!important}`;
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
  for (let g = 0; g < 4; g++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(60);
    await page.mouse.wheel(0, -120);
    const t0 = await page.evaluate(() => performance.now());
    await page.waitForTimeout(800);
    const perf = await page.evaluate(() => window.__perf);
    const f = perf.frames.filter(([, t]) => t >= t0);
    const long = f.filter(([d]) => d > 30);
    const plays = perf.plays.filter((t) => t >= t0);
    console.log(`  gesture ${g + 1}  plays ${plays.length}  frames>30ms: ${long.length}  [${long.map(([d, t]) => `${d.toFixed(0)}@+${(t - t0).toFixed(0)}`).join(" ")}]`);
    console.log(`              play offsets: [${plays.map((t) => `+${(t - t0).toFixed(0)}`).join(" ")}]`);
  }
  await ctx.close();
}

await condition("as shipped (tilted 3D wall)");
await condition("flattened (no perspective, no rotate)", flatten);
await browser.close();

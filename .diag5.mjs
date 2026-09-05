/* THE CASE THAT ACTUALLY HITCHES: a COLD load, scrolled once, on a machine that
   is not this one. Every pass gets a fresh context (empty cache) and a 4x CPU
   throttle, because warm repeat passes on a 144Hz desktop measure nothing. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const PASSES = +(process.argv[3] ?? 3);
const CPU = +(process.argv[4] ?? 4);
const W = 1440, H = 900, HITCH = 50, BUDGET = 20;

const probe = () => {
  window.__perf = { frames: [] };
  let last = performance.now();
  const tick = (now) => { window.__perf.frames.push([now - last, window.scrollY]); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};

/* Emulate `pauseOnScroll: true` in every lane, installed before app code. */
const pauseDuringGesture = () => {
  let t, held = [];
  addEventListener("scroll", () => {
    if (!held.length) for (const v of document.querySelectorAll("video")) if (!v.paused) { v.pause(); held.push(v); }
    clearTimeout(t);
    t = setTimeout(() => { for (const v of held) v.play().catch(() => {}); held = []; }, 160);
  }, { passive: true });
};
const noVideo = () => {
  addEventListener("DOMContentLoaded", () => { HTMLMediaElement.prototype.play = () => Promise.resolve(); });
  HTMLMediaElement.prototype.play = () => Promise.resolve();
};

const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });

async function coldPass(extraInit) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await ctx.newPage();
  await page.addInitScript(probe);
  if (extraInit) await page.addInitScript(extraInit);
  const cdp = await ctx.newCDPSession(page);
  if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { window.__perf.frames.length = 0; });
  for (let i = 0; i < 32; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  const frames = await page.evaluate(() => window.__perf.frames);
  await ctx.close();
  const d = frames.map((f) => f[0]).filter((x) => x > 0).sort((a,b)=>a-b);
  return { p50: d[Math.floor(d.length*0.5)], p95: d[Math.floor(d.length*0.95)], worst: d[d.length-1],
           drop: (d.filter((x)=>x>BUDGET).length/d.length)*100,
           hitches: frames.filter((f)=>f[0]>HITCH).length };
}

async function run(name, init) {
  console.log(`\n### ${name}`);
  let h = 0, dr = 0, w = 0;
  for (let i = 0; i < PASSES; i++) {
    const r = await coldPass(init);
    h += r.hitches; dr += r.drop; w = Math.max(w, r.worst);
    console.log(`  cold pass ${i+1}  p50 ${r.p50.toFixed(1)}  p95 ${r.p95.toFixed(1)}  worst ${r.worst.toFixed(0)}  drop ${r.drop.toFixed(1)}%  hitches ${r.hitches}`);
  }
  console.log(`  TOTAL hitches ${h}   mean drop ${(dr/PASSES).toFixed(1)}%   worst ${w.toFixed(0)}ms`);
}

console.log(`cold-load scroll, ${CPU}x CPU throttle, ${PASSES} passes each`);
await run("1. baseline", null);
await run("2. all lanes pause decoding during the gesture", pauseDuringGesture);
await run("3. no video at all (floor)", noVideo);
await browser.close();

/* A/B for the one lever the code already names: whether the HOT lanes (#work)
   keep decoding through a scroll gesture. Condition 2 emulates
   `pauseOnScroll: true` for every lane from outside the app, so the trade can
   be measured before anything is edited. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900, HITCH = 50, BUDGET = 20;
const PASSES = +(process.argv[3] ?? 4);

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

const sections = await page.evaluate(() => [...document.querySelectorAll("section, header, footer")].map((el) => ({
  id: el.id || el.getAttribute("aria-label")?.slice(0, 24) || el.tagName,
  top: Math.round(el.getBoundingClientRect().top + scrollY), h: Math.round(el.getBoundingClientRect().height) })));
const where = (y) => { const mid = y + H / 2; const hit = sections.filter((s) => mid >= s.top && mid < s.top + s.h); return hit.length ? hit[hit.length-1].id : "-"; };

async function cycle() {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await page.evaluate(() => { window.__perf.frames.length = 0; });
  for (let i = 0; i < 32; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(60); }
  const frames = await page.evaluate(() => window.__perf.frames);
  const d = frames.map((f) => f[0]).filter((x) => x > 0).sort((a,b)=>a-b);
  return { p95: d[Math.floor(d.length*0.95)], worst: d[d.length-1],
           drop: (d.filter((x)=>x>BUDGET).length/d.length)*100,
           hitches: frames.filter((f)=>f[0]>HITCH) };
}
async function run(name) {
  console.log(`\n### ${name}`);
  let tot = 0, dropSum = 0;
  for (let i = 0; i < PASSES; i++) {
    const r = await cycle();
    tot += r.hitches.length; dropSum += r.drop;
    console.log(`  pass ${i+1}  p95 ${r.p95.toFixed(1)}  worst ${r.worst.toFixed(0)}  drop ${r.drop.toFixed(1)}%  hitches ${r.hitches.length}` +
      (r.hitches.length ? "  @ " + r.hitches.map(([ms,y]) => `${ms.toFixed(0)}ms/${where(y)}`).join(", ") : ""));
  }
  console.log(`  TOTAL hitches ${tot}   mean drop ${(dropSum/PASSES).toFixed(1)}%`);
}

await run("1. baseline");

/* Emulate pauseOnScroll for every lane: stop decoders for the gesture, resume
   160ms after the last wheel event — the app's own SCROLL_IDLE_MS. */
await page.evaluate(() => {
  let t, held = [];
  addEventListener("scroll", () => {
    if (!held.length) {
      for (const v of document.querySelectorAll("video")) if (!v.paused) { v.pause(); held.push(v); }
    }
    clearTimeout(t);
    t = setTimeout(() => { for (const v of held) v.play().catch(() => {}); held = []; }, 160);
  }, { passive: true });
}, {});
await run("2. all lanes pause decoding during the gesture");

await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.resolve(); for (const v of document.querySelectorAll("video")) v.pause(); });
await run("3. no video at all (floor)");
await browser.close();

/* Correctness first: after gestures, is anything left frozen at rate 0, and are
   the clips that should be running actually advancing? Then the two numbers. */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3100";
const W = 1440, H = 900;
const browser = await chromium.launch({ headless: false, args: ["--disable-background-timer-throttling","--disable-renderer-backgrounding","--disable-backgrounding-occluded-windows","--disable-features=CalculateNativeWinOcclusion"] });
const ctx = await browser.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(6000);

const census = async (label) => {
  const a = await page.evaluate(() => [...document.querySelectorAll("video")].map((v) => [v.paused, v.playbackRate, v.currentTime]));
  await page.waitForTimeout(700);
  const b = await page.evaluate(() => [...document.querySelectorAll("video")].map((v) => [v.paused, v.playbackRate, v.currentTime]));
  const running = a.filter(([p]) => !p).length;
  const frozen = b.filter(([p, r]) => !p && r === 0).length;
  const advanced = b.filter(([p,, t], i) => !p && a[i] && t > a[i][2]).length;
  console.log(`  ${label.padEnd(30)} not-paused ${String(running).padStart(3)}   still at rate 0: ${frozen}   advanced in 700ms: ${advanced}`);
  return frozen;
};

console.log("### after load, no interaction");
let frozen = await census("at rest");
console.log("\n### after eight gestures");
for (let g = 0; g < 8; g++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(60); await page.mouse.wheel(0, -120); await page.waitForTimeout(500); }
frozen += await census("back at the top");
console.log("\n### after a full-page scroll down and back");
for (let i = 0; i < 32; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(40); }
await page.waitForTimeout(1200);
frozen += await census("parked in the lower page");
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, -200); await page.waitForTimeout(40); }
await page.waitForTimeout(1200);
frozen += await census("back at the top again");
console.log(`\n  FROZEN-AT-RATE-0 TOTAL ACROSS ALL CENSUSES: ${frozen}  ${frozen === 0 ? "(none — nothing is left held)" : "(BUG: clips left held)"}`);
await browser.close();

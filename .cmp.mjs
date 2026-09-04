/* Work section, frame level, throttled and not. One label per build. */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:3000";
const LABEL = process.argv[3] ?? "";
const ROUNDS = +(process.argv[4] ?? 4);

const probe = () => {
  window.__perf = { frames: [], long: 0 };
  let last = performance.now();
  const tick = (n) => { window.__perf.frames.push(n - last); last = n; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.long += e.duration; })
    .observe({ entryTypes: ["longtask"] });
};
const stats = (r) => {
  const f = r.frames.filter((d) => d > 0).sort((a, b) => a - b);
  if (!f.length) return null;
  const mean = f.reduce((a, b) => a + b, 0) / f.length;
  return {
    p50: +f[Math.floor(f.length * 0.5)].toFixed(1),
    p95: +f[Math.floor(f.length * 0.95)].toFixed(1),
    worst: +f[f.length - 1].toFixed(1),
    drop: +((f.filter((d) => d > 20).length / f.length) * 100).toFixed(1),
    hitch: f.filter((d) => d > 50).length,
    jitter: +Math.sqrt(f.reduce((a, d) => a + (d - mean) ** 2, 0) / f.length).toFixed(1),
    block: Math.round(r.long),
  };
};

const browser = await chromium.launch({
  headless: false,
  args: ["--disable-features=CalculateNativeWinOcclusion", "--disable-renderer-backgrounding", "--disable-background-timer-throttling"],
});
const rows = [];

for (const rate of [1, 4]) {
  for (let round = 1; round <= ROUNDS; round++) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(probe);
    const cdp = await page.context().newCDPSession(page);
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelector("#work").scrollIntoView({ block: "start" }));
    await page.evaluate(() => window.scrollBy(0, -800));
    await page.waitForTimeout(1500);
    if (rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    await page.waitForTimeout(600);

    const reset = () => page.evaluate(() => { window.__perf.frames.length = 0; window.__perf.long = 0; });
    const read = async () => stats(await page.evaluate(() => window.__perf));

    await reset();
    for (let i = 0; i < 18; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(70); }
    rows.push({ rate, scenario: "scroll work", ...(await read()) });

    const el = page.locator("#work button[aria-label^='Play reel'] >> nth=3").first();
    await el.evaluate((n) => n.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(1000);
    await reset();
    await el.hover({ force: true, timeout: 8000 });
    await page.waitForTimeout(900);
    /* Drag the pointer ACROSS the row — this is the gesture that restyles the
       subtree over and over, and the one a person actually makes. */
    for (let i = 0; i < 12; i++) { await page.mouse.move(500 + i * 40, 450); await page.waitForTimeout(70); }
    await page.waitForTimeout(500);
    rows.push({ rate, scenario: "hover across row", ...(await read()) });

    if (rate > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await page.close();
  }
}
await browser.close();

const med = (g, k) => [...g.map((r) => r[k])].sort((a, b) => a - b)[Math.floor(g.length / 2)];
console.log("\n  ===== " + LABEL + " =====");
for (const rate of [1, 4]) {
  console.log("\n  CPU " + (rate === 1 ? "unthrottled" : rate + "x throttled"));
  console.log("    scenario            p50    p95  worst  drop%  hitch  jitter  block");
  for (const scenario of ["scroll work", "hover across row"]) {
    const g = rows.filter((r) => r.rate === rate && r.scenario === scenario);
    console.log("    " + scenario.padEnd(18) +
      ["p50", "p95", "worst", "drop", "hitch", "jitter", "block"].map((k) => String(med(g, k)).padStart(6)).join(" "));
  }
}

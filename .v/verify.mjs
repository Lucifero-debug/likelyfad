import { chromium } from "playwright";
const b = await chromium.launch();
for (const [w,h,tag] of [[1920,1080,"1920"],[390,844,"390"]]) {
  const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3001/", { waitUntil: "load" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `.v/nofade-${tag}.png` });
  const r = await page.evaluate(() => {
    const box = document.querySelector('[role="group"][aria-label*="wall"]');
    const cs = getComputedStyle(box);
    // any gradient-overlay children left behind?
    const overlays = [...box.children].filter(n => /gradient/.test(getComputedStyle(n).backgroundImage)).length;
    return {
      maskImage: cs.maskImage,
      webkitMaskImage: cs.webkitMaskImage,
      fadeX: cs.getPropertyValue("--fade-x").trim() || "(unset)",
      fadeY: cs.getPropertyValue("--fade-y").trim() || "(unset)",
      inlineStyle: box.getAttribute("style") || "(none)",
      gradientChildren: overlays,
      boxShadow: cs.boxShadow,
      filter: cs.filter,
    };
  });
  console.log(`\n=== ${tag} ===`);
  for (const [k,v] of Object.entries(r)) console.log(`  ${k.padEnd(17)}: ${v}`);
  await page.close();
}
await b.close();

import { readFileSync, writeFileSync } from "node:fs";
const p = "lib/useInViewPlay.ts";
let s = readFileSync(p, "utf8");
const reps = [
  [`        eachPausing(r, (el) => el.pause());`,
   `        eachPausing(r, (el) => { el.playbackRate = 0; });`],
  [`        eachPausing(r, (el) => {
          if (!startQueue.includes(el)) void el.play().catch(() => {});
        });`,
   `        eachPausing(r, (el) => {
          el.playbackRate = 1;
          if (!startQueue.includes(el)) void el.play().catch(() => {});
        });`],
  [`    startQueue.splice(i, 1);
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void el.play().catch(() => {});`,
   `    startQueue.splice(i, 1);
    el.playbackRate = 1;
    // Rejects under some autoplay policies. The poster stays up in that case,
    // which is the correct fallback.
    void el.play().catch(() => {});`],
];
for (const [a] of reps) if (!s.includes(a)) { console.error("MISS:\n" + a); process.exit(1); }
for (const [a, b] of reps) s = s.replace(a, b);
writeFileSync(p, s);
console.log("C-simple patched");

import type { Reel } from "./reels.generated";

/* ============================================================================
   Display order for the reel walls.

   THE PROBLEM THIS SOLVES
   The generated list arrives in Drive's own order, which is by filename, and
   these filenames cluster by shoot: `doctor-in-office-…`, `expert-doctor-
   review-…`, `live-stage-doctor-…` and `doctor-and-specialist-…` all land
   within a few positions of each other, as do four `movesmethod` cuts. The
   walls took contiguous slices off the front of that list, so ReelWall got
   every doctor clip and every movesmethod clip — same subject, same framing,
   often adjacent in the same lane. Nothing was actually duplicated; it just
   read as one video repeating. It also meant the wall never showed anything
   past the letter V, because the first 18 filenames were all it ever saw.

   THE FIX
   Group clips that look like they came from the same shoot, then emit one from
   each group in turn. With ~50 groups over 68 clips, two clips from the same
   shoot end up roughly 50 apart instead of adjacent — far outside the 18 the
   wall shows, let alone the ~8 on screen at once.

   Everything here is pure and deterministic: same input list, same output, so
   the server and client render identical markup and nothing hydrates wrong.
   ========================================================================== */

/* Words that say nothing about which shoot a clip came from. Every name in the
   folder is some arrangement of these, so leaving them in would group the
   whole library into one bucket. Months are here because clips are named by
   delivery date, and two unrelated ads shot in August are not a pair. */
const NOISE = new Set([
  "ai", "ugc", "ad", "ads", "advert", "video", "vid", "reel", "clip", "final",
  "draft", "cut", "edit", "ver", "version", "copy", "new", "old", "test",
  "style", "viral", "angle", "shot", "raw", "master",
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
  "january", "february", "march", "april", "june", "july", "august",
  "september", "october", "november", "december",
  "the", "and", "for", "with", "from", "this", "that",
]);

/* The words in an id that might identify a shoot: long enough to mean
   something, not in the stoplist, and not a bare number or a date ordinal
   ("24th"). `movesmethod-24th-july` reduces to {movesmethod};
   `tk-ama008c5-sl0455-…` reduces to nothing at all, which is correct — those
   are camera-roll names and carry no shared subject. */
function subjectWords(id: string): string[] {
  return id
    .split(/[^a-z0-9]+/i)
    .map((w) => w.toLowerCase())
    .filter(
      (w) => w.length >= 4 && !NOISE.has(w) && !/^\d/.test(w) && !/^\d+(st|nd|rd|th)$/.test(w)
    );
}

/* Union-find over "shares a subject word". Transitive on purpose: if A shares
   `doctor` with B and B shares `health` with C, all three are one shoot as far
   as the wall is concerned, and that is the grouping we want — the point is
   that they LOOK alike, and a chain of shared subjects is good evidence. */
function groupBySubject(items: Reel[]): Reel[][] {
  const parent = items.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a: number, b: number) => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) parent[rb] = ra;
  };

  // First index that used each word; every later user joins it.
  const owner = new Map<string, number>();
  items.forEach((item, i) => {
    for (const w of subjectWords(item.id)) {
      const first = owner.get(w);
      if (first === undefined) owner.set(w, i);
      else union(first, i);
    }
  });

  const groups = new Map<number, Reel[]>();
  items.forEach((item, i) => {
    const root = find(i);
    const g = groups.get(root);
    if (g) g.push(item);
    else groups.set(root, [item]);
  });
  return [...groups.values()];
}

/* A small deterministic hash. Used only to break ties, so that clips which
   share no subject with anything — the `v2702`-style camera-roll names, which
   are most of the folder — do not come out in filename order and land on the
   wall as one contiguous alphabetical block. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/* Spread each group evenly across the whole output rather than dealing them
   round-robin. Round-robin emits one of everything and then loops, so a shoot
   of four puts one clip at the front and the other three in a block at the
   back — the original problem moved rather than fixed.

   Instead, give member k of a group of m the position (k + phase) / m, where
   phase is a per-group constant in [0, 1). That lays each group's members down
   as an evenly spaced ladder across the whole list — a group of four at 25%
   intervals — and the phase decides where that ladder starts, so two groups of
   the same size do not interleave in lockstep.

   The phase has to be the hash ITSELF, not a small offset added to a fixed
   0.5. Most of this folder is single-clip groups (`v2702`-style camera-roll
   names that share no subject with anything), and for those m = 1 and k = 0 —
   so a fixed 0.5 would stack every one of them on the same position and leave
   the real groups stranded at the two ends of the list. With the hash as the
   phase, a singleton's position IS its hash, i.e. uniform across the range.

   With 68 clips and a shoot of four, the 18 on the wall will still contain
   about one of them. That is just arithmetic — and it is a different thing
   from four of them adjacent. */
export function spreadReels(items: Reel[]): Reel[] {
  if (items.length < 2) return items.slice();
  return groupBySubject(items)
    .flatMap((g) => {
      const phase = hash(g[0].id);
      return g.map((reel, k) => ({ reel, at: (k + phase) / g.length }));
    })
    .sort((a, b) => a.at - b.at || hash(a.reel.id) - hash(b.reel.id))
    .map((x) => x.reel);
}

/* Take `count` clips starting at `offset` in the spread order.

   The walls call this with non-overlapping windows, which is what keeps a clip
   from appearing in two places on the page. The modulo only ever engages if
   the Drive folder holds fewer clips than the page wants to show — with a full
   folder every slot is a different reel, which is the point. */
export function takeReels(items: Reel[], offset: number, count: number): Reel[] {
  const order = spreadReels(items);
  if (!order.length) return [];
  return Array.from({ length: count }, (_, i) => order[(offset + i) % order.length]);
}

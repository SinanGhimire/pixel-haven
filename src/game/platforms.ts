// Multi-tier one-way platform layout, generated deterministically per map.
// Pure module (no Phaser) so reachability rules stay testable.

export type Platform = { x: number; y: number; w: number; tier: 1 | 2 | 3; secret?: boolean };

/** Vertical gap between tiers; must stay below the hero's single-jump height (~70px). */
export const TIER_STEP = 48;
/** Extra world height above the floor scene that the camera may reveal. */
export const SKY_RISE = 112;

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const snap = (v: number) => Math.round(v / 16) * 16;

export function generatePlatforms(seed: string, worldWidth: number, floorY: number): Platform[] {
  const r = rng(seed);
  const between = (a: number, b: number) => a + Math.floor(r() * (b - a + 1));
  const out: Platform[] = [];
  const margin = 128;
  let x = margin + between(0, 48);
  while (x < worldWidth - margin - 96) {
    const w1 = snap(between(80, 128));
    const p1: Platform = { x: snap(x), y: floorY - TIER_STEP, w: w1, tier: 1 };
    out.push(p1);
    if (r() < 0.8) {
      const w2 = snap(between(64, 96));
      const dir = r() < 0.5 ? -1 : 1;
      const x2 = Math.max(margin, Math.min(worldWidth - margin - w2, p1.x + (dir > 0 ? p1.w - 32 : -w2 + 32)));
      const p2: Platform = { x: snap(x2), y: floorY - TIER_STEP * 2, w: w2, tier: 2 };
      out.push(p2);
      if (r() < 0.55) {
        const w3 = snap(between(64, 80));
        const x3 = Math.max(margin, Math.min(worldWidth - margin - w3, p2.x + (dir > 0 ? p2.w - 32 : -w3 + 32)));
        out.push({ x: snap(x3), y: floorY - TIER_STEP * 3, w: w3, tier: 3 });
      }
    }
    x += w1 + between(112, 176);
  }
  // One hidden treasure alcove per map, on the highest available ledge.
  const top = out.filter((p) => p.tier === 3);
  const pool = top.length ? top : out.filter((p) => p.tier === 2);
  const pick = pool[Math.floor(r() * pool.length)];
  if (pick) pick.secret = true;
  return out;
}

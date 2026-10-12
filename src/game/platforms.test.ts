import { describe, expect, it } from "vitest";
import { generatePlatforms, TIER_STEP } from "./platforms";
import { MAPS, PLAYER } from "./config";
import { canDropThrough, canLandOnLedge } from "./platformPhysics";

describe("exploration ledges", () => {
  it("builds repeatable reachable routes and one treasure ledge in every world", () => {
    for (const map of MAPS) {
      const ledges = generatePlatforms(map.id, 1440, 192);
      expect(ledges).toEqual(generatePlatforms(map.id, 1440, 192));
      expect(new Set(ledges.map((p) => p.tier)).size).toBeGreaterThanOrEqual(2);
      expect(ledges.filter((p) => p.secret)).toHaveLength(1);
      for (const p of ledges) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x + p.w).toBeLessThanOrEqual(1440);
        expect(p.y).toBe(192 - p.tier * TIER_STEP);
        if (p.tier > 1) expect(ledges.some((q) => q.tier === p.tier - 1 && q.x < p.x + p.w + 48 && p.x < q.x + q.w + 48)).toBe(true);
      }
    }
    expect(TIER_STEP).toBeLessThan(PLAYER.JUMP_FORCE ** 2 / (2 * PLAYER.GRAVITY));
  });
  it("lands only from above and allows jumping through undersides", () => {
    expect(canLandOnLedge(80, 95, 96, false)).toBe(true);
    expect(canLandOnLedge(-100, 95, 96, false)).toBe(false);
    expect(canLandOnLedge(100, 110, 96, false)).toBe(false);
    expect(canLandOnLedge(80, 95, 96, true)).toBe(false);
  });
  it("drops only with down+jump while recently standing on a ledge", () => {
    expect(canDropThrough(1000, 950, true, true)).toBe(true);
    expect(canDropThrough(1000, 800, true, true)).toBe(false);
    expect(canDropThrough(1000, 950, false, true)).toBe(false);
  });
});
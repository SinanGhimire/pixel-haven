import { describe, expect, it } from "vitest";
import { MAPS } from "./config";
import { gameMedia } from "./media";

describe("Fantasy world artwork", () => {
  it("includes every supplied fantasy pack without ocean or modern street maps", () => {
    expect(MAPS).toHaveLength(12);
    expect(new Set(MAPS.map((m) => m.id)).size).toBe(12);
    for (const map of MAPS) {
      expect(map.name).not.toMatch(/ocean|street|city|cyber|skyline/i);
      expect(map.floor).toBe(true);
      expect(gameMedia(`/game/maps/${map.id}/ground.png`)).toContain("/__l5e/assets-v1/");
      map.layers.forEach((size, i) => {
        expect(size.every((n) => n > 0)).toBe(true);
        expect(gameMedia(`/game/maps/${map.id}/bg${i}.png`)).toContain("/__l5e/assets-v1/");
      });
      map.props.forEach((_, i) => expect(gameMedia(`/game/maps/${map.id}/props/${i}.png`)).toContain("/__l5e/assets-v1/"));
    }
  });
});
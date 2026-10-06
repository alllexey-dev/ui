import { describe, expect, it } from "vitest";
import { progressGeometry } from "../src/lib/progress.js";

describe("progressGeometry", () => {
  it("shows only the track at zero", () => {
    const g = progressGeometry(0, 200, 4, true);
    expect(g.active).toBe("");
    expect(g.track).toEqual({ x1: 2, x2: 198 });
  });

  it("starts the track a gap after the indicator", () => {
    const g = progressGeometry(0.5, 200, 4, false);
    expect(g.active).toBe("M2 2 L98 2");
    expect(g.track?.x1).toBe(100 + 4 + 2);
  });

  it("hides the track when full", () => {
    expect(progressGeometry(1, 200, 4, true).track).toBeNull();
  });

  it("clamps out-of-range values, e.g. from easing overshoot", () => {
    expect(progressGeometry(1.2, 200, 4, false)).toEqual(progressGeometry(1, 200, 4, false));
    expect(progressGeometry(-0.1, 200, 4, false)).toEqual(progressGeometry(0, 200, 4, false));
  });

  it("makes room for the wave", () => {
    expect(progressGeometry(0.5, 200, 4, true).height).toBe(12);
    expect(progressGeometry(0.5, 200, 4, false).height).toBe(4);
  });
});

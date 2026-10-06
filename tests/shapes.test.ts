import { describe, expect, it } from "vitest";
import { clipPath, SHAPE_POINTS, shapeNames, shapePoints } from "../src/lib/shapes.js";

describe("shapes", () => {
  it.each(shapeNames)("%s has the same point count, so any two shapes can morph", (name) => {
    expect(shapePoints(name)).toHaveLength(SHAPE_POINTS);
  });

  it.each(shapeNames)("%s stays inside the unit box and touches its edge", (name) => {
    const coords = shapePoints(name).flat();
    expect(Math.min(...coords)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...coords)).toBeLessThanOrEqual(1);
    expect(Math.max(...coords.map((c) => Math.abs(c - 0.5)))).toBeCloseTo(0.5, 6);
  });

  it("starts every shape at the top centre", () => {
    const [x, y] = shapePoints("circle")[0];
    expect(x).toBeCloseTo(0.5, 6);
    expect(y).toBeCloseTo(0, 6);
  });

  it("lays the pill out horizontally", () => {
    const points = shapePoints("pill");
    const width = Math.max(...points.map((p) => p[0])) - Math.min(...points.map((p) => p[0]));
    const height = Math.max(...points.map((p) => p[1])) - Math.min(...points.map((p) => p[1]));
    expect(width).toBeGreaterThan(height);
  });

  it("renders a CSS polygon", () => {
    expect(clipPath("gem")).toMatch(/^polygon\((-?\d+\.\d\d% -?\d+\.\d\d%, ){71}-?\d+\.\d\d% -?\d+\.\d\d%\)$/);
  });
});

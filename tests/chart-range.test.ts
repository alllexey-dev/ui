import { describe, expect, it } from "vitest";
import { chartRange } from "../src/lib/chart-range.js";

describe("chartRange", () => {
  it("starts non-negative data at zero with headroom on top", () => {
    expect(chartRange(5, 100)).toEqual([0, 115]);
  });

  it("gives an empty or all-zero series a unit axis", () => {
    expect(chartRange(0, 0)).toEqual([0, 1]);
    expect(chartRange(null, null)).toEqual([0, 1]);
  });

  it("keeps negative values visible and zero inside the range", () => {
    const [bottom, top] = chartRange(-10, 20);
    expect(bottom).toBeLessThan(-10);
    expect(top).toBeGreaterThan(20);
  });

  it("ends an all-negative series at zero", () => {
    const [bottom, top] = chartRange(-40, -5);
    expect(bottom).toBeLessThan(-40);
    expect(top).toBe(0);
  });

  it("honours pinned ends", () => {
    expect(chartRange(3, 42, { max: 100 })).toEqual([0, 100]);
    expect(chartRange(-3, 42, { min: -50, max: 50 })).toEqual([-50, 50]);
  });

  it("never returns an empty range", () => {
    const [bottom, top] = chartRange(10, 20, { min: 30 });
    expect(top).toBeGreaterThan(bottom);
  });
});

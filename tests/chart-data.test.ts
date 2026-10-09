import { describe, expect, it } from "vitest";
import { alignSeries, chartRange, valueAt } from "../src/lib/chart-data.js";

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

describe("chartRange without zero", () => {
  it("follows the data with a little room on both sides", () => {
    const [bottom, top] = chartRange(100, 110, { zero: false });
    expect(bottom).toBeGreaterThan(90);
    expect(bottom).toBeLessThan(100);
    expect(top).toBeGreaterThan(110);
    expect(top).toBeLessThan(120);
  });

  it("opens a flat line instead of collapsing it", () => {
    const [bottom, top] = chartRange(50, 50, { zero: false });
    expect(bottom).toBeLessThan(50);
    expect(top).toBeGreaterThan(50);
  });
});

describe("alignSeries", () => {
  it("merges the moments of all series and fills the gaps with null", () => {
    expect(alignSeries([[[1, 10], [3, 30]], [[2, 200], [3, 300]]])).toEqual({
      times: [1, 2, 3],
      values: [[10, null, 30], [null, 200, 300]],
    });
  });
});

describe("valueAt", () => {
  it("returns the last known value at or before the index", () => {
    expect(valueAt([1, null, 3, null], 1)).toBe(1);
    expect(valueAt([1, null, 3, null])).toBe(3);
    expect(valueAt([null, null], 1)).toBeNull();
  });
});

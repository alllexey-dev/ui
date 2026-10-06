import { describe, expect, it } from "vitest";
import { wavePath } from "../src/lib/wave.js";

describe("wavePath", () => {
  it("is empty for a zero-length line", () => {
    expect(wavePath(10, 10, 6, 3)).toBe("");
  });

  it("is a straight segment without amplitude", () => {
    expect(wavePath(2, 50, 6, 0)).toBe("M2 6 L50 6");
  });

  it("stays within the amplitude", () => {
    const ys = [...wavePath(2, 200, 6, 3).matchAll(/[ML][\d.]+ ([\d.-]+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(3);
    expect(Math.max(...ys)).toBeLessThanOrEqual(9);
  });
});

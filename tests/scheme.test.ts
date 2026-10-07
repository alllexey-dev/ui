import { describe, expect, it } from "vitest";
import { argbFromHex, Hct } from "@material/material-color-utilities";
import { schemeVariables, variants } from "../src/lib/theme/scheme.js";
import { staticThemeCss } from "../src/lib/theme/static.js";

const hex = /^#[0-9a-f]{6}$/;

function luminance(color: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(color.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("schemeVariables", () => {
  it.each(variants.flatMap((v) => [[v, false], [v, true]] as const))("%s (dark=%s) defines every role as a hex colour", (variant, dark) => {
    const vars = schemeVariables("#0061a4", dark, variant);
    for (const role of ["--md-primary", "--md-surface", "--md-on-surface", "--md-success", "--md-warning-container", "--md-inverse-primary"]) {
      expect(vars[role], role).toMatch(hex);
    }
  });

  it.each([false, true])("keeps body text readable (dark=%s)", (dark) => {
    const vars = schemeVariables("#0061a4", dark, "tonal");
    expect(contrast(vars["--md-on-surface"], vars["--md-surface"])).toBeGreaterThan(7);
    expect(contrast(vars["--md-on-primary"], vars["--md-primary"])).toBeGreaterThan(4.5);
  });

  it("tonal is calmer than vibrant for the same seed", () => {
    const chroma = (color: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
      return Math.max(r, g, b) - Math.min(r, g, b);
    };
    expect(chroma(schemeVariables("#0061a4", false, "tonal")["--md-primary"])).toBeLessThan(chroma(schemeVariables("#0061a4", false, "vibrant")["--md-primary"]));
  });
});

describe("staticThemeCss", () => {
  it("emits light, explicit dark and system dark blocks", () => {
    const css = staticThemeCss("#0061a4", "tonal");
    expect(css).toContain(":root {");
    expect(css).toContain(':root[data-theme="dark"] {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css.match(/--md-primary:/g)).toHaveLength(3);
  });
});

describe("theme-default.css", () => {
  it("matches the shared default choice (run npm run gen:theme after changing the scheme)", async () => {
    const { readFileSync } = await import("node:fs");
    const { defaultChoice } = await import("../src/lib/theme/shared.js");
    const file = readFileSync(new URL("../src/lib/styles/theme-default.css", import.meta.url), "utf8");
    expect(file).toBe(staticThemeCss(defaultChoice.seed, defaultChoice.variant));
  });
});

describe("containers in dark schemes", () => {
  const seeds = ["#0061a4", "#6750a4", "#006a6a", "#386a20", "#b4532a", "#9c4166"];
  const tone = (hex: string) => Hct.fromInt(argbFromHex(hex)).tone;

  it.each(variants.flatMap((v) => seeds.map((s) => [v, s] as const)))("%s %s: containers are dark surfaces with readable text", (variant, seed) => {
    const vars = schemeVariables(seed, true, variant);
    for (const role of ["primary", "secondary", "tertiary", "error"]) {
      const container = vars[`--md-${role}-container`];
      expect(tone(container), `${role}-container ${container}`).toBeLessThanOrEqual(50);
      expect(contrast(vars[`--md-on-${role}-container`], container), `on-${role}-container`).toBeGreaterThan(4.5);
    }
  });

  it("leaves containers that are already dark as the 2025 spec made them", () => {
    const vars = schemeVariables("#0061a4", true, "tonal");
    expect(vars["--md-primary-container"]).toBe("#3b5472");
    expect(vars["--md-secondary-container"]).toBe("#303c4c");
  });
});

import { schemeVariables, type Variant } from "./scheme.js";

export { schemeVariables, variants, type Variant } from "./scheme.js";
export { staticThemeCss } from "./static.js";
export { defaultChoice, initTheme, readChoice, resolveMode, seeds, variantLabels, watchChoice, writeChoice, type ThemeChoice, type ThemeMode } from "./shared.js";

export type Mode = "light" | "dark";

export interface ThemeOptions {
  /** Seed colour, e.g. "#6750a4". Every product of the system has its own. */
  seed: string;
  variant?: Variant;
  mode: Mode;
  /** Element that receives the variables; defaults to <html>. */
  target?: HTMLElement;
}

/** Writes all colour roles as --md-* custom properties and marks the element with data-theme. */
export function applyTheme({ seed, variant = "tonal", mode, target = document.documentElement }: ThemeOptions): void {
  target.dataset.theme = mode;
  for (const [name, value] of Object.entries(schemeVariables(seed, mode === "dark", variant))) {
    target.style.setProperty(name, value);
  }
}

/** Reads a custom property of the current theme (canvas charts need real colours). */
export function cssVar(name: string, from: Element = document.documentElement): string {
  return getComputedStyle(from).getPropertyValue(name).trim();
}

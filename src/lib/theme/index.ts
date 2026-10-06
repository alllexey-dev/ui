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

/** Writes all colour roles as --md-* custom properties, marks the element with data-theme and, for <html>, the theme-color meta. */
export function applyTheme({ seed, variant = "tonal", mode, target = document.documentElement }: ThemeOptions): void {
  const vars = schemeVariables(seed, mode === "dark", variant);
  target.dataset.theme = mode;
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value);
  }
  if (target === document.documentElement) paintBrowserChrome(vars["--md-surface"]);
}

/** Mobile browsers colour their address bar from <meta name="theme-color">: keep it on the surface colour. */
function paintBrowserChrome(color: string): void {
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  if (!metas.length) {
    document.head.append(Object.assign(document.createElement("meta"), { name: "theme-color", content: color }));
    return;
  }
  for (const meta of metas) {
    meta.removeAttribute("media");
    meta.content = color;
  }
}

/** Reads a custom property of the current theme (canvas charts need real colours). */
export function cssVar(name: string, from: Element = document.documentElement): string {
  return getComputedStyle(from).getPropertyValue(name).trim();
}

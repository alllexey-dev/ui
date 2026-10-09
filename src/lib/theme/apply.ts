import { schemeVariables, type Variant } from "./scheme.js";

export type Mode = "light" | "dark";

export interface ThemeOptions {
  /** Seed colour, e.g. "#6750a4". Every product of the system has its own. */
  seed: string;
  variant?: Variant;
  mode: Mode;
  /** Element that receives the variables; defaults to <html>. */
  target?: HTMLElement;
}

const CHANGE_EVENT = "m3-themechange";

/**
 * Writes all colour roles as --md-* custom properties, marks the element with data-theme and, for <html>, the
 * theme-color meta. Then fires the event onThemeChange listens to.
 */
export function applyTheme({ seed, variant = "tonal", mode, target = document.documentElement }: ThemeOptions): void {
  const vars = schemeVariables(seed, mode === "dark", variant);
  target.dataset.theme = mode;
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value);
  }
  if (target === document.documentElement) paintBrowserChrome(vars["--md-surface"]);
  target.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Calls back every time the theme is applied to <html>. Canvas drawings (charts, terminals) bake colours in,
 * so they read them again with cssVar and redraw here. Returns the unsubscribe function.
 */
export function onThemeChange(callback: () => void): () => void {
  const root = document.documentElement;
  root.addEventListener(CHANGE_EVENT, callback);
  return () => root.removeEventListener(CHANGE_EVENT, callback);
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

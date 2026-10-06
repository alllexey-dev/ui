import { builtinIcons } from "./builtin.js";

/** Material Symbols path data (viewBox "0 -960 960 960"), by name. "-fill" names are the filled variants. */
const registry = new Map<string, string>(Object.entries(builtinIcons));

/**
 * Registers icons for <Icon name="...">. Values are path data or whole SVG files
 * (e.g. `import x from "@material-symbols/svg-400/rounded/x.svg?raw"`).
 */
export function defineIcons(icons: Record<string, string>): void {
  for (const [name, value] of Object.entries(icons)) {
    registry.set(name, value.trimStart().startsWith("<") ? (value.match(/ d="([^"]+)"/)?.[1] ?? "") : value);
  }
}

export function iconPath(name: string, filled = false): string {
  return (filled && registry.get(`${name}-fill`)) || registry.get(name) || "";
}

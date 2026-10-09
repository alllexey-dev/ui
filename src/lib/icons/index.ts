import { builtinIcons } from "./builtin.js";

/** Material Symbols path data (viewBox "0 -960 960 960"), by name. "-fill" names are the filled variants. */
const registry = new Map<string, string>(Object.entries(builtinIcons));

/** Names of the icons the package registers itself. */
export const builtinIconNames: string[] = Object.keys(builtinIcons);

/**
 * Registers icons for <Icon name="...">. Values are path data or whole SVG files; a key that is a file path
 * registers under the file name, so the result of Vite's import.meta.glob can be passed as is:
 *
 *   defineIcons(import.meta.glob("/node_modules/@material-symbols/svg-400/rounded/{add,add-fill,delete}.svg",
 *     { query: "?raw", import: "default", eager: true }));
 */
export function defineIcons(icons: Record<string, string>): void {
  for (const [key, value] of Object.entries(icons)) {
    const name = key.includes("/") ? key.slice(key.lastIndexOf("/") + 1).replace(/\.svg$/, "") : key;
    registry.set(name, value.trimStart().startsWith("<") ? (value.match(/ d="([^"]+)"/)?.[1] ?? "") : value);
  }
}

export function iconPath(name: string, filled = false): string {
  return (filled && registry.get(`${name}-fill`)) || registry.get(name) || "";
}

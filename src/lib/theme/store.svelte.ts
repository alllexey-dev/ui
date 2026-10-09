import { untrack } from "svelte";
import { applyTheme } from "./apply.js";
import type { Variant } from "./scheme.js";
import { readChoice, watchChoice, writeChoice, type ThemeMode } from "./shared.js";

/**
 * Reactive theme for Svelte apps. The choice is shared by all alllexey.dev sites (see theme/shared.ts);
 * the scheme is re-applied whenever mode, seed, variant or the system preference change. Get it with getTheme().
 */
export class ThemeStore {
  mode = $state<ThemeMode>("auto");
  seed = $state("");
  variant = $state<Variant>("tonal");
  system = $state<"light" | "dark">("light");
  resolved = $derived<"light" | "dark">(this.mode === "auto" ? this.system : this.mode);

  constructor() {
    const media = matchMedia("(prefers-color-scheme: dark)");
    this.#take(readChoice());
    this.system = media.matches ? "dark" : "light";
    media.addEventListener("change", (e) => (this.system = e.matches ? "dark" : "light"));
    watchChoice((choice) => this.#take(choice));
    this.#apply();
    $effect.root(() => {
      $effect(() => this.#apply());
    });
  }

  setMode(value: ThemeMode): void {
    this.mode = value;
    this.#save();
  }

  setSeed(value: string): void {
    this.seed = value;
    this.#save();
  }

  setVariant(value: Variant): void {
    this.variant = value;
    this.#save();
  }

  #take(choice: { mode: ThemeMode; seed: string; variant: Variant }) {
    this.mode = choice.mode;
    this.seed = choice.seed;
    this.variant = choice.variant;
  }

  #apply() {
    const options = { seed: this.seed, variant: this.variant, mode: this.resolved };
    // onThemeChange listeners run inside applyTheme: what they read must not become a dependency of this effect
    untrack(() => applyTheme(options));
  }

  #save() {
    writeChoice({ mode: this.mode, seed: this.seed, variant: this.variant });
  }
}

let shared: ThemeStore | undefined;

/**
 * The app's theme. The store is created and applied on the first call and shared after that; AppShell and
 * TopBar call it themselves, so an app only needs it to read the theme or to apply it before they mount.
 */
export function getTheme(): ThemeStore {
  return (shared ??= new ThemeStore());
}

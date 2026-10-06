import { applyTheme, type Variant } from "./index.js";
import { readChoice, watchChoice, writeChoice, type ThemeMode } from "./shared.js";

export type { ThemeMode } from "./shared.js";

/**
 * Reactive theme for Svelte apps. The choice is shared by all alllexey.dev sites (see theme/shared.ts);
 * the scheme is re-applied whenever mode, seed, variant or the system preference change.
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
    applyTheme({ seed: this.seed, variant: this.variant, mode: this.resolved });
  }

  #save() {
    writeChoice({ mode: this.mode, seed: this.seed, variant: this.variant });
  }
}

/** Create once per app, at the top of the root component's module. */
export function createTheme(): ThemeStore {
  return new ThemeStore();
}

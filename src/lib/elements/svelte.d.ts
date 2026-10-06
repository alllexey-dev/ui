// Types for <m3-*> custom elements in Svelte markup: add `import "@alllexey/ui/elements/svelte";` to a .d.ts file.
import "svelte/elements";

declare module "svelte/elements" {
  export interface SvelteHTMLElements {
    "m3-shape": HTMLAttributes<HTMLElement> & { shape?: string; size?: string | number; color?: string };
    "m3-loading-indicator": HTMLAttributes<HTMLElement> & { size?: string | number; contained?: boolean; label?: string };
    "m3-progress": HTMLAttributes<HTMLElement> & { value?: string | number; max?: string | number; tone?: string; flat?: boolean; thickness?: string | number };
  }
}

<script lang="ts" module>
  import type { ShapeTone } from "./Shape.svelte";

  /** Status of a thing, the same words as the m3-pill modifiers: works, needs attention, broken, idle. */
  export type StatusTone = "ok" | "warn" | "bad" | "neutral";

  /** The colour role that shows a status, for Shape, cards and other containers: `<Shape tone={statusRole[s]}>`. */
  export const statusRole: Record<StatusTone, ShapeTone> = { ok: "success", warn: "warning", bad: "error", neutral: "neutral" };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { clipPath } from "../shapes.js";

  // Small status mark: ok is a soft cookie, warn a spinning burst, bad a sharp burst, neutral an outlined circle.
  // Colour is not the only carrier of meaning (UX.md): pass the status text as children, or a `label` when the
  // mark stands alone.
  let { tone, size = 12, label = "", children }: { tone: StatusTone; size?: number; label?: string; children?: Snippet } = $props();
  const shape = $derived(tone === "ok" ? "cookie6" : tone === "warn" ? "softBurst" : "burst");
</script>

{#snippet mark(alone: boolean)}
  <span
    class="m3-status {tone}"
    style:width="{size}px"
    style:height="{size}px"
    style:clip-path={tone === "neutral" ? undefined : clipPath(shape)}
    title={alone && label ? label : undefined}
    role={alone && label ? "img" : undefined}
    aria-label={alone && label ? label : undefined}
  ></span>
{/snippet}

{#if children}
  <span class="m3-status-text">{@render mark(false)}{@render children()}</span>
{:else}
  {@render mark(true)}
{/if}

<style>
  .m3-status-text { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
  .m3-status { display: inline-block; flex: none; transition: clip-path 0.5s var(--md-spring-default), background 0.3s; }
  .ok { background: var(--md-success); }
  .warn { background: var(--md-warning); animation: spin 2.4s linear infinite; }
  .bad { background: var(--md-error); }
  .neutral { border-radius: 50%; box-shadow: inset 0 0 0 2px var(--md-outline); }
  @keyframes spin { to { rotate: 1turn; } }
  @media (prefers-reduced-motion: reduce) { .warn { animation: none; } }
</style>

<script lang="ts">
  import { clipPath } from "../shapes.js";

  export type Tone = "ok" | "warn" | "bad" | "off";
  // Small status mark: ok is a soft cookie, warn a spinning burst, bad a sharp burst, off an outlined circle.
  let { tone, size = 12, label = "" }: { tone: Tone; size?: number; label?: string } = $props();
  const shape = $derived(tone === "ok" ? "cookie6" : tone === "warn" ? "softBurst" : "burst");
</script>

<span class="status {tone}" style:width="{size}px" style:height="{size}px" style:clip-path={tone === "off" ? undefined : clipPath(shape)} title={label || undefined} role={label ? "img" : undefined} aria-label={label || undefined}></span>

<style>
  .status { display: inline-block; flex: none; transition: clip-path 0.5s var(--md-spring-default), background 0.3s; }
  .ok { background: var(--md-success); }
  .warn { background: var(--md-warning); animation: spin 2.4s linear infinite; }
  .bad { background: var(--md-error); }
  .off { border-radius: 50%; box-shadow: inset 0 0 0 2px var(--md-outline); }
  @keyframes spin { to { rotate: 1turn; } }
</style>

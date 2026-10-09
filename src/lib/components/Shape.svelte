<script lang="ts" module>
  /** Colour pair of a shape: the role's container with its on-colour; neutral is a grey surface. */
  export type ShapeTone = "primary" | "secondary" | "tertiary" | "error" | "success" | "warning" | "neutral";
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { clipPath, type ShapeName } from "../shapes.js";

  // A container clipped to an M3 Expressive shape; changing `shape` morphs it with a spring.
  // `color` and `fg` take any CSS colour and win over `tone`.
  let {
    shape = "cookie9",
    size = 48,
    tone = "primary",
    color,
    fg,
    spin = false,
    children,
  }: { shape?: ShapeName; size?: number; tone?: ShapeTone; color?: string; fg?: string; spin?: boolean; children?: Snippet } = $props();

  const background = $derived(color ?? (tone === "neutral" ? "var(--md-surface-container-highest)" : `var(--md-${tone}-container)`));
  const foreground = $derived(fg ?? (tone === "neutral" ? "var(--md-on-surface-variant)" : `var(--md-on-${tone}-container)`));
</script>

<span class="m3-shape" class:spin style:width="{size}px" style:height="{size}px" style:color={foreground}>
  <span class="fill" style:background style:clip-path={clipPath(shape)}></span>
  <span class="content">{@render children?.()}</span>
</span>

<style>
  .m3-shape { position: relative; display: inline-grid; place-items: center; flex: none; }
  .fill { position: absolute; inset: 0; transition: clip-path 0.65s var(--md-spring-slow), background 0.3s; }
  .spin .fill { animation: spin 18s linear infinite; }
  .content { position: relative; display: grid; place-items: center; }
  @keyframes spin { to { rotate: 1turn; } }
  @media (prefers-reduced-motion: reduce) { .spin .fill { animation: none; } }
</style>

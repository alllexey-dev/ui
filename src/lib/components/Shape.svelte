<script lang="ts">
  import type { Snippet } from "svelte";
  import { clipPath, type ShapeName } from "../shapes.js";

  // A container clipped to an M3 Expressive shape; changing `shape` morphs it with a spring.
  let {
    shape = "cookie9",
    size = 48,
    color = "var(--md-primary-container)",
    fg = "var(--md-on-primary-container)",
    spin = false,
    children,
  }: { shape?: ShapeName; size?: number; color?: string; fg?: string; spin?: boolean; children?: Snippet } = $props();
</script>

<span class="shape" class:spin style:width="{size}px" style:height="{size}px" style:color={fg}>
  <span class="fill" style:background={color} style:clip-path={clipPath(shape)}></span>
  <span class="content">{@render children?.()}</span>
</span>

<style>
  .shape { position: relative; display: inline-grid; place-items: center; flex: none; }
  .fill { position: absolute; inset: 0; transition: clip-path 0.65s var(--md-spring-slow), background 0.3s; }
  .spin .fill { animation: spin 18s linear infinite; }
  .content { position: relative; display: grid; place-items: center; }
  @keyframes spin { to { rotate: 1turn; } }
  @media (prefers-reduced-motion: reduce) { .spin .fill { animation: none; } }
</style>

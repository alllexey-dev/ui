<script lang="ts">
  import type { Snippet } from "svelte";

  // Page content column inside AppShell: max width, paddings and the enter animation.
  let { width = 1320, children }: { width?: number; children: Snippet } = $props();
</script>

<div class="page" style:max-width="{width}px">{@render children()}</div>

<style>
  .page { margin: 0 auto; padding: 32px 40px 96px; animation: m3-enter 0.5s var(--md-spring-default); }
  @media (max-width: 760px) { .page { padding: 20px 16px 80px; } }
</style>

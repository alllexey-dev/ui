<script lang="ts">
  import { iconPath } from "../icons/index.js";

  // Material Symbols icon from the registry (see defineIcons), or explicit path data.
  let { name = "", path = "", size = 24, filled = false }: { name?: string; path?: string; size?: number; filled?: boolean } = $props();
  const d = $derived(path || iconPath(name, filled));
</script>

<svg width={size} height={size} viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path {d} /></svg>

<style>
  svg { flex: none; display: block; }
</style>

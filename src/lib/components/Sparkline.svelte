<script lang="ts">
  let { values, width = 96, height = 28 }: { values: number[]; width?: number; height?: number } = $props();
  const path = $derived.by(() => {
    if (values.length < 2) return "";
    const max = Math.max(...values, 1);
    const step = width / (values.length - 1);
    return values.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(height - 2 - (v / max) * (height - 4)).toFixed(1)}`).join(" ");
  });
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true">
  {#if path}
    <path d={path + ` L${width},${height} L0,${height} Z`} fill="var(--md-primary)" opacity="0.12" />
    <path d={path} fill="none" stroke="var(--md-primary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
  {/if}
</svg>

<style>
  svg { display: block; }
</style>

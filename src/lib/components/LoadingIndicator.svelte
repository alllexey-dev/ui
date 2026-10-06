<script lang="ts">
  import { onMount } from "svelte";
  import { clipPath, type ShapeName } from "../shapes.js";

  // M3 Expressive loading indicator: an active indicator that morphs through shapes while rotating.
  let { size = 48, contained = false, label = "", color = "" }: { size?: number; contained?: boolean; label?: string; color?: string } = $props();
  const sequence: ShapeName[] = ["softBurst", "cookie9", "pentagon", "pill", "sunny", "cookie4", "gem"];
  let el: HTMLSpanElement;

  onMount(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames = [...sequence, sequence[0]].map((shape, i) => ({ clipPath: clipPath(shape), rotate: `${i * 140}deg` }));
    const animation = el.animate(frames, { duration: 650 * sequence.length, iterations: Infinity, easing: "cubic-bezier(0.38, 1.21, 0.22, 1)" });
    return () => animation.cancel();
  });
</script>

<span class="wrap" role="status" aria-label={label || "Загрузка"}>
  <span class="box" class:contained style:width="{size}px" style:height="{size}px">
    <span class="indicator" bind:this={el} style:clip-path={clipPath(sequence[0])} style:background={color || undefined}></span>
  </span>
  {#if label}<span class="label">{label}</span>{/if}
</span>

<style>
  .wrap { display: inline-flex; flex-direction: column; align-items: center; gap: 12px; }
  .box { display: grid; place-items: center; border-radius: 50%; }
  .box.contained { background: var(--md-primary-container); }
  .indicator { width: 72%; height: 72%; background: var(--md-primary); }
  .contained .indicator { background: var(--md-on-primary-container); width: 62%; height: 62%; }
  .label { font: var(--md-body-medium); color: var(--md-on-surface-variant); }
</style>

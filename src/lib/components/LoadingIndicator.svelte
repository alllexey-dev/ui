<script lang="ts">
  import { onMount } from "svelte";
  import { animateLoading, restingClipPath } from "../loading.js";

  // M3 Expressive loading indicator: an active indicator that morphs through shapes while rotating.
  // `block` centres it in a block as large as EmptyState, for a page or section waiting for its first data.
  let {
    size = 48,
    contained = false,
    block = false,
    label = "",
    color = "",
  }: { size?: number; contained?: boolean; block?: boolean; label?: string; color?: string } = $props();
  let el: HTMLSpanElement;

  onMount(() => {
    const animation = animateLoading(el);
    return () => animation?.cancel();
  });
</script>

<span class="wrap" class:block role="status" aria-label={label || "Загрузка"}>
  <span class="box" class:contained style:width="{size}px" style:height="{size}px">
    <span class="indicator" bind:this={el} style:clip-path={restingClipPath} style:background={color || undefined}></span>
  </span>
  {#if label}<span class="label">{label}</span>{/if}
</span>

<style>
  .wrap { display: inline-flex; flex-direction: column; align-items: center; gap: 12px; }
  .wrap.block { display: flex; justify-content: center; padding: 40px 24px; }
  .box { display: grid; place-items: center; border-radius: 50%; }
  .box.contained { background: var(--md-primary-container); }
  .indicator { width: 72%; height: 72%; background: var(--md-primary); }
  .contained .indicator { background: var(--md-on-primary-container); width: 62%; height: 62%; }
  .label { font: var(--md-body-medium); color: var(--md-on-surface-variant); }
</style>

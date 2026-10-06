<script lang="ts">
  import type { Snippet } from "svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  // Wraps content that is being replaced: it fades back at once, and only if loading takes longer
  // than `delay` a contained loading indicator appears over it.
  let { loading, delay = 250, children }: { loading: boolean; delay?: number; children: Snippet } = $props();
  let slow = $state(false);

  $effect(() => {
    if (!loading) {
      slow = false;
      return;
    }
    const timer = setTimeout(() => (slow = true), delay);
    return () => clearTimeout(timer);
  });
</script>

<div class="wrap" class:loading aria-busy={loading}>
  <div class="content">{@render children()}</div>
  {#if loading && slow}<div class="overlay"><LoadingIndicator size={56} contained /></div>{/if}
</div>

<style>
  .wrap { position: relative; }
  .content { transition: opacity 0.35s var(--md-effects-default), filter 0.35s var(--md-effects-default); }
  .loading .content { opacity: 0.38; filter: saturate(0.6); pointer-events: none; }
  .overlay { position: absolute; inset: 0; display: grid; place-items: start center; padding-top: min(18vh, 160px); animation: appear 0.4s var(--md-spring-default); }
  @keyframes appear { from { opacity: 0; transform: scale(0.6); } }
</style>

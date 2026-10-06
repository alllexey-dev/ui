<script lang="ts">
  import type { Snippet } from "svelte";

  let { title, text = "", actions }: { title: string; text?: string; actions?: Snippet } = $props();
</script>

<header class="m3-page-head">
  <div>
    <h1>{title}</h1>
    {#if text}<p>{text}</p>{/if}
  </div>
  {#if actions}<div class="actions">{@render actions()}</div>{/if}
</header>

<style>
  .actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>

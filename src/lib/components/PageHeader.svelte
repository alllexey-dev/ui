<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  // Top of a page (UX.md "Страница"): the title as in the navigation, one line of explanation, 1-2 actions on
  // the right. `back` adds a link to the parent page above the title; children replace `text` when the line
  // needs markup.
  let {
    title,
    text = "",
    back,
    actions,
    children,
  }: { title: string; text?: string; back?: { href: string; label: string }; actions?: Snippet; children?: Snippet } = $props();
</script>

<header class="m3-page-head">
  <div>
    {#if back}<a class="m3-btn text small back" href={back.href}><Icon name="arrow_back" />{back.label}</a>{/if}
    <h1>{title}</h1>
    {#if children}<p>{@render children()}</p>{:else if text}<p>{text}</p>{/if}
  </div>
  {#if actions}<div class="actions">{@render actions()}</div>{/if}
</header>

<style>
  .back { margin: 0 0 8px -12px; }
  .actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>

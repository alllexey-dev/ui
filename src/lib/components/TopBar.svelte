<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShapeName } from "../shapes.js";
  import type { ThemeStore } from "../theme/store.svelte.js";
  import Icon from "./Icon.svelte";
  import Shape from "./Shape.svelte";
  import ThemeSettings from "./ThemeSettings.svelte";

  // Top bar of a single-page site without AppShell (UX.md "Каркас"): a shaped logo, the brand and one line
  // under it on the left; page actions and the appearance button on the right.
  let {
    brand,
    brandHref = "/",
    subtitle = "",
    icon = "",
    shape = "cookie9",
    theme,
    actions,
  }: {
    brand: string;
    brandHref?: string;
    subtitle?: string;
    /** Logo icon in a shape; none when empty. */
    icon?: string;
    shape?: ShapeName;
    /** When given, the bar shows the appearance button and dialog. */
    theme?: ThemeStore;
    actions?: Snippet;
  } = $props();

  let settings = $state(false);
</script>

<header class="m3-top-bar">
  <a class="brand" href={brandHref}>
    {#if icon}<Shape {shape} size={40}><Icon name={icon} size={22} /></Shape>{/if}
    <span class="names">
      <span class="m3-title-medium m3-clip">{brand}</span>
      {#if subtitle}<span class="m3-label-medium m3-muted m3-clip">{subtitle}</span>{/if}
    </span>
  </a>
  <div class="actions">
    {@render actions?.()}
    {#if theme}
      <button type="button" class="m3-icon-btn" aria-label="Оформление" title="Оформление" onclick={() => (settings = true)}><Icon name="palette" /></button>
    {/if}
  </div>
</header>

{#if settings && theme}<ThemeSettings {theme} onclose={() => (settings = false)} />{/if}

<style>
  .m3-top-bar {
    position: relative; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: calc(12px + env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) 12px max(16px, env(safe-area-inset-left));
  }
  .brand { display: flex; align-items: center; gap: 12px; min-width: 0; color: inherit; text-decoration: none; border-radius: var(--md-shape-md); }
  .brand:focus-visible { outline: 3px solid var(--md-secondary); outline-offset: 2px; }
  .names { display: flex; flex-direction: column; min-width: 0; }
  .actions { display: flex; align-items: center; gap: 4px; flex: none; }
</style>

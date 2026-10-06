<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ThemeStore } from "../theme/store.svelte.js";
  import Icon from "./Icon.svelte";
  import ThemeSettings from "./ThemeSettings.svelte";

  export type NavItem = { href: string; label: string; icon: string; active?: boolean; badge?: number | string };
  export type FabAction = { label: string; icon: string; href?: string; onclick?: () => void };

  // Application frame: navigation rail (expandable on wide screens, a modal drawer on phones),
  // top app bar on phones, theme settings and a rounded content surface. Routing stays with the app:
  // it passes items with `active` set.
  let {
    brand,
    brandHref = "/",
    items,
    fab,
    theme,
    title,
    account,
    actions,
    children,
  }: {
    brand: string;
    brandHref?: string;
    items: NavItem[];
    fab?: FabAction;
    /** When given, the shell shows the appearance button and dialog. */
    theme?: ThemeStore;
    /** Top bar title on phones; defaults to the active item label. */
    title?: string;
    /** Bottom of the rail: user, connection state and the like. */
    account?: Snippet<[{ expanded: boolean }]>;
    /** Extra top bar buttons on phones. */
    actions?: Snippet;
    children: Snippet;
  } = $props();

  const storageKey = "ui-rail-expanded";
  let expanded = $state(typeof localStorage === "undefined" || localStorage.getItem(storageKey) !== "false");
  let drawer = $state(false);
  let settings = $state(false);
  const heading = $derived(title ?? items.find((i) => i.active)?.label ?? brand);

  function toggleRail() {
    expanded = !expanded;
    localStorage.setItem(storageKey, String(expanded));
  }
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (drawer = false)} onhashchange={() => (drawer = false)} onpopstate={() => (drawer = false)} />

<div class="shell" class:expanded>
  <aside class="rail" class:open={drawer} aria-label="Навигация">
    <div class="rail-top">
      <button class="m3-icon-btn menu-btn" onclick={toggleRail} aria-label={expanded ? "Свернуть меню" : "Развернуть меню"}><Icon name="menu" /></button>
      <button class="m3-icon-btn close-btn" onclick={() => (drawer = false)} aria-label="Закрыть меню"><Icon name="close" /></button>
      <a class="brand m3-title-medium m3-emphasized" href={brandHref}>{brand}</a>
    </div>
    {#if fab}
      {#if fab.href}
        <a class="m3-fab rail-fab" href={fab.href} title={fab.label} onclick={() => (drawer = false)}><Icon name={fab.icon} /><span class="fab-label">{fab.label}</span></a>
      {:else}
        <button class="m3-fab rail-fab" title={fab.label} onclick={() => ((drawer = false), fab.onclick?.())}><Icon name={fab.icon} /><span class="fab-label">{fab.label}</span></button>
      {/if}
    {/if}
    <nav>
      {#each items as item (item.href)}
        <a href={item.href} class="item" class:active={item.active} aria-current={item.active ? "page" : undefined} onclick={() => (drawer = false)}>
          <span class="indicator"><Icon name={item.icon} filled={item.active} /></span>
          <span class="label">{item.label}</span>
          {#if item.badge}<span class="badge m3-num">{item.badge}</span>{/if}
        </a>
      {/each}
    </nav>
    <div class="rail-bottom">
      {#if theme}
        <button class="item" onclick={() => (settings = true)}>
          <span class="indicator"><Icon name="palette" /></span>
          <span class="label">Оформление</span>
        </button>
      {/if}
      {@render account?.({ expanded })}
    </div>
  </aside>
  {#if drawer}<div class="drawer-scrim" role="presentation" onclick={() => (drawer = false)}></div>{/if}

  <div class="body">
    <header class="topbar">
      <button class="m3-icon-btn" onclick={() => (drawer = true)} aria-label="Меню"><Icon name="menu" /></button>
      <span class="m3-title-large m3-clip">{heading}</span>
      <span class="spacer"></span>
      {@render actions?.()}
      {#if theme}<button class="m3-icon-btn" onclick={() => (settings = true)} aria-label="Оформление"><Icon name="palette" /></button>{/if}
    </header>
    <main>{@render children()}</main>
  </div>
</div>

{#if settings && theme}<ThemeSettings {theme} onclose={() => (settings = false)} />{/if}

<style>
  .shell { display: grid; grid-template-columns: 96px minmax(0, 1fr); min-height: 100vh; transition: grid-template-columns 0.45s var(--md-spring-default); }
  .shell.expanded { grid-template-columns: 240px minmax(0, 1fr); }

  .rail { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 4px; padding: 12px 12px 16px; background: var(--md-surface); overflow-y: auto; overflow-x: hidden; z-index: 20; }
  .rail > * { flex-shrink: 0; }
  .rail-top { display: flex; align-items: center; gap: 8px; height: 56px; padding-left: 16px; }
  .close-btn { display: none; }
  .brand { white-space: nowrap; opacity: 0; transition: opacity 0.2s; }
  .expanded .brand { opacity: 1; }
  .rail-fab { margin: 8px 0 16px 8px; width: 56px; overflow: hidden; transition: width 0.45s var(--md-spring-default), border-radius 0.35s var(--md-spring-fast); }
  .expanded .rail-fab { width: calc(100% - 16px); }
  .fab-label { white-space: nowrap; opacity: 0; transition: opacity 0.2s; }
  .expanded .fab-label { opacity: 1; }

  nav { display: flex; flex-direction: column; gap: 4px; }
  .item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 0; border: none; background: none; color: var(--md-on-surface-variant); font: var(--md-label-medium); }
  .item:focus-visible { outline: none; }
  .item:focus-visible .indicator { outline: 3px solid var(--md-secondary); outline-offset: 2px; }
  .indicator { position: relative; isolation: isolate; display: grid; place-items: center; width: 56px; height: 32px; border-radius: var(--md-shape-full); transition: background 0.3s, width 0.45s var(--md-spring-fast); }
  .indicator::before { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--md-on-surface); opacity: 0; z-index: -1; transition: opacity 0.15s; }
  .item:hover .indicator::before { opacity: 0.08; }
  .item.active { color: var(--md-on-surface); }
  .item.active .indicator { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
  .label { white-space: nowrap; }
  .badge { position: absolute; top: 2px; left: calc(50% + 8px); min-width: 16px; height: 16px; padding: 0 4px; border-radius: 8px; background: var(--md-error); color: var(--md-on-error); font: var(--md-label-small); display: grid; place-items: center; }

  .expanded .item { flex-direction: row; gap: 0; padding: 0; }
  .expanded .indicator { width: 100%; height: 48px; justify-content: flex-start; padding-left: 16px; gap: 12px; display: flex; align-items: center; }
  .expanded .item .label { position: absolute; left: 56px; font: var(--md-label-large); }
  .expanded .badge { left: auto; right: 16px; top: 16px; }

  .rail-bottom { margin-top: auto; display: flex; flex-direction: column; gap: 8px; padding-top: 12px; }
  .rail :global(.rail-text) { opacity: 0; transition: opacity 0.2s; }
  .expanded .rail :global(.rail-text) { opacity: 1; }

  .body { min-width: 0; display: flex; flex-direction: column; }
  .topbar { display: none; align-items: center; gap: 8px; height: 64px; padding: 0 8px; position: sticky; top: 0; z-index: 10; background: var(--md-surface); }
  .spacer { flex: 1; }
  main { position: relative; flex: 1; min-width: 0; background: var(--md-surface-container-lowest); border-radius: var(--md-shape-xl) 0 0 0; margin-top: 12px; }
  :global([data-theme="dark"]) main { background: var(--md-surface-container-low); }

  .drawer-scrim { display: none; }
  @media (max-width: 1100px) {
    .shell, .shell.expanded { grid-template-columns: 96px minmax(0, 1fr); }
    .expanded .item { flex-direction: column; }
    .expanded .indicator { width: 56px; height: 32px; justify-content: center; padding: 0; }
    .expanded .item .label { position: static; font: var(--md-label-medium); }
    .expanded .rail-fab { width: 56px; }
    .expanded .fab-label, .expanded .brand, .expanded .rail :global(.rail-text) { opacity: 0; }
    .menu-btn { display: none; }
    .rail-top { padding-left: 4px; }
    .expanded .badge { left: calc(50% + 8px); right: auto; top: 2px; }
  }
  @media (max-width: 760px) {
    .shell, .shell.expanded { grid-template-columns: 1fr; }
    .topbar { display: flex; }
    main { margin-top: 0; border-radius: var(--md-shape-xl) var(--md-shape-xl) 0 0; }
    .rail { position: fixed; left: 0; top: 0; bottom: 0; width: 300px; transform: translateX(-105%); transition: transform 0.45s var(--md-spring-default); border-radius: 0 var(--md-shape-lg) var(--md-shape-lg) 0; background: var(--md-surface-container-low); }
    .rail.open { transform: none; box-shadow: var(--md-elevation-3); }
    .rail .item { flex-direction: row; }
    .rail .indicator { width: 100%; height: 56px; justify-content: flex-start; padding-left: 16px; display: flex; align-items: center; }
    .rail .item .label { position: absolute; left: 56px; font: var(--md-label-large); }
    .rail .badge { left: auto; right: 16px; top: 20px; }
    .rail .brand, .rail .fab-label, .shell .rail :global(.rail-text) { opacity: 1; }
    .rail .rail-fab { width: calc(100% - 16px); }
    .menu-btn { display: none; }
    .close-btn { display: inline-grid; }
    .drawer-scrim { display: block; position: fixed; inset: 0; background: color-mix(in srgb, var(--md-scrim) 35%, transparent); z-index: 15; }
  }
</style>

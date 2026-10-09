<script lang="ts" module>
  export type TabOption<K extends string> = { value: K; label: string; icon?: string; badge?: number | string };
</script>

<script lang="ts" generics="T extends string">
  import Icon from "./Icon.svelte";

  // Tabs over content on the same page; the app renders the panel for `value`. Arrow keys, Home and End move
  // between tabs and select them. `badge` is a count that needs attention, as on navigation items.
  let {
    options,
    value = $bindable(),
    label = "",
    onchange,
  }: { options: TabOption<T>[]; value: T; label?: string; onchange?: (value: T) => void } = $props();

  let list: HTMLDivElement;

  function pick(next: T) {
    if (next === value) return;
    value = next;
    onchange?.(next);
  }

  function onkeydown(e: KeyboardEvent) {
    const current = options.findIndex((o) => o.value === value);
    const last = options.length - 1;
    const keys: Record<string, number> = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current <= 0 ? last : current - 1, Home: 0, End: last };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(options[next].value);
    list.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }
</script>

<div bind:this={list} class="m3-tabs" role="tablist" tabindex="-1" aria-label={label || undefined} {onkeydown}>
  {#each options as option (option.value)}
    {@const selected = option.value === value}
    <button type="button" role="tab" class:active={selected} aria-selected={selected} tabindex={selected ? 0 : -1} onclick={() => pick(option.value)}>
      {#if option.icon}<Icon name={option.icon} size={20} />{/if}{option.label}
      {#if option.badge}<span class="badge">{option.badge}</span>{/if}
    </button>
  {/each}
</div>

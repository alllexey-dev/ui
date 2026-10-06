<script lang="ts" module>
  export type GroupOption<K extends string> = { value: K; label: string; icon?: string };
</script>

<script lang="ts" generics="T extends string">
  import Icon from "./Icon.svelte";

  // Connected button group with single selection (periods, view modes, filters).
  let {
    options,
    value = $bindable(),
    small = false,
    label = "",
    onchange,
  }: { options: GroupOption<T>[]; value: T; small?: boolean; label?: string; onchange?: (value: T) => void } = $props();

  function pick(next: T) {
    if (next === value) return;
    value = next;
    onchange?.(next);
  }
</script>

<div class="m3-group" class:small role="radiogroup" aria-label={label || undefined}>
  {#each options as option}
    <button role="radio" aria-checked={value === option.value} class:active={value === option.value} onclick={() => pick(option.value)}>
      {#if option.icon}<Icon name={option.icon} size={18} />{/if}{option.label}
    </button>
  {/each}
</div>

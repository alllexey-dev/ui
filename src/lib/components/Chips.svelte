<script lang="ts" module>
  export type ChipOption<K extends string> = { value: K; label: string; icon?: string; count?: number };
</script>

<script lang="ts" generics="T extends string">
  import Icon from "./Icon.svelte";

  // Filter chips. Bind `value` for one choice (pressing the selected chip again clears it to "") or `values`
  // for several. A selected chip shows a check instead of its icon; `count` is how many items it matches.
  let {
    options,
    value = $bindable(""),
    values = $bindable(),
    label = "",
    onchange,
  }: {
    options: ChipOption<T>[];
    value?: T | "";
    values?: T[];
    label?: string;
    onchange?: () => void;
  } = $props();

  const isSelected = (option: T) => (values ? values.includes(option) : value === option);

  function toggle(option: T) {
    if (values) values = isSelected(option) ? values.filter((v) => v !== option) : [...values, option];
    else value = value === option ? "" : option;
    onchange?.();
  }
</script>

<div class="m3-chips" role="group" aria-label={label || undefined}>
  {#each options as option (option.value)}
    {@const selected = isSelected(option.value)}
    <button type="button" class="m3-chip" class:selected aria-pressed={selected} onclick={() => toggle(option.value)}>
      {#if selected}<Icon name="check" />{:else if option.icon}<Icon name={option.icon} />{/if}
      {option.label}
      {#if option.count !== undefined}<span class="count m3-num">{option.count}</span>{/if}
    </button>
  {/each}
</div>

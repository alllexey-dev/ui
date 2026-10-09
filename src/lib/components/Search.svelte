<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import Icon from "./Icon.svelte";

  // Search field with a clear button. `compact` is the 40px one for toolbars and cards; other attributes
  // (maxlength, autocomplete, inputmode, ...) go to the input.
  let {
    value = $bindable(""),
    label = "Поиск",
    placeholder = label,
    compact = false,
    oninput,
    ...rest
  }: {
    value?: string;
    /** Accessible name of the field. */
    label?: string;
    placeholder?: string;
    compact?: boolean;
    oninput?: (value: string) => void;
  } & Omit<HTMLInputAttributes, "value" | "oninput" | "type"> = $props();

  let input: HTMLInputElement;

  function clear() {
    value = "";
    oninput?.("");
    input.focus();
  }
</script>

<label class="m3-search" class:compact>
  <Icon name="search" size={compact ? 20 : 24} />
  <input bind:this={input} {...rest} type="search" bind:value {placeholder} aria-label={label} oninput={() => oninput?.(value)} />
  {#if value}<button type="button" class="m3-icon-btn small" aria-label="Очистить" onclick={clear}><Icon name="close" size={20} /></button>{/if}
</label>

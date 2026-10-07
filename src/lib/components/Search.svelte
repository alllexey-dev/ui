<script lang="ts">
  import Icon from "./Icon.svelte";

  let { value = $bindable(""), placeholder = "Поиск", oninput }: { value?: string; placeholder?: string; oninput?: (value: string) => void } = $props();
</script>

<label class="m3-search">
  <Icon name="search" />
  <input type="search" bind:value {placeholder} oninput={() => oninput?.(value)} />
  {#if value}<button type="button" class="m3-icon-btn small" aria-label="Очистить" onclick={() => ((value = ""), oninput?.(""))}><Icon name="close" size={20} /></button>{/if}
</label>

<style>
  input::-webkit-search-cancel-button { display: none; }
</style>

<script lang="ts">
  let { checked = $bindable(false), danger = false, disabled = false, label = "", onchange }: { checked?: boolean; danger?: boolean; disabled?: boolean; label?: string; onchange?: (checked: boolean) => void } = $props();
</script>

<span class="m3-switch" class:danger>
  <input type="checkbox" role="switch" bind:checked {disabled} aria-label={label || undefined} onchange={() => onchange?.(checked)} />
  <span class="track"><span class="thumb"></span></span>
</span>

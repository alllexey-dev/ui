<script lang="ts">
  import type { Snippet } from "svelte";

  // M3 switch; it applies at once (UX.md "Формы"). With children the text is part of the control and the
  // whole row toggles it. To ask first, return false from onchange: the switch stays put, and the app sets
  // `checked` itself after the confirmation.
  let {
    checked = $bindable(false),
    danger = false,
    disabled = false,
    label = "",
    onchange,
    children,
  }: {
    checked?: boolean;
    danger?: boolean;
    disabled?: boolean;
    /** Accessible name when there is no visible text. */
    label?: string;
    onchange?: (checked: boolean) => boolean | void;
    children?: Snippet;
  } = $props();

  function change(e: Event & { currentTarget: HTMLInputElement }) {
    const next = e.currentTarget.checked;
    if (onchange?.(next) === false) e.currentTarget.checked = checked;
    else checked = next;
  }
</script>

{#snippet control()}
  <span class="m3-switch" class:danger>
    <input type="checkbox" role="switch" {checked} {disabled} aria-label={children ? undefined : label || undefined} onchange={change} />
    <span class="track"><span class="thumb"></span></span>
  </span>
{/snippet}

{#if children}
  <label class="m3-switch-label">{@render control()}<span>{@render children()}</span></label>
{:else}
  {@render control()}
{/if}

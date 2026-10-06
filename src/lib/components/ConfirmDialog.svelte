<script lang="ts">
  import Dialog from "./Dialog.svelte";

  let {
    title,
    text,
    confirmLabel,
    cancelLabel = "Отмена",
    danger = false,
    requireText = "",
    icon = danger ? "warning" : "help",
    onconfirm,
    oncancel,
  }: {
    title: string;
    text: string;
    confirmLabel: string;
    cancelLabel?: string;
    danger?: boolean;
    /** When set, the button stays disabled until this exact text is typed (for destructive actions). */
    requireText?: string;
    icon?: string;
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();

  let typed = $state("");
  const ready = $derived(!requireText || typed.trim() === requireText);
</script>

<Dialog {title} {text} {icon} shape={danger ? "softBurst" : "cookie9"} tone={danger ? "error" : "secondary"} onclose={oncancel}>
  {#if requireText}
    <label class="type">
      <span class="m3-body-small m3-muted">Чтобы подтвердить, введите <b class="m3-mono">{requireText}</b></span>
      <!-- svelte-ignore a11y_autofocus -->
      <input class="m3-field" autofocus bind:value={typed} onkeydown={(e) => e.key === "Enter" && ready && onconfirm()} />
    </label>
  {/if}
  {#snippet actions()}
    <button class="m3-btn text" onclick={oncancel}>{cancelLabel}</button>
    <!-- svelte-ignore a11y_autofocus -->
    <button class="m3-btn" class:danger autofocus={!requireText} disabled={!ready} onclick={onconfirm}>{confirmLabel}</button>
  {/snippet}
</Dialog>

<style>
  .type { display: flex; flex-direction: column; gap: 8px; }
  .type b { color: var(--md-on-surface); }
</style>

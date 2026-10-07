<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  // Labelled text field (UX.md "Формы"): label above, example in the placeholder, the error or a hint below.
  // `multiline` turns it into a growing textarea. Other attributes (maxlength, autocomplete, ...) go to the control.
  let {
    label,
    value = $bindable(""),
    error = "",
    hint = "",
    optional = false,
    multiline = false,
    rows = 5,
    id: givenId,
    oninput,
    onblur,
    ...rest
  }: {
    label: string;
    value?: string;
    error?: string;
    hint?: string;
    /** Adds "необязательно" after the label. */
    optional?: boolean;
    multiline?: boolean;
    rows?: number;
    id?: string;
    oninput?: (value: string) => void;
    onblur?: () => void;
  } & Omit<HTMLInputAttributes, "value" | "oninput" | "onblur" | "id"> = $props();

  const autoId = $props.id();
  const id = $derived(givenId || autoId);
  let control: HTMLInputElement | HTMLTextAreaElement | undefined = $state();
  const note = $derived(error || hint);

  export function focus() {
    control?.focus();
  }
</script>

<div class="m3-text-field" class:invalid={!!error}>
  <label class="m3-label-large" for={id}>{label}{#if optional}<span class="m3-muted">{" · необязательно"}</span>{/if}</label>
  {#if multiline}
    <textarea
      bind:this={control}
      {id}
      class="m3-field"
      {rows}
      bind:value
      placeholder={rest.placeholder}
      maxlength={rest.maxlength}
      required={rest.required}
      disabled={rest.disabled}
      autocomplete={rest.autocomplete as HTMLTextAreaElement["autocomplete"]}
      aria-invalid={error ? true : undefined}
      aria-describedby={note ? `${id}-note` : undefined}
      oninput={() => oninput?.(value)}
      onblur={() => onblur?.()}
    ></textarea>
  {:else}
    <input
      bind:this={control}
      {...rest}
      {id}
      class="m3-field"
      bind:value
      aria-invalid={error ? true : undefined}
      aria-describedby={note ? `${id}-note` : undefined}
      oninput={() => oninput?.(value)}
      onblur={() => onblur?.()}
    />
  {/if}
  {#if error}
    <span class="note m3-body-small" id="{id}-note" role="alert">{error}</span>
  {:else if hint}
    <span class="note m3-body-small m3-muted" id="{id}-note">{hint}</span>
  {/if}
</div>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShapeName } from "../shapes.js";
  import Icon from "./Icon.svelte";
  import Shape from "./Shape.svelte";

  // Basic M3 dialog: optional shaped icon, headline, supporting text, content and actions.
  // Escape and a click on the scrim call onclose unless `modal` is set (then only actions close it).
  let {
    title,
    text = "",
    icon = "",
    shape = "cookie9",
    tone = "secondary",
    wide = false,
    modal = false,
    onclose,
    children,
    actions,
  }: {
    title: string;
    text?: string;
    icon?: string;
    shape?: ShapeName;
    tone?: "secondary" | "primary" | "tertiary" | "error";
    wide?: boolean;
    modal?: boolean;
    onclose?: () => void;
    children?: Snippet;
    actions?: Snippet;
  } = $props();

  const close = () => !modal && onclose?.();
  let box: HTMLDivElement;

  $effect(() => {
    const previous = document.activeElement as HTMLElement | null;
    // Let an autofocus field inside take focus first; otherwise focus the dialog itself.
    queueMicrotask(() => box.contains(document.activeElement) || box.focus());
    return () => previous?.focus?.();
  });
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && close()} />

<div class="m3-scrim" role="presentation" onclick={close}>
  <div bind:this={box} class="m3-dialog" class:wide role={modal ? "alertdialog" : "dialog"} aria-modal="true" aria-label={title} tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={() => {}}>
    {#if icon}
      <Shape {shape} size={48} color="var(--md-{tone}-container)" fg="var(--md-on-{tone}-container)"><Icon name={icon} /></Shape>
    {/if}
    <h2>{title}</h2>
    {#if text}<p>{text}</p>{/if}
    {@render children?.()}
    {#if actions}<div class="actions">{@render actions()}</div>{/if}
  </div>
</div>

<style>
  .m3-dialog:focus { outline: none; }
</style>

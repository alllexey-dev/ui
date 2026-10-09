<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShapeName } from "../shapes.js";
  import Icon from "./Icon.svelte";
  import Shape from "./Shape.svelte";

  // Empty and error states: a shaped icon, one line of title, an optional hint and action.
  let {
    title,
    text = "",
    icon = "inbox",
    error = false,
    shape = error ? "softBurst" : "cookie9",
    children,
  }: { title: string; text?: string; icon?: string; error?: boolean; shape?: ShapeName; children?: Snippet } = $props();
</script>

<div class="state" role={error ? "alert" : undefined}>
  <Shape {shape} size={72} tone={error ? "error" : "neutral"}>
    <Icon name={error ? "error" : icon} size={32} />
  </Shape>
  <div class="m3-title-medium">{title}</div>
  {#if text}<div class="m3-body-medium m3-muted">{text}</div>{/if}
  {#if children}<div class="action">{@render children()}</div>{/if}
</div>

<style>
  .state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 24px; text-align: center; }
  .state > :global(:first-child) { margin-bottom: 8px; }
  .action { margin-top: 8px; }
</style>

<script lang="ts">
  import Shape from "./Shape.svelte";

  // Signed-in user at the bottom of the AppShell rail; the text hides when the rail is collapsed.
  let { name, status = "", tone = "" }: { name: string; status?: string; tone?: "" | "ok" | "bad" } = $props();
</script>

<div class="m3-account">
  <Shape shape="cookie9" size={36} color="var(--md-tertiary-container)" fg="var(--md-on-tertiary-container)">
    <span class="m3-label-large">{(name || "?").slice(0, 1).toUpperCase()}</span>
  </Shape>
  <div class="rail-text">
    <div class="m3-title-small m3-clip">{name || "-"}</div>
    {#if status}<div class="m3-body-small" class:m3-ok={tone === "ok"} class:m3-bad={tone === "bad"} class:m3-muted={!tone}>{status}</div>{/if}
  </div>
</div>

<style>
  .m3-account { display: flex; align-items: center; gap: 12px; padding: 8px 10px; }
  .rail-text { min-width: 0; }
</style>

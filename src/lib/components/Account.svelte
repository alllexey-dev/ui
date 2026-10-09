<script lang="ts">
  import type { Snippet } from "svelte";
  import Avatar from "./Avatar.svelte";
  import type { StatusTone } from "./StatusShape.svelte";

  // Signed-in user at the bottom of the AppShell rail: avatar, name and a status line (connection, role).
  // With `href` the whole block links to the profile; `actions` (a logout button) sit at the end. In the
  // collapsed rail only the avatar stays.
  let {
    name,
    src = "",
    status = "",
    tone = "neutral",
    href = "",
    actions,
  }: { name: string; src?: string; status?: string; tone?: StatusTone; href?: string; actions?: Snippet } = $props();
</script>

<div class="m3-account">
  <svelte:element this={href ? "a" : "div"} class="who" class:m3-state={!!href} href={href || undefined}>
    <Avatar {name} {src} size={36} decorative />
    <span class="rail-text">
      <span class="m3-title-small m3-clip">{name || "-"}</span>
      {#if status}<span class="m3-body-small m3-clip" class:m3-ok={tone === "ok"} class:m3-warn={tone === "warn"} class:m3-bad={tone === "bad"} class:m3-muted={tone === "neutral"}>{status}</span>{/if}
    </span>
  </svelte:element>
  {#if actions}<span class="rail-text actions">{@render actions()}</span>{/if}
</div>

<style>
  .m3-account { display: flex; align-items: center; gap: 4px; padding: 4px; }
  .who { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 6px; border-radius: var(--md-shape-lg); color: inherit; }
  .rail-text { min-width: 0; display: flex; flex-direction: column; }
  .actions { flex: none; flex-direction: row; }
</style>

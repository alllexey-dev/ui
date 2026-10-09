<script lang="ts">
  import { initials } from "../format.js";
  import type { ShapeName } from "../shapes.js";
  import Shape, { type ShapeTone } from "./Shape.svelte";

  // A person: the photo when `src` loads, otherwise their initials on a shape. `decorative` hides it from screen
  // readers when the name is written next to it.
  let {
    name,
    src = "",
    size = 40,
    tone = "tertiary",
    shape = "cookie9",
    decorative = false,
  }: { name: string; src?: string; size?: number; tone?: ShapeTone; shape?: ShapeName; decorative?: boolean } = $props();

  let broken = $state(false);
  $effect(() => {
    void src;
    broken = false;
  });
</script>

{#if src && !broken}
  <img class="m3-avatar" {src} alt={decorative ? "" : name} width={size} height={size} onerror={() => (broken = true)} />
{:else}
  <Shape {shape} {size} {tone}>
    <span class="letters" role={decorative ? undefined : "img"} aria-label={decorative ? undefined : name} aria-hidden={decorative || undefined} style:font-size="{Math.round(size * 0.38)}px">{initials(name)}</span>
  </Shape>
{/if}

<style>
  .m3-avatar { flex: none; display: block; border-radius: 50%; object-fit: cover; background: var(--md-surface-container-highest); }
  .letters { font-weight: 500; line-height: 1; }
</style>

<script lang="ts">
  import { createFollower, progressColors, progressGeometry } from "../progress.js";

  // M3 Expressive linear progress: a wavy active indicator, a gap and a flat track with a stop dot.
  // Indicator and track are drawn from one eased value, so they move together.
  let {
    value,
    max = 100,
    tone = "primary",
    thickness = 4,
    wave = true,
  }: { value: number; max?: number; tone?: "primary" | "warning" | "error" | "tertiary"; thickness?: number; wave?: boolean } = $props();

  let width = $state(0);
  let shown = $state(0);
  const fraction = $derived(max > 0 ? Math.min(1, Math.max(0, value / max)) : 0);
  const follower = createFollower((v) => (shown = v));
  const g = $derived(progressGeometry(shown, width, thickness, wave));
  const colors = $derived(progressColors(tone));

  $effect(() => follower.set(fraction));
  $effect(() => () => follower.stop());
</script>

<div class="progress" bind:clientWidth={width} style:height="{g.height}px" role="progressbar" aria-valuenow={Math.round(fraction * 100)} aria-valuemin={0} aria-valuemax={100}>
  {#if width}
    <svg {width} height={g.height}>
      {#if g.track}
        <line x1={g.track.x1} x2={g.track.x2} y1={g.mid} y2={g.mid} stroke={colors.track} stroke-width={thickness} stroke-linecap="round" />
        <circle cx={g.track.x2} cy={g.mid} r={thickness / 2} fill={colors.indicator} />
      {/if}
      {#if g.active}
        <path d={g.active} fill="none" stroke={colors.indicator} stroke-width={thickness} stroke-linecap="round" stroke-linejoin="round" />
      {/if}
    </svg>
  {/if}
</div>

<style>
  .progress { width: 100%; }
  svg { display: block; overflow: visible; }
</style>

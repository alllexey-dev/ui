<script lang="ts">
  import { wavePath } from "../wave.js";

  // M3 Expressive linear progress: a wavy active indicator, a gap and a flat track with a stop dot.
  let {
    value,
    max = 100,
    tone = "primary",
    thickness = 4,
    wave = true,
  }: { value: number; max?: number; tone?: "primary" | "warning" | "error" | "tertiary"; thickness?: number; wave?: boolean } = $props();

  let width = $state(0);
  const fraction = $derived(max > 0 ? Math.min(1, Math.max(0, value / max)) : 0);
  const height = $derived(thickness + (wave ? 8 : 0));
  const mid = $derived(height / 2);
  const activeEnd = $derived(Math.max(0, fraction * width));
  const gap = 4;
  const wavelength = 28;
  const amplitude = $derived(wave ? 3 : 0);

  const activePath = $derived(activeEnd >= thickness ? wavePath(thickness / 2, activeEnd - thickness / 2, mid, amplitude, wavelength) : "");
  const trackStart = $derived(fraction > 0 ? activeEnd + gap + thickness / 2 : thickness / 2);
  const color = $derived(`var(--md-${tone})`);
  const trackColor = $derived(tone === "primary" ? "var(--md-secondary-container)" : `var(--md-${tone}-container)`);
</script>

<div class="progress" bind:clientWidth={width} style:height="{height}px" role="progressbar" aria-valuenow={Math.round(fraction * 100)} aria-valuemin={0} aria-valuemax={100}>
  {#if width}
    <svg {width} {height}>
      {#if trackStart < width - thickness / 2}
        <line x1={trackStart} x2={width - thickness / 2} y1={mid} y2={mid} stroke={trackColor} stroke-width={thickness} stroke-linecap="round" />
        <circle cx={width - thickness / 2} cy={mid} r={thickness / 2} fill={color} />
      {/if}
      {#if activePath}
        <path d={activePath} fill="none" stroke={color} stroke-width={thickness} stroke-linecap="round" stroke-linejoin="round" />
      {/if}
    </svg>
  {/if}
</div>

<style>
  .progress { width: 100%; }
  svg { display: block; overflow: visible; }
  path { transition: d 0.5s var(--md-spring-default); }
</style>

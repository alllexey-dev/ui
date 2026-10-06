<script lang="ts">
  import uPlot from "uplot";
  import "uplot/dist/uPlot.min.css";
  import { onMount, untrack } from "svelte";
  import { chartRange } from "../chart-range.js";
  import { cssVar } from "../theme/index.js";

  /** color is a CSS custom property, e.g. "--md-primary". */
  export type Series = { label: string; color: string };
  let {
    times,
    series,
    values,
    height = 180,
    format = (v: number) => v.toFixed(0),
    min,
    max,
    withDate = false,
  }: {
    times: number[];
    series: Series[];
    values: number[][];
    height?: number;
    format?: (v: number) => string;
    /** Pins the bottom of the y axis; by default it is 0, or below the lowest value when there are negatives. */
    min?: number;
    max?: number;
    withDate?: boolean;
  } = $props();

  let host: HTMLDivElement;
  let plot: uPlot | null = null;
  let hover = $state<{ time: string; items: { label: string; color: string; value: string }[] } | null>(null);
  const clock = (t: number) =>
    new Date(t * 1000).toLocaleString("ru-RU", withDate ? { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" });

  function options(width: number): uPlot.Options {
    const axis = { stroke: cssVar("--md-on-surface-variant"), grid: { stroke: cssVar("--md-chart-grid"), width: 1 }, ticks: { show: false }, font: `500 11px ${cssVar("--md-font")}` };
    return {
      width,
      height,
      padding: [8, 4, 0, 0],
      cursor: { points: { size: 9, width: 3 }, y: false, drag: { x: false, y: false } },
      legend: { show: false },
      scales: { x: { time: true }, y: { range: (_u, dataMin, dataMax) => chartRange(dataMin, dataMax, { min, max }) } },
      axes: [
        { ...axis, space: withDate ? 110 : 80, values: (_u, ticks) => ticks.map(clock) },
        { ...axis, size: 60, values: (_u, ticks) => ticks.map((v) => format(v)) },
      ],
      series: [
        {},
        ...series.map((s, i) => ({
          label: s.label,
          stroke: cssVar(s.color),
          width: i === 0 ? 2.5 : 2,
          fill: i === 0 ? cssVar(s.color) + "22" : undefined,
          fillTo: 0,
          points: { show: false },
        })),
      ],
      hooks: {
        // Zero line when the data crosses it (returns, balances and other signed values).
        draw: [
          (u) => {
            const [bottom, top] = [u.scales.y.min ?? 0, u.scales.y.max ?? 0];
            if (!(bottom < 0 && top > 0)) return;
            const y = Math.round(u.valToPos(0, "y", true)) + 0.5;
            const ctx = u.ctx;
            ctx.save();
            ctx.strokeStyle = cssVar("--md-outline");
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(u.bbox.left, y);
            ctx.lineTo(u.bbox.left + u.bbox.width, y);
            ctx.stroke();
            ctx.restore();
          },
        ],
        setCursor: [
          (u) => {
            const idx = u.cursor.idx;
            if (idx == null) {
              hover = null;
              return;
            }
            hover = {
              time: new Date((u.data[0][idx] as number) * 1000).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: withDate ? undefined : "2-digit" }),
              items: series.map((s, i) => ({ label: s.label, color: s.color, value: format((u.data[i + 1][idx] as number) ?? 0) })),
            };
          },
        ],
      },
    };
  }

  function build() {
    plot?.destroy();
    plot = new uPlot(options(host.clientWidth), [times, ...values] as uPlot.AlignedData, host);
  }

  onMount(() => {
    const resize = new ResizeObserver(() => plot?.setSize({ width: host.clientWidth, height }));
    resize.observe(host);
    // Colours are baked into the canvas: rebuild when the theme rewrites the variables on <html>.
    const theme = new MutationObserver(() => queueMicrotask(build));
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-theme"] });
    return () => {
      resize.disconnect();
      theme.disconnect();
      plot?.destroy();
    };
  });

  // First build and rebuilds when the axes change; plain data updates go through setData below.
  $effect(() => {
    void withDate;
    void series;
    untrack(build);
  });

  $effect(() => {
    plot?.setData([times, ...values] as uPlot.AlignedData);
  });
</script>

<div bind:this={host}></div>
<div class="legend">
  {#if hover}
    <span class="time">{hover.time}</span>
    {#each hover.items as item}<span class="key"><i style:background="var({item.color})"></i>{item.label} <b>{item.value}</b></span>{/each}
  {:else}
    {#each series as s, i}<span class="key"><i style:background="var({s.color})"></i>{s.label} <b>{values[i]?.length ? format(values[i][values[i].length - 1]) : "-"}</b></span>{/each}
  {/if}
</div>

<style>
  .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px; min-height: 20px; font: var(--md-label-medium); color: var(--md-on-surface-variant); font-variant-numeric: tabular-nums; }
  .key { display: inline-flex; align-items: center; gap: 6px; }
  .key i { width: 10px; height: 10px; border-radius: 4px; }
  .key b { color: var(--md-on-surface); font-weight: 600; }
  .time { color: var(--md-on-surface); }
  :global(.u-legend) { display: none; }
  :global(.uplot) { font-family: var(--md-font) !important; }
</style>

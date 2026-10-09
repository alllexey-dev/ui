<script lang="ts">
  import uPlot from "uplot";
  import "uplot/dist/uPlot.min.css";
  import { onMount, untrack } from "svelte";
  import { chartRange, valueAt } from "../chart-data.js";
  import { cssVar, onThemeChange } from "../theme/apply.js";

  export type Series = {
    label: string;
    /** A theme custom property, e.g. "--md-primary". */
    color: string;
    /** Line width in pixels; the first series is 2.5, the others 2. */
    width?: number;
    /** Canvas dash pattern, e.g. [6, 4] for a benchmark or reference line. */
    dash?: number[];
    /** Tint under the line; by default only the first series has it. */
    fill?: boolean;
  };
  export type Marker = { time: number; label: string };

  // Time series line chart. `times` are unix seconds; `values` has one array per series, aligned with `times`,
  // with null where a series has no point (alignSeries builds that from separate point lists).
  let {
    times,
    series,
    values,
    height = 180,
    format = (v: number) => v.toFixed(0),
    min,
    max,
    zero = true,
    markers = [],
    withDate = false,
  }: {
    times: number[];
    series: Series[];
    values: (number | null)[][];
    height?: number;
    format?: (v: number) => string;
    /** Pins the bottom of the y axis; by default it is 0, or below the lowest value when there are negatives. */
    min?: number;
    max?: number;
    /** Keep zero in view (amounts, returns); turn off for prices and other values far from zero. */
    zero?: boolean;
    /** Dashed vertical lines with a caption, e.g. a deploy or the start of a period. */
    markers?: Marker[];
    withDate?: boolean;
  } = $props();

  let host: HTMLDivElement;
  let plot: uPlot | null = null;
  let hover = $state<{ time: string; at: number } | null>(null);
  const clock = (t: number) =>
    new Date(t * 1000).toLocaleString("ru-RU", withDate ? { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" });
  const shown = (v: number | null) => (v === null ? "-" : format(v));

  // Lines across the plot area: the zero line when the data crosses it and the markers.
  function drawGuides(u: uPlot) {
    const ctx = u.ctx;
    const { left, top, width, height } = u.bbox;
    ctx.save();
    ctx.strokeStyle = cssVar("--md-outline");
    ctx.lineWidth = devicePixelRatio;
    const [bottom, ceiling] = [u.scales.y.min ?? 0, u.scales.y.max ?? 0];
    if (bottom < 0 && ceiling > 0) {
      const y = Math.round(u.valToPos(0, "y", true)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + width, y);
      ctx.stroke();
    }
    ctx.setLineDash([4 * devicePixelRatio, 4 * devicePixelRatio]);
    ctx.fillStyle = cssVar("--md-on-surface-variant");
    ctx.font = `500 ${11 * devicePixelRatio}px ${cssVar("--md-font")}`;
    for (const marker of markers) {
      const x = Math.round(u.valToPos(marker.time, "x", true)) + 0.5;
      if (x < left || x > left + width) continue;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + height);
      ctx.stroke();
      ctx.fillText(marker.label, x + 6 * devicePixelRatio, top + 14 * devicePixelRatio);
    }
    ctx.restore();
  }

  function options(width: number): uPlot.Options {
    const axis = { stroke: cssVar("--md-on-surface-variant"), grid: { stroke: cssVar("--md-chart-grid"), width: 1 }, ticks: { show: false }, font: `500 11px ${cssVar("--md-font")}` };
    return {
      width,
      height,
      padding: [8, 4, 0, 0],
      cursor: { points: { size: 9, width: 3 }, y: false, drag: { x: false, y: false } },
      legend: { show: false },
      scales: { x: { time: true }, y: { range: (_u, dataMin, dataMax) => chartRange(dataMin, dataMax, { min, max, zero }) } },
      axes: [
        { ...axis, space: withDate ? 110 : 80, values: (_u, ticks) => ticks.map(clock) },
        { ...axis, size: 60, values: (_u, ticks) => ticks.map((v) => format(v)) },
      ],
      series: [
        {},
        ...series.map((s, i) => ({
          label: s.label,
          stroke: cssVar(s.color),
          width: s.width ?? (i === 0 ? 2.5 : 2),
          dash: s.dash,
          fill: (s.fill ?? i === 0) ? cssVar(s.color) + "22" : undefined,
          fillTo: 0,
          spanGaps: true,
          points: { show: false },
        })),
      ],
      hooks: {
        draw: [drawGuides],
        setCursor: [
          (u) => {
            const idx = u.cursor.idx;
            hover =
              idx == null
                ? null
                : {
                    time: new Date((u.data[0][idx] as number) * 1000).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: withDate ? undefined : "2-digit" }),
                    at: idx,
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
    // Colours are baked into the canvas: rebuild with the new ones when the theme changes.
    const stopWatchingTheme = onThemeChange(build);
    return () => {
      resize.disconnect();
      stopWatchingTheme();
      plot?.destroy();
    };
  });

  // First build and rebuilds when the look changes; plain data updates go through setData below.
  $effect(() => {
    void [withDate, series, zero, min, max, markers, height];
    untrack(build);
  });

  $effect(() => {
    plot?.setData([times, ...values] as uPlot.AlignedData);
  });
</script>

<div bind:this={host}></div>
<div class="legend">
  {#if hover}<span class="time">{hover.time}</span>{/if}
  {#each series as s, i}
    <span class="key"><i style:background="var({s.color})"></i>{s.label} <b>{shown(valueAt(values[i] ?? [], hover?.at))}</b></span>
  {/each}
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

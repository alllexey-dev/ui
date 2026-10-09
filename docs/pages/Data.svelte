<script lang="ts">
  import Chart from "../../src/lib/components/Chart.svelte";
  import { ButtonGroup, DataGrid, Meter, PageHeader, Sparkline, alignSeries, compactNumber, timeAgo } from "../../src/lib/index.js";

  let range = $state("1h");
  const points = $derived(range === "1h" ? 60 : 96);
  const now = Math.floor(Date.now() / 1000);
  const times = $derived(Array.from({ length: points }, (_, i) => now - (points - i) * (range === "1h" ? 60 : 900)));
  const wave = (i: number, k: number) => 30 + 20 * Math.sin(i / (6 + k)) + 8 * Math.sin(i / 2.3 + k) + 10 * k;
  const cpu = $derived(times.map((_, i) => Math.max(0, wave(i, 0))));
  const mem = $derived(times.map((_, i) => Math.max(0, wave(i, 1) * 0.8)));
  const pnl = $derived(times.map((_, i) => 6 * Math.sin(i / 9) + 3 * Math.sin(i / 2.7) - 1.5));
  // Two price series sampled at different moments, as they come from separate sources.
  const prices = $derived(
    alignSeries([
      times.filter((_, i) => i % 2 === 0).map((t, i) => [t, 64_000 + 900 * Math.sin(i / 5) + 40 * i] as [number, number]),
      times.filter((_, i) => i % 3 === 0).map((t, i) => [t, 64_200 + 600 * Math.sin(i / 4)] as [number, number]),
    ]),
  );
  const markers = $derived([{ time: times[Math.floor(times.length * 0.6)], label: "деплой" }]);
  const spark = Array.from({ length: 24 }, (_, i) => Math.abs(Math.sin(i / 3)) * 100 + i * 2);
  const stacks = [
    ["console", 22, undefined],
    ["minecraft", 71, "warn"],
    ["db-gateway", 93, "bad"],
  ] as const;
</script>

<PageHeader title="Данные" text="Графики на uPlot читают цвета из темы и перерисовываются при её смене." />

<section class="stats">
  <div class="m3-card m3-stat"><span class="label">Запросов за сутки</span><span class="value">{compactNumber(1_284_000)}</span><span class="support">+12% к прошлой неделе</span></div>
  <div class="m3-card m3-stat"><span class="label">Время ответа</span><span class="value">84 мс</span><span class="support">p95: 210 мс</span></div>
  <div class="m3-card m3-stat"><span class="label">Последний деплой</span><span class="value">v1.7.0</span><span class="support">{timeAgo(Date.now() - 3 * 3_600_000)}</span></div>
</section>

<section class="m3-card">
  <div class="m3-section-head">
    <h2 class="m3-section-title">Нагрузка</h2>
    <ButtonGroup small bind:value={range} options={[{ value: "1h", label: "1 ч" }, { value: "24h", label: "24 ч" }]} />
  </div>
  <Chart {times} values={[cpu, mem]} series={[{ label: "CPU", color: "--md-primary" }, { label: "Память", color: "--md-tertiary" }]} format={(v) => `${v.toFixed(0)}%`} max={100} withDate={range !== "1h"} />
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Доходность</h2>
  <Chart {times} values={[pnl]} series={[{ label: "PnL", color: "--md-tertiary" }]} format={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`} withDate={range !== "1h"} height={160} {markers} />
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Цена</h2>
  <p class="m3-body-medium m3-muted">Без нуля на оси, ряды с разными моментами, эталон пунктиром.</p>
  <Chart
    times={prices.times}
    values={prices.values}
    zero={false}
    series={[{ label: "BTC", color: "--md-primary", fill: false }, { label: "Индекс", color: "--md-outline", dash: [6, 4], width: 1.5 }]}
    format={(v) => v.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
    withDate={range !== "1h"}
  />
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Контейнер</h2>
  <dl class="m3-details">
    <dt>Образ</dt><dd class="m3-mono">ghcr.io/alllexey-dev/console:v1.7.0</dd>
    <dt>Запущен</dt><dd>{timeAgo(Date.now() - 26 * 3_600_000)}</dd>
    <dt>Порты</dt><dd class="m3-mono">8080/tcp</dd>
  </dl>
</section>

<section class="m3-card flush">
  <div class="m3-table">
    <div class="tr th" style:grid-template-columns="1fr 2fr 120px"><span>Стек</span><span>Память</span><span>Запросы</span></div>
    {#each stacks as [name, value, tone]}
      <div class="tr" style:grid-template-columns="1fr 2fr 120px"><span class="m3-clip">{name}</span><Meter {value} {tone} /><Sparkline values={spark.map((v) => v * (value / 50))} /></div>
    {/each}
  </div>
</section>

<section>
  <h2 class="m3-section-title">Таблица данных</h2>
  <DataGrid
    columns={[{ name: "id", type: "int8" }, { name: "login", type: "text" }, { name: "created_at", type: "timestamptz" }, { name: "note", type: "text" }]}
    rows={[["1", "alllexey", "2026-10-06 12:00:00+03", null], ["2", "guest", "2026-10-06 12:30:11+03", "двойной клик по ячейке показывает значение целиком"]]}
    sort={{ column: "id", desc: false }}
    onsort={() => {}}
  />
</section>

<style>
  section { margin-bottom: 16px; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
</style>

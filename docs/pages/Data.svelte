<script lang="ts">
  import Chart from "../../src/lib/components/Chart.svelte";
  import { ButtonGroup, DataGrid, Meter, PageHeader, Sparkline } from "../../src/lib/index.js";

  let range = $state("1h");
  const points = $derived(range === "1h" ? 60 : 96);
  const now = Math.floor(Date.now() / 1000);
  const times = $derived(Array.from({ length: points }, (_, i) => now - (points - i) * (range === "1h" ? 60 : 900)));
  const wave = (i: number, k: number) => 30 + 20 * Math.sin(i / (6 + k)) + 8 * Math.sin(i / 2.3 + k) + 10 * k;
  const cpu = $derived(times.map((_, i) => Math.max(0, wave(i, 0))));
  const mem = $derived(times.map((_, i) => Math.max(0, wave(i, 1) * 0.8)));
  const spark = Array.from({ length: 24 }, (_, i) => Math.abs(Math.sin(i / 3)) * 100 + i * 2);
  const stacks = [
    ["console", 22, ""],
    ["minecraft", 71, "warn"],
    ["db-gateway", 93, "bad"],
  ] as const;
</script>

<PageHeader title="Данные" text="Графики на uPlot читают цвета из темы и перерисовываются при её смене." />

<section class="m3-card">
  <div class="head">
    <h2 class="m3-section-title">Нагрузка</h2>
    <ButtonGroup small bind:value={range} options={[{ value: "1h", label: "1 ч" }, { value: "24h", label: "24 ч" }]} />
  </div>
  <Chart {times} values={[cpu, mem]} series={[{ label: "CPU", color: "--md-primary" }, { label: "Память", color: "--md-tertiary" }]} format={(v) => `${v.toFixed(0)}%`} max={100} withDate={range !== "1h"} />
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
  .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
  .head h2 { margin: 0; }
</style>

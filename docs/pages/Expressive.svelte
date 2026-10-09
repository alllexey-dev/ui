<script lang="ts">
  import { Avatar, Icon, LoadingIndicator, PageHeader, Shape, StatusShape, WavyProgress, shapeNames, statusRole, type ShapeName, type ShapeTone, type StatusTone } from "../../src/lib/index.js";

  const tones: ShapeTone[] = ["primary", "secondary", "tertiary", "success", "warning", "error", "neutral"];
  const statuses: [StatusTone, string][] = [["ok", "работает"], ["warn", "запускается"], ["bad", "ошибка"], ["neutral", "остановлен"]];

  let morph = $state<ShapeName>("cookie9");
  let value = $state(62);
</script>

<PageHeader title="Формы" text="Библиотека форм M3 Expressive: любые две формы перетекают друг в друга, потому что у всех одинаковое число точек." />

<section class="m3-card">
  <h2 class="m3-section-title">Библиотека</h2>
  <div class="shapes">
    {#each shapeNames as name}
      <button class="tile" class:active={morph === name} onclick={() => (morph = name)}>
        <Shape shape={name} size={64} color={morph === name ? "var(--md-primary)" : "var(--md-secondary-container)"} />
        <span class="m3-label-medium">{name}</span>
      </button>
    {/each}
  </div>
  <div class="morph">
    <Shape shape={morph} size={160} color="var(--md-tertiary-container)" fg="var(--md-on-tertiary-container)" spin><span class="m3-headline-small m3-emphasized">{morph}</span></Shape>
    <p class="m3-body-medium m3-muted">Нажмите на форму выше: переход идёт по пружинной кривой.</p>
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Загрузка и прогресс</h2>
  <div class="row">
    <LoadingIndicator />
    <LoadingIndicator contained size={56} />
    <LoadingIndicator size={36} label="Загружаем логи" />
  </div>
  <input type="range" min="0" max="100" bind:value aria-label="Значение" />
  <WavyProgress {value} />
  <WavyProgress value={value * 0.8} tone="warning" />
  <WavyProgress value={value * 0.5} tone="error" wave={false} />
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Статусы</h2>
  <div class="row">
    {#each statuses as [tone, text]}<StatusShape {tone}>{text}</StatusShape>{/each}
  </div>
  <div class="row">
    {#each statuses as [tone, text]}<Shape tone={statusRole[tone]} size={44} shape="cookie6"><Icon name={tone === "ok" ? "check_circle" : tone === "neutral" ? "info" : tone === "warn" ? "warning" : "error"} /></Shape>{/each}
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Тона и аватары</h2>
  <div class="row">
    {#each tones as tone}<Shape {tone} size={56}><span class="m3-label-small">{tone.slice(0, 3)}</span></Shape>{/each}
  </div>
  <div class="row">
    <Avatar name="Алексей Макаров" size={48} />
    <Avatar name="guest" tone="secondary" shape="sunny" size={48} />
    <Avatar name="Битая ссылка" src="/missing.png" tone="primary" size={48} />
  </div>
</section>

<style>
  section { margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; }
  .shapes { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; }
  .tile { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 4px; border: none; background: none; border-radius: var(--md-shape-lg); color: var(--md-on-surface-variant); transition: background 0.2s; }
  .tile:hover, .tile.active { background: var(--md-surface-container-high); }
  .tile.active { color: var(--md-primary); }
  .morph { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .row { display: flex; flex-wrap: wrap; align-items: center; gap: 32px; }
  input[type="range"] { accent-color: var(--md-primary); max-width: 320px; }
</style>

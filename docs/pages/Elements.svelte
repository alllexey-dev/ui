<script lang="ts">
  import { PageHeader } from "../../src/lib/index.js";

  let value = $state(40);
  const html = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@alllexey-dev/ui/dist/standalone/ui.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@alllexey-dev/ui/dist/standalone/ui.js"><\/script>

<button class="m3-btn tonal">Кнопка</button>
<m3-shape shape="cookie9" size="48">A</m3-shape>
<m3-loading-indicator contained></m3-loading-indicator>
<m3-progress value="40"></m3-progress>`;
</script>

<PageHeader title="Без Svelte" text="Для сайтов без сборки: один CSS и один JS-модуль. Тема подхватывается из общей куки, как и в Svelte-приложениях." />

<section class="m3-card">
  <pre class="m3-code">{html}</pre>
</section>

<section class="m3-card demo">
  <m3-shape shape="cookie9" size="56" color="var(--md-primary-container)">A</m3-shape>
  <m3-shape shape="flower" size="56" color="var(--md-tertiary-container)">B</m3-shape>
  <m3-loading-indicator></m3-loading-indicator>
  <m3-loading-indicator contained size="56"></m3-loading-indicator>
  <div class="progress">
    <input type="range" min="0" max="100" bind:value aria-label="Значение" />
    <m3-progress value={value}></m3-progress>
    <m3-progress value={value} tone="warning" flat></m3-progress>
  </div>
</section>

<style>
  section { margin-bottom: 16px; }
  .demo { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; }
  .progress { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 12px; }
  input[type="range"] { accent-color: var(--md-primary); }
</style>

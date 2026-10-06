<script lang="ts">
  import { PageHeader, seeds, variantLabels } from "../../src/lib/index.js";
  import { theme } from "../theme.js";

  const roles = ["primary", "secondary", "tertiary", "error", "success", "warning"];
  const surfaces = ["surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"];
  const type = ["display-large", "display-small", "headline-medium", "title-large", "title-medium", "body-large", "body-medium", "label-large", "label-small"];
  const seedName = $derived(seeds.find((s) => s.hex === theme.seed)?.name ?? theme.seed);
</script>

<PageHeader title="Основа" text="Цвет, типографика и форма. Тема общая для всех сайтов alllexey.dev: поменяйте её в «Оформлении», и она изменится везде." />

<section>
  <h2 class="m3-section-title">Цветовые роли</h2>
  <p class="m3-body-medium m3-muted">Сейчас: {seedName}, палитра «{variantLabels[theme.variant]}», {theme.resolved === "dark" ? "тёмная" : "светлая"} тема.</p>
  <div class="roles">
    {#each roles as role}
      <div class="role">
        <div class="swatch" style:background="var(--md-{role})" style:color="var(--md-on-{role})"><span class="m3-label-large">{role}</span></div>
        <div class="swatch small" style:background="var(--md-{role}-container)" style:color="var(--md-on-{role}-container)"><span class="m3-label-medium">{role}-container</span></div>
      </div>
    {/each}
  </div>
  <div class="surfaces">
    {#each surfaces as s}<div class="surface" style:background="var(--md-{s})"><span class="m3-label-small m3-muted">{s.replace("surface-container", "container")}</span></div>{/each}
  </div>
</section>

<section>
  <h2 class="m3-section-title">Типографика</h2>
  <div class="m3-card">
    {#each type as t}
      <div class="type-row"><span class="m3-label-small m3-muted">{t}</span><span class="m3-{t}">Съешь же ещё этих мягких булок</span></div>
    {/each}
    <div class="type-row"><span class="m3-label-small m3-muted">emphasized</span><span class="m3-headline-medium m3-emphasized">Выразительный акцент</span></div>
    <div class="type-row"><span class="m3-label-small m3-muted">mono</span><span class="m3-mono">platform deploy console 1.4.2</span></div>
  </div>
</section>

<section>
  <h2 class="m3-section-title">Скругления</h2>
  <div class="radii">
    {#each ["xs", "sm", "md", "lg", "xl", "xl-inc", "full"] as r}
      <div class="radius" style:border-radius="var(--md-shape-{r})"><span class="m3-label-medium">{r}</span></div>
    {/each}
  </div>
</section>

<style>
  section { margin-bottom: 40px; }
  .roles { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin: 16px 0; }
  .role { display: flex; flex-direction: column; gap: 4px; }
  .swatch { height: 72px; padding: 12px; border-radius: var(--md-shape-lg) var(--md-shape-lg) var(--md-shape-xs) var(--md-shape-xs); display: flex; align-items: flex-end; }
  .swatch.small { height: 48px; border-radius: var(--md-shape-xs) var(--md-shape-xs) var(--md-shape-lg) var(--md-shape-lg); }
  .surfaces { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; border-radius: var(--md-shape-lg); overflow: hidden; box-shadow: inset 0 0 0 1px var(--md-outline-variant); }
  .surface { height: 64px; padding: 8px; display: flex; align-items: flex-end; }
  .type-row { display: grid; grid-template-columns: 140px 1fr; gap: 16px; align-items: baseline; padding: 10px 0; }
  .type-row + .type-row { border-top: 1px solid var(--md-outline-variant); }
  .radii { display: flex; flex-wrap: wrap; gap: 12px; }
  .radius { width: 96px; height: 96px; display: grid; place-items: center; background: var(--md-tertiary-container); color: var(--md-on-tertiary-container); }
  @media (max-width: 760px) { .type-row { grid-template-columns: 1fr; gap: 4px; } }
</style>

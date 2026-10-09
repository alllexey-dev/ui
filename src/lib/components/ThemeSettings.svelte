<script lang="ts">
  import { variants } from "../theme/scheme.js";
  import { seeds, variantLabels, type ThemeMode } from "../theme/shared.js";
  import { getTheme } from "../theme/store.svelte.js";
  import Dialog from "./Dialog.svelte";
  import Icon from "./Icon.svelte";
  import Shape from "./Shape.svelte";

  // Appearance dialog. The choice is shared by every alllexey.dev site, so the text says so.
  let { onclose }: { onclose: () => void } = $props();
  const theme = getTheme();

  const modes: { key: ThemeMode; label: string; icon: string }[] = [
    { key: "light", label: "Светлая", icon: "light_mode" },
    { key: "auto", label: "Авто", icon: "brightness_auto" },
    { key: "dark", label: "Тёмная", icon: "dark_mode" },
  ];
  const custom = $derived(!seeds.some((s) => s.hex === theme.seed));
</script>

<Dialog title="Оформление" text="Палитра строится из одного цвета и применяется на всех сайтах alllexey.dev." icon="palette" shape="flower" {onclose}>
  <div class="setting">
    <span class="m3-label-large">Тема</span>
    <div class="m3-group" role="radiogroup" aria-label="Тема">
      {#each modes as m}
        <button role="radio" aria-checked={theme.mode === m.key} class:active={theme.mode === m.key} onclick={() => theme.setMode(m.key)}><Icon name={m.icon} size={18} />{m.label}</button>
      {/each}
    </div>
  </div>
  <div class="setting">
    <span class="m3-label-large">Цвет</span>
    <div class="swatches">
      {#each seeds as s}
        {@const selected = theme.seed === s.hex}
        <button class="swatch" aria-pressed={selected} title={s.name} aria-label={s.name} onclick={() => theme.setSeed(s.hex)}>
          <Shape shape={selected ? "cookie9" : "circle"} size={44} color={s.hex} fg="#fff">{#if selected}<Icon name="check" size={20} />{/if}</Shape>
        </button>
      {/each}
      <label class="swatch custom" title="Свой цвет">
        <input type="color" value={theme.seed} aria-label="Свой цвет" onchange={(e) => theme.setSeed((e.target as HTMLInputElement).value)} />
        <Shape shape={custom ? "cookie9" : "clover4"} size={44} tone="neutral" color={custom ? theme.seed : undefined} fg={custom ? "#fff" : undefined}>
          <Icon name={custom ? "check" : "format_paint"} size={20} />
        </Shape>
      </label>
    </div>
  </div>
  <div class="setting">
    <span class="m3-label-large">Палитра</span>
    <div class="chips">
      {#each variants as v}
        <button class="m3-chip" class:selected={theme.variant === v} onclick={() => theme.setVariant(v)}>{#if theme.variant === v}<Icon name="check" />{/if}{variantLabels[v]}</button>
      {/each}
    </div>
  </div>
  {#snippet actions()}<button class="m3-btn text" onclick={onclose}>Готово</button>{/snippet}
</Dialog>

<style>
  .setting { display: flex; flex-direction: column; gap: 10px; }
  .swatches { display: flex; flex-wrap: wrap; gap: 8px; }
  .swatch { border: none; background: none; padding: 0; position: relative; cursor: pointer; transition: transform 0.35s var(--md-spring-fast); }
  @media (hover: hover) { .swatch:hover { transform: scale(1.08); } }
  .swatch:active { transform: scale(0.94); }
  .swatch:focus-visible { outline: 3px solid var(--md-secondary); outline-offset: 2px; border-radius: 50%; }
  .custom input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
